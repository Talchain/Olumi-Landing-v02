interface IContainerProps {
  children?: React.ReactNode
  className?: string
}

export interface IContainer {
  <Tag extends As>(props: PropsWithAs<IContainerProps, Tag>): JSX.Element
}
