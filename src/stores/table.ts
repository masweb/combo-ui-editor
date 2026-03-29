import { createComponentStore } from '@/composables/useComponentStoreFactory'
import {
  createBorder,
  createBorderRadius,
  createPadding,
  createFontSize,
  DEFAULT_LETTER_SPACING
} from '@/utils/defaultValues'
import type { TableVariant } from '@/types/table'

const defaultBorder = createBorder('solid', 1, '#dee2e6')
const defaultBorderRadius = createBorderRadius(true, 'px', 8)
const defaultFontSize = createFontSize(14)
const defaultHeaderPadding = createPadding(true, true, 'px', 10, 12, 10, 12)
const defaultHeaderBorderBottom = createBorder('solid', 2, '#dee2e6')
const defaultHeaderFontSize = createFontSize(14)
const defaultFooterBorderTop = createBorder('solid', 2, '#dee2e6')
const defaultCellPadding = createPadding(true, true, 'px', 8, 12, 8, 12)
const defaultHorizontalBorder = createBorder('solid', 1, '#dee2e6')
const defaultVerticalBorder = createBorder('solid', 1, '#dee2e6')

const createDefaultVariant = (name: string): TableVariant => ({
  name,
  background: '#ffffff',
  color: '#212529',
  border: { ...defaultBorder },
  borderRadius: { ...defaultBorderRadius },
  fontFamily: undefined,
  fontSize: { ...defaultFontSize },
  fontStyle: 'normal',
  fontWeight: '400',
  letterSpacing: { ...DEFAULT_LETTER_SPACING },
  headerBackground: '#f8f9fa',
  headerColor: '#212529',
  headerPadding: { ...defaultHeaderPadding },
  headerBorderBottom: { ...defaultHeaderBorderBottom },
  headerFontFamily: undefined,
  headerFontStyle: 'normal',
  headerFontWeight: '600',
  headerFontSize: { ...defaultHeaderFontSize },
  headerLetterSpacing: { ...DEFAULT_LETTER_SPACING },
  footerBackground: '#f8f9fa',
  footerColor: '#212529',
  footerBorderTop: { ...defaultFooterBorderTop },
  cellPadding: { ...defaultCellPadding },
  horizontalBorderEnabled: true,
  horizontalBorder: { ...defaultHorizontalBorder },
  verticalBorderEnabled: false,
  verticalBorder: { ...defaultVerticalBorder },
  stripedRows: false,
  stripedRowBackground: 'rgba(0,0,0,0.05)',
  stripedColumns: false,
  stripedColumnBackground: 'rgba(0,0,0,0.05)',
  hoverable: false,
  hoverBackground: 'rgba(0,0,0,0.075)',
  hoverColor: '#212529',
  shadow: undefined,
  dark: {
    background: '#2d2d2d',
    color: '#ffffff',
    borderColor: '#3d3d3d',
    headerBackground: '#1a1a1a',
    headerColor: '#ffffff',
    headerBorderBottomColor: '#3d3d3d',
    footerBackground: '#1a1a1a',
    footerColor: '#ffffff',
    footerBorderTopColor: '#3d3d3d',
    horizontalBorderColor: '#3d3d3d',
    verticalBorderColor: '#3d3d3d',
    stripedRowBackground: 'rgba(255,255,255,0.05)',
    stripedColumnBackground: 'rgba(255,255,255,0.05)',
    hoverBackground: 'rgba(255,255,255,0.075)',
    hoverColor: '#ffffff',
    shadowColor: 'rgba(0,0,0,0.4)'
  }
})

export const useTableStore = defineStore('table', () =>
  createComponentStore<TableVariant>({
    componentId: 'table',
    createDefault: createDefaultVariant
  })
)
