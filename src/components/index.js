import priceInventoryCalendar from "./priceInventoryCalendar/priceInventoryCalendar";
import DialogGreen from "./DialogGreen/DialogGreen";
import "@/assets/css/common.css";

const components = [priceInventoryCalendar, DialogGreen];
const install = (Vue, option = {}) => {
  //全局注册所有组件
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

export default {
  install,
  DialogGreen,
  priceInventoryCalendar,
};
