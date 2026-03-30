export interface AvatarOnline {
  show: boolean
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  color: string
  size: number
  offsetX: number
  offsetY: number
}

export interface AvatarVariant {
  name: string
  size: UnitNumber
  showImage: boolean
  online: AvatarOnline
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
  shadows?: {
    offset?: ShadowValue
    inset?: ShadowValue
    insetHighlight?: ShadowValue
  }
  dark: DarkAvatar
}

export interface DarkAvatar extends DarkModeShadows {
  background: string
  color: string
  borderColor: string
  onlineColor: string
}
