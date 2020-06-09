import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.devtools = true
// import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css'
import '@/assets/css/common.css'
// import priceInventoryCalendar from '@/components'
// import hegComponents from '../../dist/hegComponents'
// console.log(hegComponents, '22222222222222222222')
Vue.use(VueRouter).use(ElementUI);
new Vue({
  el: '#app',
  render: h => h(App)
})
