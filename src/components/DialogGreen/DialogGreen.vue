<template>
  <el-dialog
    class="dialog_g"
    :visible.sync="dialogShow"
    :close-on-click-modal="false"
    :title="title"
    @close="close"
    :width="width"
    ref="dialog"
  >
    <div class="content">
      <!-- <p class="firstPhoto" v-if="title == 'Select Photo'">The first is the cover photo</p> -->
      <p class="selectedNum" v-if="title == 'Select Photo'">
        selected:{{ $store.state.card.photoSelectedNumM }}
      </p>
      <slot></slot>
    </div>
    <div class="footer" v-if="!dialogReadonly">
      <el-button
        class="submit"
        @click="handleClick('submit')"
        v-if="
          (title == 'Add HotelPhoto' && addSubmitLock) ||
            title != 'Add HotelPhoto'
        "
        >{{ submitText }}</el-button
      >
      <el-button class="submit forbidden" @click="tip" v-else>{{
        submitText
      }}</el-button>
      <el-button class="cancel" @click="handleClick">Cancel</el-button>
    </div>
    <div class="footer" v-if="dialogReadonly1">
      <el-button class="cancel" @click="handleClick">Back</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name:"DialogGreen",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: ""
    },
    minWidth: {
      type: String,
      default: ""
    },
    cancelFn: {
      type: Function,
      default: () => {}
    },
    submitFn: {
      type: Function,
      default: () => {}
    },
    title: String,
    width: {
      type: String,
      default: "50%"
    },
    dialogReadonly: {
      type: Boolean,
      default: false
    },
    dialogReadonly1: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: [Function, String],
      default: "Submit"
    },
    addSubmitLock: {
      type: Boolean,
      default: false
    },
    twiceDialog: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show(val) {
      // console.log(val);
      this.dialogShow = val;
    }
  },
  data() {
    return {
      dialogShow: false,
      submitFlag: false
    };
  },
  created() {},
  mounted() {
    this.$refs.dialog.$el.children[0].style.minWidth = this.minWidth;
    this.$refs.dialog.$el.children[0].style.maxWidth = this.maxWidth;
  },
  methods: {
    handleClick(type) {
      this.submitFlag = type === "submit" ? true : false;
      if (this.submitFlag) {
        let pending = this.submitFn();
        if (pending != true) {
          this.dialogShow = false;
        } else {
          this.dialogShow = true;
        }
      } else {
        if (this.title == "Add HotelPhoto") {
          this.$emit("resetAdd");
        }
        this.dialogShow = false;
      }
    },
    close() {
      let pending;
      if (!this.twiceDialog) {
        if (this.submitFlag) {
          // console.log('submit')
        } else {
          this.cancelFn();
          // console.log('cancel')
        }
      }else{
        this.cancelFn();
      }

      this.submitFlag = false;
      this.$emit("update:show", false);
      this.$emit("close", false);
    },
    closeDialog() {
      (this.submitFlag = false), this.$emit("update:show", false);
    },
    tip() {
      this.$message.warning(
        "Please select a picture and wait for upload to complete"
      );
    }
  }
};
</script>

<style scoped lang="scss">
$green: rgba(11, 157, 120, 1);
$orange: #ffa000;
.dialog_g {
  & /deep/ .el-dialog__header {
    background: rgba(11, 157, 120, 0.1);
    padding-bottom: 37px;
    font-size: 24px;
    // position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: 100;
  }
  & /deep/ .el-dialog__headerbtn .el-dialog__close {
    color: black;
  }
  .content {
    position: relative;
    .firstPhoto {
      position: absolute;
      top: -63px;
    }
    .selectedNum {
      position: absolute;
      top: -63px;
      font-size: 16px;
      color: #999;
    }
  }
  .footer {
    font-family: Roboto;
    margin-top: 30px;
    margin-left: 10px;
    .cancel {
      border: 1px solid $green;
      background: white;
      color: $green;
      width: 180px;
      height: 40px;
      margin-right: 40px;
    }
    .submit {
      border: 1px solid $orange;
      background: $orange;
      color: white;
      width: 180px;
      height: 40px;
    }
    .forbidden {
      background-color: #999;
      border: 1px solid #999;
    }
  }
}
</style>
