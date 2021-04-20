<template>
  <div class="wrapper-main member-edit-model">
    <div class="wrapper-header">
      <p class="wrapper-title">添加医院</p>
    </div>
    <div class="wrapper-content">
      <!--基本信息-->
      <el-form class="rule-form" ref="itemInfo" :model="itemInfo" label-width="120px" label-position="right">
        <el-form-item label="医院名称:" prop="name">
          <el-input class="rule-form-input" v-model="itemInfo.hosName" placeholder="请输入医院名称"></el-input>
        </el-form-item>
        <el-form-item label="城市和区域:" required>
          <el-cascader
            :options="options"
            @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="医院网址:">
          <el-input class="rule-form-input" v-model="itemInfo.hosUrl" placeholder="请输入医院网址"></el-input>
        </el-form-item>
        <el-form-item label="医院地址:">
          <el-input class="rule-form-input" v-model="itemInfo.hosAddress" placeholder="请输入医院地址, 30字以内"></el-input>
        </el-form-item>
        <el-form-item label="医院等级:" required>
          <el-select class="rule-form-select" v-model="itemInfo.hosLevel" placeholder="选择/搜索分类">
            <el-option v-for="item in cateList" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医院图片:">
          <el-input class="rule-form-input" v-model="itemInfo.hosPicture" placeholder="请输入图片地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="text">医院创建指南</el-button>
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
  name: 'memberEdit',
  props: {
  },
  data () {
    return {
      itemInfo: {
        hosName: '',
        hosCity: '',
        hosAddress: '',
        hosUrl: '',
        hosSection: '',
        hosLevel: '',
        hosPicture: ''
      },
      cateList: [ // 医院级别
        {
          id: '1',
          name: '三级'
        },
        {
          id: '2',
          name: '二级'
        },
        {
          id: '3',
          name: '一级'
        }
      ],
      price: '', // 批量零售价
      list_hide: '0' // 批量上下架。0：下架；1：上架
    }
  },
  computed: {
    options () {
      return this.$store.state.cityList
    }
  },
  watch: {
  },
  created () {
  },
  methods: {
    save () {
      if (!this.itemInfo.hosPicture) {
        this.itemInfo.hosPicture = 'http://img.114yygh.com/image/image-003/23176589027200067.png'
      }
      let data = JSON.stringify(this.itemInfo)
      this.$axios.post('/hospital', data, {
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
    },
    handleChange (value) {
      this.itemInfo.hosCity = value[0]
      this.itemInfo.hosSection = value[1]
      console.log('ddre', value)
    }
  }
}
</script>
<style scoped>
/*基本信息*/
.member-edit-model{margin-left:30px;}
.member-edit-model .wrapper-header{font-size:20px;color:#101001;}
.member-edit-model .rule-form .rule-form-input{width:400px;}
.member-edit-model .rule-form .rule-form-select{width:250px;}
/*保存*/
.member-edit-model .show-footerbar-fixed-box .show-footerbar-fixed{margin-right:15px;}
</style>
