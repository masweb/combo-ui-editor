<script setup lang="ts">
import { COMPONENT_LIST, COMPONENT_TYPOGRAPHY_META, COMPONENT_FORM_META } from '@/constants'
import { useColorPairEditor } from '@/composables/useColorPairEditor'
import { useThemeGenerator } from '@/composables/useThemeGenerator'
import ColorField from '@/components/settings/fields/ColorField.vue'
import FontFamilyField from '@/components/settings/fields/FontFamilyField.vue'
import NumberUnitField from '@/components/settings/fields/NumberUnitField.vue'

import {
  IconXboxBFilled,
  IconCreditCardFilled,
  IconAlertCircleFilled,
  IconUserFilled,
  IconRectangleFilled,
  IconLineDashed,
  IconCircleRectangleFilled,
  IconInnerShadowTopRight,
  IconTypography,
  IconForms,
  IconTableFilled,
  IconListFilled,
  IconCaretLeftRightFilled,
  IconTooltip,
  IconLayoutListFilled,
  IconChartFunnelFilled,
  IconPlus,
  IconTrash
} from '@tabler/icons-vue'
const icons: Record<string, Component> = {
  IconXboxBFilled,
  IconCreditCardFilled,
  IconAlertCircleFilled,
  IconUserFilled,
  IconRectangleFilled,
  IconLineDashed,
  IconCircleRectangleFilled,
  IconInnerShadowTopRight,
  IconTableFilled,
  IconListFilled,
  IconCaretLeftRightFilled,
  IconTooltip,
  IconLayoutListFilled,
  IconChartFunnelFilled
}
const { t } = useI18n()
const { isDark } = useTheme()
const nav = useNavigationStore()
const typographyStore = useTypographyStore()

const colorPairs = useColorPairEditor()
const themeGenerator = useThemeGenerator()

const themeName = ref('GeneratedTheme')

const genOpts = themeGenerator.options.value
const genBorderRadius = computed({
  get: () => genOpts.borderRadius,
  set: (v: number) => {
    genOpts.borderRadius = v
  }
})
const genFontFamily = computed({
  get: () => genOpts.typography.fontFamily,
  set: (v: string) => {
    genOpts.typography.fontFamily = v
  }
})
const genFontStyle = ref<'normal' | 'italic'>('normal')
const genFontWeight = ref('400')

const previewBackground = computed(() =>
  isDark.value ? typographyStore.globalConfig.dark.backgroundColor : typographyStore.globalConfig.backgroundColor
)

const textColor = computed(() =>
  isDark.value ? typographyStore.globalConfig.dark.color : typographyStore.globalConfig.color
)

const showModal = ref(false)

const handleGenerate = async () => {
  if (colorPairs.pairs.value.length === 0) return
  await themeGenerator.saveThemeToDB(colorPairs.pairs.value, themeName.value)
  showModal.value = true
  setTimeout(() => (showModal.value = false), 2000)
}
</script>

