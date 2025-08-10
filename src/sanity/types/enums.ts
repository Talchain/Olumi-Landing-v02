export enum SingletonTypes {
  Home = 'page.home',
  SiteSettings = 'siteSettings',
}

export enum SectionTypes {
  Hero = 'hero',
  Access = 'access',
  Benefits = 'benefits',
  Testimonials = 'testimonials',
  Footer = 'footer',
}

export const PageTypes = { ...SingletonTypes }
export type PageTypes = typeof PageTypes

// Used in CMS structure and individual schemas
export enum PageTitles {
  Home = 'Home Page',
  SiteSettings = 'Site Settings',
}

export enum SectionTitles {
  Hero = 'Hero',
  Access = 'Access',
  Benefits = 'Benefits',
  Testimonials = 'Testimonials',
  Footer = 'Footer',
}
