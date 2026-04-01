<script setup lang="ts">
const navigationStore = useNavigationStore()
const typographyStore = useTypographyStore()
const { isDark } = useComponentTheme()
const { previewComponents } = useComponentRegistry()
const storeManager = useStoreManager()

const currentPreviewComponent = computed(() => {
  if (!navigationStore.currentComponent) return null
  const id = navigationStore.currentComponent.id
  return id ? previewComponents[id] : null
})

const previewBackground = computed(() =>
  isDark.value ? typographyStore.globalConfig.dark.backgroundColor : typographyStore.globalConfig.backgroundColor
)

const hasVariants = computed(() => {
  const id = navigationStore.currentComponent?.id
  if (!id) return true
  const store = storeManager.getStore(id)
  if (!store?.variants) return true
  return store.variants.value.length > 0
})
</script>

<template>
  <div class="preview-view p-4" :style="{ backgroundColor: previewBackground }">
    <PreviewBackgroundPicker />
    <div v-if="!hasVariants" class="empty-variants" :class="isDark ? 'text-light' : 'text-dark'">
      <p class="empty-variants-title">Sin variantes</p>
      <p class="empty-variants-text">
        Haga click en el botón + para añadir nuevas variantes, puede asignar el nombre que desee a las nuevas variantes,
        recuerde que el nombre servirá como clase css en el componente final de su aplicación.
      </p>
    </div>
    <component :is="currentPreviewComponent" v-else />
  </div>
</template>

<style scoped>
.empty-variants {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 40px - 2rem);
  text-align: center;
  opacity: 0.6;
}

.empty-variants-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.empty-variants-text {
  max-width: 480px;
  line-height: 1.6;
}
</style>