<template>
  <div class="cover-view" :style="{ backgroundColor: previewBackground }">
    <div class="row">
      <div class="col-12 col-md-6 mb-4">
        <div class="card cursor-pointer" @click="() => (nav.currentComponent = COMPONENT_TYPOGRAPHY_META)">
          <div class="card-header" :style="{ color: textColor }">
            <b>{{ t('components.typography') }}</b>
          </div>
          <div class="card-body" :style="{ color: textColor, opacity: 0.8 }">
            <IconTypography :size="80" stroke-width=".9" />
            {{ t('typography.description') }}
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 mb-4">
        <div class="card cursor-pointer" @click="() => (nav.currentComponent = COMPONENT_FORM_META)">
          <div class="card-header" :style="{ color: textColor }">
            <b>{{ t('components.forms') }}</b>
          </div>
          <div class="card-body" :style="{ color: textColor, opacity: 0.8 }">
            <IconForms :size="80" stroke-width=".9" />
            {{ t('forms.description') }}
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 col-lg-3 col-xl-2" v-for="item in COMPONENT_LIST" :key="item.id">
        <div class="card mb-4 user-select-none cursor-pointer" @click="() => (nav.currentComponent = item)">
          <div class="card-header text-center" :style="{ color: textColor }">
            <b>{{ t(`components.${item.id}`) }}</b>
          </div>
          <div class="card-body text-center" :style="{ color: textColor, opacity: 0.8 }">
            <component :is="icons[item.icon ?? '']" :size="60" stroke-width="1.4" />
          </div>
        </div>
      </div>
    </div>

    <div class="color-pair-section mt-4">
      <div class="card">
        <div class="card-header" :style="{ color: textColor }">
          <b> Theme Generator</b>
        </div>
        <div class="card-body">
          <div class="row align-items-end mb-3">
            <div class="col-auto">
              <label class="form-label" :style="{ color: textColor }">Theme Name</label>
              <input v-model="themeName" type="text" class="form-control form-control-sm" style="width: 200px" />
            </div>
            <div class="col-auto">
              <button
                class="btn btn-sm btn-link"
                :disabled="colorPairs.pairs.value.length === 0 || themeGenerator.isGenerating.value"
                @click="handleGenerate"
              >
                Generate Theme
              </button>
            </div>
          </div>

          <!-- Global Settings -->
          <div class="mb-3 p-3 rounded" style="background: rgba(127, 127, 127, 0.06)">
            <div class="row g-3 align-items-end">
              <div class="col-auto" style="width: 150px">
                <NumberUnitField
                  :label="t('themeGenerator.borderRadius')"
                  v-model="genBorderRadius"
                  unit="px"
                  :units="['px', '%', 'rem', 'em']"
                  :min="0"
                />
              </div>

              <div class="col-auto">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="themeGenerator.options.value.enableShadow"
                    id="gen-shadow"
                  />
                  <label class="form-check-label small" for="gen-shadow" :style="{ color: textColor }">
                    {{ t('themeGenerator.enableShadow') }}
                  </label>
                </div>
              </div>

              <div class="col-auto">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="themeGenerator.options.value.enableInsetShadow"
                    id="gen-inset-shadow"
                  />
                  <label class="form-check-label small" for="gen-inset-shadow" :style="{ color: textColor }">
                    {{ t('themeGenerator.enableInsetShadow') }}
                  </label>
                </div>
              </div>

              <div class="col-auto">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="themeGenerator.options.value.enableInsetHighlight"
                    id="gen-inset-highlight"
                  />
                  <label class="form-check-label small" for="gen-inset-highlight" :style="{ color: textColor }">
                    {{ t('themeGenerator.enableInsetHighlight') }}
                  </label>
                </div>
              </div>
            </div>

            <hr class="my-2" style="opacity: 0.15" />

            <div class="row g-3">
              <div class="col-3" style="width: 260px">
                <FontFamilyField
                  :font-family="genFontFamily"
                  :font-style="genFontStyle"
                  :font-weight="genFontWeight"
                  @update:font-family="genFontFamily = $event"
                  @update:font-style="genFontStyle = $event"
                  @update:font-weight="genFontWeight = $event"
                />
              </div>

              <div class="col-2">
                <ColorField
                  :label="t('themeGenerator.color')"
                  :model-value="themeGenerator.options.value.typography.color"
                  @update:model-value="themeGenerator.options.value.typography.color = $event"
                />
              </div>

              <div class="col-2">
                <ColorField
                  :label="t('themeGenerator.backgroundColor')"
                  :model-value="themeGenerator.options.value.typography.backgroundColor"
                  @update:model-value="themeGenerator.options.value.typography.backgroundColor = $event"
                />
              </div>

              <div class="col-2">
                <ColorField
                  :label="t('themeGenerator.darkColor')"
                  :model-value="themeGenerator.options.value.typography.darkColor"
                  @update:model-value="themeGenerator.options.value.typography.darkColor = $event"
                />
              </div>

              <div class="col-2">
                <ColorField
                  :label="t('themeGenerator.darkBackgroundColor')"
                  :model-value="themeGenerator.options.value.typography.darkBackgroundColor"
                  @update:model-value="themeGenerator.options.value.typography.darkBackgroundColor = $event"
                />
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-sm align-middle" :style="{ color: textColor }">
              <thead>
                <tr>
                  <th :style="{ color: textColor }">#</th>
                  <th :style="{ color: textColor }">Light</th>
                  <th :style="{ color: textColor }">Dark</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(pair, i) in colorPairs.pairs.value" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>
                    <ColorField
                      :label="t('common.light')"
                      :model-value="pair.light"
                      @update:model-value="colorPairs.updatePair(i, 'light', $event)"
                    />
                  </td>
                  <td>
                    <ColorField
                      :label="t('common.dark')"
                      :model-value="pair.dark"
                      @update:model-value="colorPairs.updatePair(i, 'dark', $event)"
                    />
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger py-0 px-1" @click="colorPairs.removePair(i)">
                      <IconTrash :size="14" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button class="btn btn-sm btn-link" @click="colorPairs.addPair()">
            <IconPlus :size="14" class="me-1" />
            Add Color Pair
          </button>
        </div>
      </div>
    </div>
    <div class="mb-5 mt-5">&nbsp;</div>
    <div class="mb-5 mt-5">&nbsp;</div>
    <div class="mb-5 mt-5">&nbsp;</div>
    <div class="mb-5 mt-5">&nbsp;</div>
    <div class="mb-5 mt-5">&nbsp;</div>

    <!-- Feedback Modal -->
    <Transition name="modal-fade">
      <div v-if="showModal" class="theme-feedback-backdrop" @click="showModal = false">
        <div class="theme-feedback-modal" @click.stop>
          <div class="theme-feedback-check">✓</div>
          <div class="theme-feedback-text">Tema generado!</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.theme-feedback-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
}

.theme-feedback-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 48px;
  border-radius: 12px;
  background: var(--cui-body-bg, #fff);
  color: var(--cui-body-color, #212529);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.theme-feedback-check {
  width: 48px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  border-radius: 50%;
  background: #28a745;
  color: #fff;
}

.theme-feedback-text {
  font-size: 18px;
  font-weight: 600;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
