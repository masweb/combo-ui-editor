import tinycolor from 'tinycolor2'
import type { ColorPair } from './useColorPairEditor'
import { db } from '@/db'
import { isThemeComponentData } from '@/types/theme'
import { storeManager } from './useStoreManager'
import { useTypographyStore } from '@/stores/typography'
import { useFormsStore } from '@/stores/forms'
import { createDefaultButtonVariant as createDefaultButton } from '@/stores/button'
import { createDefaultCardVariant as createDefaultCard } from '@/stores/card'
import { createDefaultAlertVariant as createDefaultAlert } from '@/stores/alert'
import { createDefaultBadgeVariant as createDefaultBadge } from '@/stores/badge'
import { createDefaultChipVariant as createDefaultChip } from '@/stores/chip'
import { createDefaultDividerVariant as createDefaultDivider } from '@/stores/divider'
import { createDefaultProgressVariant as createDefaultProgress } from '@/stores/progress'
import { createDefaultSpinnerVariant as createDefaultSpinner } from '@/stores/spinner'
import { createDefaultAvatarVariant as createDefaultAvatar } from '@/stores/avatar'
import { createDefaultTableVariant as createDefaultTable } from '@/stores/table'
import { createDefaultListGroupVariant as createDefaultListGroup } from '@/stores/listgroup'
import { createDefaultPaginationVariant as createDefaultPagination } from '@/stores/pagination'
import { createDefaultAccordionVariant as createDefaultAccordion } from '@/stores/accordion'
import { createDefaultTooltipVariant as createDefaultTooltip } from '@/stores/tooltip'
import { createDefaultPopoverVariant as createDefaultPopover } from '@/stores/popover'
import type { ButtonVariant } from '@/types/button'
import type { CardVariant } from '@/types/card'
import type { AlertVariant } from '@/types/alert'
import type { BadgeVariant } from '@/types/badge'
import type { ChipVariant } from '@/types/chip'
import type { DividerVariant } from '@/types/divider'
import type { ProgressVariant } from '@/types/progress'
import type { SpinnerVariant } from '@/types/spinner'
import type { AvatarVariant } from '@/types/avatar'
import type { TableVariant } from '@/types/table'
import type { ListGroupVariant } from '@/types/listgroup'
import type { PaginationVariant } from '@/types/pagination'
import type { AccordionVariant } from '@/types/accordion'
import type { TooltipVariant } from '@/types/tooltip'
import type { PopoverVariant } from '@/types/popover'
import type { BorderRadiusValue, ShadowValue, ComponentShadows } from '@/types/generics'
import { createBorderRadius } from '@/utils/defaultValues'
import type { TypographyGlobalConfig } from '@/types/typography'

export interface ThemeGeneratorOptions {
  borderRadius: number
  enableShadow: boolean
  enableInsetShadow: boolean
  enableInsetHighlight: boolean
  typography: {
    fontFamily: string
    color: string
    backgroundColor: string
    darkColor: string
    darkBackgroundColor: string
  }
}

const DEFAULT_GENERATOR_OPTIONS: ThemeGeneratorOptions = {
  borderRadius: 10,
  enableShadow: true,
  enableInsetShadow: false,
  enableInsetHighlight: false,
  typography: {
    fontFamily: '',
    color: '#212529',
    backgroundColor: '#ffffff',
    darkColor: '#f8f9fa',
    darkBackgroundColor: '#222222'
  }
}

const OPTIONS_STORAGE_KEY = 'combo-ui-generator-options'

const THEME_VERSION = '1.0'

const IMPORT_KEY_MAP: Record<string, keyof typeof db> = {
  buttons: 'buttons',
  cards: 'cards',
  alerts: 'alerts',
  badges: 'badges',
  chips: 'chips',
  dividers: 'dividers',
  progress: 'progress',
  spinners: 'spinners',
  avatars: 'avatars',
  tables: 'tableVariants',
  listgroups: 'listGroups',
  pagination: 'paginations',
  accordions: 'accordions',
  tooltips: 'tooltips',
  popovers: 'popovers'
}

function autoText(bgColor: string): string {
  return tinycolor(bgColor).isDark() ? '#ffffff' : '#333333'
}

function lighten(color: string, amount: number): string {
  return tinycolor(color).lighten(amount).toHexString()
}

function tint(color: string, amount: number): string {
  return tinycolor.mix(color, '#ffffff', amount).toHexString()
}

function darken(color: string, amount: number): string {
  return tinycolor(color).darken(amount).toHexString()
}

