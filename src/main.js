import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faPaperPlane, faBagShopping, faLayerGroup, faWandMagicSparkles, faUserLock, faArrowLeft, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'

library.add(
  faPaperPlane,
  faBagShopping,
  faLayerGroup,
  faWandMagicSparkles,
  faUserLock,
  faFaceSmile,
  faArrowLeft,
  faLinkedin,
  faEnvelope,
  faGithub
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.component('fa', FontAwesomeIcon)

app.use(router) 
app.mount('#app')
