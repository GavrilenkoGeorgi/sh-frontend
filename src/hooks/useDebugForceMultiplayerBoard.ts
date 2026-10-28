// dev-only: allow forcing the multiplayer board to be shown for styling/debug.
// enable by adding `?forceBoard=1` to the URL or setting `localStorage.setItem('sh.forceMultiplayerBoard','1')`
export function useDebugForceMultiplayerBoard(): boolean {
  if (process.env.NODE_ENV !== 'development') return false

  const params = new URLSearchParams(window.location.search)
  const queryForce = params.get('forceBoard') === '1'
  const localForce = localStorage.getItem('sh.forceMultiplayerBoard') === '1'

  return queryForce || localForce
}