function withAlpha(color: string, alpha: number): string {
  return tinycolor(color).setAlpha(alpha).toRgbString()
}

function darkBorder(darkBg: string): string {
  return tinycolor(darkBg).lighten(15).toHexString()
}

function darkShadow(): string {
  return 'rgba(0,0,0,0.4)'
}

function darkShadowInset(): string {
  return 'rgba(0,0,0,0.5)'
}

function darkShadowHighlight(): string {
  return 'rgba(255,255,255,0.3)'
}

function createOffsetShadow(color: string): ShadowValue {
  return { enabled: true, offsetX: 0, offsetY: 2, blur: 8, spread: 0, color }
}

function createInsetShadow(): ShadowValue {
  return { enabled: true, offsetX: -4, offsetY: -4, blur: 8, spread: 0, color: 'rgba(0,0,0,0.1)' }
}

function createInsetHighlightShadow(): ShadowValue {
  return { enabled: true, offsetX: 4, offsetY: 4, blur: 8, spread: 0, color: 'rgba(255,255,255,0.8)' }
}

function buildShadows(
  opts: ThemeGeneratorOptions
): ComponentShadows | undefined {
  const s: ComponentShadows = {}
  if (opts.enableShadow) s.offset = createOffsetShadow('rgba(0,0,0,0.25)')
  if (opts.enableInsetShadow) s.inset = createInsetShadow()
  if (opts.enableInsetHighlight) s.insetHighlight = createInsetHighlightShadow()
  return Object.keys(s).length > 0 ? s : undefined
}

function removeBorder(v: Record<string, unknown>) {
  if (v.border && typeof v.border === 'object') {
    const b = v.border as Record<string, unknown>
    if ('color' in b) b.color = 'transparent'
    if ('width' in b) b.width = 0
  }
  const dark = v.dark
  if (dark && typeof dark === 'object') {
    const d = dark as Record<string, unknown>
    if ('borderColor' in d) d.borderColor = 'transparent'
    if ('borderWidth' in d) d.borderWidth = 0
    if (d.border && typeof d.border === 'object') {
      const b = d.border as Record<string, unknown>
      if ('color' in b) b.color = 'transparent'
      if ('width' in b) b.width = 0
    }
  }
}

function applyOptions<T extends Record<string, unknown>>(
  variant: T,
  opts: ThemeGeneratorOptions
): T {
  const v = variant as Record<string, unknown>
  if ('borderRadius' in v && v.borderRadius) {
    v.borderRadius = createBorderRadius(true, 'px', opts.borderRadius)
  }
  const hasInset = opts.enableInsetShadow || opts.enableInsetHighlight
  if (hasInset) {
    removeBorder(v)
  }
  if ('shadows' in v) {
    v.shadows = buildShadows(opts)
  }
  if ('fontFamily' in v && opts.typography.fontFamily) {
    v.fontFamily = opts.typography.fontFamily
  }
  return variant
}

function generateButton(pair: ColorPair, index: number, opts: ThemeGeneratorOptions): ButtonVariant {
  const v = createDefaultButton(`v${index + 1}`)
  v.background = pair.light
  v.color = opts.typography.color || autoText(pair.light)
  v.border.color = pair.light
  v.hoverBackground = darken(pair.light, 8)
  v.hoverColor = autoText(v.hoverBackground)
  v.hoverBorder.color = v.hoverBackground
  v.activeBackground = darken(pair.light, 15)
  v.activeColor = autoText(v.activeBackground)
  v.activeBorder.color = v.activeBackground
  v.focusColor = pair.light
  v.disabledBackground = lighten(pair.light, 40)
  v.disabledColor = '#6c757d'
  v.disabledBorder.color = lighten(pair.light, 30)

  v.dark.background = pair.dark
  v.dark.color = autoText(pair.dark)
  v.dark.borderColor = pair.dark
  v.dark.hoverBackground = lighten(pair.dark, 8)
  v.dark.hoverColor = autoText(v.dark.hoverBackground)
  v.dark.hoverBorderColor = v.dark.hoverBackground
  v.dark.activeBackground = lighten(pair.dark, 15)
  v.dark.activeColor = autoText(v.dark.activeBackground)
  v.dark.activeBorderColor = v.dark.activeBackground
  v.dark.focusColor = pair.dark
  v.dark.disabledBackground = darken(pair.dark, 10)
  v.dark.disabledColor = '#6c757d'
  v.dark.disabledBorderColor = darkBorder(pair.dark)
  v.dark.shadowColor = darkShadow()
  v.dark.shadowInsetColor = darkShadowInset()
  v.dark.shadowInsetHighlightColor = darkShadowHighlight()

  return applyOptions(v, opts)
}

