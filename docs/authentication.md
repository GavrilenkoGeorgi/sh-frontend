# Authentication Setup

This document describes the current frontend authentication setup so future
debugging can start from a shared map of how the app expects auth to work.

## Summary

Authentication is cookie-based from the frontend perspective. The app does not
store an access token in Redux or local storage. Instead, authenticated HTTP
requests use `credentials: 'include'` and rely on the backend to set, refresh,
and clear auth cookies.

The frontend keeps only three auth values in Redux:

- `user`: the current user object, or `null`
- `isAuthenticated`: whether the frontend currently considers the user logged in
- `authInitialized`: whether the startup auth check has finished

The frontend also stores a localStorage hint named `sharlushka_auth_session`.
This is not an auth token. It only tells the app whether it should try a
refresh request on page load.

## Important Files

- `src/store/slices/authSlice.ts`: Redux auth state, reducers, and selectors.
- `src/store/slices/apiSlice.ts`: shared RTK Query base query with cookie
  credentials and automatic refresh on `401`.
- `src/store/slices/userApiSlice.ts`: auth/account endpoints such as login,
  logout, refresh, register, profile, password reset, and account deletion.
- `src/hooks/auth/useAuthBootstrap.ts`: startup refresh logic.
- `src/utils/authSessionHint.ts`: localStorage session hint helper.
- `src/routes/RootLayout.tsx`: runs auth bootstrap before rendering the app body.
- `src/routes/ProtectedRoute.tsx`: blocks protected routes until auth is ready.
- `src/components/forms/Login.tsx`: login form and login success handling.
- `src/components/forms/Logout.tsx`: logout request and client-side cleanup.
- `src/components/forms/DeleteAccount.tsx`: account deletion and cleanup.
- `src/features/multiplayer/socket/multiplayerSocket.ts`: Socket.IO client using
  cookies via `withCredentials: true`.
- `src/hooks/useMultiplayerSocket.ts`: connects sockets only after auth is ready
  and authenticated.

## Environment

Auth endpoints are built from `REACT_APP_USERS_URL` in `src/constants/routes.ts`.

Expected examples:

```env
REACT_APP_USERS_URL=http://localhost:5000/users
REACT_APP_GAME_URL=http://localhost:5000/game
REACT_APP_MULTIPLAYER_URL=http://localhost:5000/multiplayer
REACT_APP_SOCKET_URL=http://localhost:5000
```

Production and staging values are configured in `netlify.toml`.

Because auth depends on cookies, the backend must support cross-origin cookies
when frontend and backend origins differ. That usually means correct CORS
`credentials` support plus cookie attributes such as `SameSite=None; Secure` in
production cross-site deployments.

## Auth State

`authSlice` starts unauthenticated:

```ts
{
  user: null,
  isAuthenticated: false,
  authInitialized: false
}
```

The reducers are:

- `setCredentials({ user })`: stores the user and sets `isAuthenticated = true`.
- `logout()`: clears the user and sets `isAuthenticated = false`.
- `setAuthInitialized()`: marks startup auth detection complete.

`authInitialized` is important because the app should not decide that a user is
logged out before the initial refresh attempt has had a chance to finish.

## Startup Flow

Startup auth is handled by `useAuthBootstrap`, which runs from `RootLayout`.

1. `useAuthBootstrap` reads `hasAuthSessionHint()` once on mount.
2. If the hint does not exist, it immediately dispatches `setAuthInitialized()`.
3. If the hint exists, it runs `useRefreshTokenQuery`.
4. The refresh endpoint sends `POST ${REACT_APP_USERS_URL}/refresh` with
   cookies included.
5. In `onQueryStarted`, a successful response with `response.user` stores the
   hint and dispatches `setCredentials({ user })`.
6. A failed or malformed refresh clears the hint and leaves the user
   unauthenticated.
7. The refresh `finally` block dispatches `setAuthInitialized()`.

While `authInitialized` is false, `RootLayout` renders `Fallback` instead of the
main app body.

## Login Flow

The login form uses `useLoginMutation`.

1. User submits email and password.
2. The frontend sends `POST ${REACT_APP_USERS_URL}/login` with
   `credentials: 'include'`.
3. The backend is expected to set auth cookies and return the `User`.
4. On success, the frontend:
   - writes the localStorage auth session hint
   - dispatches `setCredentials({ user })`
   - navigates to `/play`
5. On failure, it shows an error toast.

Registration is separate. `Register.tsx` calls `/register`, shows a success
toast, and sends the user to `/login`. It does not log the user in
automatically.

## Authenticated Requests

The app has two RTK Query API slices:

- `apiSlice`, reducer path `user`, for user and multiplayer invite endpoints.
- `gameSlice`, reducer path `game`, for game save/stats endpoints.

Both use `baseQueryWithReauth`, which wraps `fetchBaseQuery` with:

```ts
credentials: 'include'
```

Individual endpoint definitions also usually include `credentials: 'include'`.
That is redundant but consistent with the cookie-based model.

Authenticated endpoint examples:

- `/profile`
- `/delete`
- `/logout`
- `/refresh`
- `/game/save`
- `/game/stats`
- `/game/clearstats`
- `/multiplayer/invites/incoming`
- `/multiplayer/invites/outgoing`

## Automatic Refresh on 401

`baseQueryWithReauth` retries failed requests when the server returns `401`.

Flow:

1. Run the original request.
2. If it returns `401` and the URL is not `/refresh`, run
   `POST ${REACT_APP_USERS_URL}/refresh`.
3. A module-level `refreshPromise` ensures concurrent `401` responses share one
   refresh request.
