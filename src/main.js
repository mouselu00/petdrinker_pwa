import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VueIdb from "vue-idb";

Vue.config.productionTip = false
Vue.use(VueIdb);

const idb = new VueIdb({
  version: 1,
  database: "petDrinker",
  schemas: [{ petDrinkerTable: "id, serial_number, created_at, updated_at" }]
});

new Vue({
  router,
  idb:idb,
  render: h => h(App)
}).$mount('#app')
