<script setup lang="ts">
import { TypographyFields } from '@/components/shared'
import VariantHeader from './VariantHeader.vue'
import ShadowField from './fields/ShadowField.vue'
import DarkModeShadowsSettings from './DarkModeShadowsSettings.vue'
import type { DarkPagination, PaginationVariant } from '@/types/pagination'
import { useDualModePatch } from '@/composables/useDualModePatch'

const { t } = useI18n()
const paginationStore = usePaginationStore()
const { isDark } = useComponentTheme()
const typographyStore = useTypographyStore()

const { patch, patchDark } = useDualModePatch<PaginationVariant, DarkPagination>({
  selectedVariant: computed(() => paginationStore.selectedVariant),
  selectedVariantIndex: computed(() => paginationStore.selectedVariantIndex),
  updateVariant: paginationStore.updateVariant
})

const variant = computed(() => paginationStore.selectedVariant)

const onGapInput = (e: Event) => {
  const raw = parseFloat((e.target as HTMLInputElement).value)
  if (!isNaN(raw) && raw >= 0) {
    patch({ itemGap: Math.round(raw) })
  }
}
</script>

<template>
  <VariantHeader
    :variant-name="variant?.name"
    :can-delete="paginationStore.variants.length > 0"
    @update:name="patch({ name: $event })"
    @delete="paginationStore.deleteVariant(paginationStore.selectedVariantIndex)"
    @add="paginationStore.addVariant"
  />

  <div v-if="variant">
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
        <div class="mb-3">
          <label class="form-label">{{ t('common.spacing') }}</label>
          <div class="input-group input-group-sm">
            <input
              type="number"
              class="form-control"
              :value="variant.itemGap"
              min="0"
              max="20"
              step="1"
              v-wheel-number="1"
              @input="onGapInput"
            />
            <span class="input-group-text">px</span>
          </div>
        </div>
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
      </SettingsSection>

      <SettingsSection :title="t('common.shadow')" :initial-open="false">
        <ShadowField :model-value="variant.shadows" @update:model-value="patch({ shadows: $event })" />
      </SettingsSection>
    </template>

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
      </SettingsSection>

      <DarkModeShadowsSettings
        :shadow-color="variant.dark.shadowColor"
        :shadow-inset-color="variant.dark.shadowInsetColor"
        :shadow-inset-highlight-color="variant.dark.shadowInsetHighlightColor"
        @update:shadow-color="patchDark({ shadowColor: $event })"
        @update:shadow-inset-color="patchDark({ shadowInsetColor: $event })"
        @update:shadow-inset-highlight-color="patchDark({ shadowInsetHighlightColor: $event })"
      />
    </template>
  </div>
</template>
