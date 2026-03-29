<script setup lang="ts">
import { usePreviewGrid } from '@/composables/usePreviewGrid'
import { useThemeCompensation } from '@/composables/useThemeCompensation'
import type { TableVariant } from '@/types/table'

const tableStore = useTableStore()
const { typographyStore, buildBorderRadius, buildPadding, buildBorderCSS, resolveColor, isDark } =
  usePreviewGrid()

const componentTheme = useComponentTheme()
const { theme } = useTheme()
const { getCompensation, getFooterCompensation } = useThemeCompensation(componentTheme.theme, theme)

const getWrapperStyles = (variant: TableVariant) => {
  const s = variant.shadow
  const shadowColor = isDark.value ? variant.dark.shadowColor : s?.color
  return {
    backgroundColor: resolveColor(variant.background, variant.dark.background),
    ...buildBorderCSS(variant.border, variant.dark.borderColor),
    borderRadius: buildBorderRadius(variant.borderRadius),
    boxShadow: s?.enabled
      ? `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${shadowColor}`
      : 'none',
    overflow: 'hidden'
  }
}

const getHeaderCellStyles = (variant: TableVariant) => {
  const fontFamily = variant.headerFontFamily ?? typographyStore.effectiveFontFamily

  return {
    backgroundColor: resolveColor(variant.headerBackground, variant.dark.headerBackground),
    color: resolveColor(variant.headerColor, variant.dark.headerColor),
    fontFamily,
    fontSize: `${variant.headerFontSize.value}${variant.headerFontSize.unit}`,
    fontStyle: variant.headerFontStyle,
    fontWeight: variant.headerFontWeight,
    letterSpacing: `${variant.headerLetterSpacing.value}${variant.headerLetterSpacing.unit}`,
    padding: buildPadding(variant.headerPadding)
  }
}

const getBodyCellStyles = (variant: TableVariant) => {
  const fontFamily = variant.fontFamily ?? typographyStore.effectiveFontFamily

  return {
    color: resolveColor(variant.color, variant.dark.color),
    fontFamily,
    fontSize: `${variant.fontSize.value}${variant.fontSize.unit}`,
    fontStyle: variant.fontStyle,
    fontWeight: variant.fontWeight,
    letterSpacing: `${variant.letterSpacing.value}${variant.letterSpacing.unit}`,
    padding: buildPadding(variant.cellPadding)
  }
}

const getFooterCellStyles = (variant: TableVariant) => {
  const fontFamily = variant.fontFamily ?? typographyStore.effectiveFontFamily

  return {
    backgroundColor: resolveColor(variant.footerBackground, variant.dark.footerBackground),
    color: resolveColor(variant.footerColor, variant.dark.footerColor),
    fontFamily,
    fontSize: `${variant.fontSize.value}${variant.fontSize.unit}`,
    fontStyle: variant.fontStyle,
    fontWeight: variant.fontWeight,
    padding: buildPadding(variant.cellPadding)
  }
}

const getHeaderRowStyles = (variant: TableVariant) => {
  const borderColor = resolveColor(variant.headerBorderBottom.color, variant.dark.headerBorderBottomColor)

  return {
    borderBottomStyle: variant.headerBorderBottom.style,
    borderBottomWidth: `${variant.headerBorderBottom.width}${variant.headerBorderBottom.unit}`,
    borderBottomColor: borderColor
  }
}

const getTableStyles = (variant: TableVariant) => ({
  width: '100%',
  borderCollapse: (variant.horizontalBorderEnabled || variant.verticalBorderEnabled) ? 'separate' as const : 'collapse' as const,
  borderSpacing: (variant.horizontalBorderEnabled || variant.verticalBorderEnabled) ? '0' : undefined
})

const getHorizontalBorder = (variant: TableVariant) => {
  if (!variant.horizontalBorderEnabled) return {}
  const color = resolveColor(variant.horizontalBorder.color, variant.dark.horizontalBorderColor)
  return {
    borderBottomStyle: variant.horizontalBorder.style,
    borderBottomWidth: `${variant.horizontalBorder.width}${variant.horizontalBorder.unit}`,
    borderBottomColor: color
  }
}

