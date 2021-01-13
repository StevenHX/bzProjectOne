<template>
  <el-dialog
    :visible.sync="modalShow"
    v-bind="$attrs"
    :width="width + 'px'"
    :top="top"
    v-if="modalShow"
    :custom-class="className"
    :before-close="beforeCloseFun"
    @close="$emit('on-close')"
    :close-on-click-modal="closeModal"
    :title="title"
  >
    <div slot="title" v-if="$slots.title" class="title">
      <slot name="title"></slot>
    </div>
    <slot class="el-dialog__body"></slot>
    <div slot="footer" v-if="!hideFoot" class="dialog-footer">
      <el-button
        size="small"
        v-show="hideClose != 'true' && hideClose != 1"
        class="close-btn"
        @click="close"
        >{{ closeText }}
      </el-button>
      <el-button
        v-bind:class="{ modalSaveEnable: !modalSaveEnable }"
        :disabled="!modalSaveEnable"
        type="primary"
        size="small"
        :loading="modelSaveLoading"
        v-show="hideSave != 'true' && hideSave != 1"
        @click="save"
        >{{ saveText }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
/**
 * 基础弹窗组件
 */
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "Open",
})
export default class Open extends Vue {
  @Prop({
    type: String,
    default: "确定",
  })
  saveText!: string;
  @Prop({
    type: String,
    default: "取消",
  })
  closeText!: string;
  @Prop({
    type: Boolean,
    default: false,
  })
  hideSave!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  hideClose!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  hideFoot!: boolean;
  @Prop({
    type: String,
    default: "信息",
  })
  title!: string;
  @Prop({
    type: [Number, String],
    default: 410,
  })
  width!: number | string;
  @Prop({
    type: [Number, String],
    default: "15vh",
  })
  top!: any;
  @Prop({
    type: String,
  })
  className!: string;
  @Prop({
    type: Boolean,
    default: false,
  })
  closeModal!: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  modalShow!: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  modalSaveEnable!: boolean; // 保存按钮是否可用

  @Prop({
    type: Boolean,
    default: false,
  })
  modelSaveLoading!: boolean;

  save() {
    this.$emit("on-save");
  }
  close() {
    this.$emit("on-close");
  }
  beforeCloseFun() {
    this.$emit("on-close");
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  .el-dialog__header {
    padding: 0 20px;
    height: 36px;
    // @include gradient-color();
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    .el-dialog__title {
      color: $black;
      font-size: 14px;
    }
    .el-dialog__headerbtn {
      top: 12px;
      .el-dialog__close {
        color: $black;
      }
    }
  }

  .el-dialog__body {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .el-dialog__footer {
    padding: 10px 20px;
    text-align: center;
    box-sizing: border-box;
    .el-button {
      background: #ff7f00;
      color: white;
      height: 28px;
      padding: 2px 18px;
      border-color: #ff7f00;
    }
    .modalSaveEnable {
      background: #d8d8d8;
      color: whitesmoke;
      height: 28px;
      padding: 2px 18px;
      border-color: white;
    }
    .close-btn {
      border: 1px solid #ff7f00;
      color: #ff7f00;
      background: white;
    }
  }
}
</style>
