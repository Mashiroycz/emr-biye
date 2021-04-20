<template>
  <div class="wrapper-main">
    <div class="main-nav">
      <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
        <el-menu-item index="0" @click="goTo('')">
          <i class="el-icon-menu"></i>
          <span>首页</span>
        </el-menu-item>
        <!-- 医院管理 -->
        <el-submenu index="1" v-if="this.type === '管理员'">
          <template slot="title"><i class="el-icon-office-building"></i><span>医院管理</span></template>
          <el-menu-item index="1-1" @click="goTo('hospital/hospitalEdit')">
            <span slot="title">添加医院</span>
          </el-menu-item>
          <el-menu-item index="1-2" @click="goTo('hospital/hospitalList')">
            <span slot="title">医院列表</span>
          </el-menu-item>
        </el-submenu>
        <!-- 科室管理 -->
        <el-submenu index="2" v-if="this.type === '后台医生'">
          <template slot="title"><i class="el-icon-house"></i><span>科室管理</span></template>
          <el-menu-item index="2-1" @click="goTo('huya')">
            <span slot="title">创建科室</span>
          </el-menu-item>
          <el-menu-item index="2-2" @click="goTo('ksList')">
            <span slot="title">科室列表</span>
          </el-menu-item>
        </el-submenu>
        <!-- 用户管理 -->
        <el-submenu index="3" v-if="this.type === '管理员'">
          <template slot="title"><i class="el-icon-user"></i><span>用户管理</span></template>
          <el-menu-item index="3-1" @click="goTo('memberEdit')">
            <span slot="title">新增用户</span>
          </el-menu-item>
          <el-menu-item index="3-2" @click="goTo('memberList')">
            <span slot="title">用户列表</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="3" v-if="this.type === '后台医生'">
          <template slot="title"><i class="el-icon-user-solid"></i><span>医生管理</span></template>
          <el-menu-item index="3-1" @click="goTo('memberEdit')">
            <span slot="title">新增医生</span>
          </el-menu-item>
          <el-menu-item index="3-2" @click="goTo('memberList')">
            <span slot="title">医生列表</span>
          </el-menu-item>
        </el-submenu>
        <!-- 病历管理 -->
        <el-menu-item index="4" @click="goTo('medEdit')" v-if="this.type === '医生'">
          <i class="el-icon-edit"></i>
          <span slot="title">添加病历</span>
        </el-menu-item>
        <el-menu-item index="6" v-if="false">
          <i class="el-icon-setting"></i>
          <span slot="title">病历核实归档</span>
        </el-menu-item>
        <el-menu-item index="7" @click="goTo('stentil')" v-if="this.type === '后台医生'">
          <i class="el-icon-document-copy"></i>
          <span slot="title">模板管理</span>
        </el-menu-item>
        <el-menu-item index="8" @click="goTo('medList')" v-if="this.type === '后台医生' || this.type === '管理员'">
          <i class="el-icon-document-copy"></i>
          <span slot="title">病历库</span>
        </el-menu-item>
        <el-menu-item index="9" @click="goTo('medList')" v-if="this.type === '医生'">
          <i class="el-icon-document-copy"></i>
          <span slot="title">诊疗记录</span>
        </el-menu-item>
        <el-menu-item index="10">
          <i class="el-icon-setting"></i>
          <span slot="title">设置</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main-container" :class="{active: isActive}">
      <div class="main-header" :class="loginType" v-if="this.$route.path!=='/medEdit'">
        <div class="header-action"><el-button type="primary" @click="zhangkai()" icon="el-icon-s-unfold" style="margin: 10px"></el-button></div>
        <el-card class="box-card">
          <p class="header-msg1">{{$store.state.hospitalMsg.hosName}}</p>
          <p class="header-msg2">{{$store.state.memberMsg.type}}:{{$store.state.memberMsg.name}}</p>
          <div class="main-header-edit" v-if="this.$route.path==='/medEdit'">
            <el-button type="primary" @click="zhangkai()" icon="el-icon-s-unfold" style="margin: 10px"></el-button>
          </div>
        </el-card>
      </div>
      <div class="img-index-back" v-if="this.$route.path === `/`">
        <el-card class="box-card2">
          <p style="font-weight:600;margin-bottom:5px;">个人信息</p>
          <div class="msg-item"><span class="msg-tip">姓名：</span><span class="msg-tip2">{{myMsg.name}}</span></div>
          <div class="msg-item"><span class="msg-tip">身份：</span><span class="msg-tip2">{{myMsg.type}}</span></div>
          <div class="msg-item"><span class="msg-tip">手机号：</span><span class="msg-tip2">{{myMsg.phoneNumber}}</span></div>
          <div class="msg-item"><span class="msg-tip">身份证号：</span><span class="msg-tip2">{{myMsg.identity}}</span></div>
          <div class="msg-item"><span class="msg-tip">登录密码：</span><span class="msg-tip2">******</span></div>
        </el-card>
      </div>
      <!-- <div class="download" @click="downloadprice()">下载
      </div> -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'