function generateCard(pair: ColorPair, index: number, opts: ThemeGeneratorOptions): CardVariant {
  const v = createDefaultCard(`v${index + 1}`)
  v.background = opts.typography.backgroundColor || tint(pair.light, 82)
  v.color = opts.typography.color || autoText(v.background)
  v.border.color = tint(pair.light, 68)
  v.headerBackground = tint(pair.light, 75)
  v.headerColor = autoText(v.headerBackground)
  v.headerBorderBottom.color = v.border.color

  v.dark.background = pair.dark
  v.dark.color = autoText(pair.dark)
  v.dark.borderColor = darkBorder(pair.dark)
  v.dark.headerBackground = darken(pair.dark, 10)
  v.dark.headerColor = autoText(v.dark.headerBackground)
  v.dark.headerBorderBottomColor = darkBorder(pair.dark)
  v.dark.shadowColor = darkShadow()
  v.dark.shadowInsetColor = darkShadowInset()
  v.dark.shadowInsetHighlightColor = darkShadowHighlight()

  return applyOptions(v, opts)
}

function generateAlert(pair: ColorPair, index: number, opts: ThemeGeneratorOptions): AlertVariant {
  const v = createDefaultAlert(`v${index + 1}`)
  v.background = tint(pair.light, 80)
  v.color = darken(pair.light, 40)
  v.border.color = tint(pair.light, 68)
  v.headerBackground = tint(pair.light, 72)
  v.headerColor = v.color
  v.headerBorderBottom.color = v.border.color
  v.closeColor = v.color
  v.closeHoverColor = darken(v.color, 20)
  v.closeActiveColor = darken(v.color, 30)

  v.dark.background = pair.dark
  v.dark.color = autoText(pair.dark)
  v.dark.borderColor = darkBorder(pair.dark)
  v.dark.headerBackground = darken(pair.dark, 10)
  v.dark.headerColor = autoText(v.dark.headerBackground)
  v.dark.headerBorderBottomColor = darkBorder(pair.dark)
  v.dark.closeColor = autoText(pair.dark)
  v.dark.closeHoverColor = lighten(pair.dark, 30)
  v.dark.closeActiveColor = lighten(pair.dark, 40)
  v.dark.shadowColor = darkShadow()
  v.dark.shadowInsetColor = darkShadowInset()
  v.dark.shadowInsetHighlightColor = darkShadowHighlight()

  return applyOptions(v, opts)
}

function generateBadge(pair: ColorPair, index: number, opts: ThemeGeneratorOptions): BadgeVariant {
  const v = createDefaultBadge(`v${index + 1}`)
  v.background = pair.light
  v.color = autoText(pair.light)
  v.border.color = pair.light

  v.dark.background = pair.dark
  v.dark.color = autoText(pair.dark)
  v.dark.borderColor = pair.dark
  v.dark.shadowColor = darkShadow()
  v.dark.shadowInsetColor = darkShadowInset()
  v.dark.shadowInsetHighlightColor = darkShadowHighlight()

  return applyOptions(v, opts)
}

function generateChip(pair: ColorPair, index: number, opts: ThemeGeneratorOptions): ChipVariant {
  const v = createDefaultChip(`v${index + 1}`)
  v.background = tint(pair.light, 75)
  v.color = darken(pair.light, 30)
  v.border.color = tint(pair.light, 60)
  v.closeColor = darken(pair.light, 15)
  v.closeHoverColor = darken(pair.light, 25)
  v.closeActiveColor = darken(pair.light, 35)

  v.dark.background = pair.dark
  v.dark.color = autoText(pair.dark)
  v.dark.borderColor = darkBorder(pair.dark)
  v.dark.closeColor = autoText(pair.dark)
  v.dark.closeHoverColor = lighten(pair.dark, 20)
  v.dark.closeActiveColor = lighten(pair.dark, 30)
  v.dark.shadowColor = darkShadow()
  v.dark.shadowInsetColor = darkShadowInset()
  v.dark.shadowInsetHighlightColor = darkShadowHighlight()

  return applyOptions(v, opts)
}

