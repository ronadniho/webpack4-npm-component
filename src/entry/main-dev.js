import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.devtools = true
import 'font-awesome/css/font-awesome.css'
import '@/assets/css/common.css'
import priceInventoryCalendar from '../../dist/Heg-Components'
Vue.use(VueRouter).use(ElementUI).use(priceInventoryCalendar);
new Vue({
  el: '#app',
  render: h => h(App)
})
