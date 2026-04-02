<script setup lang="ts">
import { BaseFields, TypographyFields } from '@/components/shared'
import VariantHeader from './VariantHeader.vue'
import DarkModeShadowsSettings from './DarkModeShadowsSettings.vue'
import { useDualModePatch } from '@/composables/useDualModePatch'
import { useUnitNumberUpdates } from '@/composables/useUnitNumberUpdates'
import type { DarkAvatar, AvatarOnline } from '@/types/avatar'

const { t } = useI18n()
const avatarStore = useAvatarStore()
const { isDark } = useComponentTheme()
const typographyStore = useTypographyStore()

const { patch, patchDark } = useDualModePatch<AvatarVariant, DarkAvatar>({
  selectedVariant: computed(() => avatarStore.selectedVariant),
  selectedVariantIndex: computed(() => avatarStore.selectedVariantIndex),
  updateVariant: avatarStore.updateVariant
})

const variant = computed(() => avatarStore.selectedVariant)

const sizeUpdates = useUnitNumberUpdates(patch, variant, 'size')

const defaultOnline = {
  show: true,
  position: 'bottom-right' as const,
  color: '#28a745',
  size: 14,
  offsetX: 0,
  offsetY: 0
}

const patchOnline = (updates: Partial<AvatarOnline>) => {
  if (!variant.value) return
  patch({ online: { ...defaultOnline, ...variant.value.online, ...updates } })
}

const onlinePositions = [
  { value: 'top-right', label: t('avatar.topRight') },
  { value: 'top-left', label: t('avatar.topLeft') },
  { value: 'bottom-right', label: t('avatar.bottomRight') },
  { value: 'bottom-left', label: t('avatar.bottomLeft') }
]
</script>

<template>
  <VariantHeader
    :variant-name="variant?.name"
    :variant-names="avatarStore.variants.map((v: any) => v.name)"
    :variant-index="avatarStore.selectedVariantIndex"
    :can-delete="avatarStore.variants.length > 0"
    @update:name="patch({ name: $event })"
    @delete="avatarStore.deleteVariant(avatarStore.selectedVariantIndex)"
    @add="avatarStore.addVariant"
  />

  <div v-if="variant">
    <!-- LIGHT MODE SETTINGS -->
    <template v-if="!isDark">
      <SettingsSection :title="t('common.base')" :initial-open="false">
        <NumberUnitField
          :label="t('common.size')"
          :model-value="variant.size?.value ?? 64"
          :unit="variant.size?.unit ?? 'px'"
          :units="['px', 'em', 'rem']"
          @update:model-value="sizeUpdates.updateValue"
          @update:unit="sizeUpdates.updateUnit"
        />
        <SwitchField
          :label="t('avatar.showImage')"
          :model-value="variant.showImage ?? false"
          @update:model-value="patch({ showImage: $event })"
        />
        <BaseFields
          :background="variant.background"
          :color="variant.color"
          :border="variant.border"
          :border-radius="variant.borderRadius"
          :padding="variant.padding"
          @update:background="patch({ background: $event })"
          @update:color="patch({ color: $event })"
          @update:border="patch({ border: $event })"
          @update:border-radius="patch({ borderRadius: $event })"
          @update:padding="patch({ padding: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('avatar.onlineIndicator')" :initial-open="false">
        <SwitchField
          :label="t('avatar.showOnline')"
          :model-value="variant.online?.show ?? true"
          @update:model-value="patchOnline({ show: $event })"
        />
        <template v-if="variant.online?.show ?? true">
          <div class="field-group">
            <label class="field-label">{{ t('avatar.position') }}</label>
            <select
              class="form-select form-select-sm"
              :value="variant.online?.position ?? 'bottom-right'"
              @change="
                patchOnline({ position: ($event.target as HTMLSelectElement).value as AvatarOnline['position'] })
              "
            >
              <option v-for="pos in onlinePositions" :key="pos.value" :value="pos.value">{{ pos.label }}</option>
            </select>
          </div>
          <ColorField
            :label="t('common.backgroundColor')"
            :model-value="variant.online?.color ?? '#28a745'"
            @update:model-value="patchOnline({ color: $event })"
          />
          <div class="field-group">
            <label class="field-label">{{ t('common.size') }}</label>
            <input
              v-wheel-number
              type="number"
              class="form-control form-control-sm"
              :value="variant.online?.size ?? 14"
              min="0"
              @input="patchOnline({ size: Number(($event.target as HTMLInputElement).value) })"
            />
          </div>
          <div class="border-field-row mb-2">
            <div class="field-group flex-fill">
              <label class="field-label">X</label>
              <input
                v-wheel-number
                type="number"
                class="form-control form-control-sm"
                :value="variant.online?.offsetX ?? 0"
                @input="patchOnline({ offsetX: Number(($event.target as HTMLInputElement).value) })"
              />
            </div>
            <div class="field-group flex-fill">
              <label class="field-label">Y</label>
              <input
                v-wheel-number
                type="number"
                class="form-control form-control-sm"
                :value="variant.online?.offsetY ?? 0"
                @input="patchOnline({ offsetY: Number(($event.target as HTMLInputElement).value) })"
              />
            </div>
          </div>
        </template>
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

      <SettingsSection :title="t('common.shadow')" :initial-open="false">
        <ShadowField :model-value="variant.shadows" @update:model-value="patch({ shadows: $event })" />
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

      <SettingsSection :title="t('avatar.onlineIndicator')" :initial-open="false">
        <ColorField
          :label="t('avatar.onlineColor')"
          :model-value="variant.dark?.onlineColor ?? '#28a745'"
          @update:model-value="patchDark({ onlineColor: $event })"
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
