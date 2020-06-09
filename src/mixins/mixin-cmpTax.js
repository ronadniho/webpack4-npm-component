export default{
  methods:{
    computedGST(nellRate) {
      let result = null;
      if ((!nellRate && nellRate !== 0) || nellRate < 0) {
        result = null;
      } else if (nellRate >= 0 && nellRate <= 1000) {
        result = "0";
      } else if (nellRate > 1000 && nellRate <= 7500) {
        result = "12";
      } else if (nellRate > 7500) {
        result = "18";
      }
      return result;
    }
  }
}