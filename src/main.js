import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// -------- SOLID (fas) --------
import {
  faPaperPlane,
  faBagShopping,
  faLayerGroup,
  faWandMagicSparkles,
  faUserLock,
  faArrowLeft,
  faEnvelope,
  faDatabase,
  faFireFlameCurved,
  faTableCellsLarge,
  faSquareRootVariable,
  faChartLine,
  faDiagramProject,
  faLeaf,
  faCircleNodes,
  faBezierCurve,
  faWater,
  faCodeBranch,
  faFileCode,
  faHashtag
} from '@fortawesome/free-solid-svg-icons'

// -------- REGULAR (far) --------
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons'

// -------- BRANDS (fab) --------
import {
  faGithub,
  faLinkedin,
  faVuejs,
  faReact,
  faNodeJs,
  faAws,
  faPython,
  faGitAlt,
  faPhp
} from '@fortawesome/free-brands-svg-icons'

library.add(
  // solid
  faPaperPlane,
  faBagShopping,
  faLayerGroup,
  faWandMagicSparkles,
  faUserLock,
  faArrowLeft,
  faEnvelope,
  faDatabase,
  faFireFlameCurved,
  faTableCellsLarge,
  faSquareRootVariable,
  faChartLine,
  faDiagramProject,
  faLeaf,
  faCircleNodes,
  faBezierCurve,
  faWater,
  faCodeBranch,
  faFileCode,
  faHashtag,

  // regular
  faFaceSmile,

  // brands
  faGithub,
  faLinkedin,
  faVuejs,
  faReact,
  faNodeJs,
  faAws,
  faPython,
  faGitAlt,
  faPhp
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.component('fa', FontAwesomeIcon)

app.use(router)
app.mount('#app')
