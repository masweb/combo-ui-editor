<script setup lang="ts">
import { usePreviewGrid } from '@/composables/usePreviewGrid'
import { useThemeCompensation } from '@/composables/useThemeCompensation'
import type { PopoverPlacement, PopoverVariant } from '@/types/popover'

const popoverStore = usePopoverStore()
const { typographyStore, buildBorderRadius, buildPadding, buildShadow, buildBorderCSS, resolveColor, isDark } =
  usePreviewGrid()

const componentTheme = useComponentTheme()
const { theme } = useTheme()
const { getCompensation, getFooterCompensation } = useThemeCompensation(componentTheme.theme, theme)

const labelColor = computed(() =>
  isDark.value ? typographyStore.globalConfig.dark.color : typographyStore.globalConfig.color
)

const getPopoverStyles = (variant: PopoverVariant) => {
  const offsetShadow = variant.shadows?.offset?.enabled
    ? `${variant.shadows.offset.offsetX}px ${variant.shadows.offset.offsetY}px ${variant.shadows.offset.blur}px ${variant.shadows.offset.spread}px ${isDark.value ? (variant.dark.shadowColor ?? variant.shadows.offset.color) : variant.shadows.offset.color}`
    : 'none'

  return {
    backgroundColor: resolveColor(variant.background, variant.dark.background),
    color: resolveColor(variant.color, variant.dark.color),
    ...buildBorderCSS(variant.border, variant.dark.borderColor),
    borderRadius: buildBorderRadius(variant.borderRadius),
    boxShadow: offsetShadow,
    width: `${variant.maxWidth.value}${variant.maxWidth.unit}`,
    position: 'relative' as const,
    overflow: 'hidden'
  }
}

const getInsetOverlayStyles = (variant: PopoverVariant) => {
  const shadows: string[] = []

  if (variant.shadows?.inset?.enabled) {
    const color = isDark.value ? variant.dark.shadowInsetColor : variant.shadows.inset.color
    shadows.push(
      `inset ${variant.shadows.inset.offsetX}px ${variant.shadows.inset.offsetY}px ${variant.shadows.inset.blur}px ${variant.shadows.inset.spread}px ${color}`
    )
  }

  if (variant.shadows?.insetHighlight?.enabled) {
    const color = isDark.value ? variant.dark.shadowInsetHighlightColor : variant.shadows.insetHighlight.color
    shadows.push(
      `inset ${variant.shadows.insetHighlight.offsetX}px ${variant.shadows.insetHighlight.offsetY}px ${variant.shadows.insetHighlight.blur}px ${variant.shadows.insetHighlight.spread}px ${color}`
    )
  }

  return {
    position: 'absolute',
    inset: '0',
    zIndex: 2,
    pointerEvents: 'none',
    borderRadius: buildBorderRadius(variant.borderRadius),
    boxShadow: shadows.length > 0 ? shadows.join(', ') : 'none'
  }
}

const getHeaderStyles = (variant: PopoverVariant) => {
  const fontFamily = variant.headerFontFamily ?? typographyStore.effectiveFontFamily

  return {
    backgroundColor: resolveColor(variant.headerBackground, variant.dark.headerBackground),
    color: resolveColor(variant.headerColor, variant.dark.headerColor),
    fontFamily,
    fontSize: `${variant.headerFontSize.value}${variant.headerFontSize.unit}`,
    fontStyle: variant.headerFontStyle,
    fontWeight: variant.headerFontWeight,
    letterSpacing: variant.headerLetterSpacing
      ? `${variant.headerLetterSpacing.value}${variant.headerLetterSpacing.unit}`
      : undefined,
    padding: buildPadding(variant.headerPadding),
    borderBottomStyle: variant.headerBorderBottom.style,
    borderBottomWidth: `${variant.headerBorderBottom.width}${variant.headerBorderBottom.unit}`,
    borderBottomColor: resolveColor(variant.headerBorderBottom.color, variant.dark.headerBorderBottomColor),
    borderRadius: `${buildBorderRadius(variant.borderRadius).split(' ')[0]} ${buildBorderRadius(variant.borderRadius).split(' ')[1]} 0 0`,
    position: 'relative' as const,
    zIndex: 1
  }
}

