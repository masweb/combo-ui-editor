import type {
  BorderValue,
  BorderRadiusValue,
  ComponentShadows,
  DarkModeShadows,
  FontStyle,
  LetterSpacingValue,
  PaddingValue,
  UnitNumber
} from './generics'

export interface PaginationVariant {
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
  itemGap: number
  activeBackground: string
  activeColor: string
  activeBorderColor: string
  hoverBackground: string
  hoverColor: string
  disabledColor: string
  disabledOpacity: number
  shadows?: ComponentShadows
  dark: DarkPagination
}

export interface DarkPagination extends DarkModeShadows {
  background: string
  color: string
  borderColor: string
  activeBackground: string
  activeColor: string
  activeBorderColor: string
  hoverBackground: string
  hoverColor: string
  disabledColor: string
}
