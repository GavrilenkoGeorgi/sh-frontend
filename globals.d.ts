declare const __APP_VERSION__: string

declare module '*.sass'

declare module '*.svg' {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}