4. If refresh returns `{ user }`, the frontend:
   - writes the auth session hint
   - dispatches `setCredentials(refreshResult.data)`
   - retries the original request
5. If refresh fails or returns an unexpected shape, the frontend:
   - clears the auth session hint
   - dispatches `logout()`
   - resets `apiSlice` and `gameSlice` cached state
   - shows a session-expired warning toast from the request that started refresh

The refresh response is validated by `isRefreshResponse`, which requires a user
object with string `_id`, `name`, and `email`.

## Logout and Client Cleanup

`Logout.tsx` calls `POST ${REACT_APP_USERS_URL}/logout`.

On success, it:

- clears the auth session hint
- dispatches `logout()`
- resets RTK Query caches for `apiSlice` and `gameSlice`
- shows a success toast
- navigates to `/`

If the logout HTTP request fails, the current code shows an error toast and does
not clear local auth state.

Account deletion follows a similar cleanup path after `DELETE /delete`.

## Route Protection

Protected routes are wrapped by `ProtectedRoute`.

Protected routes:

- `/stats`
- `/profile`
- `/multiplayer`

Behavior:

- If `authInitialized` is false, show `Fallback`.
- If initialized but unauthenticated, redirect to `/login`.
- If authenticated, render the protected route through `Outlet`.

The `/play` route is public. Anonymous users can play, but `Game.tsx` only saves
results when `selectCurrentUser` returns a user.

## Multiplayer Socket Auth

The Socket.IO client is created with:

```ts
io(resolveSocketUrl(), {
  autoConnect: false,
  withCredentials: true
})
```

`useMultiplayerSocket` waits for `authInitialized`.

- If authenticated, it connects the socket.
- If unauthenticated, it disconnects the socket and resets multiplayer state.

Socket authentication is therefore expected to reuse the same backend cookie
session as normal HTTP requests. No explicit token is sent by the frontend.

The socket URL is resolved in this order:

1. `REACT_APP_SOCKET_URL`
2. origin from `REACT_APP_USERS_URL`
3. current frontend origin

## Password Recovery

Password recovery is not tied to the current Redux auth session.

Flow:

1. `ForgotPwd.tsx` sends `POST /forgotpwd` with the user's email.
2. The backend presumably emails a recovery link containing a token.
3. `Password.tsx` reads `token` from the URL query string.
4. `UpdatePwd.tsx` submits `PUT /updatepwd` with password, confirm, and token.
5. On success, the user is sent to `/login`.

The token is stored in a hidden form field during the password update flow.

## Known Risk Areas and Debugging Notes

These are not necessarily confirmed bugs, but they are the areas most likely to
explain future auth issues.

### Cookie and CORS configuration

All auth depends on cookies being accepted by the browser and included on
requests. If login appears successful but refresh or protected requests fail,
check:

- `Set-Cookie` headers on `/login` and `/refresh`
- cookie domain/path
- `HttpOnly`, `Secure`, and `SameSite` attributes
- backend CORS `Access-Control-Allow-Credentials`
- frontend request origin versus backend allowed origins
- whether local development uses HTTP while production cookies require HTTPS

### Session hint can become stale

`sharlushka_auth_session` only means "try refresh on startup." It can exist even
when the backend cookie is expired or missing. In that case startup will attempt
refresh, fail, clear the hint, and continue unauthenticated.

If startup keeps showing a loader, inspect `/refresh` and the
`setAuthInitialized()` path.

### Logout failure keeps client logged in

`Logout.tsx` only clears local auth state after the backend logout request
succeeds. If `/logout` fails because the session is already expired or the
network fails, the frontend can continue to show the user as authenticated until
another request triggers refresh failure.

This may be intentional, but it is worth checking if users report being unable
to log out.

### Profile update does not update Redux user

`Profile.tsx` sends the profile update and shows a success toast, but it does
not update `auth.user` afterward. The file already has a TODO for this.

Possible symptoms:

- navbar or profile form still shows old name/email after update
- multiplayer may continue using stale user data until refresh/reload

### Inconsistent refresh response handling

`apiSlice.ts` validates the refresh response with `isRefreshResponse`.
`userApiSlice.ts` uses a lighter cast in `refreshToken.onQueryStarted`.

If the backend response shape changes, one path may accept data that the other
rejects. The expected shape should stay:

```json
{
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string"
  }
}
```

### URL matching for refresh skip

`baseQueryWithReauth` skips refresh retry when `url.includes('/refresh')`.
This is simple and probably fine, but any unrelated URL containing `/refresh`
would also skip reauth.

### Missing environment variables produce broken URLs

`API_ROUTES` interpolates environment values directly. If `REACT_APP_USERS_URL`
is missing, auth URLs become strings such as `undefined/login`.

Check compiled environment variables first when all auth requests fail at once.

### Service worker/cache confusion

The production app is a PWA. If auth behavior differs only after deploy, verify
that the browser is not running an old frontend bundle with outdated endpoint
URLs or old refresh logic.

## Quick Debug Checklist

When investigating an auth issue, check in this order:

1. Is `REACT_APP_USERS_URL` correct for the current environment?
2. Does `/login` return the expected user object and set cookies?
3. Are cookies visible in browser devtools for the backend domain?
4. Are subsequent requests sending cookies?
5. Does `/refresh` return `{ user: { _id, name, email } }`?
6. Does Redux `auth.authInitialized` become `true` after startup?
7. Does Redux `auth.isAuthenticated` match the expected user state?
8. On `401`, does only one refresh request happen for concurrent failures?
9. After failed refresh, are `auth`, RTK Query caches, and the session hint
   cleared?
10. For multiplayer, does the socket request include cookies and does the
    backend accept them?
