import React from 'react'
import clsx from 'clsx'

import { IRow, IColumn } from './GridTypes'

import s from './Grid.module.scss'

export const Row: IRow = ({ className, as: Component = 'div', ...props }) => (
  <Component className={clsx(s.row, className)} {...props} />
)

const is = Number.isFinite

export const Column: IColumn = ({ initial, medium, desktop, large, className, as: Component = 'div', ...props }) => (
  <Component
    className={clsx(
      s.col,
      [s[`col--${initial}`]],
      !!is(medium) && [s[`col--medium--${medium}`]],
      !!is(desktop) && [s[`col--desktop--${desktop}`]],
      !!is(large) && [s[`col--large--${large}`]],
      className
    )}
    {...props}
  />
)
