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

export interface DarkTooltip extends DarkModeShadows {
  background: string
  color: string
  borderColor: string
}

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipVariant {
  name: string
  placement: TooltipPlacement
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
  shadows?: ComponentShadows
  dark: DarkTooltip
}
