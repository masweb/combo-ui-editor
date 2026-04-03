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
import type { TooltipVariant } from '@/types/tooltip'

const defaultBorder = createBorder('solid', 1, '#555555')
const defaultBorderRadius = createBorderRadius(true, 'px', 6)
const defaultPadding = createPadding(true, true, 'px', 6, 10, 6, 10)
const defaultFontSize = createFontSize(13)
const defaultArrowSize = createUnitNumber(6)
const defaultMaxWidth = createUnitNumber(200)

const createDefaultVariant = (name: string): TooltipVariant => ({
  name,
  placement: 'top',
  background: '#333333',
  color: '#ffffff',
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
  shadows: undefined,
  dark: {
    background: '#ffffff',
    color: '#333333',
    borderColor: '#dee2e6',
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowInsetColor: 'rgba(0,0,0,0.3)',
    shadowInsetHighlightColor: 'rgba(255,255,255,0.75)'
  }
})

export const useTooltipStore = defineStore('tooltip', () =>
  createComponentStore<TooltipVariant>({
    componentId: 'tooltip',
    createDefault: createDefaultVariant
  })
)
