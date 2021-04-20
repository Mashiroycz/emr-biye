<template>
  <div class="wrapper-main hospital-edit-model">
    <div class="wrapper-header">
      <p class="wrapper-title" v-if="this.$store.state.memberMsg.type === '管理员'">添加后台医生</p>
      <p class="wrapper-title" v-if="this.$store.state.memberMsg.type === '后台医生'">添加医生</p>
    </div>
    <div class="wrapper-content">
      <!--基本信息-->
      <el-form class="rule-form" ref="itemInfo" :model="itemInfo" label-width="120px" label-position="right">
        <el-form-item label="医生名称:" prop="name">
          <el-input class="rule-form-input" v-model="itemInfo.name" placeholder="请输入医生名称"></el-input>
        </el-form-item>
        <el-form-item label="所属科室:" v-if="this.$store.state.memberMsg.type === '后台医生'">
          <el-select class="type-select" v-model="selected" @change="updateList()">
            <el-option
              v-for="item in showKsList"
              :key="item.ksID"
              :label="item.ksName"
              :value="item.ksID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属医院:" v-if="this.$store.state.memberMsg.type === '管理员'">
          <el-input class="rule-form-input" v-model="itemInfo.belHos" placeholder="请输入所属医院"></el-input>
        </el-form-item>
        <el-form-item label="身份证号:">
          <el-input class="rule-form-input" v-model="itemInfo.identity" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input class="rule-form-input" v-model="itemInfo.phoneNumber" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="登录密码:">
          <el-input class="rule-form-input" v-model="itemInfo.password" placeholder="请输入登录密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="text">医生创建指南</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 保存 -->
    <div class="show-footerbar-fixed-box">
      <div class="show-footerbar-fixed">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button>取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hospitalEdit',
  props: {
  },
  data () {
    return {
      selected: '',
      itemInfo: {
        name: '',
        belHos: '',
        type: '后台医生',
        identity: '',
        phoneNumber: '',
        password: '',
        currentNum: 0,
        totalNum: 0
      },
      showKsList: []
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    if (this.$store.state.memberMsg.type === '后台医生') {
      this.getKsList()
    }
  },
  methods: {
    async getKsList () {
      let that = this
      let ksList = []
      let tempList = []
      let res = await this.$axios.post('/ks/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        ksList = res.data.data
        console.log(ksList)
        for (let item of res.data.data) {
          if (Number(item.blHosID) === Number(that.$store.state.memberMsg.belHos)) {
            tempList.push(item)
          }
        }
        that.showKsList = tempList
      }).catch((err) => {
        console.log(err)
      })
      console.log(res)
    },
    updateList () {
      this.itemInfo.belKs = this.selected
    },
    save () {
      if (!this.itemInfo.identity || !this.itemInfo.password || !this.itemInfo.phoneNumber || !this.itemInfo.name) {
        this.$message({
          message: '请填写完整',
          type: 'warning'
        })
        return false
      }
      if (this.$store.state.memberMsg.type === '后台医生') {
        this.itemInfo.type = '医生'
        this.itemInfo.totalNum = 5
        this.itemInfo.belHos = this.$store.state.memberMsg.belHos
      }
      let data = JSON.stringify(this.itemInfo)
      this.$axios.post('/member', data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then((res) => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
<style scoped>
/*基本信息*/
.hospital-edit-model{margin-left:30px;}
.hospital-edit-model .wrapper-header{font-size:20px;color:#101001;}
.hospital-edit-model .rule-form .rule-form-input{width:400px;}
.hospital-edit-model .rule-form .rule-form-select{width:250px;}
/*保存*/
.hospital-edit-model .show-footerbar-fixed-box .show-footerbar-fixed{margin-right:15px;}
</style>
