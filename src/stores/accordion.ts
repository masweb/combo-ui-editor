import { createComponentStore } from '@/composables/useComponentStoreFactory'
import {
  createBorder,
  createBorderRadius,
  createPadding,
  createFontSize,
  DEFAULT_LETTER_SPACING
} from '@/utils/defaultValues'
import type { AccordionVariant } from '@/types/accordion'

const defaultBorder = createBorder('solid', 1, '#dee2e6')
const defaultBorderRadius = createBorderRadius(true, 'px', 6)
const defaultFontSize = createFontSize(14)
const defaultButtonFontSize = createFontSize(16)
const defaultBodyPadding = createPadding(true, true, 'px', 12, 16, 12, 16)
const defaultButtonPadding = createPadding(true, true, 'px', 14, 20, 14, 20)

const createDefaultVariant = (name: string): AccordionVariant => ({
  name,
  background: '#ffffff',
  color: '#212529',
  border: { ...defaultBorder },
  borderRadius: { ...defaultBorderRadius },
  bodyPadding: { ...defaultBodyPadding },
  fontFamily: undefined,
  fontSize: { ...defaultFontSize },
  fontStyle: 'normal',
  fontWeight: '400',
  letterSpacing: { ...DEFAULT_LETTER_SPACING },
  buttonBackground: '#ffffff',
  buttonColor: '#212529',
  buttonPadding: { ...defaultButtonPadding },
  buttonFontSize: { ...defaultButtonFontSize },
  buttonFontWeight: '500',
  buttonHoverBackground: '#f8f9fa',
  buttonHoverColor: '#0d6efd',
  activeButtonBackground: '#e7f1ff',
  activeButtonColor: '#0d6efd',
  shadow: undefined,
  dark: {
    background: '#2d2d2d',
    color: '#dee2e6',
    borderColor: '#3d3d3d',
    buttonBackground: '#2d2d2d',
    buttonColor: '#dee2e6',
    buttonHoverBackground: 'rgba(255,255,255,0.075)',
    buttonHoverColor: '#6ea8fe',
    activeButtonBackground: 'rgba(13,110,253,0.15)',
    activeButtonColor: '#6ea8fe',
    shadowColor: 'rgba(0,0,0,0.3)'
  }
})

export const useAccordionStore = defineStore('accordion', () =>
  createComponentStore<AccordionVariant>({
    componentId: 'accordion',
    createDefault: createDefaultVariant
  })
)
