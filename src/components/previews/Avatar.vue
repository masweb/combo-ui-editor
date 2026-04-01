<script setup lang="ts">
import { usePreviewGrid } from '@/composables/usePreviewGrid'
import { useThemeCompensation } from '@/composables/useThemeCompensation'

const avatarStore = useAvatarStore()
const { typographyStore, buildBorderRadius, buildShadow, buildBorderCSS, resolveColor, isDark } = usePreviewGrid()

const componentTheme = useComponentTheme()
const { theme } = useTheme()
const { getCompensation, getFooterCompensation } = useThemeCompensation(componentTheme.theme, theme)

const labelColor = computed(() =>
  isDark.value ? typographyStore.globalConfig.dark.color : typographyStore.globalConfig.color
)

const getAvatarStyles = (variant: AvatarVariant) => {
  const fontFamily = variant.fontFamily ?? typographyStore.effectiveFontFamily
  const size = `${variant.size?.value ?? 64}${variant.size?.unit ?? 'px'}`

  return {
    backgroundColor: resolveColor(variant.background, variant.dark.background),
    color: resolveColor(variant.color, variant.dark.color),
    ...buildBorderCSS(variant.border, variant.dark.borderColor),
    borderRadius: buildBorderRadius(variant.borderRadius),
    width: size,
    height: size,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily,
    fontSize: `${variant.fontSize.value}${variant.fontSize.unit}`,
    fontStyle: variant.fontStyle,
    fontWeight: variant.fontWeight,
    letterSpacing: `${variant.letterSpacing.value}${variant.letterSpacing.unit}`,
    boxShadow: buildShadow(variant),
    overflow: 'hidden'
  }
}

const getImageStyles = (variant: AvatarVariant) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const
})

const getOnlineStyles = (variant: AvatarVariant) => {
  const online = variant.online ?? {
    position: 'bottom-right' as const,
    color: '#28a745',
    size: 14,
    offsetX: 0,
    offsetY: 0
  }
  const positionMap: Record<string, string> = {
    'top-right': 'top',
    'top-left': 'top',
    'bottom-right': 'bottom',
    'bottom-left': 'bottom'
  }
  const pos = online.position ?? 'bottom-right'
  const vPos = positionMap[pos] ?? 'bottom'
  const isRight = pos.includes('right')

  return {
    position: 'absolute' as const,
    [vPos]: `${online.offsetY}px`,
    [isRight ? 'right' : 'left']: `${online.offsetX}px`,
    width: `${online.size}px`,
    height: `${online.size}px`,
    borderRadius: '50%',
    backgroundColor: resolveColor(online.color, variant.dark?.onlineColor),
    border: '2px solid #fff'
  }
}
</script>

<template>
  <div class="avatar-preview p-4">
    <div class="row g-4">
      <div v-for="(variant, index) in avatarStore.variants" :key="index" class="col-md-6 col-lg-4 col-xl-3">
        <div
          class="card"
          :style="getCompensation()"
          :class="{ 'border-primary': avatarStore.selectedVariantIndex === index }"
          style="cursor: pointer"
          @click="avatarStore.selectVariant(index)"
        >
          <div class="card-body d-flex align-items-center justify-content-center">
            <div style="position: relative; display: inline-block">
              <div class="preview-avatar" :style="getAvatarStyles(variant)">
                <img v-if="variant.showImage" src="https://i.pravatar.cc/300" alt="" :style="getImageStyles(variant)" />
                <template v-else>AB</template>
              </div>
              <div v-if="variant.online?.show ?? true" class="online-indicator" :style="getOnlineStyles(variant)"></div>
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