function generateDivider(pair: ColorPair, index: number, opts: ThemeGeneratorOptions): DividerVariant {
  const v = createDefaultDivider(`v${index + 1}`)
  v.border.color = pair.light
  v.dark.borderColor = lighten(pair.dark, 30)
  return applyOptions(v, opts)
}

function generateProgress(pair: ColorPair, index: number, opts: ThemeGeneratorOptions): ProgressVariant {
  const v = createDefaultProgress(`v${index + 1}`)
  v.trackColor = tint(pair.light, 80)
  v.fillColor = pair.light
  v.labelColor = autoText(v.fillColor)

  v.dark.trackColor = darken(pair.dark, 10)
  v.dark.fillColor = pair.dark
  v.dark.labelColor = autoText(pair.dark)
  v.dark.borderColor = darkBorder(pair.dark)
  v.dark.shadowColor = darkShadow()
  v.dark.shadowInsetColor = darkShadowInset()
  v.dark.shadowInsetHighlightColor = darkShadowHighlight()

  return applyOptions(v, opts)
}

function generateSpinner(pair: ColorPair, index: number, opts: ThemeGeneratorOptions): SpinnerVariant {
  const v = createDefaultSpinner(`v${index + 1}`)
  v.color = pair.light
  v.trackColor = tint(pair.light, 80)
  v.border.color = pair.light

  v.dark.color = pair.dark
  v.dark.trackColor = darken(pair.dark, 15)
  v.dark.borderColor = darkBorder(pair.dark)

  return applyOptions(v, opts)
}

function generateAvatar(pair: ColorPair, index: number, opts: ThemeGeneratorOptions): AvatarVariant {
  const v = createDefaultAvatar(`v${index + 1}`)
  v.background = pair.light
  v.color = autoText(pair.light)
  v.border.color = lighten(pair.light, 15)
  v.online.color = '#28a745'

  v.dark.background = pair.dark
  v.dark.color = autoText(pair.dark)
  v.dark.borderColor = darkBorder(pair.dark)
  v.dark.onlineColor = '#28a745'
  v.dark.shadowColor = darkShadow()
  v.dark.shadowInsetColor = darkShadowInset()
  v.dark.shadowInsetHighlightColor = darkShadowHighlight()

  return applyOptions(v, opts)
}

function generateTable(pair: ColorPair, index: number, opts: ThemeGeneratorOptions): TableVariant {
  const v = createDefaultTable(`v${index + 1}`)
  v.background = opts.typography.backgroundColor || '#ffffff'
  v.color = opts.typography.color || '#212529'
  v.border.color = tint(pair.light, 68)
  v.headerBackground = tint(pair.light, 85)
  v.headerColor = darken(pair.light, 40)
  v.headerBorderBottom.color = tint(pair.light, 68)
  v.footerBackground = tint(pair.light, 85)
  v.footerColor = v.headerColor
  v.footerBorderTop.color = v.border.color
  v.horizontalBorder.color = tint(pair.light, 60)
  v.verticalBorder.color = tint(pair.light, 60)
  v.stripedRowBackground = withAlpha(pair.light, 0.08)
  v.stripedColumnBackground = withAlpha(pair.light, 0.08)
  v.hoverBackground = withAlpha(pair.light, 0.12)
  v.hoverColor = opts.typography.color || '#212529'

  v.dark.background = pair.dark
  v.dark.color = autoText(pair.dark)
  v.dark.borderColor = darkBorder(pair.dark)
  v.dark.headerBackground = darken(pair.dark, 10)
  v.dark.headerColor = autoText(v.dark.headerBackground)
  v.dark.headerBorderBottomColor = darkBorder(pair.dark)
  v.dark.footerBackground = darken(pair.dark, 10)
  v.dark.footerColor = autoText(v.dark.footerBackground)
  v.dark.footerBorderTopColor = darkBorder(pair.dark)
  v.dark.horizontalBorderColor = darkBorder(pair.dark)
  v.dark.verticalBorderColor = darkBorder(pair.dark)
  v.dark.stripedRowBackground = darken(pair.dark, 3)
  v.dark.stripedColumnBackground = darken(pair.dark, 3)
  v.dark.hoverBackground = darken(pair.dark, 5)
  v.dark.hoverColor = autoText(pair.dark)
  v.dark.shadowColor = darkShadow()

  return applyOptions(v, opts)
}

