import { createComponentStore } from '@/composables/useComponentStoreFactory'
import {
  createBorder,
  createBorderRadius,
  createPadding,
  createFontSize,
  DEFAULT_LETTER_SPACING
} from '@/utils/defaultValues'
import type { ListGroupVariant } from '@/types/listgroup'

const defaultBorder = createBorder('solid', 1, '#dee2e6')
const defaultBorderRadius = createBorderRadius(true, 'px', 6)
const defaultFontSize = createFontSize(14)
const defaultPadding = createPadding(true, true, 'px', 10, 16, 10, 16)

const createDefaultVariant = (name: string): ListGroupVariant => ({
  name,
  background: '#ffffff',
  color: '#212529',
  border: { ...defaultBorder },
  borderRadius: { ...defaultBorderRadius },
  padding: { ...defaultPadding },
  fontFamily: undefined,
  fontSize: { ...defaultFontSize },
  fontStyle: 'normal',
  fontWeight: '400',
  letterSpacing: { ...DEFAULT_LETTER_SPACING },
  flush: 'none',
  numbered: 'none',
  activeBackground: '#0d6efd',
  activeColor: '#ffffff',
  activeBorderColor: '#0d6efd',
  hoverBackground: '#f8f9fa',
  hoverColor: '#212529',
  disabledColor: '#6c757d',
  disabledBackground: '#ffffff',
  disabledOpacity: 0.65,
  shadow: undefined,
  dark: {
    background: '#2d2d2d',
    color: '#ffffff',
    borderColor: '#3d3d3d',
    activeBackground: '#0d6efd',
    activeColor: '#ffffff',
    activeBorderColor: '#0d6efd',
    hoverBackground: 'rgba(255,255,255,0.075)',
    hoverColor: '#ffffff',
    disabledColor: '#6c757d',
    disabledBackground: '#2d2d2d',
    shadowColor: 'rgba(0,0,0,0.4)'
  }
})

export const useListGroupStore = defineStore('listgroup', () =>
  createComponentStore<ListGroupVariant>({
    componentId: 'listgroup',
    createDefault: createDefaultVariant
  })
)
