import { defineStore } from 'pinia'
import { createComponentStore } from '@/composables/useComponentStoreFactory'
import {
  createBorder,
  createBorderRadius,
  createPadding,
  createFontSize,
  createUnitNumber,
  DEFAULT_LETTER_SPACING
} from '@/utils/defaultValues'
import type { PopoverVariant } from '@/types/popover'

const defaultBorder = createBorder('solid', 1, '#dee2e6')
const defaultBorderRadius = createBorderRadius(true, 'px', 8)
const defaultPadding = createPadding(true, true, 'px', 12, 16, 12, 16)
const defaultFontSize = createFontSize(14)
const defaultArrowSize = createUnitNumber(8)
const defaultMaxWidth = createUnitNumber(300)

const defaultHeaderBorder = createBorder('solid', 1, '#dee2e6')
const defaultHeaderPadding = createPadding(true, true, 'px', 8, 16, 8, 16)
const defaultHeaderFontSize = createFontSize(14)

const createDefaultVariant = (name: string): PopoverVariant => ({
  name,
  placement: 'top',
  background: '#ffffff',
  color: '#333333',
  border: { ...defaultBorder },
  borderRadius: { ...defaultBorderRadius },
  padding: { ...defaultPadding },
  fontFamily: undefined,
  fontSize: { ...defaultFontSize },
  fontStyle: 'normal',
  fontWeight: '400',
  letterSpacing: { ...DEFAULT_LETTER_SPACING },
  arrowSize: { ...defaultArrowSize },
  maxWidth: { ...defaultMaxWidth },
  headerBackground: '#f8f9fa',
  headerColor: '#333333',
  headerPadding: { ...defaultHeaderPadding },
  headerBorderBottom: { ...defaultHeaderBorder },
  headerFontFamily: undefined,
  headerFontStyle: 'normal',
  headerFontWeight: '600',
  headerFontSize: { ...defaultHeaderFontSize },
  headerLetterSpacing: { ...DEFAULT_LETTER_SPACING },
  shadows: undefined,
  dark: {
    background: '#2d2d2d',
    color: '#e0e0e0',
    borderColor: '#495057',
    headerBackground: '#343a40',
    headerColor: '#e0e0e0',
    headerBorderBottomColor: '#495057',
    shadowColor: 'rgba(0,0,0,0.6)',
    shadowInsetColor: 'rgba(0,0,0,0.4)',
    shadowInsetHighlightColor: 'rgba(255,255,255,0.05)'
  }
})

export const usePopoverStore = defineStore('popover', () =>
  createComponentStore<PopoverVariant>({
    componentId: 'popover',
    createDefault: createDefaultVariant
  })
)
