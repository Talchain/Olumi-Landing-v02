'use client'

import Link from 'next/link'

import Container from '@/components/core/Container'
import { Column, Row } from '@/components/core/Grid'
import NextImage from '@/components/ui/NextImage'
import Button from '@/components/ui/Button'
import { BodyCopy, H3 } from '@/components/ui/Text'
import FadeIn from '@/components/motion/FadeIn'
import RichText from '@/components/ui/RichText'

import { IFooter } from './FooterTypes'

import Arrow from '@/assets/svg/arrow.svg'
import Envelope from '@/assets/svg/envelope.svg'

import s from './Footer.module.scss'

const Footer = ({ data }: IFooter) => {
  if (!data) return null

  const {
    logo,
    signCta,
    headline,
    quicklinks,
    contact,
    access,
    rightsCopy,
    privacyPolicy,
  } = data

  return (
    <Container id="footer" as="footer" className={s.footer}>
      <div className={s.top}>
        <FadeIn>
          <Link href="/" className={s.logoWrapper}>
            {!!logo?.asset && <NextImage image={logo} alt="Site Logo" />}
          </Link>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Button to={signCta.externalLink} theme="dark" icon="user">
            {signCta?.label}
          </Button>
        </FadeIn>
      </div>
      <Row className={s.middle}>
        <Column initial={6} medium={6} className={s.linksWrapper}>
          <H3>{headline}</H3>
          <div className={s.links}>
            <div className={s.quicklinks}>
              <BodyCopy>Quicklinks</BodyCopy>
              <ul>
                {quicklinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.url}>
                      <Arrow />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.contact}>
              <BodyCopy>Contact</BodyCopy>
              <ul>
                {contact.map((link, index) => (
                  <li key={index}>
                    <Link href={link.url}>
                      <Arrow />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Column>
        <Column initial={6} medium={6} desktop={5}>
          <div className={s.access}>
            <div className={s.intro}>
              <RichText
                value={access.title.body}
                className={s.title}
                defaultTextComponent={H3}
              />
              <BodyCopy>{access.description}</BodyCopy>
            </div>
            <form className={s.form}>
              <div className={s.fieldset}>
                <Envelope />
                <input type="email" placeholder={access.placeholder} />
              </div>
              {/* @ts-ignore */}
              <Button to={access.cta?.externalLink?.url} type="submit">
                {access.cta?.externalLink?.label}
              </Button>
            </form>
          </div>
        </Column>
      </Row>
      <div className={s.bottom}>
        <BodyCopy>{rightsCopy}</BodyCopy>
        <Link className={s.privacy} href={privacyPolicy.url}>
          {privacyPolicy.label}
        </Link>
        <BodyCopy>
          Made by <Link href="https://mallardandclaret.com/">M&C</Link>
        </BodyCopy>
      </div>
    </Container>
  )
}

export default Footer
