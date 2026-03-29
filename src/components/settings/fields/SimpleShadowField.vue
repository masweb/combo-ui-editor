<script setup lang="ts">
import type { ShadowValue } from '@/types/generics'

const { t } = useI18n()

const props = defineProps<{
  modelValue: ShadowValue | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ShadowValue | undefined]
}>()

const defaultShadow = (): ShadowValue => ({
  enabled: true,
  offsetX: 0,
  offsetY: 4,
  blur: 12,
  spread: 0,
  color: 'rgba(0,0,0,0.15)'
})

const isEnabled = computed(() => props.modelValue?.enabled ?? false)

const shadow = computed(() => props.modelValue ?? defaultShadow())

const toggleShadow = (enabled: boolean) => {
  if (enabled) {
    emit('update:modelValue', { ...defaultShadow(), enabled: true })
  } else {
    emit('update:modelValue', undefined)
  }
}

const updateShadow = (updates: Partial<ShadowValue>) => {
  emit('update:modelValue', { ...shadow.value, ...updates })
}
</script>

<template>
  <div class="simple-shadow-field">
    <div class="d-flex align-items-center justify-content-between mb-2">
      <label class="field-label mb-0">{{ t('settings.shadowOffset') }}</label>
      <SwitchField :model-value="isEnabled" @update:model-value="toggleShadow" />
    </div>
    <div v-if="isEnabled" class="shadow-slot">
      <div class="shadow-slot-body">
        <div class="shadow-row">
          <label class="field-label-inline">X</label>
          <input
            v-wheel-number
            type="number"
            class="form-control form-control-sm"
            :value="shadow.offsetX"
            @input="updateShadow({ offsetX: Number(($event.target as HTMLInputElement).value) })"
          />
          <label class="field-label-inline">Y</label>
          <input
            v-wheel-number
            type="number"
            class="form-control form-control-sm"
            :value="shadow.offsetY"
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
            :value="shadow.blur"
            @input="updateShadow({ blur: Math.max(0, Number(($event.target as HTMLInputElement).value)) })"
          />
          <label class="field-label-inline">{{ t('settings.spread') }}</label>
          <input
            v-wheel-number
            type="number"
            class="form-control form-control-sm"
            :value="shadow.spread"
            @input="updateShadow({ spread: Number(($event.target as HTMLInputElement).value) })"
          />
        </div>
        <ColorField
          :label="t('settings.color')"
          :model-value="shadow.color"
          @update:model-value="updateShadow({ color: $event })"
        />
      </div>
    </div>
  </div>
</template>
