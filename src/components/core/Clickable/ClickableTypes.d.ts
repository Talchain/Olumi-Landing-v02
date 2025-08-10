export type TAnchor = {
  to: string
  ariaLabel?: string
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export type TButton = {
  ariaLabel?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export type TClickable = ({ to?: undefined } & TButton) | TAnchor
