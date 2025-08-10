import { As, PropsWithAs } from 'reakit-utils/types'

interface IRow {
  <Tag extends As>(
    props: PropsWithAs<
      {
        className?: string
        children?: React.ReactNode
      },
      Tag
    >
  ): JSX.Element
}

interface IColumn {
  <Tag extends As>(
    props: PropsWithAs<
      {
        initial?: number
        medium?: number
        desktop?: number
        large?: number
        className?: string
        children?: React.ReactNode
      },
      Tag
    >
  ): JSX.Element
}
