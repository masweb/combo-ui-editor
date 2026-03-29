import { createComponentStore } from '@/composables/useComponentStoreFactory'
import {
  createBorder,
  createBorderRadius,
  createPadding,
  createFontSize,
  DEFAULT_LETTER_SPACING
} from '@/utils/defaultValues'
import type { PaginationVariant } from '@/types/pagination'

const defaultBorder = createBorder('solid', 1, '#dee2e6')
const defaultBorderRadius = createBorderRadius(true, 'px', 6)
const defaultFontSize = createFontSize(14)
const defaultPadding = createPadding(true, true, 'px', 6, 12, 6, 12)

const createDefaultVariant = (name: string): PaginationVariant => ({
  name,
  background: '#ffffff',
  color: '#0d6efd',
  border: { ...defaultBorder },
  borderRadius: { ...defaultBorderRadius },
  padding: { ...defaultPadding },
  fontFamily: undefined,
  fontSize: { ...defaultFontSize },
  fontStyle: 'normal',
  fontWeight: '400',
  letterSpacing: { ...DEFAULT_LETTER_SPACING },
  itemGap: 4,
  activeBackground: '#0d6efd',
  activeColor: '#ffffff',
  activeBorderColor: '#0d6efd',
  hoverBackground: '#e9ecef',
  hoverColor: '#0d6efd',
  disabledColor: '#6c757d',
  disabledOpacity: 0.65,
  shadows: undefined,
  dark: {
    background: '#2d2d2d',
    color: '#6ea8fe',
    borderColor: '#3d3d3d',
    activeBackground: '#0d6efd',
    activeColor: '#ffffff',
    activeBorderColor: '#0d6efd',
    hoverBackground: 'rgba(255,255,255,0.075)',
    hoverColor: '#6ea8fe',
    disabledColor: '#6c757d',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowInsetColor: 'rgba(0,0,0,0.2)',
    shadowInsetHighlightColor: 'rgba(255,255,255,0.75)'
  }
})

export const usePaginationStore = defineStore('pagination', () =>
  createComponentStore<PaginationVariant>({
    componentId: 'pagination',
    createDefault: createDefaultVariant
  })
)
