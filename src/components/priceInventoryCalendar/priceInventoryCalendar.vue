<template>
  <div class="container">
    <div class="hotel-name">{{ calendarData.hotelName }}</div>
    <div class="title-box" ref="box">
      <div class="title">Rate & Inventory</div>
      <div class="tips">
        <i class="color-grey"></i>
        <span>Black Out</span>
        <i class="color-red"></i>
        <span>Sold Out</span>
        <i class="color-green"></i>
        <span>Available</span>
      </div>
    </div>
    <!--action-->
    <el-row class="action flex">
      <!--select date-->
      <el-col :span="4" class="lt flex align-items">
        <el-date-picker
          @change="dateChange"
          v-model="calendarData.selectDate"
          type="date"
          :clearable="false"
          placeholder
        ></el-date-picker>
      </el-col>

      <!--prev-next 7day-->
      <el-col :span="20" class="rt flex space-between align-items">
        <a href="javascript:;" @click="toggle('prev')">
          <i class="fa fa-chevron-left" style="margin-right: 10px;" aria-hidden="true"></i>
          Pass 7 days
        </a>
        <div class="online">
          <el-radio v-model="radio" label="1">{{ calendarData.channelManager }}</el-radio>
        </div>
        <a href="javascript:;" @click="toggle('next')">
          Next 7 days
          <i aria-hidden="true" style="margin-left: 10px;" class="fa fa-chevron-right"></i>
        </a>
      </el-col>
    </el-row>

    <!--room date-->
    <div class="room-date">
      <div class="mask" v-show="isMask"></div>
      <el-row class="room-date-header">
        <el-col :span="4">
          <div class="month"></div>
          <div class="date"></div>
          <div class>
            <b>Room Type</b>
          </div>
        </el-col>

        <el-col :span="20" class="flex">
          <div v-for="(item, index) in calendarData.dateArr" :key="index" class="item-date">
            <div class="month">{{ item.month }}</div>
            <div class="date">{{ item.date }}</div>
            <div class="week">{{ item.week }}</div>
          </div>
        </el-col>
      </el-row>

      <!--item-->
      <el-row
        class="room-date-container"
        v-for="(item, index) in calendarData.roomList"
        :key="index"
      >
        <el-row class="room-date-item">
          <!--库存-->
          <el-row class="room-date-item-header">
            <el-col :span="4">
              <div class="flex space-between">
                <div class="text-ellipsis flex">
                  <i
                    class="fa fa-caret-up"
                    aria-hidden="true"
                    :class="{ close: item._show }"
                    @click="handleSpread(item, 'a')"
                  ></i>
                  <el-tooltip effect="dark" placement="top-start" :content="item.roomTypeName">
                    <label>{{ item.roomTypeName }}</label>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="Bulk Upload Inventory"
                    placement="top"
                  >
                    <i
                      class="fa fa-pencil-square-o"
                      aria-hidden="true"
                      @click="openBatchModel(1, item,item.roomTypeId)"
                    ></i>
                  </el-tooltip>
                </div>
              </div>
            </el-col>

            <el-col
              :span="20"
              class="flex"
              :style="{
                'border-color': false ? '#bbb' : 'transparent'
              }"
            >
              <div class="item-inventPrice" v-for="(child, idx) in item.inventories" :key="idx">
                <div class="item">
                  <div>
                    <input
                      v-model="child.count"
                      :readonly="child.timeStamp < minDateStamp"
                      @input="inventInput('inventory', child)"
                      class="inventInput"
                      :class="{
                        'color-green':
                          !child.soldOut && child.count && child.count !== '0',
                        'color-red': child.soldOut || child.count == '0'
                      }"
                      :style="{
                        cursor:
                          child.timeStamp < minDateStamp
                            ? 'not-allowed'
                            : 'pointer'
                      }"
                    />
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>

          <!--价格-->
          <transition name="top-transform">
            <el-col :span="24" style="position: relative;left: 0;top: 0;" v-if="item._show">
              <el-row
                class="room-date-item-info"
                v-for="(rates, ridx) in item.ratePlans"
                :key="ridx"
              >
                <el-row :span="24">
                  <el-col :span="4">
                    <div class="title flex space-between align-items">
                      <div class="j">
                        <i
                          class="fa fa-caret-up"
                          aria-hidden="true"
                          :class="{ close: rates._show }"
                          @click="handleSpread(rates, 'b')"
                        ></i>
                      </div>

                      <div
                        class="flex flex-column"
                        style="flex-grow:1;
                        justify-content: space-evenly;
                        align-items: flex-start;"
                      >
                        <el-tooltip
                          effect="dark"
                          placement="top-start"
                          :content="rates.ratePlanName||rates.ratePlanType"
                        >
                          <label>{{ rates.ratePlanName||rates.ratePlanType }}</label>
                        </el-tooltip>
                        <div>{{rates.lastDay}}</div>
                      </div>
                      <div class="flex flex-column">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="Bulk Upload Rates"
                          placement="top"
                        >
                          <i
                            class="fa fa-pencil-square-o"
                            aria-hidden="true"
                            @click="openBatchModel(2, rates,item.roomTypeId)"
                          ></i>
                        </el-tooltip>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="20" class="flex" style="height:100%">
                    <div
                      v-for="(itemB, ridx) in rates.rates"
                      :key="ridx"
                      class="item-rate-show item-rate"
                    >
                      <p
                        class="dot"
                        :class="{
                                'color-grey': itemB.blackout
                              }"
                        style="cursor:pointer;position:relative;"
                        @click="
                            handleCurrentPrice(itemB, 3,itemB.timeStamp >= minDateStamp)
                        "
                      >
                        <i></i>
                        <i></i>
                        <i></i>
                        <span
                          v-if="itemB.blackout"
                          style="position:absolute;right:5px;top:50%;transform:translateY(-50%);"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="svg-icon"
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                            style="fill: rgb(16, 16, 16);"
                          >
                            <path
                              d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                            />
                          </svg>
                        </span>
                      </p>
                    </div>
                  </el-col>
                </el-row>
                <el-row :span="24" v-if="rates._show">
                  <el-col :span="24" style="position: relative;left: 0;top: 0;" v-show="true">
                    <el-row class="room-date-item-rates">
                      <el-col :span="4" class="peoples">
                        <div class="people">
                          <i class="el-icon-user-solid"></i>
                        </div>
                        <div class="people">
                          <i class="el-icon-user-solid"></i>
                          <i class="el-icon-user-solid"></i>
                        </div>
                      </el-col>

                      <el-col :span="20" class="flex">
                        <div class="item-rates">
                          <div v-for="(itemB, ridx) in rates.rates" :key="ridx" class="item-rate">
                            <!-- <p
                              class="dot"
                              :style="{
                                cursor:
                                  itemB.timeStamp < minDateStamp
                                    ? 'not-allowed'
                                    : 'pointer'
                              }"
                              @click="itemB.timeStamp >= minDateStamp&&handleCurrentPrice(itemB, 3)"
                            >...</p>-->
                            <input
                              :readonly="itemB.timeStamp < minDateStamp"
                              class="priceInput"
                              @input="
                                inventInput('price', {
                                  itemB,
                                  itemC
                                })
                              "
                              :style="{
                                cursor:
                                  itemB.timeStamp < minDateStamp
                                    ? 'not-allowed'
                                    : 'pointer'
                              }"
                              v-for="(itemC, ridx) in itemB.sellRates"
                              :key="ridx"
                              v-model="itemC.sellRate"
                            />
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-row>
            </el-col>
          </transition>
          <!--rate-->
          <transition name="top-transform"></transition>
        </el-row>
      </el-row>

      <div class="btn-group">
        <el-button class="btn cancel" @click="clearFormData(true)">Cancel</el-button>
        <el-button class="btn save" @click="handleSave(() => {})">Save Changes</el-button>
      </div>
      <div class="back-button">
        <p @click="handleBack">Back</p>
      </div>
    </div>
    <dialog-green
      :width="'600px'"
      :show.sync="dialogShow"
      :title="title"
      class="ruleFormInventory"
      :submitFn="submitFn"
      :cancelFn="cancelFn"
    >
      <InventoryItem
        :dialogInventory="dialogInventory"
        :inventoryErr="inventoryErr"
        ref="ruleFormInventory"
        :showAddInventoryErr="showAddInventoryErr"
      ></InventoryItem>
    </dialog-green>

    <dialog-green
      :width="'800px'"
      :show.sync="dialogShowR"
      :title="title"
      class="ruleFormInventory"
      :submitFn="submitFn"
      :cancelFn="cancelFn"
      :dialogReadonly="dialogReadonly"
      :dialogReadonly1="dialogReadonly"
    >
      <RateItem :dialogRate="dialogRate" :rateType="batchModelType" :rateErr="rateErr"></RateItem>
    </dialog-green>

    <el-dialog title="Alert" :visible.sync="dialogVisible" width="30%">
      <span>You have some unsaved changes. Do you want to save these changes?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Discard Changes</el-button>
        <el-button type="primary" @click="alertDialog">Save Changes</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import {
//   AddCalendarInventory,
//   editSingleInventory,
//   editCalendarPrice
// } from "@/api";
import {
  getDateFormat,
  parseMonths,
  parseDays,
  formatString
} from "@/assets/js/utils";
import InventoryItem from "./iventoryItem.vue";
import RateItem from "./rateItem.vue";
import DialogGreen from "../DialogGreen/DialogGreen.vue";

import { INVENTORY, PRICE, SELLRATES } from "@/class/priceOrInventoryClass";
import computedGST from "@/mixins/mixin-cmpTax";

export default {
  name: "priceInventoryCalendar",
  components: {
    InventoryItem,
    RateItem,
    DialogGreen
  },
  props: {
    calendarData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    addInventoriesFun: {
      type: Function,
      default: function() {
        return () => {};
      }
    },
    addRateFun: {
      type: Function,
      default: function() {
        return () => {};
      }
    }
  },
  mixins: [computedGST],
  data() {
    return {
      hotelName: "",
      dialogVisible: false,
      dialogType: "",
      minDateStamp: "",
      channelManager: "",
      dialogReadonly: false,
      inventoryFormData: {
        lock: true,
        data: {}
      },
      priceFormData: {
        lock: true,
        data: {}
      },
      hotelId: "",
      selectDate: "", //当前选择的其实日期
      dateArr: [], //当前显示的7天日历
      showAddInventoryErr: false,
      radio: "1",
      roomList: [],
      dialogShow: false,
      dialogShowR: false,
      inventoryModel: false,
      priceModel: false,
      title: "",
      minWidth: "1000px",
      roomName: "",
      ratePlanName: "",
      ebkType: "",
      weeks: {
        default: [0, 1, 2, 3, 4, 5, 6],
        options: [
          {
            value: 0,
            name: "Sun"
          },
          {
            value: 1,
            name: "Mon"
          },
          {
            value: 2,
            name: "Tues"
          },
          {
            value: 3,
            name: "Wed"
          },
          {
            value: 4,
            name: "Thur"
          },
          {
            value: 5,
            name: "Fri"
          },
          {
            value: 6,
            name: "Sat"
          }
        ]
      },

      batchModelType: null, //批量修改模态框状态，值1为库存，值2为价格,3单天价格
      batchInventoryModel: {}, //批量修改库存数据
      batchPriceModel: {}, //批量修改价格数据

      isMask: false,
      messageText: {
        inventory: "Please enter inventory",
        more100: "More than Rs.100",
        date: "Please select date",
        dayAndWeek: "Please tick the day of the week",
        less: "Net rate needs to be less than the sell rate",
        net: "Please enter the net rate",
        sell: "Please enter the sell rate",
        gst: "Please enter the GST"
      },
      dialogInventory: {
        data: {}
      },
      dialogRate: {
        data: {}
      },
      rateErr: {
        startErr: false,
        endErr: false,
        checkErr: false,
        sellRateErr: false
      },
      inventoryErr: {
        startErr: false,
        endErr: false,
        checkErr: false
      }
    };
  },
  created() {
    // this.hotelId = '281544e0f1c04f6981507003c631554c'||this.$route.query.id;
  },
  mounted() {
    this.selectDate = new Date();
  },
  methods: {
    dateChange() {
      this.clearFormData();
    },
    handleBack() {
      this.$emit("emitBack");
    },
    handleCurrentPrice(item, type, lock) {
      this.dialogReadonly = !lock;
      this.batchModelType = type;
      this.dialogShowR = !this.dialogShowR;
      this.inventoryModel = false;
      this.priceModel = true;
      this.title = "Upload Rates";
      this.rateType = 3;
      this.dialogRate.data = new PRICE(
        item.roomTypeId,
        item.ratePlanId,
        item.sellRates,
        item.startDate,
        item.endDate,
        item.roomTypeName,
        item.ratePlanType,
        item.blackout ? 1 : 0,
        item.weekDayOf,
        item.checkAll,
        item.commission === 0 || item.commission > 0
          ? Math.floor(item.commission * 100)
          : null,
        item.extraAdultPrice,
        item.extraChildPrice
      );

      this.dialogRate.data.blackout = this.dialogRate.data.blackout
        ? true
        : false;

      // this.$nextTick(() => {
      //   document.getElementsByClassName("err")[0].className = "hide err";
      // });
    },
    clearFormData(status) {
      this.calendarData.inventoryFormData.lock = true;
      this.calendarData.inventoryFormData.data = {};
      this.calendarData.priceFormData.lock = true;
      this.calendarData.priceFormData.data = {};
      if (status) {
        this.$emit("emitCancel");
      }
    },
    getMinStamp() {
      let y = new Date().getFullYear();
      let m = new Date().getMonth() + 1;
      let d = new Date().getDate();
      this.minDateStamp = new Date(`${y}/${m}/${d}`).getTime();
    },
    closeDialog() {
      this.toggleDate(() => {
        this.dialogVisible = false;
        this.dialogType = "";
        this.clearFormData();
      });
    },
    alertDialog() {
      this.handleSave(() => {
        this.dialogVisible = false;
        this.clearFormData();
      });
    },
    handleSave(callee) {
      if (
        this.calendarData.inventoryFormData.lock &&
        this.calendarData.priceFormData.lock
      )
        return;
      this.$emit("emitSave");

      // let inventories = [],
      //   sellRates = [];
      // for (let key in this.calendarData.inventoryFormData.data) {
      //   for (let cKey in this.calendarData.inventoryFormData.data[key]) {
      //     inventories.push(this.calendarData.inventoryFormData.data[key][cKey]);
      //   }
      // }
      // for (let key in this.calendarData.priceFormData.data) {
      //   for (let cKey in this.calendarData.priceFormData.data[key]) {
      //     sellRates.push(this.calendarData.priceFormData.data[key][cKey]);
      //   }
      // }
      // sellRates.map(v => {
      //   v.commission = v.commission * 100;
      // });
      // editSingleInventory(this.hotelId, { inventories, sellRates }).then(
      //   res => {
      //     if (res.data && res.data.code == 200) {
      //       this.$message.success(res.data.message);
      //       this.$emit("emitCancel");
      //     } else {
      //       this.$message.error(res.data.message || "Error");
      //     }
      //     this.clearFormData();
      //     callee && callee();
      //   }
      // );
    },
    inventInput(type, v) {
      if (type == "price") {
        this.calendarData.priceFormData.lock = false;
        v.itemC.sellRate = v.itemC.sellRate.replace(/[^0-9]/g, "") || "0";
        if (
          v.itemC.sellRate.length > 1 &&
          v.itemC.sellRate.slice(0, 1) == "0"
        ) {
          v.itemC.sellRate = v.itemC.sellRate.slice(1, v.itemC.sellRate.length);
        }
        if (v.itemC.sellRate <= 1000) {
          v.itemC.sellRateTax = 0;
        } else if (v.itemC.sellRate <= 7500) {
          v.itemC.sellRateTax = 12;
        } else {
          v.itemC.sellRateTax = 18;
        }
        if (!this.calendarData.priceFormData.data[v.itemB.startDate]) {
          this.calendarData.priceFormData.data[v.itemB.startDate] = {};
        }
        this.calendarData.priceFormData.data[v.itemB.startDate][
          v.itemB.roomTypeName + "_" + v.itemB.ratePlanType
        ] = v.itemB;
      } else if (type == "inventory") {
        this.calendarData.inventoryFormData.lock = false;
        v.count = v.count.replace(/[^0-9]/g, "") || "0";
        if (v.count.length > 1 && v.count.slice(0, 1) == "0") {
          v.count = v.count.slice(1, v.count.length);
        }
        if (!this.calendarData.inventoryFormData.data[v.startDate]) {
          this.calendarData.inventoryFormData.data[v.startDate] = {};
        }
        this.calendarData.inventoryFormData.data[v.startDate][
          v.roomTypeName
        ] = v;
      }
    },
    handleSpread(v) {
      v._show = !v._show;
    },
    openBatchModel(type, item, roomTypeId) {
      this.dialogReadonly = false;
      /*
       * 参数1 NUMBER：type
       * 值：1为库存，2为价格
       *
       * 参数2 ARRAY：name
       * 值[roomType,ratePlan,ebkType]
       *
       * 参数3 STRING：roomTypeId
       *
       * 参数4 STRING：ratePlanId
       *
       *
       * */

      this.batchModelType = type;
      if (type == 1) {
        this.dialogShow = !this.dialogShow;
        this.inventoryModel = true;
        this.priceModel = false;
        this.title = "Bulk Upload Inventory";
        this.dialogInventory.data = new INVENTORY(
          this.hotelId,
          roomTypeId,
          new Date(),
          "",
          item.roomTypeName
        );
      } else if (type == 2) {
        this.dialogShowR = !this.dialogShowR;
        this.inventoryModel = false;
        this.priceModel = true;
        this.title = "Bulk Upload Rates";
        this.rateType = 2;
        this.dialogRate.data = new PRICE(
          roomTypeId,
          item.ratePlanId,
          [new SELLRATES("single"), new SELLRATES("double")],
          new Date(),
          "",
          item.ratePlanName,
          item.ratePlanType,
          item.blackout ? 1 : 0
        );
      }
    },
    handleCheckAllChange(val) {
      this.dialogInventory.data.checkedWeeks = val ? this.weeks.default : [];
    },
    handleCheckedWeeksChange(value) {
      let checkedCount = value.length;
      this.dialogInventory.data.checkAll =
        checkedCount === this.weeks.options.length;
    },
    submitFn() {
      if (this.batchModelType == 1) {
        let bIM = this.dialogInventory.data;
        let data = this.dialogInventory.data;
        if (!data.startDate) {
          this.inventoryErr.startErr = true;
        }
        if (!data.endDate) {
          this.inventoryErr.endErr = true;
        }
        if (!data.weekDayOf.length) {
          this.inventoryErr.checkErr = true;
        }

        if (
          !this.inventoryErr.startErr &&
          !this.inventoryErr.endErr &&
          !this.inventoryErr.checkErr
        ) {
          if (
            !this.dialogInventory.data.soldOut &&
            !this.dialogInventory.data.count
          ) {
            this.showAddInventoryErr = true;
            this.dialogShow = true;
          } else {
            this.showAddInventoryErr = false;
            bIM.startDate = bIM.startDate && getDateFormat(bIM.startDate);
            bIM.endDate = bIM.endDate && getDateFormat(bIM.endDate);
            return this.AddInventoriesAsync(bIM);
          }
        }

        // if (
        //   this.inventoryErr.startErr ||
        //   this.inventoryErr.endErr ||
        //   this.inventoryErr.checkErr
        // ) {
        //   this.dialogShow = true;
        // }
        // else {
        //   if (
        //     !this.dialogInventory.data.soldOut &&
        //     !this.dialogInventory.data.count
        //   ) {
        //     this.showAddInventoryErr = true;
        //     this.dialogShow = true;
        //   } else {
        //     this.showAddInventoryErr = false;
        //     bIM.startDate = bIM.startDate && getDateFormat(bIM.startDate);
        //     bIM.endDate = bIM.endDate && getDateFormat(bIM.endDate);
        //     return this.AddInventoriesAsync(bIM);
        //   }
        // }
      } else if (this.batchModelType == 2 || this.batchModelType == 3) {
        let data = this.dialogRate.data;
        // if (this.dialogRate.data.checked && !this.dialogRate.data.commission) {
        //   console.log(document.getElementsByClassName("err"));
        //   document.getElementsByClassName("err")[0].className = "err";
        //   return true;
        // }
        if (!data.startDate) {
          this.rateErr.startErr = true;
        }
        if (!data.endDate) {
          this.rateErr.endErr = true;
        }
        if (!data.weekDayOf.length) {
          this.rateErr.checkErr = true;
        }

        if (
          !this.rateErr.startErr &&
          !this.rateErr.endErr &&
          !this.rateErr.checkErr
        ) {
          data.sellRates.forEach(v => {
            v.sellRateTax = this.computedGST(v.sellRate);
          });
          if (this.batchModelType == 2) {
            data.startDate = getDateFormat(data.startDate);
            data.endDate = getDateFormat(data.endDate);
          }
          this.dialogRate.data.blackout = this.dialogRate.data.blackout ? 1 : 0;
          return this.AddRateAsync(data);
        }

        // if (
        //   this.rateErr.startErr ||
        //   this.rateErr.endErr ||
        //   this.rateErr.checkErr
        // ) {
        //   this.dialogShowR = true;
        // } else {
        //   data.sellRates.forEach(v => {
        //     v.sellRateTax = this.computedGST(v.sellRate);
        //   });
        //   if (this.batchModelType == 2) {
        //     data.startDate = getDateFormat(data.startDate);
        //     data.endDate = getDateFormat(data.endDate);
        //   }
        //   this.dialogRate.data.blackout = this.dialogRate.data.blackout ? 1 : 0;
        //   return this.AddRateAsync(data);
        // }
      }
      return true;
    },
    cancelFn() {
      this.inventoryModel = false;
      this.priceModel = false;
      if (this.batchModelType == 1) {
        this.$data.inventoryErr = this.$options.data().inventoryErr;
        this.showAddInventoryErr = false;
      } else if (this.batchModelType == 2 || this.batchModelType == 3) {
        this.$data.rateErr = this.$options.data().rateErr;
      }
    },
    AddInventoriesAsync(data) {
      this.addInventoriesFun(data);
      // return AddCalendarInventory(this.hotelId, data).then(res => {
      //   if (res.data.code == 200) {
      //     this.$message.success(res.data.message);
      //     this.dialogShow = false;
      //     this.$refs["ruleFormInventory"].$refs[
      //       "inventoryItemForm"
      //     ].resetFields();
      //     this.showAddInventoryErr = false;
      //     // this.getRoomsAsync();
      //     this.$emit("emitCancel");
      //     return true;
      //   }
      // });
    },
    AddRateAsync(data) {
      this.addRateFun(data);
      // return editCalendarPrice(this.hotelId, data).then(res => {
      //   if (res.data.code == 200) {
      //     this.$message.success(res.data.message);
      //     this.dialogShow = false;
      //     this.$emit("emitCancel");
      //     return true;
      //   }
      // });
    },
    changeRateplan(rateplan) {
      rateplan = rateplan || "";
      let str;
      if (rateplan.indexOf("with Breakfast") > 0) {
        str = "CP";
      } else {
        str = "EP";
      }
      return str;
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
      let currentDate = this.selectDate;
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
    toggle(type) {
      /*
       *参数:type
       * 值'prev'为上7天
       *
       * 值'next'为下7天
       *
       *
       * */
      this.dialogType = type;
      if (
        !this.calendarData.inventoryFormData.lock ||
        !this.calendarData.priceFormData.lock
      ) {
        this.dialogVisible = true;
        return;
      }
      this.toggleDate();
    },
    toggleDate(callee) {
      if (this.dialogType == "prev") {
        callee && callee();
        this.calendarData.selectDate = new Date(
          this.calendarData.selectDate.getTime() - 7 * (24 * 3600 * 1000)
        );
      } else if (this.dialogType == "next") {
        callee && callee();
        this.calendarData.selectDate = new Date(
          this.calendarData.selectDate.getTime() + 7 * (24 * 3600 * 1000)
        );
      }
    },
    computedGST(nellRate) {
      let result = null;
      if (this.ebkType !== "treebo") {
        if (!nellRate || nellRate < 1120) {
          result = "0";
        } else if (nellRate >= 1120 && nellRate <= 8400) {
          result = "12";
        } else if (nellRate > 8400) {
          result = "18";
        }
      } else {
        if (!nellRate || nellRate < 1000) {
          result = "0";
        } else if (nellRate >= 1000 && nellRate <= 7500) {
          result = "12";
        } else if (nellRate > 7500) {
          result = "18";
        }
      }
      return result;
    },
    checkTime(v) {
      let current = new Date();
      current = new Date(
        `${current.getFullYear()}/${current.getMonth() +
          1}/${current.getDate()}`
      );
      let selected = new Date(v.replace(/\-/g, "/"));
      if (selected.getTime() < current.getTime()) {
        return false;
      }
      return true;
    }
  },
  watch: {
    // selectDate: function(nVal, oVal) {
    //   this.computerDateHeader(this.getRoomsAsync);
    // },
    "dialogInventory.data.soldOut": {
      handler(val) {
        if (val) {
          this.dialogInventory.data.count = 0;
          this.inventoryDisabled = true;
          this.showAddInventoryErr = false;
        } else {
          this.dialogInventory.data.count = "";
          this.inventoryDisabled = false;
        }
      },
      immediate: true
    },
    "dialogInventory.data.count": {
      handler(val) {
        if (val) {
          this.showAddInventoryErr = false;
        }
      },
      immediate: true
    }
  },
  filters: {}
};
</script>

<style scoped lang="scss">

.el-tooltip {
  font-size: 22px !important;
  width: auto !important;
  height: auto !important;
  line-height: 22px !important;
  & + div {
    height: 16px;
    font-size: 12px;
    color: #101010;
  }
}
.flex-column {
  flex-flow: column nowrap;
  width: 35px;
  height: 61px;
  line-height: 12px;
  color: rgba(16, 16, 16, 1);
  font-size: 12px;
  text-align: center;
  justify-content: space-evenly;
  align-items: flex-end;
  box-sizing: border-box;
  padding-right: 9px;
}
.container {
  width: 100%;
  .hotel-name {
    font-size: 28px;
    margin: 20px 0;
    padding: 0 20px;
  }
  .close {
    transform: rotate(180deg);
  }
  input {
    border: 1px solid rgba(153, 153, 153, 1);
    border-radius: 4px;
    width: 120px;
    height: 40px;
    box-sizing: border-box;
    padding: 0 14px;
    text-align: center;
    outline: 0px;
    &.priceInput {
      &:not([readonly]):focus {
        border: 1px solid #999 !important;
        background-color: #fff !important;
      }
      &[readonly] {
        color: #999 !important;
        border-color: #999 !important;
        background-color: auto !important;
      }
    }
    &.inventInput {
      &:not([readonly]):focus {
        border: 1px solid #999;
        background-color: #fff;
      }
      &[readonly] {
        color: #999 !important;
        // border-color: #999 !important;
        &.color-green {
          background-color: rgba(11, 157, 120, 0.2) !important;
        }
        .color-red {
          background-color: rgba(229, 28, 35, 0.2) !important;
        }
        .color-grey {
          background-color: rgba(153, 153, 153, 0.2) !important;
        }
      }
    }
  }
  .color-green {
    border-color: transparent;
    left: 1181px;
    background-color: rgba(11, 157, 120, 0.2);
  }
  .color-red {
    border-color: transparent;
    background-color: rgba(229, 28, 35, 0.2);
  }
  .color-grey {
    border: 1px solid rgba(153, 153, 153, 1);
    background-color: rgba(153, 153, 153, 0.2);
    color: #999;
  }

  .lh-40 {
    line-height: 40px;
  }
  .mr-10 {
    margin-right: 10px;
  }
  .mb-15 {
    margin-bottom: 15px;
  }
  .required {
    color: red;
    font-size: 20px;
    font-weight: 600;
  }

  .title-box {
    height: 70px;
    display: flex;
    justify-content: space-between;
    background-color: rgba(11, 157, 120, 0.1);
    padding: 0 30px 0 20px;
    margin-bottom: 20px;
    .title {
      font-size: 24px;
      color: #333;
      line-height: 70px;
    }
    .tips {
      display: flex;
      align-items: center;
      i {
        width: 30px;
        height: 30px;
        display: inline-block;
        border-radius: 4px;
        margin: 0 11px 0 27px;
      }
    }
  }
  .action {
    margin-bottom: 24px;
    .lt {
      flex-grow: 1;
      height: 40px;
      .el-date-picker {
        width: 220px;
        height: 40px;
      }
    }
    .rt {
      flex-grow: 3;
      height: 40px;
      padding: 0 52px;
      a {
        color: #009d79;
        font-size: 20px;
      }
      > div {
        font-size: 18px;
        color: #333;
      }
    }
  }

  .room-date {
    position: relative;
    margin-bottom: 30px;
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0);
      z-index: 4001;
      width: 100%;
      height: 100%;
    }
    &-header {
      background-color: #0b9d78;
      height: 100px;
      padding: 10px 0;
      box-sizing: border-box;
      color: #fff;
      &:hover {
        cursor: not-allowed;
      }
      .el-col {
        font-size: 20px;
        &:first-child {
          position: relative;
          b {
            position: absolute;
            bottom: 0;
            left: 10px;
          }
        }
        height: 100%;
        .item-date {
          width: 100%;
          .month {
            font-size: 14px;
            height: 22px;
          }
          .date {
            font-size: 24px;
            height: 40px;
            line-height: 40px;
            border-left: 1px dashed #fff;
          }
          .week {
            font-size: 14px;
            height: 15px;
          }
        }
        &:not(:first-child) {
          text-align: center;
        }
      }
    }

    &-container {
      margin-top: 10px;
      /deep/ .el-input__inner {
        text-align: center;
      }
    }

    &-item {
      box-shadow: 0 2px 10px 0 rgb(204, 204, 204);
      &-header {
        box-sizing: border-box;
        background-color: #fff;
        > .el-col {
          height: 61px;
          line-height: 61px;
          &:first-child {
            background-color: rgba(11, 157, 120, 0.15);
            padding: 0 10px 0 6px;
            font-size: 18px;
          }

          &:not(:first-child) {
            height: 61px;
            border-bottom: 1px dashed transparent;
            .item-inventPrice {
              width: 14.28%;
              height: 100%;
            }
            .item {
              width: 100%;
              height: 100%;
              padding: 10px;

              position: relative;
              box-sizing: border-box;
              &.active {
                background-color: #0b9d78;
                z-index: 4002;
                > div {
                  background-color: #54baa0 !important;
                  color: #fff;
                }
              }
              > div:not(.single-model) {
                width: 100%;
                height: 100%;
                line-height: 41px;
                text-align: center;
                border-radius: 4px;
                font-size: 13px;
                // background-color: #fff;
                // border: 1px solid #d5d5d5;
                box-sizing: border-box;
                &:hover {
                  cursor: pointer;
                }
                &.warning {
                  background-color: #ffeacc;
                  border-color: transparent;
                }
                &.success {
                  background-color: #ceebe4;
                  border-color: transparent;
                }
                &.danger {
                  background-color: #fad2d3;
                  border-color: transparent;
                }
                &.disabled {
                  background-color: #ebebeb;
                  border-color: transparent;
                }
              }
            }
          }
          .item-inventPrice:nth-child(9) {
            .single-model {
              left: -150%;
            }
          }
          .item-inventPrice:last-child {
            .single-model {
              left: -150%;
            }
          }
          i.fa {
            width: 11px;
            transition: all 0.3s;
            &:hover {
              cursor: pointer;
            }
            &.close {
              transform: rotate(180deg);
            }
          }
        }
      }

      &-info {
        background-color: rgba(11, 157, 120, 0.05);
        > .el-row {
          height: 60px;
          > .el-col {
            &:first-child {
              line-height: 56px;
              font-size: 18px;
              position: relative;
              .title {
                width: 100%;
                height: 100%;
                label {
                  // width: 60% !important;
                  // height: 100% !important;
                  width: 100% !important;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  text-align: left;
                  font-size: 12px !important;
                }
                .j {
                  position: relative;
                  width: 10%;
                  height: 61px;
                  i {
                    position: absolute;
                    top: 17px;
                    margin-left: 5px;
                    height: 12px;
                    text-align: center;
                    // &::before{
                    //   position: absolute;
                    //   top: 0;
                    // }
                    &:hover {
                      cursor: pointer;
                    }
                  }
                }
              }
            }
            &:not(:first-child) {
              .item-date {
                width: 14.28%;
                text-align: center;
                font-size: 13px;
                position: relative;
                &:nth-child(9) {
                  .single-model {
                    left: -200%;
                  }
                }
                &:last-child {
                  .single-model {
                    left: -200%;
                  }
                }

                .item {
                  padding: 10px;
                  width: 100%;
                  height: 100%;
                  box-sizing: border-box;
                  position: relative;
                  > div:first-child {
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;
                    box-sizing: border-box;
                    &.disabled {
                      border-color: #adadad;
                      color: #aeaeae;
                    }
                  }
                  &.active {
                    background-color: #0b9d78;
                    z-index: 4002;
                    > div {
                      background-color: #54baa0 !important;
                      color: #fff;
                    }
                  }
                }
                .single-model {
                  width: 350%;
                  height: 400%;
                  top: 56px;
                  left: 0;
                  input {
                    width: 60%;
                    margin: 0 10px;
                  }
                  .gst_disabled {
                    cursor: not-allowed;
                    background-color: #e1e1e1;
                  }
                }
                > div:not(.single-model) {
                  line-height: 36px;
                  &:hover {
                    cursor: pointer;
                  }
                }
              }
            }
          }
        }
      }
      .item-rate-show {
        width: 14.28%;
        padding: 10px;
        text-align: center;
        display: flex;
        .dot {
          align-items: center;
          width: 100%;
          font-size: 18px;
          color: #111;
          font-weight: 700;
          display: flex;
          justify-content: center;
          margin: 0 auto;
          &.color-grey {
            width: 120px;
            height: 40px;
            line-height: 20px;
            border-radius: 4px;
            background-color: rgba(238, 238, 238, 1);
            border: 1px solid rgba(153, 153, 153, 1);
            box-sizing: border-box;
          }
          i {
            display: inline-block;
            width: 5px;
            height: 5px;
            border: 0;
            border-radius: 50%;
            background-color: #101010;
            margin-right: 3px;
          }
        }
      }
      &-rates {
        background-color: #fff;
        .peoples {
          .people {
            height: 60px;
            display: flex;
            width: 80%;
            padding-left: 20%;
            box-sizing: border-box;
            i {
              line-height: 56px;
              text-align: center;
              font-size: 22px;
              margin-right: 5px;
            }
          }
        }
        .item-rates {
          display: flex;
          .item-rate {
            position: relative;
            width: 14.28%;
            padding: 10px;
            text-align: center;
          }
        }
      }
      .single-model {
        position: absolute;
        background-color: #55bba1;
        width: 250%;
        height: 300%;
        top: 60px;
        left: 0;
        z-index: 4001;
        padding: 15px;
        box-sizing: border-box;
        .el-row {
          text-align: left;
          line-height: 30px;
          color: #fff;
          font-size: 16px;
          &:not(:last-child) {
            margin-bottom: 7px;
          }
        }
      }
    }
  }
}

.el-checkbox {
  margin-right: 18px;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 10px;
  align-items: center;
  & > label {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 4px;
    font-weight: bold;
    font-size: 17px !important;
  }
}

.btn-group {
  margin-top: 20px;
  text-align: right;
  .btn {
    width: 160px;
    height: 40px;
  }
  .cancel {
    color: #0b9d78;
    border: 1px solid #0b9d78;
    font-size: 18px;
  }
  .save {
    background-color: #ffa000;
    color: #fff;
    border: 1px solid #ffa000;
  }
}
.back-button {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  cursor: pointer;
  p {
    width: 120px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    background-color: #009a7d;
    font-size: 18px;
    text-align: center;
    border-radius: 4px;
  }
}
</style>
