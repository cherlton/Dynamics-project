import { create } from 'zustand'

export const useUiStore = create((set, get) => ({
  isPopUp: false,
  shufflePhase: 'idle', // 'idle' | 'out-left' | 'out-right' | 'in-right' | 'in-left'

  setIsPopUp: (val) => set({ isPopUp: Boolean(val) }),
  togglePopUp: () => set((state) => ({ isPopUp: !state.isPopUp })),
  setShufflePhase: (phase) => set({ shufflePhase: phase }),

  /**
   * Shuffles out current form to the left (or right for backward),
   * executes the navigation callback / route change,
   * smooth scrolls to top with ease,
   * then shuffles in the new form from the right (or left).
   */
  shuffleNavigate: (navigateFn, to, direction = 'forward') => {
    const outPhase = direction === 'forward' ? 'out-left' : 'out-right'
    const inPhase = direction === 'forward' ? 'in-right' : 'in-left'

    // Step 1: Active form card moves from current position to left (or right)
    set({ shufflePhase: outPhase })

    setTimeout(() => {
      // Step 2: Navigate to target route / callback
      if (typeof navigateFn === 'function') {
        navigateFn(to)
      }

      // Auto-scroll to top with smooth ease
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

      // Step 3: Incoming form card glides from right (or left) to center
      set({ shufflePhase: inPhase })

      setTimeout(() => {
        set({ shufflePhase: 'idle' })
      }, 460)
    }, 320)
  },
}))
