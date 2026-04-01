<script setup lang="ts">
import { TypographyFields } from '@/components/shared'
import VariantHeader from './VariantHeader.vue'
import type { DarkAccordion, AccordionVariant } from '@/types/accordion'
import type { ShadowValue } from '@/types/generics'
import { useDualModePatch } from '@/composables/useDualModePatch'

const { t } = useI18n()
const accordionStore = useAccordionStore()
const { isDark } = useComponentTheme()
const typographyStore = useTypographyStore()

const { patch, patchDark } = useDualModePatch<AccordionVariant, DarkAccordion>({
  selectedVariant: computed(() => accordionStore.selectedVariant),
  selectedVariantIndex: computed(() => accordionStore.selectedVariantIndex),
  updateVariant: accordionStore.updateVariant
})

const variant = computed(() => accordionStore.selectedVariant)

const defaultShadow = (): ShadowValue => ({
  enabled: true,
  offsetX: 0,
  offsetY: 4,
  blur: 12,
  spread: 0,
  color: 'rgba(0,0,0,0.15)'
})

const hasShadow = computed(() => variant.value?.shadow?.enabled ?? false)

const shadowValue = computed(() => variant.value?.shadow ?? defaultShadow())

const toggleShadow = (enabled: boolean) => {
  if (enabled) {
    patch({ shadow: { ...defaultShadow(), enabled: true } })
  } else {
    patch({ shadow: undefined })
  }
}

const updateShadow = (patchData: Partial<ShadowValue>) => {
  if (!variant.value?.shadow) return
  patch({ shadow: { ...variant.value.shadow, ...patchData } })
}
</script>

<template>
  <VariantHeader
    :variant-name="variant?.name"
    :can-delete="accordionStore.variants.length > 0"
    @update:name="patch({ name: $event })"
    @delete="accordionStore.deleteVariant(accordionStore.selectedVariantIndex)"
    @add="accordionStore.addVariant"
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
          :label="t('common.body') + ' padding'"
          :model-value="variant.bodyPadding"
          @update:model-value="patch({ bodyPadding: $event })"
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
          :model-value="variant.buttonBackground"
          @update:model-value="patch({ buttonBackground: $event })"
        />
        <ColorField
          :label="t('common.headerColor')"
          :model-value="variant.buttonColor"
          @update:model-value="patch({ buttonColor: $event })"
        />
        <PaddingField
          :label="t('common.headerPadding')"
          :model-value="variant.buttonPadding"
          @update:model-value="patch({ buttonPadding: $event })"
        />
        <div class="mb-3">
          <label class="form-label">{{ t('common.fontSize') }}</label>
          <div class="input-group input-group-sm">
            <input
              type="number"
              class="form-control"
              :value="variant.buttonFontSize.value"
              min="8"
              max="48"
              step="1"
              v-wheel-number="1"
              @input="
                patch({
                  buttonFontSize: {
                    ...variant.buttonFontSize,
                    value: Number(($event.target as HTMLInputElement).value)
                  }
                })
              "
            />
            <span class="input-group-text">px</span>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">{{ t('common.fontWeight') }}</label>
          <select
            class="form-select form-select-sm"
            :value="variant.buttonFontWeight"
            @change="patch({ buttonFontWeight: ($event.target as HTMLSelectElement).value })"
          >
            <option value="300">Light (300)</option>
            <option value="400">Regular (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semibold (600)</option>
            <option value="700">Bold (700)</option>
          </select>
        </div>
      </SettingsSection>

      <SettingsSection :title="t('common.active')" :initial-open="false">
        <ColorField
          :label="t('common.activeBackground')"
          :model-value="variant.activeButtonBackground"
          @update:model-value="patch({ activeButtonBackground: $event })"
        />
        <ColorField
          :label="t('common.activeColor')"
          :model-value="variant.activeButtonColor"
          @update:model-value="patch({ activeButtonColor: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.hover')" :initial-open="false">
        <ColorField
          :label="t('common.hoverBackground')"
          :model-value="variant.buttonHoverBackground"
          @update:model-value="patch({ buttonHoverBackground: $event })"
        />
        <ColorField
          :label="t('common.hoverColor')"
          :model-value="variant.buttonHoverColor"
          @update:model-value="patch({ buttonHoverColor: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.shadow')" :initial-open="false">
        <div class="mb-2">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <label class="field-label mb-0">{{ t('common.shadow') }}</label>
            <SwitchField :model-value="hasShadow" @update:model-value="toggleShadow" />
          </div>
          <div v-if="hasShadow">
            <div class="shadow-slot">
              <div class="shadow-slot-body">
                <div class="shadow-row">
                  <label class="field-label-inline">X</label>
                  <input
                    v-wheel-number
                    type="number"
                    class="form-control form-control-sm"
                    :value="shadowValue.offsetX"
                    @input="updateShadow({ offsetX: Number(($event.target as HTMLInputElement).value) })"
                  />
                  <label class="field-label-inline">Y</label>
                  <input
                    v-wheel-number
                    type="number"
                    class="form-control form-control-sm"
                    :value="shadowValue.offsetY"
                    @input="updateShadow({ offsetY: Number(($event.target as HTMLInputElement).value) })"
                  />
                </div>
                <div class="shadow-row">
                  <label class="field-label-inline">{{ t('settings.blur') }}</label>
                  <input
                    v-wheel-number
                    type="number"
                    class="form-control form-control-sm"
                    min="0"
                    :value="shadowValue.blur"
                    @input="updateShadow({ blur: Math.max(0, Number(($event.target as HTMLInputElement).value)) })"
                  />
                  <label class="field-label-inline">{{ t('settings.spread') }}</label>
                  <input
                    v-wheel-number
                    type="number"
                    class="form-control form-control-sm"
                    :value="shadowValue.spread"
                    @input="updateShadow({ spread: Number(($event.target as HTMLInputElement).value) })"
                  />
                </div>
                <ColorField
                  :label="t('settings.color')"
                  :model-value="shadowValue.color"
                  @update:model-value="updateShadow({ color: $event })"
                />
              </div>
            </div>
          </div>
        </div>
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

      <SettingsSection :title="t('common.header')" :initial-open="false">
        <ColorField
          :label="t('common.headerBackground')"
          :model-value="variant.dark.buttonBackground"
          @update:model-value="patchDark({ buttonBackground: $event })"
        />
        <ColorField
          :label="t('common.headerColor')"
          :model-value="variant.dark.buttonColor"
          @update:model-value="patchDark({ buttonColor: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.active')" :initial-open="false">
        <ColorField
          :label="t('common.activeBackground')"
          :model-value="variant.dark.activeButtonBackground"
          @update:model-value="patchDark({ activeButtonBackground: $event })"
        />
        <ColorField
          :label="t('common.activeColor')"
          :model-value="variant.dark.activeButtonColor"
          @update:model-value="patchDark({ activeButtonColor: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.hover')" :initial-open="false">
        <ColorField
          :label="t('common.hoverBackground')"
          :model-value="variant.dark.buttonHoverBackground"
          @update:model-value="patchDark({ buttonHoverBackground: $event })"
        />
        <ColorField
          :label="t('common.hoverColor')"
          :model-value="variant.dark.buttonHoverColor"
          @update:model-value="patchDark({ buttonHoverColor: $event })"
        />
      </SettingsSection>

      <SettingsSection :title="t('common.shadow')" :initial-open="false">
        <ColorField
          :label="t('settings.shadowColor')"
          :model-value="variant.dark.shadowColor"
          @update:model-value="patchDark({ shadowColor: $event })"
        />
      </SettingsSection>
    </template>
  </div>
</template>
