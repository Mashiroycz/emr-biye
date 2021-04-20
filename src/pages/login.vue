<template>
 <div class="login">
     <div class="show-header">
     </div>
     <div class="show-content">
         <div class="show-content-header">
            <span class="show-content-tip">登录</span><span class="show-content-tip2" @click="goTo('loginBefore')">还没有账号?</span>
         </div>
         <div class="show-form-wrapper">
             <el-form class="show-form" ref="form" :model="form">
                <p class="form-label">手机号</p>
                <el-form-item>
                    <el-input v-model="form.phoneNumber"></el-input>
                </el-form-item>
                <p class="form-label">密码</p>
                <el-form-item>
                    <el-input placeholder="请输入密码" v-model="form.password" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-radio v-model="form.radio" label="患者">患者</el-radio>
                    <el-radio v-model="form.radio" label="医生">医生</el-radio>
                    <el-radio v-model="form.radio" label="后台医生">后台医生</el-radio>
                    <el-radio v-model="form.radio" label="管理员">管理员</el-radio>
                </el-form-item>
                <el-form-item>
                    <el-button class="btn-login" type="primary" v-on:click="dd">登录</el-button>
                </el-form-item>
             </el-form>
         </div>
     </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      msg: '登录页面',
      form: {
        phoneNumber: '',
        password: '',
        radio: '患者'
      },
      isTure: false,
      memberType: '患者',
      userinfo: {},
      hosinfo: {},
      hospitalList: []
    }
  },
  methods: {
    async dd () {
      // 医生登录验证
      // 数据库查询手机号信息
      let that = this
      // 登录前清空信息
      this.$store.commit('setHosinfo', {})
      this.$store.commit('setUserinfo', {})
      await this.getList()
      console.log('test输出储存信息', this.$store.state.memberMsg)
      if (that.isTure && String(that.form.radio) === this.memberType) {
        that.$message({
          message: `欢迎${this.$store.state.memberMsg.type}--${this.$store.state.memberMsg.name},登录成功`,
          type: 'success'
        })
        if (this.$store.state.memberMsg.type === '患者') {
          that.$router.push('/patient/register')
        } else {
          that.$router.push('/')
        }
      } else {
        that.$message({
          message: '登录失败',
          type: 'error'
        })
      }
    },
    async getList () {
      let that = this
      let memberList = []
      await this.getHospitalList()
      let res = await this.$axios.post('/member/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        memberList = res.data.data
        if (that.checkLogin(memberList)) {
          console.log('....', that.isTure)
          that.isTure = true
          console.log('....', that.isTure)
        }
      }).catch((err) => {
        console.log(err)
      })
      console.log(res)
    },
    async getHospitalList () {
      let res = await this.$axios.post('/hospital/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        this.hospitalList = res.data.data
      }).catch((err) => {
        console.log(err)
      })
      console.log(res)
    },
    checkLogin (memberlist) {
      let isHas = false
      for (let member of memberlist) {
        if (member.phoneNumber === this.form.phoneNumber) {
          console.log(member.password, '输出成员密码,输出类型', member.type)
          if (member.password === this.form.password) { // 密码匹配后储存信息
            this.userinfo = member // 储存成员信息（对象）
            this.memberType = member.type
            this.$store.commit('setUserinfo', this.userinfo)
            if (this.memberType === '医生' || this.memberType === '后台医生') { // 是医生或者后台医生就把医院信息储存进vuex
              for (let item of this.hospitalList) {
                // console.log('测试输出医生信息', item.hosID)
                if (item.hosID === Number(this.userinfo.belHos)) {
                  this.hosinfo = item
                }
              }
              this.$store.commit('setHosinfo', this.hosinfo)
            }
            isHas = true
          }
          break
        }
      }
      if (isHas) {
        console.log('成功查找到成员,密码正确')
        return true
      } else {
        console.log('无此成员')
        return false
      }
    },
    goTo (index) {
      if (this.$route.path === `/${index}`) {
        return false
      }
      this.$router.push('/' + index)
    }
  },
  mounted () {
    document.querySelector('body').setAttribute('style', 'background-color:#f7f7f7')
  },
  beforeDestroy () {
    document.querySelector('body').removeAttribute('style')
  },
  created () {
    console.log('de')
  }
}
</script>

<style scoped>
.login{
    background-color: #f7f7f7;
    height: 100%;
}
.show-header{
    width: 100%;
    height: 150px;
    background-color: #409EFF;
    margin-bottom:40px;
}
.show-content{
    max-width: 375px;
    margin: 0 auto;
    height: 500px;
    border: 1px solid #dedede;
    border-top: 2px solid #409EFF;
    border-radius: 5px;
    background-color:white;
}
.show-content .show-content-header{
    padding: 10px 15px;
    margin-bottom: 25px;
}
.show-content .show-content-header .show-content-tip{
    color: #409EFF;
    font-size: 18px;
    font-weight: 500;
}
.show-content .show-content-header .show-content-tip2{
    float: right;
    font-size: 15px;
    display: block;
    padding-top: 3px;
    color: #026942;
    cursor: pointer;
}
.show-content .btn-login{
    width: 100%;
}
.show-content .el-form-item{
    margin-bottom: 30px;
}
.show-content .show-form-wrapper{
    background-color:white ;
    padding: 10px 15px;
}
.show-form{
    width: 100%;
    max-width: 550px;
    margin: 0 auto 30px;
}
.show-form .form-label{
    font-size: 11px;
    font-weight: 600;
}
</style>
