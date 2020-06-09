<template>
  <div id="app">
    <priceInventoryCalendar
      :calendarData="calendarData" 
      :addInventoriesFun="addInventoriesFun"
      :addRateFun="addRateFun"
      @emitCancel="emitCancel"
      @emitSave="emitSave"
      @emitBack="emitBack"
    ></priceInventoryCalendar>
  </div>
</template>

<script>
import priceInventoryCalendar from "@/components/priceInventoryCalendar/priceInventoryCalendar";
import {
  queryRateInventory,
  AddCalendarInventory,
  editSingleInventory,
  editCalendarPrice
} from "@/api";
import {
  getDateFormat,
  parseMonths,
  parseDays,
  formatString
} from "@/assets/js/utils";
export default {
  name: "app",
  components: { priceInventoryCalendar },
  data() {
    return {
      calendarData: {
        minDateStamp: "",
        selectDate: "", //当前选择的其实日期
        dateArr: [], //当前显示的7天日历
        selectDate: "", //当前选择的其实日期
        roomList: [],
        channelManager: "",
        hotelId: "",
        hotelName: "",
        inventoryFormData: {
          lock: true,
          data: {}
        },
        priceFormData: {
          lock: true,
          data: {}
        }
      }
    };
  },
  created() {
    this.calendarData.hotelId = (this.$route&&this.$route.query.id)||'';
  },
  mounted() {
    this.calendarData.selectDate = new Date();
  },
  methods: {
    addInventoriesFun(data) {
      return AddCalendarInventory(this.calendarData.hotelId, data).then(res => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message);
          this.emitCancel();
          // this.dialogShow = false;
          // this.$refs["ruleFormInventory"].$refs[
          //   "inventoryItemForm"
          // ].resetFields();
          // this.showAddInventoryErr = false;
          // this.$emit('emitCancel');
          return true;
        }
      });
    },
    addRateFun(data) {
      return editCalendarPrice(this.calendarData.hotelId, data).then(res => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message);
          this.emitCancel();
          // this.dialogShow = false;
          // this.$emit("emitCancel");
          return true;
        }
      });
    },
    emitCancel() {
      this.getRoomsAsync();
    },
    emitSave() {
      let inventories = [],
        sellRates = [];
      for (let key in this.calendarData.inventoryFormData.data) {
        for (let cKey in this.calendarData.inventoryFormData.data[key]) {
          inventories.push(this.calendarData.inventoryFormData.data[key][cKey]);
        }
      }
      for (let key in this.calendarData.priceFormData.data) {
        for (let cKey in this.calendarData.priceFormData.data[key]) {
          sellRates.push(this.calendarData.priceFormData.data[key][cKey]);
        }
      }
      sellRates.map(v => {
        v.commission = v.commission * 100;
      });
      editSingleInventory(this.calendarData.hotelId, {
        inventories,
        sellRates
      }).then(res => {
        if (res.data && res.data.code == 200) {
          this.$message.success(res.data.message);
          this.getRoomsAsync();
        } else {
          this.$message.error(res.data.message || "Error");
        }
        this.clearFormData();
      });
    },
    emitBack() {
      history.go(-1);
    },
    clearFormData() {
      this.calendarData.inventoryFormData.lock = true;
      this.calendarData.inventoryFormData.data = {};
      this.calendarData.priceFormData.lock = true;
      this.calendarData.priceFormData.data = {};
    },
    getMinStamp() {
      let y = new Date().getFullYear();
      let m = new Date().getMonth() + 1;
      let d = new Date().getDate();
      this.calendarData.minDateStamp = new Date(`${y}/${m}/${d}`).getTime();
    },
    parseDate(type, date) {
      /*
       *参数:type
       * 1为month,2为week,3为date
       *
       * 参数:date
       * 日期类型
       *
       * */
      if (!type) return false;

      switch (type) {
        case 1:
          return date.getMonth() + 1;
          break;
        case 2:
          return date.getDay();
          break;
        case 3:
          return date.getDate();
          break;
        default:
          return date;
          break;
      }
    },
    computerDateHeader(callee) {
      let currentDate = this.calendarData.selectDate;
      this.calendarData.dateArr = [];
      for (let i = 0, _currentDate; i < 7; i++) {
        _currentDate = new Date(currentDate.getTime() + i * (24 * 3600 * 1000));
        this.calendarData.dateArr.push({
          ymd: getDateFormat(_currentDate),
          month: parseMonths(this.parseDate(1, _currentDate)),
          week: parseDays(this.parseDate(2, _currentDate)),
          date: this.parseDate(3, _currentDate)
        });
      }
      callee && callee();
    },
    getRoomsAsync() {
      this.getMinStamp();
      let params = {
        startDate: this.calendarData.dateArr[0].ymd,
        endDate: this.calendarData.dateArr[this.calendarData.dateArr.length - 1]
          .ymd
      };
      queryRateInventory(this.calendarData.hotelId, params).then(res => {
        if (res.data.code == 200) {
          let roomList = (this.calendarData.roomList = JSON.parse(
            JSON.stringify(res.data.data.roomTypes)
          ));
          this.calendarData.channelManager =
            (res.data.data.channelManager && res.data.data.channelManager[0]) ||
            "";
          this.calendarData.hotelName = res.data.data.hotelName;

          roomList.map(v => {
            let inventoryList = [];

            this.calendarData.dateArr.map(cv => {
              inventoryList.push(
                new INVENTORY(
                  this.calendarData.hotelId,
                  v.roomTypeId,
                  cv.ymd,
                  cv.ymd,
                  v.roomTypeName
                )
              );
            });
            v.inventories.map(cv => {
              inventoryList.map(ccv => {
                if (cv.date == ccv.startDate && cv.date == ccv.endDate) {
                  ccv.count = cv.count;
                  ccv.soldOut = cv.soldOut;
                  ccv.blackOut = cv.blackOut;
                  ccv.timeStamp = new Date(cv.date).getTime();
                }
              });
            });

            //遍历ep，cp
            v.ratePlans.map(cv => {
              let priceList = [];
              this.calendarData.dateArr.map(dcv => {
                priceList.push(
                  new PRICE(
                    v.roomTypeId,
                    "",
                    [new SELLRATES("single"), new SELLRATES("double")],
                    dcv.ymd,
                    dcv.ymd,
                    v.roomTypeName,
                    cv.ratePlanType,
                    cv.blackout ? 1 : 0
                  )
                );
              });
              //遍历单人，双人
              priceList.map(ccv => {
                ccv.ratePlanId = cv.ratePlanId;
              });

              cv.rates = cv.rates || [];
              if (cv.lastDay) {
                cv.lastDay = formatString(new Date(cv.lastDay).getTime());
              }

              cv.rates.map(ccv => {
                //***********TODO:CM导入价格类型顺序有可能改变
                ccv.sellRates = ccv.sellRates || [];
                let single = ccv.sellRates.filter(v => v.type == "single");
                let double = ccv.sellRates.filter(v => v.type == "double");
                ccv.sellRates = [...single, ...double];
                //***********

                priceList.map(pcv => {
                  if (ccv.date == pcv.startDate && ccv.date == pcv.endDate) {
                    pcv.extraAdultPrice = ccv.extraAdultPrice;
                    pcv.extraChildPrice = ccv.extraChildPrice;
                    pcv.commission = ccv.commission;
                    pcv.sellRates = ccv.sellRates;
                    pcv.sellRateTax = ccv.sellRateTax;
                    pcv.blackout = ccv.blackout ? 1 : 0;
                  }
                  ccv.roomTypeId = v.roomTypeId;
                  pcv.roomTypeName = v.roomTypeName;
                  pcv.ratePlanType = cv.ratePlanType;
                });
              });
              cv.rates = priceList;
            });
            v.inventories = inventoryList;
          });

          this.calendarData.roomList.forEach(a => {
            this.$set(a, "_show", true);
            a.ratePlans.forEach(b => {
              this.$set(b, "_show", true);
            });
          });
        }
      });
    }
  },
  watch: {
    "calendarData.selectDate": function(nVal, oVal) {
      this.computerDateHeader(this.getRoomsAsync);
    }
  }
};
</script>

<style lang="scss">
body {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
}
</style>
