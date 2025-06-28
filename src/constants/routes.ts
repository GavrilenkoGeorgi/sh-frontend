export const ROUTES = {
  HOME: '/',
  GAME: '/game',
  LOGIN: '/login',
  HELP: '/help',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgotpwd',
  PRIVACY: '/privacy',
  DELETE_ACCOUNT: '/deleteacc',
  CLEAR_STATS: '/clearstats',
  STATS: '/stats',
  PROFILE: '/profile'
} as const

export type RoutePathsType = (typeof ROUTES)[keyof typeof ROUTES]
