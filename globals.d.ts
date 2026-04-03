declare const __APP_VERSION__: string

declare module '*.sass'

declare module '*.svg' {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}

declare const process: {
  env: {
    NODE_ENV?: string
    REACT_APP_USERS_URL?: string
    REACT_APP_GAME_URL?: string
    REACT_APP_MULTIPLAYER_URL?: string
    REACT_APP_SOCKET_URL?: string
  }
}
