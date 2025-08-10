import { useRef, useState } from 'react'
import clsx from 'clsx'

import RichText from '@/components/ui/RichText'

import { BodyCopy, H3 } from '@/components/ui/Text'
import FadeIn from '@/components/motion/FadeIn'
import Button from '@/components/ui/Button'

import { ISanityAccessCard } from '@/sanity/schemas/objects/accessCard'

import Envelope from '@/assets/svg/envelope.svg'
import Lock from '@/assets/svg/lock.svg'
import Eye from '@/assets/svg/eye.svg'

import s from './Access.module.scss'

const AccessCard = ({
  card,
  index,
}: {
  card: ISanityAccessCard
  index: number
}) => {
  const input = useRef<HTMLInputElement>(null!)
  const [showPW, setShowPW] = useState(false)

  const { title, description, label, isPassword, placeholder, cta } = card

  return (
    <FadeIn delay={0.4 + index * 0.15}>
      <div className={s.card}>
        <div className={s.intro}>
          <RichText
            value={title.body}
            className={s.title}
            defaultTextComponent={H3}
          />
          <BodyCopy>{description}</BodyCopy>
        </div>
        <form className={s.form}>
          {label && <label>{label}</label>}
          <div className={s.fieldset}>
            {isPassword ? <Lock /> : <Envelope />}
            <input
              ref={input}
              type={isPassword ? (showPW ? 'text' : 'password') : 'email'}
              placeholder={placeholder}
              autoComplete=""
            />
            {isPassword && (
              <span
                className={clsx(s.eye, showPW && s.showPW)}
                onClick={() => setShowPW(!showPW)}
              >
                <Eye />
              </span>
            )}
          </div>
          {/* @ts-ignore */}
          <Button to={cta?.externalLink?.url} type="submit">
            {cta?.externalLink?.label}
          </Button>
        </form>
      </div>
    </FadeIn>
  )
}

export default AccessCard
