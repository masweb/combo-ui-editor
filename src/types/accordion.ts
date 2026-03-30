import type {
  BorderValue,
  BorderRadiusValue,
  FontStyle,
  LetterSpacingValue,
  PaddingValue,
  ShadowValue,
  UnitNumber
} from './generics'

export interface AccordionVariant {
  name: string
  background: string
  color: string
  border: BorderValue
  borderRadius: BorderRadiusValue
  bodyPadding: PaddingValue
  fontFamily?: string | null
  fontSize: UnitNumber
  fontStyle: FontStyle
  fontWeight: string
  letterSpacing: LetterSpacingValue
  buttonBackground: string
  buttonColor: string
  buttonPadding: PaddingValue
  buttonFontSize: UnitNumber
  buttonFontWeight: string
  buttonHoverBackground: string
  buttonHoverColor: string
  activeButtonBackground: string
  activeButtonColor: string
  shadow?: ShadowValue
  dark: DarkAccordion
}

export interface DarkAccordion {
  background: string
  color: string
  borderColor: string
  buttonBackground: string
  buttonColor: string
  buttonHoverBackground: string
  buttonHoverColor: string
  activeButtonBackground: string
  activeButtonColor: string
  shadowColor: string
}
