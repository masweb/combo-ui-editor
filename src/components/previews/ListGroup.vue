<script setup lang="ts">
import { usePreviewGrid } from '@/composables/usePreviewGrid'
import { useThemeCompensation } from '@/composables/useThemeCompensation'
import type { ListGroupVariant } from '@/types/listgroup'

const listGroupStore = useListGroupStore()
const { typographyStore, buildBorderRadius, buildPadding, buildBorderCSS, resolveColor, isDark } = usePreviewGrid()

const componentTheme = useComponentTheme()
const { theme } = useTheme()
const { getCompensation, getFooterCompensation } = useThemeCompensation(componentTheme.theme, theme)

const getWrapperStyles = (variant: ListGroupVariant) => {
  const s = variant.shadow
  const shadowColor = isDark.value ? variant.dark.shadowColor : s?.color
  const isFlush = variant.flush === 'flush'
  return {
    backgroundColor: resolveColor(variant.background, variant.dark.background),
    ...(isFlush
      ? { borderRadius: '0' }
      : {
          ...buildBorderCSS(variant.border, variant.dark.borderColor),
          borderRadius: buildBorderRadius(variant.borderRadius)
        }),
    boxShadow: s?.enabled ? `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${shadowColor}` : 'none',
    overflow: 'hidden'
  }
}

const getItemStyles = (variant: ListGroupVariant, item: (typeof sampleItems)[number], isHovered: boolean) => {
  const fontFamily = variant.fontFamily ?? typographyStore.effectiveFontFamily
  const base = {
    fontFamily,
    fontSize: `${variant.fontSize.value}${variant.fontSize.unit}`,
    fontStyle: variant.fontStyle,
    fontWeight: variant.fontWeight,
    letterSpacing: `${variant.letterSpacing.value}${variant.letterSpacing.unit}`,
    padding: buildPadding(variant.padding),
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.15s, color 0.15s'
  }

  if (item.disabled) {
    return {
      ...base,
      color: resolveColor(variant.disabledColor, variant.dark.disabledColor),
      backgroundColor: resolveColor(variant.disabledBackground, variant.dark.disabledBackground),
      opacity: variant.disabledOpacity,
      cursor: 'not-allowed'
    }
  }

  if (item.active) {
    return {
      ...base,
      color: resolveColor(variant.activeColor, variant.dark.activeColor),
      backgroundColor: resolveColor(variant.activeBackground, variant.dark.activeBackground)
    }
  }

  if (isHovered) {
    return {
      ...base,
      color: resolveColor(variant.hoverColor, variant.dark.hoverColor),
      backgroundColor: resolveColor(variant.hoverBackground, variant.dark.hoverBackground),
      cursor: 'pointer'
    }
  }

  return {
    ...base,
    color: resolveColor(variant.color, variant.dark.color)
  }
}

const getItemBorder = (variant: ListGroupVariant, index: number) => {
  if (index >= sampleItems.length - 1) return {}
  const borderColor = resolveColor(variant.border.color, variant.dark.borderColor)
  return {
    borderBottomStyle: variant.border.style,
    borderBottomWidth: `${variant.border.width}${variant.border.unit}`,
    borderBottomColor: borderColor
  }
}

const hoveredItem = ref(-1)

const sampleItems = [
  { text: 'Elemento 1', active: false, disabled: false },
  { text: 'Elemento 2', active: true, disabled: false },
  { text: 'Elemento 3', active: false, disabled: false },
  { text: 'Elemento 4', active: false, disabled: true },
  { text: 'Elemento 5', active: false, disabled: false }
]

const labelColor = computed(() =>
  isDark.value ? typographyStore.globalConfig.dark.color : typographyStore.globalConfig.color
)
</script>

<template>
  <div class="listgroup-preview p-4">
    <div class="row g-4">
      <div v-for="(variant, index) in listGroupStore.variants" :key="index" class="col-12">
        <div
          class="card"
          :style="getCompensation()"
          :class="{ 'border-primary': listGroupStore.selectedVariantIndex === index }"
          style="cursor: pointer"
          @click="listGroupStore.selectVariant(index)"
        >
          <div class="card-body">
            <div :style="getWrapperStyles(variant)">
              <div
                :style="{
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0'
                }"
              >
                <div
                  v-for="(item, itemIdx) in sampleItems"
                  :key="itemIdx"
                  :style="{
                    ...getItemStyles(variant, item, hoveredItem === itemIdx),
                    ...getItemBorder(variant, itemIdx)
                  }"
                  @mouseenter="hoveredItem = itemIdx"
                  @mouseleave="hoveredItem = -1"
                >
                  <span v-if="variant.numbered === 'numbered'" style="margin-right: 8px; font-weight: 600">
                    {{ itemIdx + 1 }}.
                  </span>
                  {{ item.text }}
                </div>
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
