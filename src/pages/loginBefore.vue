<template>
 <div class="login">
     <div class="show-header">
     </div>
     <div class="show-content">
         <div class="show-content-header">
            <span class="show-content-tip">注册</span>
         </div>
         <div class="show-form-wrapper">
             <el-form class="show-form" ref="form" :model="form">
                <p class="form-label">手机号</p>
                <el-form-item>
                    <el-input v-model="form.phoneNumber"></el-input>
                </el-form-item>
                <p class="form-label">身份证号</p>
                <el-form-item>
                    <el-input v-model="form.identity"></el-input>
                </el-form-item>
                <p class="form-label">姓名</p>
                <el-form-item>
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <p class="form-label">密码</p>
                <el-form-item>
                    <el-input placeholder="请输入密码" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="btn-login" type="primary" v-on:click="dd">注册</el-button>
                </el-form-item>
             </el-form>
         </div>
     </div>
  </div>
</template>

<script>
export default {
  name: 'loginBefore',
  data () {
    return {
      msg: '登录页面',
      form: {
        name: '',
        belHos: '',
        type: '患者',
        identity: '',
        phoneNumber: '',
        password: '',
        currentNum: 0,
        totalNum: 0
      },
      isTure: false,
      userinfo: {},
      hosinfo: {},
      hospitalList: []
    }
  },
  methods: {
    async dd () {
      if (!this.form.identity) {
        this.$message({
          message: '请填写完整',
          type: 'warning'
        })
        return false
      }
      let data = JSON.stringify(this.form)
      this.$axios.post('/member', data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then((res) => {
        this.$message({
          message: '注册成功，请填写登录',
          type: 'success'
        })
        this.$router.push('login')
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
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
    this.form.phoneNumber = ''
    this.form.password = ''
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
    margin-top: 30px;
    width: 100%;
}
.show-content .el-form-item{
    margin-bottom: 10px;
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
