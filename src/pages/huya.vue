<template>
  <div class="wrapper-main intra-item-edit-model">
    <div class="wrapper-header">
      <p class="wrapper-title">创建科室</p>
    </div>
    <div class="wrapper-content">
      <!--基本信息-->
      <el-form class="rule-form" :model="itemInfo" label-width="120px" label-position="right">
        <el-form-item label="二级科室:" required>
          <el-input class="rule-form-input" v-model="itemInfo.ksName" placeholder="请输入科室名称"></el-input>
        </el-form-item>
        <el-form-item label="一级科室:" required>
          <!-- <el-select class="rule-form-select" v-model="itemInfo.ksType" placeholder="选择/搜索分类">
            <el-option v-for="item in cateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select> -->
          <el-input class="rule-form-input" v-model="itemInfo.ksType" placeholder="请输入科室类别"></el-input>
        </el-form-item>
        <el-form-item label="科室描述:">
          <el-input class="rule-form-input" v-model="itemInfo.ksDescribe" placeholder="请输入科室描述"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="text">科室创建指南</el-button>
        </el-form-item>
      </el-form>
      <!--end基本信息-->

      <!--end门店商品管理-->
    </div>
    <!-- 保存 -->
    <div class="show-footerbar-fixed-box">
      <div class="show-footerbar-fixed">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="test1">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'huya',
  props: {
  },
  data () {
    return {
      itemInfo: {
        ksName: '', // 科室名称
        ksType: '', // 科室类别
        ksDescribe: ''// 科室描述
      },
      cateList: [ // 科室类别
        {
          id: '1',
          name: '内科'
        },
        {
          id: '2',
          name: '外科'
        },
        {
          id: '3',
          name: '辅助科室'
        }
      ],
      price: '', // 批量零售价
      list_hide: '0' // 批量上下架。0：下架；1：上架
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
  },
  methods: {
    test1 () {
      this.$axios.get('https://www.baidu.com/').then(response => {
        if (response.data) {
          console.log(response.data)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    save () {
      // store.state
      console.log(this.$store.state.memberMsg, '属于哪个医院')
      this.itemInfo.blHosID = this.$store.state.memberMsg.belHos ? this.$store.state.memberMsg.belHos : 1
      let data = JSON.stringify(this.itemInfo)
      this.$axios.post('/ks', data, {
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
      // if (this.form.id) {
      //   // 编辑
      //   $.ajax({
      //     url: '/user',
      //     type: 'put',
      //     contentType: 'application/json',
      //     data: data
      //   }).then(res => {
      //     this.dialogVisible = false
      //     this.loadTable(1)
      //   })
      // } else {
      //   // 新增
      //   $.ajax({
      //     url: '/user',
      //     type: 'post',
      //     contentType: 'application/json',
      //     data: data
      //   }).then(res => {
      //     this.dialogVisible = false
      //     this.loadTable(1)
      //   })
      // }
    }
  }
}
</script>
<style scoped>
/*基本信息*/
.intra-item-edit-model{margin-left:30px;}
.intra-item-edit-model .wrapper-header{font-size:20px;color:#101001;}
.intra-item-edit-model .rule-form .rule-form-input{width:400px;}
.intra-item-edit-model .rule-form .rule-form-select{width:250px;}
/*保存*/
.intra-item-edit-model .show-footerbar-fixed-box .show-footerbar-fixed{margin-right:15px;}
</style>