const getVerticalBorder = (variant: TableVariant) => {
  if (!variant.verticalBorderEnabled) return {}
  const color = resolveColor(variant.verticalBorder.color, variant.dark.verticalBorderColor)
  return {
    borderRightStyle: variant.verticalBorder.style,
    borderRightWidth: `${variant.verticalBorder.width}${variant.verticalBorder.unit}`,
    borderRightColor: color
  }
}

const getFooterRowStyles = (variant: TableVariant) => {
  const borderColor = resolveColor(variant.footerBorderTop.color, variant.dark.footerBorderTopColor)
  return {
    borderTopStyle: variant.footerBorderTop.style,
    borderTopWidth: `${variant.footerBorderTop.width}${variant.footerBorderTop.unit}`,
    borderTopColor: borderColor
  }
}

const getStripedRowBg = (variant: TableVariant, rowIndex: number) => {
  if (!variant.stripedRows || rowIndex % 2 === 0) return undefined
  return resolveColor(variant.stripedRowBackground, variant.dark.stripedRowBackground)
}

const getStripedColBg = (variant: TableVariant, colIndex: number) => {
  if (!variant.stripedColumns || colIndex % 2 === 0) return undefined
  return resolveColor(variant.stripedColumnBackground, variant.dark.stripedColumnBackground)
}

const getHoverStyles = (variant: TableVariant, isHovered: boolean) => {
  if (!variant.hoverable || !isHovered) return {}
  return {
    backgroundColor: resolveColor(variant.hoverBackground, variant.dark.hoverBackground),
    color: resolveColor(variant.hoverColor, variant.dark.hoverColor)
  }
}

const hoveredRow = ref(-1)

const sampleHeaders = ['ID', 'Nombre', 'Estado', 'Acciones']
const sampleRows = [
  ['1', 'Elemento A', 'Activo', 'Editar'],
  ['2', 'Elemento B', 'Inactivo', 'Editar'],
  ['3', 'Elemento C', 'Activo', 'Editar'],
  ['4', 'Elemento D', 'Pendiente', 'Editar']
]

const labelColor = computed(() =>
  isDark.value ? typographyStore.globalConfig.dark.color : typographyStore.globalConfig.color
)
</script>

<template>
  <div class="table-preview p-4">
    <div class="row g-4">
      <div v-for="(variant, index) in tableStore.variants" :key="index" class="col-12">
        <div
          class="card"
          :style="getCompensation()"
          :class="{ 'border-primary': tableStore.selectedVariantIndex === index }"
          style="cursor: pointer"
          @click="tableStore.selectVariant(index)"
        >
          <div class="card-body">
            <div :style="getWrapperStyles(variant)">
              <table :style="getTableStyles(variant)">
                <thead>
                  <tr :style="getHeaderRowStyles(variant)">
                    <th
                      v-for="(header, colIdx) in sampleHeaders"
                      :key="colIdx"
                      :style="{ ...getHeaderCellStyles(variant), ...getHorizontalBorder(variant), ...(colIdx < sampleHeaders.length - 1 ? getVerticalBorder(variant) : {}) }"
                    >
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, rowIdx) in sampleRows"
                    :key="rowIdx"
                    :style="{ backgroundColor: getStripedRowBg(variant, rowIdx), ...getHoverStyles(variant, hoveredRow === rowIdx) }"
                    @mouseenter="hoveredRow = rowIdx"
                    @mouseleave="hoveredRow = -1"
                  >
                    <td
                      v-for="(cell, colIdx) in row"
                      :key="colIdx"
                      :style="{ ...getBodyCellStyles(variant), ...(rowIdx < sampleRows.length - 1 ? getHorizontalBorder(variant) : {}), ...(colIdx < row.length - 1 ? getVerticalBorder(variant) : {}), backgroundColor: getStripedColBg(variant, colIdx) }"
                    >
                      {{ cell }}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      v-for="(header, colIdx) in sampleHeaders"
                      :key="colIdx"
                      :style="{ ...getFooterCellStyles(variant), ...getFooterRowStyles(variant), ...(colIdx < sampleHeaders.length - 1 ? getVerticalBorder(variant) : {}) }"
                    >
                      {{ header }}
                    </td>
                  </tr>
                </tfoot>
              </table>
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
