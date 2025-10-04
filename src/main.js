import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faPaperPlane, faBagShopping, faLayerGroup, faWandMagicSparkles, faUserLock } from '@fortawesome/free-solid-svg-icons'
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons'

library.add(
  faPaperPlane,
  faBagShopping,
  faLayerGroup,
  faWandMagicSparkles,
  faUserLock,
  faFaceSmile,
//   faGithub,
//   faLinkedin
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.component('fa', FontAwesomeIcon)

app.mount('#app')
