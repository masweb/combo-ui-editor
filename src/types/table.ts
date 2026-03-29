export interface TableVariant {
  name: string

  background: string
  color: string
  border: BorderValue
  borderRadius: BorderRadiusValue

  fontFamily?: string | null
  fontSize: UnitNumber
  fontStyle: FontStyle
  fontWeight: string
  letterSpacing: LetterSpacingValue

  headerBackground: string
  headerColor: string
  headerPadding: PaddingValue
  headerBorderBottom: BorderValue
  headerFontFamily?: string | null
  headerFontStyle: FontStyle
  headerFontWeight: string
  headerFontSize: UnitNumber
  headerLetterSpacing: LetterSpacingValue

  footerBackground: string
  footerColor: string
  footerBorderTop: BorderValue

  cellPadding: PaddingValue
  horizontalBorderEnabled: boolean
  horizontalBorder: BorderValue
  verticalBorderEnabled: boolean
  verticalBorder: BorderValue

  stripedRows: boolean
  stripedRowBackground: string
  stripedColumns: boolean
  stripedColumnBackground: string

  hoverable: boolean
  hoverBackground: string
  hoverColor: string

  shadow?: ShadowValue

  dark: DarkTable
}

export interface DarkTable {
  background: string
  color: string
  borderColor: string
  headerBackground: string
  headerColor: string
  headerBorderBottomColor: string
  footerBackground: string
  footerColor: string
  footerBorderTopColor: string
  horizontalBorderColor: string
  verticalBorderColor: string
  stripedRowBackground: string
  stripedColumnBackground: string
  hoverBackground: string
  hoverColor: string
  shadowColor: string
}