export default {
  data () {
    return {
      myMsg: {},
      dialogVisible: false,
      loginType: {},
      isCollapse: false,
      isActive: false,
      type: '',
      wordData: {
        nickName: '张三'
      }
    }
  },
  created () {
    this.myMsg = this.$store.state.memberMsg
    this.type = this.$store.state.memberMsg.type
    this.loginType = {
      guanliyuan: this.$store.state.memberMsg.type === '管理员',
      houtai: this.$store.state.memberMsg.type === '后台医生',
      yisheng: this.$store.state.memberMsg.type === '医生'
    }
  },
  methods: {
    downloadprice () {
      // let that = this
      // 读取并获得模板文件的二进制内容
      JSZipUtils.getBinaryContent('../../static/model2.docx', function (error, content) {
        // model.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
        // 抛出异常
        if (error) {
          throw error
        }

        // 创建一个PizZip实例，内容为模板的内容
        let zip = new PizZip(content)
        // 创建并加载docxtemplater实例对象
        let doc = new Docxtemplater().loadZip(zip)
        // 设置模板变量的值
        doc.setData({
          nickName: 'ss'
        })

        try {
          // 用模板变量的值替换所有模板变量
          doc.render()
        } catch (error) {
          // 抛出异常
          let e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties
          }
          console.log(JSON.stringify({ error: e }))
          throw error
        }

        // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
        let out = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
        // 将目标文件对象保存为目标类型的文件，并命名
        saveAs(out, '视频参数.docx')
      })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    zhangkai () {
      this.isCollapse = !this.isCollapse
      this.isActive = !this.isActive
    },
    goTo (index) {
      if (this.$route.path === `/${index}`) {
        return false
      }
      this.$router.push('/' + index)
    }
  }
}
</script>

<style>
</style>
<style scoped>
.wrapper-main{
  width: 100%;
  height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}
.el-menu-vertical-demo{
  height: 100%;
}
.main-nav{
  position:fixed;
  top: 0;
  bottom: 0;
  z-index: 99;
}
.main-container{
  margin-left: 200px;
  transition: margin-left 0.5s;
}
.main-container.active{
  margin-left: 60px;
}
.main-container .main-header{
  background:#409EFF url(../../static/image/hos2.jpg) no-repeat center;
  background-size: cover;
  height: 100px;
  padding-top: 10px;
}
.main-container .main-header.guanliyuan{
  background:#409EFF url(../../static/image/guanliyuan.jpg) no-repeat center;
  background-size: cover;
}
.main-container .main-header.yisheng{
  background:#409EFF url(../../static/image/yisheng.jpg) no-repeat center;
  background-size: cover;
}
.main-container .main-header.houtai{
  background:#409EFF url(../../static/image/houtai.png) no-repeat center;
  background-size: cover;
}
.main-container .main-header-edit{
 position: fixed;
 top: 0;
 right: 400px;
 z-index: 99;
}
.main-container .main-header .header-action{
  float: right;
}
.main-container .main-header .header-msg1{
  margin-left: 0px;
  font-size: 20px;
  font-weight: 500;
  color: #303133;
  cursor: pointer;
}
.main-container .main-header .header-msg2{
  margin-left: 200px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
}
.main-container .main-header .box-card{
  width: 400px;
  margin: 0px 500px 0px 10px;
  background-color: rgba(255, 255, 255, 0.5);
}
.wrapper-main .box-card2{
  margin: 10px 50px;
  background-color: rgba(255, 255, 255, 1);
}
.wrapper-main .img-index-back{
  margin: 10px;
  padding-top: 100px;
  /* background: url(../../static/image/hos.jpg) no-repeat center;
  background-size: cover; */
  height: 1000px;
}
.img-index-back .msg-item{
  padding: 5px;
  margin-bottom: 5px;
}
.img-index-back .msg-tip{
  font-size: 14px;
  color: #666;
}
.img-index-back .msg-tip2{
  font-size: 16px;
}
</style>
