<script setup lang="ts">
import { TypographyFields } from '@/components/shared'
import VariantHeader from './VariantHeader.vue'
import SimpleShadowField from './fields/SimpleShadowField.vue'
import type { DarkTable, TableVariant } from '@/types/table'
import { useDualModePatch } from '@/composables/useDualModePatch'

const { t } = useI18n()
const tableStore = useTableStore()
const { isDark } = useComponentTheme()
const typographyStore = useTypographyStore()

const { patch, patchDark } = useDualModePatch<TableVariant, DarkTable>({
  selectedVariant: computed(() => tableStore.selectedVariant),
  selectedVariantIndex: computed(() => tableStore.selectedVariantIndex),
  updateVariant: tableStore.updateVariant
})

const variant = computed(() => tableStore.selectedVariant)
</script>

<template>
  <VariantHeader
    :variant-name="variant?.name"
    :can-delete="tableStore.variants.length > 1"
    @update:name="patch({ name: $event })"
    @delete="tableStore.deleteVariant(tableStore.selectedVariantIndex)"
    @add="tableStore.addVariant"
  />

  <div v-if="variant">
    <!-- LIGHT MODE SETTINGS -->
    <template v-if="!isDark">
      <SettingsSection :title="t('common.base')" :initial-open="false">
        <ColorField
          :label="t('common.background')"
          :model-value="variant.background"
          @update:model-value="patch({ background: $event })"
        />
        <ColorField
          :label="t('common.textColor')"
          :model-value="variant.color"
          @update:model-value="patch({ color: $event })"
        />
        <BorderField
          :label="t('common.border')"
          :model-value="variant.border"
          @update:model-value="patch({ border: $event })"
        />
        <BorderRadiusField
          :label="t('common.borderRadius')"
          :model-value="variant.borderRadius"
          @update:model-value="patch({ borderRadius: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.typography')" :initial-open="false">
        <TypographyFields
          :font-family="variant.fontFamily ?? null"
          :font-style="variant.fontStyle"
          :font-weight="variant.fontWeight"
          :font-size="variant.fontSize"
          :letter-spacing="variant.letterSpacing"
          :global-font-family="typographyStore.effectiveFontFamily"
          @update:font-family="patch({ fontFamily: $event })"
          @update:font-style="patch({ fontStyle: $event })"
          @update:font-weight="patch({ fontWeight: $event })"
          @update:font-size="patch({ fontSize: $event })"
          @update:letter-spacing="patch({ letterSpacing: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.header')" :initial-open="false">
        <ColorField
          :label="t('common.headerBackground')"
          :model-value="variant.headerBackground"
          @update:model-value="patch({ headerBackground: $event })"
        />
        <ColorField
          :label="t('common.headerColor')"
          :model-value="variant.headerColor"
          @update:model-value="patch({ headerColor: $event })"
        />
        <PaddingField
          :label="t('common.headerPadding')"
          :model-value="variant.headerPadding"
          @update:model-value="patch({ headerPadding: $event })"
        />
        <BorderField
          :label="t('common.headerBorder')"
          :model-value="variant.headerBorderBottom"
          @update:model-value="patch({ headerBorderBottom: $event })"
        />
        <TypographyFields
          :font-family="variant.headerFontFamily ?? null"
          :font-style="variant.headerFontStyle"
          :font-weight="variant.headerFontWeight"
          :font-size="variant.headerFontSize"
          :letter-spacing="variant.headerLetterSpacing"
          :global-font-family="typographyStore.effectiveFontFamily"
          @update:font-family="patch({ headerFontFamily: $event })"
          @update:font-style="patch({ headerFontStyle: $event })"
          @update:font-weight="patch({ headerFontWeight: $event })"
          @update:font-size="patch({ headerFontSize: $event })"
          @update:letter-spacing="patch({ headerLetterSpacing: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.footer')" :initial-open="false">
        <ColorField
          :label="t('common.footerBackground')"
          :model-value="variant.footerBackground"
          @update:model-value="patch({ footerBackground: $event })"
        />
        <ColorField
          :label="t('common.footerColor')"
          :model-value="variant.footerColor"
          @update:model-value="patch({ footerColor: $event })"
        />
        <BorderField
          :label="t('common.footerBorderTop')"
          :model-value="variant.footerBorderTop"
          @update:model-value="patch({ footerBorderTop: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.cellSpacing')" :initial-open="false">
         <PaddingField
          :label="t('common.cellPadding')"
          :model-value="variant.cellPadding"
          @update:model-value="patch({ cellPadding: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.borders')" :initial-open="false">
        <SwitchField
          :label="t('common.horizontalBorder')"
          :model-value="variant.horizontalBorderEnabled"
          @update:model-value="patch({ horizontalBorderEnabled: $event })"
        />
        <BorderField
          v-if="variant.horizontalBorderEnabled"
          :label="t('common.border')"
          :model-value="variant.horizontalBorder"
          @update:model-value="patch({ horizontalBorder: $event })"
        />
        <SwitchField
          :label="t('common.verticalBorder')"
          :model-value="variant.verticalBorderEnabled"
          @update:model-value="patch({ verticalBorderEnabled: $event })"
        />
        <BorderField
          v-if="variant.verticalBorderEnabled"
          :label="t('common.border')"
          :model-value="variant.verticalBorder"
          @update:model-value="patch({ verticalBorder: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.striped')" :initial-open="false">
        <SwitchField
          :label="t('common.stripedRows')"
          :model-value="variant.stripedRows"
          @update:model-value="patch({ stripedRows: $event })"
        />
        <ColorField
          :label="t('common.stripedRowBackground')"
          :model-value="variant.stripedRowBackground"
          @update:model-value="patch({ stripedRowBackground: $event })"
        />
        <SwitchField
          :label="t('common.stripedColumns')"
          :model-value="variant.stripedColumns"
          @update:model-value="patch({ stripedColumns: $event })"
        />
        <ColorField
          :label="t('common.stripedColumnBackground')"
          :model-value="variant.stripedColumnBackground"
          @update:model-value="patch({ stripedColumnBackground: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.hover')" :initial-open="false">
        <SwitchField
          :label="t('common.hoverable')"
          :model-value="variant.hoverable"
          @update:model-value="patch({ hoverable: $event })"
        />
        <ColorField
          :label="t('common.hoverBackground')"
          :model-value="variant.hoverBackground"
          @update:model-value="patch({ hoverBackground: $event })"
        />
        <ColorField
          :label="t('common.hoverColor')"
          :model-value="variant.hoverColor"
          @update:model-value="patch({ hoverColor: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.shadow')" :initial-open="false">
        <SimpleShadowField :model-value="variant.shadow" @update:model-value="patch({ shadow: $event })" />
      </SettingsSection>
    </template>

    <!-- DARK MODE SETTINGS -->
    <template v-else>
      <SettingsSection :title="t('common.base')" :initial-open="false">
        <ColorField
          :label="t('common.background')"
          :model-value="variant.dark.background"
          @update:model-value="patchDark({ background: $event })"
        />
        <ColorField
          :label="t('common.textColor')"
          :model-value="variant.dark.color"
          @update:model-value="patchDark({ color: $event })"
        />
        <ColorField
          :label="t('common.borderColor')"
          :model-value="variant.dark.borderColor"
          @update:model-value="patchDark({ borderColor: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.header')" :initial-open="false">
        <ColorField
          :label="t('common.headerBackground')"
          :model-value="variant.dark.headerBackground"
          @update:model-value="patchDark({ headerBackground: $event })"
        />
        <ColorField
          :label="t('common.headerColor')"
          :model-value="variant.dark.headerColor"
          @update:model-value="patchDark({ headerColor: $event })"
        />
        <ColorField
          :label="t('common.headerBorder')"
          :model-value="variant.dark.headerBorderBottomColor"
          @update:model-value="patchDark({ headerBorderBottomColor: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.footer')" :initial-open="false">
        <ColorField
          :label="t('common.footerBackground')"
          :model-value="variant.dark.footerBackground"
          @update:model-value="patchDark({ footerBackground: $event })"
        />
        <ColorField
          :label="t('common.footerColor')"
          :model-value="variant.dark.footerColor"
          @update:model-value="patchDark({ footerColor: $event })"
        />
        <ColorField
          :label="t('common.footerBorderTop')"
          :model-value="variant.dark.footerBorderTopColor"
          @update:model-value="patchDark({ footerBorderTopColor: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.borders')" :initial-open="false">
        <ColorField
          :label="t('common.horizontalBorder')"
          :model-value="variant.dark.horizontalBorderColor"
          @update:model-value="patchDark({ horizontalBorderColor: $event })"
        />
        <ColorField
          :label="t('common.verticalBorder')"
          :model-value="variant.dark.verticalBorderColor"
          @update:model-value="patchDark({ verticalBorderColor: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.striped')" :initial-open="false">
        <ColorField
          :label="t('common.stripedRowBackground')"
          :model-value="variant.dark.stripedRowBackground"
          @update:model-value="patchDark({ stripedRowBackground: $event })"
        />
        <ColorField
          :label="t('common.stripedColumnBackground')"
          :model-value="variant.dark.stripedColumnBackground"
          @update:model-value="patchDark({ stripedColumnBackground: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.hover')" :initial-open="false">
        <ColorField
          :label="t('common.hoverBackground')"
          :model-value="variant.dark.hoverBackground"
          @update:model-value="patchDark({ hoverBackground: $event })"
        />
        <ColorField
          :label="t('common.hoverColor')"
          :model-value="variant.dark.hoverColor"
          @update:model-value="patchDark({ hoverColor: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.shadow')" :initial-open="false">
        <ColorField
          :label="t('common.color')"
          :model-value="variant.dark.shadowColor"
          @update:model-value="patchDark({ shadowColor: $event })"
        />
      </SettingsSection>
    </template>
  </div>
</template>
