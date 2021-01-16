<template>
  <div class="container">
        <span>iMESX8云监控平台</span>
        <div class="login-input">
            <div class="login-input-item">
                <i class="el-icon-user"></i>
                <el-input v-model="account" placeholder="请输入内容"></el-input>
            </div>
            <div class="login-input-item">
                <i class="el-icon-lock"></i>
                <el-input v-model="passWord" placeholder="请输入内容" type="password" show-password></el-input>
            </div>
        </div>
        <el-button @click="clickLogin">登录</el-button>
            <span v-if="isShowMsg" class="login-input-msg">{{noticeMsg}}</span>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Getter, Action, Mutation, namespace} from 'vuex-class';
    import {api} from '@/api';
    import _ from 'lodash';
    import { getStorage, setStorage} from "@/util/utils";

    @Component({
        name: 'login',
        components: {}
    })

    export default class Devices extends Vue {
        url:string = require('@/assets/images/bg.jpg');
        noticeMsg:any = '';
        isShowMsg:boolean = false;
        account:any = '';
        passWord:any = '';
        clickLogin() {
          this.isShowMsg = false;
          if (!this.account) {
            this.noticeMsg = '用户名为空';
            this.isShowMsg = true;
            return;
          }
          if (!this.passWord) {
            this.noticeMsg = '密码为空';
            this.isShowMsg = true;
            return;
          }
          api.login(this.account,this.passWord)
          .then((res:any) =>{
            setStorage('token',res.result.Token)
            setStorage('loginInfo',res.result)  
            this.$router.replace({path: '/Attendances/EquipList'});
          })
        }
    }
</script>

<style scoped lang="scss">
.container{
    background-image: url('../../assets/images/bg.jpg');
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    span {
        font-size: 25px;
        color: #ffffff;
    }
    .login-input {
        margin-top: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        // height: 100px;
        // justify-content: space-between;
        .login-input-item{
            background: white;
            width: 300px;
            border-radius: 5px;
            height: 45px;
            display: flex;
            align-items: center;
            font-size: 20px;
            padding-left: 5px;
            padding-right: 5px;
            margin-top: 10px;
            ::v-deep .el-input__inner {
                border-color: transparent !important;
            }
        }
        
    }
    .login-input-msg{
          margin-top: 4px;
          color: red;
          font-size: 14px;
        }
    ::v-deep .el-button{
        width: 300px !important;
        height: 40px !important;
        margin-top: 20px;
        background: rgb(114, 169, 221);
        border-color: transparent;
        font-size: 14px;
        color: #f3f3f3;
    }
}
</style>
