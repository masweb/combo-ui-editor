<script setup lang="ts">
import { usePreviewGrid } from '@/composables/usePreviewGrid'
import { useThemeCompensation } from '@/composables/useThemeCompensation'
import type { PaginationVariant } from '@/types/pagination'

const paginationStore = usePaginationStore()
const { typographyStore, buildBorderRadius, buildPadding, buildBorderCSS, buildShadow, resolveColor, isDark } =
  usePreviewGrid()

const componentTheme = useComponentTheme()
const { theme } = useTheme()
const { getCompensation, getFooterCompensation } = useThemeCompensation(componentTheme.theme, theme)

const hoveredItem = ref(-1)

const samplePages = [
  { label: '«', active: false, disabled: true },
  { label: '1', active: true, disabled: false },
  { label: '2', active: false, disabled: false },
  { label: '3', active: false, disabled: false },
  { label: '4', active: false, disabled: false },
  { label: '5', active: false, disabled: false },
  { label: '»', active: false, disabled: false }
]

const getItemStyles = (
  variant: PaginationVariant,
  item: (typeof samplePages)[number],
  isHovered: boolean
) => {
  const fontFamily = variant.fontFamily ?? typographyStore.effectiveFontFamily
  const base = {
    fontFamily,
    fontSize: `${variant.fontSize.value}${variant.fontSize.unit}`,
    fontStyle: variant.fontStyle,
    fontWeight: variant.fontWeight,
    letterSpacing: `${variant.letterSpacing.value}${variant.letterSpacing.unit}`,
    padding: buildPadding(variant.padding),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s, color 0.15s',
    cursor: 'pointer',
    userSelect: 'none' as const,
    whiteSpace: 'nowrap' as const,
    boxShadow: buildShadow(variant)
  }

  if (item.disabled && !item.active) {
    return {
      ...base,
      color: resolveColor(variant.disabledColor, variant.dark.disabledColor),
      opacity: variant.disabledOpacity,
      cursor: 'not-allowed'
    }
  }

  if (item.active) {
    return {
      ...base,
      color: resolveColor(variant.activeColor, variant.dark.activeColor),
      backgroundColor: resolveColor(variant.activeBackground, variant.dark.activeBackground),
      borderColor: resolveColor(variant.activeBorderColor, variant.dark.activeBorderColor),
      zIndex: 3
    }
  }

  if (isHovered) {
    return {
      ...base,
      color: resolveColor(variant.hoverColor, variant.dark.hoverColor),
      backgroundColor: resolveColor(variant.hoverBackground, variant.dark.hoverBackground),
      zIndex: 2
    }
  }

  return {
    ...base,
    color: resolveColor(variant.color, variant.dark.color),
    backgroundColor: resolveColor(variant.background, variant.dark.background)
  }
}

const getItemBorder = (variant: PaginationVariant, index: number) => {
  const borderColor = resolveColor(variant.border.color, variant.dark.borderColor)
  const result: Record<string, string> = {
    borderStyle: variant.border.style,
    borderWidth: `${variant.border.width}${variant.border.unit}`,
    borderColor
  }
  if (index > 0) {
    result.marginLeft = `${variant.itemGap}px`
  }
  return result
}

const getWrapperStyles = (variant: PaginationVariant) => {
  return {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center'
  }
}

const labelColor = computed(() =>
  isDark.value ? typographyStore.globalConfig.dark.color : typographyStore.globalConfig.color
)
</script>

<template>
  <div class="pagination-preview p-4">
    <div class="row g-4">
      <div v-for="(variant, index) in paginationStore.variants" :key="index" class="col-12">
        <div
          class="card"
          :style="getCompensation()"
          :class="{ 'border-primary': paginationStore.selectedVariantIndex === index }"
          style="cursor: pointer"
          @click="paginationStore.selectVariant(index)"
        >
          <div class="card-body d-flex justify-content-center">
            <nav :style="getWrapperStyles(variant)">
              <div
                v-for="(item, itemIdx) in samplePages"
                :key="itemIdx"
                :style="{
                  ...getItemStyles(variant, item, hoveredItem === itemIdx),
                  ...getItemBorder(variant, itemIdx),
                  borderRadius: buildBorderRadius(variant.borderRadius)
                }"
                @mouseenter="hoveredItem = itemIdx"
                @mouseleave="hoveredItem = -1"
              >
                {{ item.label }}
              </div>
            </nav>
          </div>
          <div
            class="card-footer text-center"
            :style="[getCompensation(), getFooterCompensation()]"
          >
            <small :style="{ color: labelColor }">{{ variant.name }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
