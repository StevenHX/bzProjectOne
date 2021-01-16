<template>
  <div class="information">
    <!-- <el-button @click="back">返回</el-button> -->
    <table-list
      ref="tableList"
      :settings="settings"
      :searchSetting="searchSetting"
      :query="query"
      :total="list.TotalCount"
      :pageNum="query.pageNum"
      :loading="loading"
      :searchDevices=devices
      ListId="ID"
      v-model="query.pageSize"
      @on-search-click="queryList"
      @on-change="queryList"
      @on-enter-click="queryList"
      @on-clear-click="queryList"
      @onUpMp4="onUpMp4"
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
import m from 'moment';
import router from '@/router';

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
  devices:any = [];
  searchSetting: any = [
    {
      label: '设备',
      placeholder: '请选择设备',
      type: 'select',
      key: 'EquipKey',
    },
    {
      label: '开始时间',
      placeholder: '请选择时间',
      type: 'time',
      key: 'BeginTime',
    },
    {
      label: '结束时间',
      placeholder: '请选择时间',
      type: 'time',
      key: 'EndTime',
    },
  ];
  query: any = {
    pageNum: 1,
    pageSize: 20,
    EquipKey: '',
    BeginTime: '',
    EndTime: ''
  };

  list: any = {
    data: [],
    TotalCount: 0,
  };
  settings: any = {
    data: [],
    columns: [
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
        data: "HAngle",
        name: "水平角度",
        type: "text",
        readOnly: true,
      },
      {
        data: "VAngle",
        name: "垂直角度",
        type: "text",
        readOnly: true,
      },
      {
        data: "VideoUrl",
        name: "视频",
        mold: "button",
        items: [
          {
            tip: "上传视频",
            emit: "onUpMp4",
            icon: "el-icon-upload2",
            circle: true,
          },
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
      }
    ],
  };

  back(){
    this.$router.back()
  }

  onUpMp4(e:any) {
    api.VideoReqUpload({
      data: {
        ID: e.ID,
        VideoReqStatus:e.VideoReqStatus
      }
    }).then((res:any) =>{
      if (res.result.Result === 1) {
         this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success'
        });
        } else {
          this.$notify.error({
            title: '失败',
            message: '上传失败'
          });
      }
        this.queryList();
    })
    // this.list.data.forEach((item:any) => {
    //   if (item.ID === e.ID) {
    //     item.VideoStatus = -1;
    //     return;
    //   }
    // });
    // this.settings.data = this.list.data;
  }
  onDownMp4(e: any) {
    NProgress.start();
    downloadFile('get',"/" + e.VideoUrl,'', 'Video.mp4')
    .finally(()=>{
      NProgress.done();
    });
  }

  onViewMp4(e:any) {
    // window.open("http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4");
    window.open(process.env.VUE_APP_URL + "/" + e.VideoUrl);
  }

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
            EquipKey: this.query.EquipKey,
            BeginTime: this.query.BeginTime,
            EndTime: this.query.EndTime
          },
        },
      })
      .then((data: any) => {
        this.list.data = data.result.Query;
        this.list.TotalCount = data.result.Page.all_count;
        this.list.data.forEach((item: any) => {
          item.ImageUrl = process.env.VUE_APP_URL + "/" + item.ImageUrl;
          item.CreateTime =  item.CreateTime.replace('T','  ');
        });
        this.settings.data = this.list.data;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  async getDevices() {
    await api.GetEquipList({
        data: {
          Page: {
            PageNum: this.query.pageNum,
            PerNum: 9999,
          },
          Query: {
            CompanyID: getStorage('loginInfo').CompanyID,
            EquipKey: '',
          }
        }
      })
      .then((data: any) => {
        this.devices = data.result.Query;
      });
  }

  async mounted() {
    // this.queryList();
    this.getDevices();
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