function generateListGroup(pair: ColorPair, index: number, opts: ThemeGeneratorOptions): ListGroupVariant {
  const v = createDefaultListGroup(`v${index + 1}`)
  v.background = opts.typography.backgroundColor || '#ffffff'
  v.color = opts.typography.color || '#212529'
  v.border.color = tint(pair.light, 68)
  v.activeBackground = pair.light
  v.activeColor = autoText(pair.light)
  v.activeBorderColor = pair.light
  v.hoverBackground = withAlpha(pair.light, 0.08)
  v.hoverColor = opts.typography.color || '#212529'
  v.disabledColor = '#6c757d'
  v.disabledBackground = opts.typography.backgroundColor || '#ffffff'

  v.dark.background = pair.dark
  v.dark.color = autoText(pair.dark)
  v.dark.borderColor = darkBorder(pair.dark)
  v.dark.activeBackground = pair.dark
  v.dark.activeColor = autoText(pair.dark)
  v.dark.activeBorderColor = pair.dark
  v.dark.hoverBackground = darken(pair.dark, 5)
  v.dark.hoverColor = autoText(pair.dark)
  v.dark.disabledColor = '#6c757d'
  v.dark.disabledBackground = darken(pair.dark, 3)
  v.dark.shadowColor = darkShadow()

  return applyOptions(v, opts)
}

function generatePagination(pair: ColorPair, index: number, opts: ThemeGeneratorOptions): PaginationVariant {
  const v = createDefaultPagination(`v${index + 1}`)
  v.background = opts.typography.backgroundColor || '#ffffff'
  v.color = pair.light
  v.border.color = tint(pair.light, 68)
  v.activeBackground = pair.light
  v.activeColor = autoText(pair.light)
  v.activeBorderColor = pair.light
  v.hoverBackground = tint(pair.light, 80)
  v.hoverColor = pair.light
  v.disabledColor = '#6c757d'

  v.dark.background = pair.dark
  v.dark.color = lighten(pair.dark, 30)
  v.dark.borderColor = darkBorder(pair.dark)
  v.dark.activeBackground = pair.dark
  v.dark.activeColor = autoText(pair.dark)
  v.dark.activeBorderColor = pair.dark
  v.dark.hoverBackground = withAlpha('#ffffff', 0.075)
  v.dark.hoverColor = lighten(pair.dark, 30)
  v.dark.disabledColor = '#6c757d'
  v.dark.shadowColor = darkShadow()
  v.dark.shadowInsetColor = darkShadowInset()
  v.dark.shadowInsetHighlightColor = darkShadowHighlight()

  return applyOptions(v, opts)
}

function generateAccordion(pair: ColorPair, index: number, opts: ThemeGeneratorOptions): AccordionVariant {
  const v = createDefaultAccordion(`v${index + 1}`)
  v.background = opts.typography.backgroundColor || '#ffffff'
  v.color = opts.typography.color || '#212529'
  v.border.color = tint(pair.light, 68)
  v.buttonBackground = opts.typography.backgroundColor || '#ffffff'
  v.buttonColor = opts.typography.color || '#212529'
  v.buttonHoverBackground = tint(pair.light, 85)
  v.buttonHoverColor = darken(pair.light, 30)
  v.activeButtonBackground = tint(pair.light, 80)
  v.activeButtonColor = darken(pair.light, 35)

  v.dark.background = pair.dark
  v.dark.color = autoText(pair.dark)
  v.dark.borderColor = darkBorder(pair.dark)
  v.dark.buttonBackground = pair.dark
  v.dark.buttonColor = autoText(pair.dark)
  v.dark.buttonHoverBackground = withAlpha('#ffffff', 0.075)
  v.dark.buttonHoverColor = lighten(pair.dark, 30)
  v.dark.activeButtonBackground = withAlpha(pair.light, 0.15)
  v.dark.activeButtonColor = lighten(pair.dark, 30)
  v.dark.shadowColor = darkShadow()

  return applyOptions(v, opts)
}

function generateTooltip(pair: ColorPair, index: number, opts: ThemeGeneratorOptions): TooltipVariant {
  const v = createDefaultTooltip(`v${index + 1}`)
  v.background = pair.light
  v.color = autoText(pair.light)
  v.border.color = darken(pair.light, 15)

  v.dark.background = pair.dark
  v.dark.color = autoText(pair.dark)
  v.dark.borderColor = lighten(pair.dark, 15)
  v.dark.shadowColor = darkShadow()
  v.dark.shadowInsetColor = darkShadowInset()
  v.dark.shadowInsetHighlightColor = darkShadowHighlight()

  return applyOptions(v, opts)
}

