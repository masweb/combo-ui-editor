<script setup lang="ts">
import { IconBroadcast, IconBroadcastOff } from '@tabler/icons-vue'
import { useThemeSync } from '@/composables/useThemeSync'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'

const { isConnected, isBroadcasting, error, toggleRealtime } = useThemeSync()
const { t } = useI18n()

const showErrorModal = ref(false)

const handleClick = async () => {
  await toggleRealtime()

  // Show error if connection failed
  if (error.value && !isBroadcasting.value) {
    showErrorModal.value = true
  }
}

const handleErrorClose = () => {
  showErrorModal.value = false
}

const buttonTitle = computed(() => {
  if (isBroadcasting.value) return t('sync.deactivate')
  return t('sync.activate')
})
</script>

<template>
  <button class="btn btn-sm btn-link" :title="buttonTitle" @click="handleClick">
    <IconBroadcast v-if="isBroadcasting" :size="22" :stroke-width="1.5" />
    <IconBroadcastOff v-else :size="22" :stroke-width="1.5" />
  </button>

  <!-- Error Modal -->
  <ConfirmModal
    :open="showErrorModal"
    :title="t('sync.error')"
    :message="error || t('sync.portInUse')"
    :confirm-text="t('common.ok') || 'OK'"
    @confirm="handleErrorClose"
    @cancel="handleErrorClose"
  />
</template>
