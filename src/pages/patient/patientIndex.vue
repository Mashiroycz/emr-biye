<template>
  <div class="patient-index-model">
    <!-- 顶部固定窗口，登录人信息 -->
    <div class="top-wrapper">
      <div class="header-content">
        <img class="img-header" src="https://img.114yygh.com/static/web/logo.png" alt="">
        <div class="text-title">统一挂号平台</div>
        <div class="search-section" :class="{'is_fixed' : isFixed}">
          <div><el-input class="msr-input" v-model="searchKey" placeholder="请输入医院名称" prefix-icon="el-icon-search"></el-input></div>
        </div>
        <div class="header-action" v-if="$store.state.memberMsg.type !== '患者'"><el-button type="text" @click="goTo()">登录注册</el-button></div>
        <div class="header-action" v-if="$store.state.memberMsg.type === '患者'">
          <el-dropdown>
            <span class="el-dropdown-link">
              您好，{{$store.state.memberMsg.name}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="goTo2()">我的病历</el-dropdown-item>
              <el-dropdown-item @click.native="DelMsg()">信息修改</el-dropdown-item>
              <el-dropdown-item  @click.native="DelMsg()" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

      </div>
    </div>
    <div class="content-wrapper">
      <router-view @msremit="changeFixed"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'patientIndex',
  data () {
    return {
      searchKey: '',
      isSelect: false,
      clickIndex: 0,
      clickIndex2: 0,
      ded: 1,
      isFixed: false // 滑动框事件触发
    }
  },
  created () {

  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    changeFixed (e) {
      this.isFixed = e
    },
    DelMsg () {
      console.log(this.$store.state.memberMsg)
      this.$store.commit('setUserinfo', {}) // 给空对象，清空个人信息
      console.log(this.$store.state.memberMsg)
    },
    goTo () {
      this.$router.push('/login')
    },
    goTo2 () {
      this.$router.push('/patient/patientMsg')
    }
  }

}
</script>

<style>
.patient-index-model .search-section .msr-input .el-input__inner{
  border-bottom: 1px solid #DCDFE6;
  border-left: none;
  border-right: none;
  border-top: none;
  border-radius: 0;
  transition: border-color 1s;
  text-align: center;
}
.patient-index-model .search-section .msr-input .el-input__inner:hover{
  border-color: #c0c4cc;
  outline: 0;
}
.patient-index-model .search-section .msr-input .el-input__inner:focus{
  border-color: #409EFF;
  outline: 0;
}
</style>
<style scoped>
.patient-index-model{
  position: relative;
}
.patient-index-model .top-wrapper{
  background-color: #ffffff;
  position: fixed;
  top: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 10px 0;
  z-index: 99;
  box-shadow: -1px -1px 10px #888888;
}
.patient-index-model .top-wrapper .header-content{
  width: 1200px;
  margin: 0 auto;
}
.patient-index-model .top-wrapper .header-content .img-header{
  float: left;
  width: 50px;
  height: 50px;
  margin-right: 15px;
}
.patient-index-model .top-wrapper .header-content .text-title{
  float: left;
  font-size: 22px;
  color: #409EFF;
  font-weight: 500;
}
.patient-index-model .top-wrapper .search-section{
  text-align: center;
  float: left;
  margin-left: 150px;
  display: none;
}
.patient-index-model .top-wrapper .search-section.is_fixed{
  display: inline;
}
.patient-index-model .top-wrapper .search-section .msr-input{
  width: 500px;
}
.header-action{
  float: right;
}
.patient-index-model .content-wrapper{
  margin-top: 70px;
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
</style>
