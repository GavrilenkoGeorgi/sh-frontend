# Refresh token endpoint contract

## Context

The frontend's `baseQueryWithReauth` middleware (in `src/store/api/baseApi.ts`) intercepts
401 responses, silently retries a token refresh, and then re-issues the original request.

A previous version of this logic used a verbose runtime type guard (`isRefreshResponse`) to
distinguish a successful refresh from a failed one. That guard has been removed in favour of
checking `refreshResult.error` — which is the standard RTK Query way of knowing whether an
HTTP request succeeded.

## Required backend behaviour

The `/auth/refresh` endpoint (POST) **must** return a proper HTTP error status (401 or 403)
whenever the refresh token is missing, expired, or invalid. It must **not** return HTTP 200
with a null / empty user payload in those cases.

| Scenario                     | Expected HTTP status | Expected body                                           |
| ---------------------------- | -------------------- | ------------------------------------------------------- |
| Valid refresh token          | 200                  | `{ "user": { "_id": "…", "name": "…", "email": "…" } }` |
| Missing refresh token cookie | 401                  | any error body                                          |
| Expired refresh token        | 401                  | any error body                                          |
| Invalid / tampered token     | 401                  | any error body                                          |

## Why this matters

The frontend now does:

```typescript
if (!refreshResult.error) {
  // treat refreshResult.data as { user: User } and proceed
} else {
  // clear auth state, show session-expired toast
}
```

If the backend returned HTTP 200 with `{ user: null }`, `refreshResult.error` would be
`undefined`, the cast `(refreshResult.data as { user: User }).user` would produce `null`,
and `setCredentials` would be called with a null user — corrupting the auth state silently.

## Related frontend file

`src/store/api/baseApi.ts` — `baseQueryWithReauth` function
