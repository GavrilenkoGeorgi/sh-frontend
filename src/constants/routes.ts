const USERS_URL = process.env.REACT_APP_USERS_URL
const GAME_URL = process.env.REACT_APP_GAME_URL

export const ROUTES = {
  HOME: '/',
  PLAY: 'play',
  LOGIN: 'login',
  HELP: 'help',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgotpwd',
  PRIVACY: 'privacy',
  DELETE_ACCOUNT: 'deleteacc',
  CLEAR_STATS: 'clearstats',
  STATS: 'stats',
  PROFILE: 'profile',
  MULTIPLAYER: 'multiplayer'
} as const

export const API_ROUTES = {
  LOGIN: `${USERS_URL}/login`,
  LOGOUT: `${USERS_URL}/logout`,
  SIGNUP: `${USERS_URL}/register`,
  DELETE_ACC: `${USERS_URL}/delete`,
  UPDATE_PROFILE: `${USERS_URL}/profile`,
  REFRESH_TOKEN: `${USERS_URL}/refresh`,
  SEND_RECOVERY_EMAIL: `${USERS_URL}/forgotpwd`,
  UPDATE_PASSWORD: `${USERS_URL}/updatepwd`
} as const

export const GAME_API_ROUTES = {
  SAVE_RESULTS: `${process.env.REACT_APP_GAME_URL}/save`,
  CLEAR_STATS: `${process.env.REACT_APP_GAME_URL}/clearstats`,
  GET_STATS: `${process.env.REACT_APP_GAME_URL}/stats`
} as const

export type RoutePathsType = (typeof ROUTES)[keyof typeof ROUTES]
export type ApiRoutePathsType = (typeof API_ROUTES)[keyof typeof API_ROUTES]
export type GameApiRoutePathsType =
  (typeof GAME_API_ROUTES)[keyof typeof GAME_API_ROUTES]
