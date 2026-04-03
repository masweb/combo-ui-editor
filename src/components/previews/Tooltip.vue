<script setup lang="ts">
import { usePreviewGrid } from '@/composables/usePreviewGrid'
import { useThemeCompensation } from '@/composables/useThemeCompensation'
import type { TooltipPlacement, TooltipVariant } from '@/types/tooltip'

const tooltipStore = useTooltipStore()
const { typographyStore, buildBorderRadius, buildPadding, buildShadow, buildBorderCSS, resolveColor, isDark } =
  usePreviewGrid()

const componentTheme = useComponentTheme()
const { theme } = useTheme()
const { getCompensation, getFooterCompensation } = useThemeCompensation(componentTheme.theme, theme)

const labelColor = computed(() =>
  isDark.value ? typographyStore.globalConfig.dark.color : typographyStore.globalConfig.color
)

const getTooltipStyles = (variant: TooltipVariant) => {
  const fontFamily = variant.fontFamily ?? typographyStore.effectiveFontFamily

  return {
    backgroundColor: resolveColor(variant.background, variant.dark.background),
    color: resolveColor(variant.color, variant.dark.color),
    ...buildBorderCSS(variant.border, variant.dark.borderColor),
    borderRadius: buildBorderRadius(variant.borderRadius),
    padding: buildPadding(variant.padding),
    fontFamily,
    fontSize: `${variant.fontSize.value}${variant.fontSize.unit}`,
    fontStyle: variant.fontStyle,
    fontWeight: variant.fontWeight,
    letterSpacing: variant.letterSpacing ? `${variant.letterSpacing.value}${variant.letterSpacing.unit}` : undefined,
    boxShadow: buildShadow(variant),
    maxWidth: `${variant.maxWidth.value}${variant.maxWidth.unit}`,
    position: 'relative',
    display: 'inline-block',
    textAlign: 'center',
    whiteSpace: 'nowrap'
  }
}

const hasBorder = (variant: TooltipVariant) =>
  variant.border.style !== 'none'

interface ArrowConfig {
  position: Record<string, string>
  borderTriangle: (size: number, unit: string, color: string) => Record<string, string>
}

const ARROW_CONFIGS: Record<TooltipPlacement, ArrowConfig> = {
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
  variant: TooltipVariant,
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

const getArrowBorderStyle = (variant: TooltipVariant) => {
  const borderColor = resolveColor(variant.border.color, variant.dark.borderColor)
  return buildArrowStyle(variant, variant.arrowSize.value, borderColor)
}

const getArrowFillStyle = (variant: TooltipVariant) => {
  const bgColor = resolveColor(variant.background, variant.dark.background)
  const bw = hasBorder(variant) ? variant.border.width : 0
  return buildArrowStyle(variant, variant.arrowSize.value - bw, bgColor)
}
</script>

<template>
  <div class="tooltip-preview p-4">
    <div class="row g-4">
      <div v-for="(variant, index) in tooltipStore.variants" :key="index" class="col-md-6 col-lg-4 col-xl-3">
        <div
          class="card"
          :style="getCompensation()"
          :class="{ 'border-primary': tooltipStore.selectedVariantIndex === index }"
          style="cursor: pointer"
          @click="tooltipStore.selectVariant(index)"
        >
          <div class="card-body d-flex align-items-center justify-content-center" style="min-height: 100px">
            <div class="position-relative d-inline-block">
              <span class="preview-tooltip" :style="getTooltipStyles(variant)">
                Tooltip text
                <span v-if="hasBorder(variant)" :style="getArrowBorderStyle(variant)" />
                <span :style="getArrowFillStyle(variant)" />
              </span>
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
