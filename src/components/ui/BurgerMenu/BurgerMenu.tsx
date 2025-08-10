import clsx from 'clsx'

import s from './BurgerMenu.module.scss'

const BurgerMenu = ({
  openMenu,
  setOpenMenu,
}: {
  openMenu: boolean
  setOpenMenu: (openMenu: boolean) => void
}) => {
  return (
    <div
      className={clsx(s.menuBtn, openMenu && s.openMenu)}
      onClick={() => setOpenMenu(!openMenu)}
    >
      <div>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}

export default BurgerMenu
