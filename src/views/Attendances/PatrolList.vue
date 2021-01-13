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
    >
      <template slot="left">
        <div class="l-t">巡逻配置</div>
      </template>
    </table-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Getter, Action, Mutation, namespace } from 'vuex-class';
import { api } from '@/api';
import _ from 'lodash';

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
        data: 'SortNo',
        name: '序号',
        type: 'text',
        readOnly: true,
      },
      {
        data: 'HAngle',
        name: '水平角度',
        type: 'text',
        readOnly: true,
      },
      {
        data: 'VAngle',
        name: '垂直角度',
        type: 'text',
        readOnly: true,
      },
      {
        data: 'Focal',
        name: '倍率',
        type: 'text',
        readOnly: true,
      },
      {
        data: 'Level',
        name: '训练等级',
        type: 'text',
        readOnly: true,
      },
      // {
      //   data: 'Time',
      //   name: 'Time',
      //   type: 'text',
      //   readOnly: true,
      // }
    ],
  };

  async queryList(pageNum?: any) {
    this.loading = true;
    this.query.pageNum = pageNum ? pageNum : 1;
    await api.GetPatrolList({
        data: {
          Page: {
            PageNum: this.query.pageNum,
            PerNum: this.query.pageSize,
          },
          Query: {
            CompanyID: 1,
            EquipKey: '20210104TST',
          },
        },
      })
      .then((data: any) => {
        this.list.data = data.result.Query;
        this.list.TotalCount = data.result.Page.all_count;
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
