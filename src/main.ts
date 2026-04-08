import CoreuiVue from '@coreui/vue'
import './css/main.scss'

import App from './App.vue'
import { i18n } from '@/i18n/i18n'
import { vWheelNumber } from './directives/wheelNumber'

const app = createApp(App)
app.use(createPinia())
app.use(CoreuiVue)
app.use(i18n)
app.directive('wheel-number', vWheelNumber)

app.mount('#app')

// Fade out splash overlay once Vue is mounted
const splash = document.getElementById('splash')
if (splash) {
  splash.classList.add('fade-out')
  splash.addEventListener('transitionend', () => splash.remove())
}
