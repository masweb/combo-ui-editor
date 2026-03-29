import type {
  BorderValue,
  BorderRadiusValue,
  FontStyle,
  LetterSpacingValue,
  PaddingValue,
  ShadowValue,
  UnitNumber
} from './generics'

export type ListGroupFlush = 'none' | 'flush'
export type ListGroupNumbered = 'none' | 'numbered'

export interface ListGroupVariant {
  name: string
  background: string
  color: string
  border: BorderValue
  borderRadius: BorderRadiusValue
  padding: PaddingValue
  fontFamily?: string | null
  fontSize: UnitNumber
  fontStyle: FontStyle
  fontWeight: string
  letterSpacing: LetterSpacingValue
  flush: ListGroupFlush
  numbered: ListGroupNumbered
  activeBackground: string
  activeColor: string
  activeBorderColor: string
  hoverBackground: string
  hoverColor: string
  disabledColor: string
  disabledBackground: string
  disabledOpacity: number
  shadow?: ShadowValue
  dark: DarkListGroup
}

export interface DarkListGroup {
  background: string
  color: string
  borderColor: string
  activeBackground: string
  activeColor: string
  activeBorderColor: string
  hoverBackground: string
  hoverColor: string
  disabledColor: string
  disabledBackground: string
  shadowColor: string
}
