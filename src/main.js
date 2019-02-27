import Vue from 'vue'
import Vuetify from 'vuetify'
import VueResource from 'vue-resource'

import App from './App.vue'

import 'vuetify/dist/vuetify.min.css'


Vue.config.productionTip = false
Vue.prototype.$hostname = 'http://188.130.155.59:5000/'

Vue.use(Vuetify)
Vue.use(VueResource);

export const eventBus = new Vue();

new Vue({
  render: h => h(App),
}).$mount('#app')
