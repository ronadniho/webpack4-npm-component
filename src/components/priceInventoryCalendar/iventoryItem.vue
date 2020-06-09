<template>
  <el-form
    :model="dialogInventory.data"
    ref="inventoryItemForm"
    label-width="0"
    class="inventory-item"
  >
    <div class="lineOne">
      <div class="left">
        <span class="demonstration">
          <i class="required">*</i>Start Date
        </span>
        <el-form-item
          style="margin-top:2px;"
          :class="[{ borderErr: inventoryErr.startErr }, 'matchHotel']"
        >
          <el-date-picker
            :picker-options="startInventoryAdd"
            v-model="dialogInventory.data.startDate"
            :default-value="dialogInventory.data.endDate"
            @focus="focusInput(dialogInventory.data.startDate, 1)"
            @blur="blurInput(dialogInventory.data.startDate, 1)"
            @change="blurInput(dialogInventory.data.startDate, 1)"
            type="date"
          ></el-date-picker>
          <p class="dateErr" v-if="inventoryErr.startErr">Please choose start date !</p>
        </el-form-item>
      </div>
      <div class="right">
        <span class="demonstration">
          <i class="required">*</i>End Date
        </span>
        <el-form-item
          style="margin-top:2px;"
          :class="[{ borderErr: inventoryErr.endErr }, 'matchHotel']"
        >
          <el-date-picker
            :picker-options="endInventoryAdd"
            v-model="dialogInventory.data.endDate"
            @focus="focusInput(dialogInventory.data.endDate, 2)"
            @blur="blurInput(dialogInventory.data.endDate, 2)"
            @change="blurInput(dialogInventory.data.endDate, 2)"
            type="date"
          ></el-date-picker>
          <p class="dateErr" v-if="inventoryErr.endErr">Please choose end date !</p>
        </el-form-item>
      </div>
    </div>
    <div class="lineOne mb-15">
      <el-form-item class="checkTip">
        <el-checkbox v-model="dialogInventory.data.checkAll" @change="handleCheckAllChange">All</el-checkbox>
        <el-checkbox-group
          v-model="dialogInventory.data.weekDayOf"
          @change="handleCheckedWeeksChange"
        >
          <el-checkbox
            v-for="(week, index) in weeks.options"
            :label="week.value"
            :key="index"
          >{{ week.name }}</el-checkbox>
        </el-checkbox-group>
        <p class="dateErr" v-if="inventoryErr.checkErr">Please select the day of the week !</p>
      </el-form-item>
    </div>
    <div class="lineOne">
      <div class="left">
        <span class="demonstration">Room Type</span>
        <el-form-item style="margin-top:2px;">
          <el-select
            v-model="dialogInventory.data.roomTypeName"
            style="width:220px;"
            :disabled="true"
          >
            <el-option v-for="(item, index) in []" :value="item" :label="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </div>
    <div class="lineOne">
      <span class="lh-40 mr-10">
        <i class="required">*</i>Inventory
      </span>
      <el-form-item prop="inventory" :class="{ borderErr: showAddInventoryErr }">
        <el-input
          class="inventory"
          v-model="dialogInventory.data.count"
          :disabled="inventoryDisabled"
          @input="inventInput(dialogInventory.data.count)"
        ></el-input>
      </el-form-item>
      <el-form-item label="Sold Out :" class="soldOutLabel">
        <el-checkbox v-model="dialogInventory.data.soldOut" class="soldOut"></el-checkbox>
      </el-form-item>
    </div>
    <el-form-item>
      <p
        class="inventory-err"
        style="color:red;"
        v-if="showAddInventoryErr"
      >Please input the number of inventory !</p>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "inventoryItem",
  props: ["dialogInventory", "inventoryErr", "showAddInventoryErr"],
  data() {
    return {
      startInventoryAdd: {
        // disabledDate: v => {
        //   if (this.dialogInventory.data.endDate) {
        //     return (
        //       v.getTime() < Date.now() - 24 * 60 * 60 * 1000 ||
        //       v.getTime() >
        //         new Date(this.dialogInventory.data.endDate).getTime() ||
        //       v.getTime() <
        //         new Date(this.dialogInventory.data.endDate).getTime() -
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

          if (this.dialogInventory.data.endDate) {
            let e = new Date(this.dialogInventory.data.endDate);
            e = new Date(
              `${e.getFullYear()}/${e.getMonth() + 1}/${e.getDate()}`
            ).getTime();
            return v.getTime() < start || v.getTime() > e;
          } else {
            return (
              v.getTime() < start  ||
              v.getTime() > start + 365 * 24 * 60 * 60 * 1000
            );
          }
        }
      },
      endInventoryAdd: {
        // disabledDate: v => {
        //   if (this.dialogInventory.data.startDate) {
        //     return (
        //       v.getTime() < Date.now() - 24 * 60 * 60 * 1000 ||
        //       v.getTime() <
        //         new Date(this.dialogInventory.data.startDate).getTime() ||
        //       v.getTime() >
        //         new Date(this.dialogInventory.data.startDate).getTime() +
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
          if (this.dialogInventory.data.startDate) {
            let s = new Date(this.dialogInventory.data.startDate);
            s = new Date(
              `${s.getFullYear()}/${s.getMonth() + 1}/${s.getDate()}`
            ).getTime();
            return (
              v.getTime() > s + 365 * 24 * 60 * 60 * 1000 || v.getTime() < s
            );
          } else {
            return (
              v.getTime() < start  ||
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
    inventInput(v) {
      if (v) {
        let data = this.dialogInventory.data;
        data.count = v.replace(/[^0-9]/g, "") || "";
        if (data.count.length > 1 && data.count.slice(0, 1) == "0") {
          data.count = data.count.slice(1, data.count.length);
        }
      }
    },
    handleCheckAllChange(val) {
      this.dialogInventory.data.weekDayOf = val ? this.weeks.default : [];
      this.inventoryErr.checkErr = this.dialogInventory.data.weekDayOf.length
        ? false
        : true;
    },
    handleCheckedWeeksChange(value) {
      let checkedCount = value.length;
      this.dialogInventory.data.checkAll =
        checkedCount === this.weeks.options.length;
      this.inventoryErr.checkErr = checkedCount ? false : true;
    },
    focusInput(val, type) {
      /*
        1  startDate
        2  endDate
      */

      if (type == 1) {
        this.inventoryErr.startErr = false;
      } else if (type == 2) {
        this.inventoryErr.endErr = false;
      }
    },
    blurInput(val, type) {
      if (type == 1) {
        this.inventoryErr.startErr = val ? false : true;
      } else if (type == 2) {
        this.inventoryErr.endErr = val ? false : true;
      }
    }
  },
  watch: {
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
  }
};
</script>


<style lang="scss" scoped>
.inventory-item {
  /deep/ .el-checkbox {
    margin-right: 15px;
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
  .inventory {
    /deep/ .el-input__inner {
      width: 70px;
    }
  }
  .soldOutLabel {
    /deep/ .el-form-item__label {
      width: 120px !important;
    }
    /deep/ .el-form-item__content {
      margin-left: 120px !important;
      margin-top: 11px !important;
    }
  }
}
</style>