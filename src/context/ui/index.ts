import { MutableRefObject } from 'react'
import { create } from 'zustand'

interface IStore {
  loaded: boolean
  setLoaded: (loaded: boolean) => void
  scrollEnabled: boolean
  setScrollEnabled: (scrollEnabled: boolean) => void
  benefitsRef: MutableRefObject<HTMLElement> | null
  setBenefitsRef: (benefitsRef: MutableRefObject<HTMLElement> | null) => void
  testimonialsRef: MutableRefObject<HTMLElement> | null
  setTestimonialsRef: (
    testimonialsRef: MutableRefObject<HTMLElement> | null,
  ) => void
}

const useStore = create<IStore>((set) => ({
  loaded: false,
  setLoaded: (loaded) => set({ loaded }),
  scrollEnabled: false,
  setScrollEnabled: (scrollEnabled) => set({ scrollEnabled }),
  benefitsRef: null,
  setBenefitsRef: (benefitsRef) => set({ benefitsRef }),
  testimonialsRef: null,
  setTestimonialsRef: (testimonialsRef) => set({ testimonialsRef }),
}))

export default useStore
