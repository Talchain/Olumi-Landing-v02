import React, { useMemo } from 'react'
import clsx from 'clsx'
import { PortableText, PortableTextComponents } from 'next-sanity'

import { BodyCopy } from '@/components/ui/Text'

import { IRichText } from './RichTextTypes'

import s from './RichText.module.scss'

const RichText = ({
  className,
  defaultTextComponent: DefaultTextComponent = BodyCopy,
  value,
}: IRichText) => {
  const components: PortableTextComponents = useMemo(
    () => ({
      block: {
        // don't render empty <p>s, check the length for it
        normal: ({ children }: any) => {
          return typeof children[0] === 'object' ||
            typeof children[0] === 'string' ? (
            <DefaultTextComponent as="p">{children}</DefaultTextComponent>
          ) : null
        },
      },

      marks: {
        // strong: ({ children }: any) => (
        //   <strong className={clsx(s.strong)}>{children}</strong>
        // ),
        em: ({ children }: any) => <em className={s.emphasis}>{children}</em>,
      },
    }),
    [DefaultTextComponent],
  )

  return (
    <div className={clsx(s.RichText, className)}>
      <PortableText value={value} components={components} />
    </div>
  )
}

export default RichText
