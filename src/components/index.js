import priceInventoryCalendar from "./priceInventoryCalendar/priceInventoryCalendar";
import DialogGreen from "./DialogGreen/DialogGreen";
import 'font-awesome/css/font-awesome.css'
import '@/assets/css/common.css'
priceInventoryCalendar.install = Vue =>
  Vue.component(priceInventoryCalendar.name, priceInventoryCalendar);
DialogGreen.install = Vue =>
  Vue.component(DialogGreen.name, DialogGreen);

export default {
  install: Vue =>
    Vue.component(priceInventoryCalendar.name, priceInventoryCalendar),
    DialogGreen,
    priceInventoryCalendar
};
