<script setup lang="ts">
import { TypographyFields } from '@/components/shared'
import VariantHeader from './VariantHeader.vue'
import SimpleShadowField from './fields/SimpleShadowField.vue'
import type { DarkListGroup, ListGroupVariant } from '@/types/listgroup'
import { useDualModePatch } from '@/composables/useDualModePatch'

const { t } = useI18n()
const listGroupStore = useListGroupStore()
const { isDark } = useComponentTheme()
const typographyStore = useTypographyStore()

const { patch, patchDark } = useDualModePatch<ListGroupVariant, DarkListGroup>({
  selectedVariant: computed(() => listGroupStore.selectedVariant),
  selectedVariantIndex: computed(() => listGroupStore.selectedVariantIndex),
  updateVariant: listGroupStore.updateVariant
})

const variant = computed(() => listGroupStore.selectedVariant)
</script>

<template>
  <VariantHeader
    :variant-name="variant?.name"
    :can-delete="listGroupStore.variants.length > 1"
    @update:name="patch({ name: $event })"
    @delete="listGroupStore.deleteVariant(listGroupStore.selectedVariantIndex)"
    @add="listGroupStore.addVariant"
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
        <PaddingField
          :label="t('common.padding')"
          :model-value="variant.padding"
          @update:model-value="patch({ padding: $event })"
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

      <SettingsSection :title="t('common.layout')" :initial-open="false">
        <SwitchField
          :label="t('common.flush')"
          :model-value="variant.flush === 'flush'"
          @update:model-value="patch({ flush: $event ? 'flush' : 'none' })"
        />
        <SwitchField
          :label="t('common.numbered')"
          :model-value="variant.numbered === 'numbered'"
          @update:model-value="patch({ numbered: $event ? 'numbered' : 'none' })"
        />

      </SettingsSection>

      <SettingsSection :title="t('common.active')" :initial-open="false">
        <ColorField
          :label="t('common.activeBackground')"
          :model-value="variant.activeBackground"
          @update:model-value="patch({ activeBackground: $event })"
        />
        <ColorField
          :label="t('common.activeColor')"
          :model-value="variant.activeColor"
          @update:model-value="patch({ activeColor: $event })"
        />
        <ColorField
          :label="t('common.activeBorderColor')"
          :model-value="variant.activeBorderColor"
          @update:model-value="patch({ activeBorderColor: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.hover')" :initial-open="false">
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

      <SettingsSection :title="t('common.disabled')" :initial-open="false">
        <ColorField
          :label="t('common.disabledColor')"
          :model-value="variant.disabledColor"
          @update:model-value="patch({ disabledColor: $event })"
        />
        <ColorField
          :label="t('common.disabledBackground')"
          :model-value="variant.disabledBackground"
          @update:model-value="patch({ disabledBackground: $event })"
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

      <SettingsSection :title="t('common.active')" :initial-open="false">
        <ColorField
          :label="t('common.activeBackground')"
          :model-value="variant.dark.activeBackground"
          @update:model-value="patchDark({ activeBackground: $event })"
        />
        <ColorField
          :label="t('common.activeColor')"
          :model-value="variant.dark.activeColor"
          @update:model-value="patchDark({ activeColor: $event })"
        />
        <ColorField
          :label="t('common.activeBorderColor')"
          :model-value="variant.dark.activeBorderColor"
          @update:model-value="patchDark({ activeBorderColor: $event })"
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

      <SettingsSection :title="t('common.disabled')" :initial-open="false">
        <ColorField
          :label="t('common.disabledColor')"
          :model-value="variant.dark.disabledColor"
          @update:model-value="patchDark({ disabledColor: $event })"
        />
        <ColorField
          :label="t('common.disabledBackground')"
          :model-value="variant.dark.disabledBackground"
          @update:model-value="patchDark({ disabledBackground: $event })"
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
