<template>
  <el-form class="rateItemForm">
    <div class="lineOne" v-if="rateType != 2">
      <div class="left">
        <span class="demonstration">Select Date</span>
        <el-form-item prop="startDate" label style="margin-top:2px;" class="matchHotel">
          <el-date-picker
            style="width: 100%;"
            :clearable="true"
            :picker-options="startOptions"
            :default-value="dialogRate.data.endDate"
            v-model="dialogRate.data.startDate"
            type="date"
            :disabled="true"
          ></el-date-picker>
        </el-form-item>
      </div>
      <div class="blackOut">
        <el-checkbox v-model="dialogRate.data.blackout">Black Out</el-checkbox>
      </div>
    </div>
    <div class="lineOne" v-else>
      <div class="left">
        <span class="demonstration">
          <i class="required">*</i>Start Date
        </span>
        <el-form-item
          prop="startDate"
          label
          style="margin-top:2px;"
          :class="[{ borderErr: rateErr.startErr }, 'matchHotel']"
        >
          <el-date-picker
            style="width: 100%;"
            :clearable="true"
            :picker-options="startOptionsEdit"
            @focus="focusInput(dialogRate.data.startDate, 1)"
            @blur="blurInput(dialogRate.data.startDate, 1)"
            @change="blurInput(dialogRate.data.startDate, 1)"
            v-model="dialogRate.data.startDate"
            type="date"
          ></el-date-picker>
          <p class="dateErr" v-if="rateErr.startErr">Please choose start date !</p>
        </el-form-item>
      </div>
      <div class="right">
        <span class="demonstration">
          <i class="required">*</i>End Date
        </span>
        <el-form-item
          prop="endDate"
          label
          style="margin-top:2px;"
          :class="[{ borderErr: rateErr.endErr }, 'matchHotel']"
        >
          <el-date-picker
            style="width: 100%;"
            :clearable="true"
            :picker-options="endOptionsEdit"
            @focus="focusInput(dialogRate.data.endDate, 2)"
            @blur="blurInput(dialogRate.data.endDate, 2)"
            @change="blurInput(dialogRate.data.endDate, 2)"
            v-model="dialogRate.data.endDate"
            type="date"
          ></el-date-picker>
          <p class="dateErr" v-if="rateErr.endErr">Please choose end date !</p>
        </el-form-item>
      </div>
      <div class="blackOut">
        <el-checkbox v-model="dialogRate.data.blackout">Black Out</el-checkbox>
      </div>
    </div>
    <div class="lineOne mb-15" v-if="rateType == 2">
      <el-form-item class="checkTip">
        <el-checkbox v-model="dialogRate.data.checkAll" @change="handleCheckAllChange">All</el-checkbox>
        <el-checkbox-group v-model="dialogRate.data.weekDayOf" @change="handleCheckedWeeksChange">
          <el-checkbox
            v-for="(week, index) in weeks.options"
            :label="week.value"
            :key="index"
          >{{ week.name }}</el-checkbox>
        </el-checkbox-group>
        <p class="dateErr" v-if="rateErr.checkErr">Please select the day of the week !</p>
      </el-form-item>
    </div>
    <div class="lineOne">
      <div class="left">
        <span class="demonstration">Room Type</span>
        <el-form-item style="margin-top:2px;">
          <el-select v-model="dialogRate.data.roomTypeName" style="width:220px;" :disabled="true">
            <el-option
              v-for="(item, index) in []"
              :value="item"
              :label="RateItem"
              :key="index"
              :disabled="true"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="right">
        <span class="demonstration">Rate plan</span>
        <el-form-item style="margin-top:2px;">
          <el-select v-model="dialogRate.data.ratePlanType" style="width:220px;" :disabled="true">
            <el-option
              v-for="(item, index) in []"
              :value="item"
              :label="RateItem"
              :key="index"
              :disabled="true"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
    </div>
    <div class="audit" id="adult" v-for="(item, index) in dialogRate.data.sellRates" :key="index">
      <div class="adultFirst">
        <span v-if="index == 0" class="w-30">
          <i class="el-icon-user-solid"></i>
        </span>
        <span v-if="index == 1" class="w-30">
          <i class="el-icon-user-solid"></i>
          <i class="el-icon-user-solid"></i>
        </span>
        <span class="spanText">{{ index + 1 }} adult</span>
        <span class="spanSellRate">
          Sell Rate
          <b>₹</b>
        </span>
      </div>
      <el-form-item prop="sellRateF" label class="sellRateItem">
        <div class="sellRateF">
          <el-input
            style="width:80px;"
            maxlength="10"
            v-model="item.sellRate"
            @input="inventInput('sellRate', item, index)"
          ></el-input>
        </div>
      </el-form-item>
      <div class="sellTax">
        <span>Tax</span>
        <span class="tax">
          {{ computedGST(item.sellRate) }}
          <i v-if="item.sellRate">%</i>
        </span>
      </div>
    </div>
    <div class="lineOne mt-20" id="commission">
      <div class="left mr-30">
        <span class="demonstration">Extra Adult Price</span>
        <el-form-item label style="margin-top:2px;">
          <span style="line-height:30px;display: inline-block;width:20px;text-align: left;">₹</span>
          <el-input
            style="width:80px; "
            v-model="dialogRate.data.extraAdultPrice"
            @input="inventInput('aPrice', dialogRate.data.extraAdultPrice)"
          ></el-input>
        </el-form-item>
      </div>
      <div class="middle mr-30">
        <span class="demonstration">Extra Child Price (Above than free child age)</span>
        <el-form-item label style="margin-top:2px;">
          <span style="line-height:30px;display: inline-block;width:20px;text-align:left;">₹</span>
          <el-input
            style="width:80px; "
            v-model="dialogRate.data.extraChildPrice"
            @input="inventInput('cPrice', dialogRate.data.extraChildPrice)"
          ></el-input>
        </el-form-item>
      </div>
      <div class="right">
      <!--
        <el-checkbox
          v-model="dialogRate.data.checked"
          @change="commissinChange"
          class="demonstration"
        >Commission</el-checkbox>
        -->
        <span class="demonstration">Commission</span>
        <el-form-item label style="margin-top:2px;">
          <el-input
            maxlength="2"
            style="width:80px; "
            v-model="dialogRate.data.commission"
            @input="inventInput('commission', dialogRate.data.commission)"
          ></el-input>
          <span style="line-height:30px;display: inline-block;width:30px;text-align: center;">%</span>
        </el-form-item>
        <!-- <div class="err hide">Input Required</div>  -->
      </div>
    </div>
  </el-form>
