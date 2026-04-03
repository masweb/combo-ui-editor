import type {
  BorderValue,
  BorderRadiusValue,
  PaddingValue,
  UnitNumber,
  LetterSpacingValue,
  ComponentShadows,
  DarkModeShadows,
  FontStyle
} from './generics'

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface DarkPopover extends DarkModeShadows {
  background: string
  color: string
  borderColor: string
  headerBackground: string
  headerColor: string
  headerBorderBottomColor: string
}

export interface PopoverVariant {
  name: string
  placement: PopoverPlacement
  background: string
  color: string
  border: BorderValue
  borderRadius: BorderRadiusValue
  padding: PaddingValue
  fontFamily?: string | null
  fontSize: UnitNumber
  fontStyle: FontStyle
  fontWeight: string
  letterSpacing?: LetterSpacingValue
  arrowSize: UnitNumber
  maxWidth: UnitNumber
  headerBackground: string
  headerColor: string
  headerPadding: PaddingValue
  headerBorderBottom: BorderValue
  headerFontFamily?: string | null
  headerFontStyle: FontStyle
  headerFontWeight: string
  headerFontSize: UnitNumber
  headerLetterSpacing?: LetterSpacingValue
  shadows?: ComponentShadows
  dark: DarkPopover
}
