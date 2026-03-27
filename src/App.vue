<script setup lang="ts">
import { saveWindowState, StateFlags } from '@tauri-apps/plugin-window-state'
saveWindowState(StateFlags.ALL)

const nav = useNavigationStore()
</script>

<template>
  <MainBar />
  <CoverView v-if="!nav.currentComponent" />
  <div v-else class="d-flex">
    <SidePanel />
    <PreviewView />
  </div>
</template>
