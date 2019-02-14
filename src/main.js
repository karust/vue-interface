import Vue from 'vue'
import Vuetify from 'vuetify'
import VueResource from 'vue-resource'

import App from './App.vue'

import 'vuetify/dist/vuetify.min.css'


Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VueResource);

new Vue({
  render: h => h(App),
}).$mount('#app')
