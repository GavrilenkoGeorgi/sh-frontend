import { ReactNode, Dispatch, SetStateAction, } from 'react'
// import Store from '../store/store'

// -- interfaces --
/* export interface State {
  store: Store
} */

// -- types --
export type post = {
  _id: string,
  title: string,
  pubDate?: string,
  link: string
}

export type AuthProviderProps = { // this doesn't belong here
  children: ReactNode
}

export type EditRssItemProps = {
  title: string,
  link: string,
  open: boolean,
  setEdit: Dispatch<SetStateAction<boolean>>,
  id: string
}