const getBodyStyles = (variant: PopoverVariant) => {
  const fontFamily = variant.fontFamily ?? typographyStore.effectiveFontFamily

  return {
    fontFamily,
    fontSize: `${variant.fontSize.value}${variant.fontSize.unit}`,
    fontStyle: variant.fontStyle,
    fontWeight: variant.fontWeight,
    letterSpacing: variant.letterSpacing ? `${variant.letterSpacing.value}${variant.letterSpacing.unit}` : undefined,
    padding: buildPadding(variant.padding),
    position: 'relative' as const,
    zIndex: 1
  }
}

const hasBorder = (variant: PopoverVariant) =>
  variant.border.style !== 'none'

interface ArrowConfig {
  position: Record<string, string>
  borderTriangle: (size: number, unit: string, color: string) => Record<string, string>
}

const ARROW_CONFIGS: Record<PopoverPlacement, ArrowConfig> = {
  top: {
    position: { bottom: 'VALUE', left: '50%', transform: 'translateX(-50%)' },
    borderTriangle: (s, u, c) => ({
      borderLeft: `${s}${u} solid transparent`,
      borderRight: `${s}${u} solid transparent`,
      borderTop: `${s}${u} solid ${c}`
    })
  },
  bottom: {
    position: { top: 'VALUE', left: '50%', transform: 'translateX(-50%)' },
    borderTriangle: (s, u, c) => ({
      borderLeft: `${s}${u} solid transparent`,
      borderRight: `${s}${u} solid transparent`,
      borderBottom: `${s}${u} solid ${c}`
    })
  },
  left: {
    position: { right: 'VALUE', top: '50%', transform: 'translateY(-50%)' },
    borderTriangle: (s, u, c) => ({
      borderTop: `${s}${u} solid transparent`,
      borderBottom: `${s}${u} solid transparent`,
      borderLeft: `${s}${u} solid ${c}`
    })
  },
  right: {
    position: { left: 'VALUE', top: '50%', transform: 'translateY(-50%)' },
    borderTriangle: (s, u, c) => ({
      borderTop: `${s}${u} solid transparent`,
      borderBottom: `${s}${u} solid transparent`,
      borderRight: `${s}${u} solid ${c}`
    })
  }
}

const buildArrowStyle = (
  variant: PopoverVariant,
  size: number,
  color: string
) => {
  const unit = variant.arrowSize.unit
  const config = ARROW_CONFIGS[variant.placement]
  const pos = { ...config.position }
  const key = Object.keys(pos).find(k => pos[k] === 'VALUE')!
  pos[key] = `-${size}${unit}`

  return {
    position: 'absolute' as const,
    width: '0',
    height: '0',
    ...pos,
    ...config.borderTriangle(size, unit, color)
  }
}

const getArrowBorderStyle = (variant: PopoverVariant) => {
  const borderColor = resolveColor(variant.border.color, variant.dark.borderColor)
  return buildArrowStyle(variant, variant.arrowSize.value, borderColor)
}

const getArrowFillStyle = (variant: PopoverVariant) => {
  const bgColor = resolveColor(variant.background, variant.dark.background)
  const bw = hasBorder(variant) ? variant.border.width : 0
  return buildArrowStyle(variant, variant.arrowSize.value - bw, bgColor)
}
</script>

<template>
  <div class="popover-preview p-4">
    <div class="row g-4">
      <div v-for="(variant, index) in popoverStore.variants" :key="index" class="col-12 col-xl-6">
        <div
          class="card"
          :style="getCompensation()"
          :class="{ 'border-primary': popoverStore.selectedVariantIndex === index }"
          style="cursor: pointer"
          @click="popoverStore.selectVariant(index)"
        >
          <div class="card-body d-flex align-items-center justify-content-center" style="min-height: 160px">
            <div class="position-relative d-inline-block">
              <div class="preview-popover" :style="getPopoverStyles(variant)">
                <div class="preview-popover-inset-overlay" :style="getInsetOverlayStyles(variant)"></div>
                <div class="preview-popover-header" :style="getHeaderStyles(variant)">
                  <span>Popover Header</span>
                </div>
                <div class="preview-popover-body" :style="getBodyStyles(variant)">
                  This is a popover body with some example content.
                </div>
                <span v-if="hasBorder(variant)" :style="getArrowBorderStyle(variant)" />
                <span :style="getArrowFillStyle(variant)" />
              </div>
            </div>
          </div>
          <div class="card-footer text-center" :style="[getCompensation(), getFooterCompensation()]">
            <small :style="{ color: labelColor }">{{ variant.name }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
