import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import krryTransfer from 'krry-transfer'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from '@/lang' // internationalization
import '@/icons' // icon
import '@/permission' // permission control
Vue.prototype.$isMobile = false

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }
// set ElementUI lang to EN
Vue.use(ElementUI, {
  //  locale
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(krryTransfer)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
