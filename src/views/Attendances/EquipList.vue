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
      v-model="query.pageSize"
      @on-search-click="queryList"
      @on-change="queryList"
      @on-enter-click="queryList"
      @on-clear-click="queryList"
      @onStartMachine="onStartMachine"
      @onStopMachine="onStopMachine"
    >
      <template slot="left">
        <div class="l-t">设备管理</div>
      </template>
    </table-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Getter, Action, Mutation, namespace } from 'vuex-class';
import { api } from '@/api';
import _ from 'lodash';
import { getStorage, setStorage} from "@/util/utils";
import m from 'moment';

@Component({
  name: 'Devices',
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
        data: 'EquipName',
        name: '设备名称',
        type: 'text',
        readOnly: true,
      },
      {
        data: 'Model',
        name: '型号',
        type: 'text',
        readOnly: true,
      },
      {
        data: 'EquipKey',
        name: '设备key',
        type: 'text',
        readOnly: true,
      },
      {
        data: 'EquipRunStatus',
        name: '设备运行状态',
        type: 'text',
        readOnly: true,
      },
      {
        data: 'EquipReqStatus',
        name: '设备指令状态',
        type: 'text',
        readOnly: true,
      },
      {
        data: 'HeartInfo',
        name: '设备心跳信息',
        type: 'text',
        readOnly: true,
      },
      {
        data: 'HeartTime',
        name: '最近心跳时间',
        type: 'text',
        readOnly: true,
      },
      {
        data: "action",
        name: "操作",
        mold: "button",
        items: [
          {
            tip: "启动",
            emit: "onStartMachine",
            icon: "el-icon-video-play",
            circle: true,
          },
          {
            tip: "停止",
            emit: "onStopMachine",
            icon: "el-icon-video-pause",
            circle: true,
          }
        ],
      },
      // {
      //   data: "action2",
      //   name: "驱鸟历史",
      //   mold: "button",
      //   items: [
      //     {
      //       tip: "查看驱鸟历史",
      //       emit: "onOpenHistory",
      //       icon: "el-icon-pie-chart",
      //       circle: true,
      //     }
      //   ],
      // },
      // {
      //   data: "action3",
      //   name: "巡逻配置",
      //   mold: "button",
      //   items: [
      //     {
      //       tip: "查看巡逻配置",
      //       emit: "onOpenPatrol",
      //       icon: "el-icon-s-operation",
      //       circle: true,
      //     }
      //   ],
      // }
    ],
  };

  async queryList(pageNum?: any) {
    this.loading = true;
    this.query.pageNum = pageNum ? pageNum : 1;
    await api.GetEquipList({
        data: {
          Page: {
            PageNum: this.query.pageNum,
            PerNum: this.query.pageSize,
          },
          Query: {
            CompanyID: getStorage('loginInfo').CompanyID,
            EquipKey: '',
          }
        }
      })
      .then((data: any) => {
        this.list.data = data.result.Query;
        this.list.data.forEach((item:any) => {
          item.HeartTime =  item.HeartTime.replace('T','  ');
        });
        this.list.TotalCount = data.result.Page.all_count;
        this.settings.data = this.list.data;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onStartMachine(e:any) {
    this.SetEquipStatus(100)
  }
  onStopMachine(e:any) {
    this.SetEquipStatus(400)
  }

  onOpenHistory(e:any) {
    this.$router.push({path: '/Attendances/BridDetectList',query: { EquipKey: e.EquipKey }});
  }

  onOpenPatrol(e:any) {
     this.$router.push({path: '/Attendances/PatrolList',query: { EquipKey: e.EquipKey }});
  }
  SetEquipStatus(status:any) {
     api.SetEquipStatus({
      data: {
        RunStatus: status,
        EquipKey: process.env.VUE_APP_EQUIP
      }
    }).then((res:any) =>{
      if (res.result.Result === 1) {
         this.$notify({
          title: '成功',
          message: status === 100 ? '启动成功':'停止成功',
          type: 'success'
        });
        } else {
          this.$notify.error({
            title: '失败',
            message: status === 100 ? '启动失败':'停止失败'
          });
      }
        this.queryList();
    })
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
        content: '';
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