</template>

<script>
import computedGST from "@/mixins/mixin-cmpTax";
export default {
  name: "RateItem",
  props: ["dialogRate", "rateType", "rateErr"],
  mixins: [computedGST],
  data() {
    return {
      startOptions: {
        disabledDate: v => {
          return v.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      startOptionsEdit: {
        // disabledDate: v => {
        //   if (this.dialogRate.data.endDate) {
        //     return (
        //       v.getTime() < Date.now() - 24 * 60 * 60 * 1000 ||
        //       v.getTime() > new Date(this.dialogRate.data.endDate).getTime()||
        //       v.getTime() <
        //         new Date(this.dialogRate.data.endDate).getTime() -
        //           49 * 24 * 60 * 60 * 1000
        //     );
        //   } else {
        //     return v.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        //   }
        // }

        disabledDate: v => {
          let start = new Date();
          start = new Date(
            `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()}`
          ).getTime();

          if (this.dialogRate.data.endDate) {
            let e = new Date(this.dialogRate.data.endDate);
            e = new Date(
              `${e.getFullYear()}/${e.getMonth() + 1}/${e.getDate()}`
            ).getTime();
            return v.getTime() < start || v.getTime() > e;
          } else {
            return (
              v.getTime() < start ||
              v.getTime() > start + 365 * 24 * 60 * 60 * 1000
            );
          }
        }
      },
      endOptionsEdit: {
        // disabledDate: v => {
        //   if (this.dialogRate.data.startDate) {
        //     return (
        //       v.getTime() < Date.now() - 24 * 60 * 60 * 1000 ||
        //       v.getTime() <
        //         new Date(this.dialogRate.data.startDate).getTime() ||
        //       v.getTime() >
        //         new Date(this.dialogRate.data.startDate).getTime() +
        //           49 * 24 * 60 * 60 * 1000
        //     );
        //   } else {
        //     return v.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        //   }
        // }
        disabledDate: v => {
          let start = new Date();
          start = new Date(
            `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()}`
          ).getTime();
          if (this.dialogRate.data.startDate) {
            let s = new Date(this.dialogRate.data.startDate);
            s = new Date(
              `${s.getFullYear()}/${s.getMonth() + 1}/${s.getDate()}`
            ).getTime();
            return (
              v.getTime() > s + 365 * 24 * 60 * 60 * 1000 || v.getTime() < s
            );
          } else {
            return (
              v.getTime() < start ||
              v.getTime() > start + 365 * 24 * 60 * 60 * 1000
            );
          }
        }
      },
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
      }
    };
  },
  methods: {
    commissinChange(v) {
      if (!v) {
        this.dialogRate.data.commission = null;
      }
    },
    inventInput(type, v, i) {
      let data = this.dialogRate.data;
      if (type == "sellRate") {
        v.sellRate = v.sellRate.replace(/[^0-9]/g, "") || "";
        if (v.sellRate.length > 1 && v.sellRate.slice(0, 1) == "0") {
          v.sellRate = v.sellRate.slice(1, v.sellRate.length);
        }
      } else if (type == "aPrice") {
        data.extraAdultPrice = v.replace(/[^0-9]/g, "") || "";
        if (!data.extraAdultPrice) {
          data.extraAdultPrice = null;
        } else if (
          data.extraAdultPrice.length > 1 &&
          data.extraAdultPrice.slice(0, 1) == "0"
        ) {
          data.extraAdultPrice = data.extraAdultPrice.slice(
            1,
            data.extraAdultPrice.length
          );
        }
      } else if (type == "cPrice") {
        data.extraChildPrice = v.replace(/[^0-9]/g, "") || "";
        if (!data.extraChildPrice) {
          data.extraChildPrice = null;
        } else if (
          data.extraChildPrice.length > 1 &&
          data.extraChildPrice.slice(0, 1) == "0"
        ) {
          data.extraChildPrice = data.extraChildPrice.slice(
            1,
            data.extraChildPrice.length
          );
        }
      } else if (type == "commission") {
        data.commission = v.replace(/[^0-9]/g, "") || "";
        if (!data.commission) {
          data.commission = null;
        } else if (
          data.commission.length > 1 &&
          data.commission.slice(0, 1) == "0"
        ) {
          data.commission = data.commission.slice(1, data.commission.length);
        }
      }
    },
    handleCheckAllChange(val) {
      this.dialogRate.data.weekDayOf = val ? this.weeks.default : [];
      this.rateErr.checkErr = this.dialogRate.data.weekDayOf.length
        ? false
        : true;
    },
    handleCheckedWeeksChange(value) {
      let checkedCount = value.length;
      this.dialogRate.data.checkAll =
        checkedCount === this.weeks.options.length;
      this.rateErr.checkErr = checkedCount ? false : true;
    },
    focusInput(val, t) {
      /*
        1  startDate
        2  endDate
        3  sellRate
      */

      if (t == 1) {
        this.rateErr.startErr = false;
      } else if (t == 2) {
        this.rateErr.endErr = false;
      } else if (t == 3) {
        if (val.type == "single") {
          this.rateErr.sellRateErr = false;
        }
      }
    },
    blurInput(val, t) {
      if (t == 1) {
        this.rateErr.startErr = val ? false : true;
      } else if (t == 2) {
        this.rateErr.endErr = val ? false : true;
      } else if (t == 3) {
        if (val.type == "single") {
          this.rateErr.sellRateErr = val.sellRate ? false : true;
        }
      }
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.demonstration {
  height: 24px;
}
.err{
  color:red;
  font-size: 12px;
  margin-top: 5px;
  &.hide{
    display: none;
  }
}
.rateItemForm {
  .w-30 {
    width: 30px;
    display: inline-block;
  }
  .mr-30 {
    margin-right: 30px;
  }
  .mt-20 {
    margin-top: 20px;
  }
  .required {
    display: inline-block;
    width: 12px;
    color: #e51c23;
    vertical-align: middle;
    font-size: 18px;
  }
  .tax {
    width: 80px;
    height: 38px;
    line-height: 38px !important;
    display: inline-block;
    border: 1px solid #bbb;
    background-color: #eee;
    border-radius: 4px;
    left: 738px;
    text-align: center;
  }
  .blackOut {
    padding-top: 38px;
    margin-left: 20px;
  }
  /deep/ .el-checkbox {
    margin-right: 15px;
  }
  .el-dialog__header {
    padding-bottom: 20px;
    padding-left: 30px;
    background-color: rgba(0, 238, 221, 0.1);
  }
  .borderErr {
    /deep/ .el-input__inner {
      border: 1px solid red;
    }
  }

  .lineOne {
    display: flex;
    text-align: left;
    .matchHotel {
      /deep/ .el-form-item__content {
        position: relative;
        .dateErr {
          position: absolute;
          left: 0;
          top: 44px;
          color: red;
          font-size: 12px;
        }
      }
    }
    .checkTip {
      position: relative;
      /deep/ .el-form-item__content {
        position: relative;
        .dateErr {
          position: absolute;
          left: 0;
          top: 24px;
          color: red;
          font-size: 12px;
        }
      }
    }
    > div {
      > span {
        display: inline-block;
        height: 24px;
      }
    }
    .right {
      margin-left: 20px;
    }
  }
  .lineOne:last-child {
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
  }
  #adult {
    height: 30px;
    display: flex;
    margin-top: 2px;
    border: 1px solid #dcdcdc;
    padding: 15px;
    width: 440px;
    flex: 1.2;
    .adultFirst {
      flex: 1.4;
      > i {
        line-height: 30px;
      }
      .spanText {
        margin-left: 10px;
        color: rgb(0, 157, 121);
      }
      .spanTwo {
        margin-left: 10px;
        color: rgb(0, 157, 121);
      }
      .spanTwoSell {
        line-height: 30px;
        padding-left: 32px;
        > b {
          color: black;
          padding-left: 5px;
          padding-right: 10px;
        }
      }
      .spanSellRate {
        line-height: 30px;
        padding-left: 40px;
        position: relative;
        i {
          position: absolute;
          left: 27px;
          top: -5px;
        }
        b {
          color: black;
          padding-left: 5px;
          padding-right: 10px;
        }
      }
    }
    .sellRateItem {
      position: relative;
      .sellRateErr {
        position: absolute;
        left: 0;
        top: 44px;
        font-size: 12px;
        color: red;
      }
    }
    .sellRateF {
      display: flex;
      justify-content: space-around;
    }
    .sellRateT {
      flex: 0.6;
      display: flex;
      justify-content: space-around;
    }
    .sellTax {
      flex: 1;
      display: flex;
      justify-content: space-around;
      > span {
        line-height: 30px;
        padding-left: 5px;
      }
    }
  }
}
</style>