import { ReactNode } from 'react'

export type post = {
  _id: string,
  title: string,
  pubDate?: string,
  link: string
}

export type AuthProviderProps = {
  children: ReactNode
}
