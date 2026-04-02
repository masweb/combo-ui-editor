<script setup lang="ts">
import { computed } from 'vue'
import { IconPlus, IconTrash } from '@tabler/icons-vue'

interface Props {
  variantName: string | undefined
  variantNames: string[]
  variantIndex: number
  canDelete: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:name': [name: string]
  delete: []
  add: []
}>()

const { t } = useI18n()

const isDuplicate = computed(() => {
  if (!props.variantName) return false
  const duplicateIndex = props.variantNames.indexOf(props.variantName)
  return duplicateIndex !== -1 && duplicateIndex !== props.variantIndex
})

function updateName(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:name', target.value)
}
</script>

<template>
  <div>
    <div class="d-flex align-items-center">
      <input
        type="text"
        class="form-control form-control-lg border-start-0 border-0 border-bottom"
        :class="{ 'is-invalid': isDuplicate }"
        :value="variantName"
        @input="updateName"
      />
      <div
        v-if="canDelete"
        class="px-3 border-start border-bottom cursor-pointer"
        :class="{ 'border-danger': isDuplicate }"
        style="height: 48px"
        @click="emit('delete')"
      >
        <IconTrash :size="18" class="mt-3" />
      </div>
      <div
        class="px-3 border-start border-bottom cursor-pointer"
        :class="{ 'border-danger': isDuplicate }"
        style="height: 48px"
        @click="emit('add')"
      >
        <IconPlus :size="18" class="mt-3" />
      </div>
    </div>
    <div v-if="isDuplicate" class="invalid-feedback d-block">
      {{ t('common.duplicateVariantName') }}
    </div>
  </div>
</template>
