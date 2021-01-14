<template>
  <div class="information">
    <table-list
      ref="tableList"
      :settings="settings"
      :searchSetting="searchSetting"
      :query="query"
      :total="list.TotalCount"
      :pageNum="query.pageNum"
      :loading="loading"
      ListId="ID"
      v-model="query.pageSize"
      @on-search-click="queryList"
      @on-change="queryList"
      @on-enter-click="queryList"
      @on-clear-click="queryList"
      @onDownMp4="onDownMp4"
      @onViewMp4="onViewMp4"
    >
      <template slot="left">
        <div class="l-t">驱鸟历史</div>
      </template>
    </table-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Getter, Action, Mutation, namespace } from "vuex-class";
import { api } from "@/api";
import _ from "lodash";
import { getStorage, setStorage, dateFormat} from "@/util/utils";
import { downloadFile} from '@/util';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css';

@Component({
  name: "Devices",
  components: {},
})
export default class Devices extends Vue {
  public $refs!: {
    tableList: HTMLFormElement;
  };
  selectDeleteItems: any = [];
  loading: boolean = false;
  deleteLoading: boolean = false;
  onToolLoading: boolean = false;
  searchSetting: any = [
    // {
    //   label: '人员编号',
    //   placeholder: '请输入人员编号',
    //   type: 'input',
    //   key: 'userCode',
    // },
    // {
    //   label: '姓名',
    //   placeholder: '请输入姓名',
    //   type: 'input',
    //   key: 'userName',
    // },
  ];
  query: any = {
    pageNum: 1,
    pageSize: 20,
  };

  list: any = {
    data: [],
    TotalCount: 0,
  };
  settings: any = {
    data: [],
    columns: [
      {
        data: "ID",
        name: "ID",
        type: "text",
        readOnly: true,
      },
      {
        data: "CreateTime",
        name: "创建时间",
        type: "text",
        readOnly: true,
      },
      {
        data: "ImageUrl",
        name: "图像",
        mold: "img",
        readOnly: true,
      },
      {
        data: "VideoUrl",
        name: "视频",
        mold: "button",
        items: [
          {
            tip: "下载视频",
            emit: "onDownMp4",
            icon: "el-icon-download",
            circle: true,
          },
          {
            tip: "查看视频",
            emit: "onViewMp4",
            icon: "el-icon-view",
            circle: true,
          }
        ],
      },
    ],
  };

  onDownMp4(e: any) {
    console.log(e);
    NProgress.start();
    downloadFile('get','/big_buck_bunny.mp4','','test.mp4')
    .finally(()=>{
      NProgress.done();
    });
  }

  onViewMp4(e:any) {
    window.open("http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4");
  }

  formatDateTime = function (date: any) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    var h = date.getHours();
    h = h < 10 ? "0" + h : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    var second = date.getSeconds();
    second = second < 10 ? "0" + second : second;
    return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
  };
  async queryList(pageNum?: any) {
    this.loading = true;
    this.query.pageNum = pageNum ? pageNum : 1;
    await api
      .GetBridDetectList({
        data: {
          Page: {
            PageNum: this.query.pageNum,
            PerNum: this.query.pageSize,
          },
          Query: {
            CompanyID: getStorage('loginInfo').CompanyID,
            EquipKey: process.env.VUE_APP_EQUIP,
          },
        },
      })
      .then((data: any) => {
        this.list.data = data.result.Query;
        this.list.TotalCount = data.result.Page.all_count;
        this.list.data.forEach((item: any) => {
          item.ImageUrl = process.env.VUE_APP_URL + "/" + item.ImageUrl;
          item.CreateTime = this.formatDateTime(new Date(item.CreateTime));
        });
        this.settings.data = this.list.data;
      })
      .finally(() => {
        this.loading = false;
      });
  }
  mounted() {
    this.queryList();
  }
}
</script>

<style scoped lang="scss">
.information {
  .i-header {
    height: 160px;
    display: flex;
    padding-bottom: 20px;

    > div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;

      &:not(:last-child)::before {
        content: "";
        width: 1px;
        height: 50%;
        background-color: $form-bd;
        position: absolute;
        top: 25%;
        right: 0px;
      }

      &:nth-of-type(1) {
        label {
          color: $warning;
        }
      }

      &:nth-of-type(2) {
        label {
          color: $primary;
        }
      }

      &:nth-of-type(3) {
        label {
          color: $success;
        }
      }

      label {
        font-size: 36px;
        font-weight: bold;
      }
    }
  }
}
</style>
