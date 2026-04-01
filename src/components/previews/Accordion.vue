<script setup lang="ts">
import { usePreviewGrid } from '@/composables/usePreviewGrid'
import { useThemeCompensation } from '@/composables/useThemeCompensation'
import type { AccordionVariant } from '@/types/accordion'

const accordionStore = useAccordionStore()
const { typographyStore, buildBorderRadius, buildPadding, buildSingleShadow, resolveColor, isDark } = usePreviewGrid()

const componentTheme = useComponentTheme()
const { theme } = useTheme()
const { getCompensation, getFooterCompensation } = useThemeCompensation(componentTheme.theme, theme)

const openItems = ref<Set<number>>(new Set())
const hoveredItem = ref(-1)

const sampleItems = [
  {
    title: 'Accordion Item #1',
    body: "This is the first item's accordion body. It is shown by default until the collapse plugin adds the appropriate classes."
  },
  {
    title: 'Accordion Item #2',
    body: "This is the second item's accordion body. It is hidden by default until the collapse plugin adds the appropriate classes."
  },
  {
    title: 'Accordion Item #3',
    body: "This is the third item's accordion body. It is hidden by default until the collapse plugin adds the appropriate classes."
  }
]

const toggleItem = (idx: number) => {
  if (openItems.value.has(idx)) {
    openItems.value.delete(idx)
  } else {
    openItems.value.add(idx)
  }
}

const getWrapperStyles = (variant: AccordionVariant) => {
  const borderColor = resolveColor(variant.border.color, variant.dark.borderColor)
  return {
    overflow: 'hidden',
    borderRadius: buildBorderRadius(variant.borderRadius),
    borderStyle: variant.border.style,
    borderWidth: `${variant.border.width}${variant.border.unit}`,
    borderColor,
    boxShadow: getShadow(variant)
  }
}

const getShadow = (variant: AccordionVariant): string => {
  if (!variant.shadow?.enabled) return 'none'
  const color = resolveColor(variant.shadow.color, variant.dark.shadowColor)
  return buildSingleShadow(variant.shadow, color)
}

const getButtonStyles = (variant: AccordionVariant, itemIdx: number) => {
  const isOpen = openItems.value.has(itemIdx)
  const isHovered = hoveredItem.value === itemIdx
  const fontFamily = variant.fontFamily ?? typographyStore.effectiveFontFamily
  const base: Record<string, string | number> = {
    width: '100%',
    padding: buildPadding(variant.buttonPadding),
    fontFamily,
    fontSize: `${variant.buttonFontSize.value}${variant.buttonFontSize.unit}`,
    fontWeight: variant.buttonFontWeight,
    letterSpacing: `${variant.letterSpacing.value}${variant.letterSpacing.unit}`,
    border: 'none',
    outline: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'background-color 0.15s, color 0.15s',
    userSelect: 'none'
  }

  if (isOpen) {
    base.backgroundColor = resolveColor(variant.activeButtonBackground, variant.dark.activeButtonBackground)
    base.color = resolveColor(variant.activeButtonColor, variant.dark.activeButtonColor)
  } else if (isHovered) {
    base.backgroundColor = resolveColor(variant.buttonHoverBackground, variant.dark.buttonHoverBackground)
    base.color = resolveColor(variant.buttonHoverColor, variant.dark.buttonHoverColor)
  } else {
    base.backgroundColor = resolveColor(variant.buttonBackground, variant.dark.buttonBackground)
    base.color = resolveColor(variant.buttonColor, variant.dark.buttonColor)
  }

  if (itemIdx > 0) {
    base.borderTop = `${variant.border.width}${variant.border.unit} ${variant.border.style} ${resolveColor(variant.border.color, variant.dark.borderColor)}`
  }

  return base
}

const getBodyStyles = (variant: AccordionVariant) => {
  const fontFamily = variant.fontFamily ?? typographyStore.effectiveFontFamily
  return {
    padding: buildPadding(variant.bodyPadding),
    fontFamily,
    fontSize: `${variant.fontSize.value}${variant.fontSize.unit}`,
    fontStyle: variant.fontStyle,
    fontWeight: variant.fontWeight,
    letterSpacing: `${variant.letterSpacing.value}${variant.letterSpacing.unit}`,
    backgroundColor: resolveColor(variant.background, variant.dark.background),
    color: resolveColor(variant.color, variant.dark.color)
  }
}

const getArrowStyle = (variant: AccordionVariant, itemIdx: number) => {
  const isOpen = openItems.value.has(itemIdx)
  return {
    transition: 'transform 0.2s ease-in-out',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    width: '16px',
    height: '16px',
    flexShrink: 0
  }
}

const getChevronColor = (variant: AccordionVariant, itemIdx: number) => {
  const isOpen = openItems.value.has(itemIdx)
  return isOpen
    ? resolveColor(variant.activeButtonColor, variant.dark.activeButtonColor)
    : resolveColor(variant.buttonColor, variant.dark.buttonColor)
}

const labelColor = computed(() =>
  isDark.value ? typographyStore.globalConfig.dark.color : typographyStore.globalConfig.color
)
</script>

<template>
  <div class="accordion-preview p-4">
    <div class="row g-4">
      <div v-for="(variant, index) in accordionStore.variants" :key="index" class="col-12">
        <div
          class="card"
          :style="getCompensation()"
          :class="{ 'border-primary': accordionStore.selectedVariantIndex === index }"
          style="cursor: pointer"
          @click="accordionStore.selectVariant(index)"
        >
          <div class="card-body d-flex justify-content-center">
            <div :style="getWrapperStyles(variant)" style="width: 100%; max-width: 600px">
              <div v-for="(item, itemIdx) in sampleItems" :key="itemIdx">
                <div
                  :style="getButtonStyles(variant, itemIdx)"
                  @click.stop="toggleItem(itemIdx)"
                  @mouseenter="hoveredItem = itemIdx"
                  @mouseleave="hoveredItem = -1"
                >
                  <span>{{ item.title }}</span>
                  <svg
                    :style="getArrowStyle(variant, itemIdx)"
                    viewBox="0 0 16 16"
                    fill="none"
                    :stroke="getChevronColor(variant, itemIdx)"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m2 5 6 6 6-6" />
                  </svg>
                </div>
                <div v-if="openItems.has(itemIdx)" :style="getBodyStyles(variant)">
                  {{ item.body }}
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