function generatePopover(pair: ColorPair, index: number, opts: ThemeGeneratorOptions): PopoverVariant {
  const v = createDefaultPopover(`v${index + 1}`)
  v.background = tint(pair.light, 85)
  v.color = opts.typography.color || '#333333'
  v.border.color = tint(pair.light, 68)
  v.headerBackground = tint(pair.light, 75)
  v.headerColor = opts.typography.color || '#333333'
  v.headerBorderBottom.color = v.border.color

  v.dark.background = pair.dark
  v.dark.color = autoText(pair.dark)
  v.dark.borderColor = darkBorder(pair.dark)
  v.dark.headerBackground = darken(pair.dark, 8)
  v.dark.headerColor = autoText(v.dark.headerBackground)
  v.dark.headerBorderBottomColor = darkBorder(pair.dark)
  v.dark.shadowColor = darkShadow()
  v.dark.shadowInsetColor = darkShadowInset()
  v.dark.shadowInsetHighlightColor = 'rgba(255,255,255,0.05)'

  return applyOptions(v, opts)
}

interface ComponentGenerator {
  key: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generate: (pair: ColorPair, index: number, opts: ThemeGeneratorOptions) => any
}

const GENERATORS: ComponentGenerator[] = [
  { key: 'buttons', generate: generateButton },
  { key: 'cards', generate: generateCard },
  { key: 'alerts', generate: generateAlert },
  { key: 'badges', generate: generateBadge },
  { key: 'chips', generate: generateChip },
  { key: 'dividers', generate: generateDivider },
  { key: 'progress', generate: generateProgress },
  { key: 'spinners', generate: generateSpinner },
  { key: 'avatars', generate: generateAvatar },
  { key: 'tables', generate: generateTable },
  { key: 'listgroups', generate: generateListGroup },
  { key: 'pagination', generate: generatePagination },
  { key: 'accordions', generate: generateAccordion },
  { key: 'tooltips', generate: generateTooltip },
  { key: 'popovers', generate: generatePopover }
]

export const useThemeGenerator = () => {
  const isGenerating = ref(false)

  const options = ref<ThemeGeneratorOptions>(loadOptions())

  function loadOptions(): ThemeGeneratorOptions {
    try {
      const stored = localStorage.getItem(OPTIONS_STORAGE_KEY)
      if (stored) return { ...DEFAULT_GENERATOR_OPTIONS, ...JSON.parse(stored) }
    } catch {
      // ignore
    }
    saveOptions()
    return { ...DEFAULT_GENERATOR_OPTIONS }
  }

  function saveOptions() {
    localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options.value))
  }

  const generateTheme = async (pairs: ColorPair[], name: string, opts?: ThemeGeneratorOptions): Promise<ThemeData> => {
    isGenerating.value = true
    const resolvedOpts = opts ?? options.value

    try {
      const themeData: ThemeData = {
        name,
        version: THEME_VERSION
      }

      for (const gen of GENERATORS) {
        const variants = pairs.map((pair, i) => gen.generate(pair, i, resolvedOpts))
        themeData[gen.key] = {
          variants,
          selectedVariantIndex: 0
        }
      }

      return themeData
    } finally {
      isGenerating.value = false
    }
  }

  const reloadStores = async () => {
    const typographyStore = useTypographyStore()
    typographyStore.clearFromMemory()
    await typographyStore.loadFromDB()

    const formsStore = useFormsStore()
    formsStore.clearFromMemory()
    await formsStore.loadFromDB()

    void storeManager.reloadAllStores()
  }

  const saveThemeToDB = async (pairs: ColorPair[], name: string) => {
    isGenerating.value = true

    try {
      saveOptions()
      const themeData = await generateTheme(pairs, name, options.value)

      for (const gen of GENERATORS) {
        const componentData = themeData[gen.key]
        if (isThemeComponentData(componentData)) {
          const tableName = IMPORT_KEY_MAP[gen.key]
          if (tableName) {
            const table = db[tableName] as unknown as {
              put: (data: { id: string; variants: unknown[]; selectedVariantIndex: number }) => Promise<void>
            }
            await table.put({
              id: 'main',
              variants: componentData.variants,
              selectedVariantIndex: componentData.selectedVariantIndex ?? 0
            })
          }
        }
      }

      await db.themeMeta.put({ id: 'main', name })

      await reloadStores()
    } finally {
      isGenerating.value = false
    }
  }

  return {
    isGenerating,
    options,
    generateTheme,
    saveThemeToDB
  }
}
