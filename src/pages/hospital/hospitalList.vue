<template>
  <div class="hospital-list-model">
    <div class="show-header">
      <el-form class="type-form" inline>
        <el-form-item>
          <el-select class="type-select" v-model="selected" @change="updateList(index)">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search_key" @change="updateList()" prefix-icon="el-icon-search" placeholder="搜索"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="showList"
      class="show-table">
      <el-table-column prop="hosID" label="hosID"></el-table-column>
      <el-table-column label="医院名称">
        <template slot-scope="scope">
          <p class="action-icon">{{scope.row.hosName}}</p>
          <p class="action-icon"><el-button type="text">{{scope.row.hosUrl}}</el-button></p>
        </template>
      </el-table-column>
      <el-table-column prop="hosCity" label="城市"></el-table-column>
      <el-table-column prop="hosSection" label="区域"></el-table-column>
      <el-table-column label="医院地址">
        <template slot-scope="scope">
          <span class="action-icon"><el-button type="text">{{scope.row.hosAddress}}</el-button></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <span class="action-icon" @click="edit(scope.row.hosID)"><i class="el-icon-edit-outline"></i></span>
          <span class="action-icon" @click="deleteItem(scope.row.hosID)"><i class="el-icon-delete"></i></span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="编辑医院信息"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="医院名称:">
            <el-input class="rule-form-input" v-model="form.hosName"></el-input>
          </el-form-item>
          <el-form-item label="医院城市:">
            <el-input class="rule-form-input" v-model="form.hosCity"></el-input>
          </el-form-item>
          <el-form-item label="医院区域:">
            <el-input class="rule-form-input" v-model="form.hosSection"></el-input>
          </el-form-item>
          <el-form-item label="医院地址:">
            <el-input class="rule-form-input" v-model="form.hosAddress"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit()">确 定</el-button>
      </span>
    </el-dialog>
    <div class="show-footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  name: 'hospitalList',
  data () {
    return {
      total: 100,
      limit: 5,
      page: 1,
      selected: '',
      search_key: '',
      form: {},
      hospitalList: [],
      dialogVisible: false,
      typeOptions: [
        {
          label: '全部城市',
          value: '全部城市'
        },
        {
          label: '北京',
          value: '北京'
        },
        {
          label: '南京',
          value: '南京'
        },
        {
          label: '上海',
          value: '上海'
        }
      ]
    }
  },
  computed: {
    showList () {
      let arrList = this.hospitalList.slice((this.page - 1) * this.limit, this.page * this.limit)
      return arrList
    }
  },
  watch: {
    // student: {
    //   handler (newV, oldV) {
    //     console.log('new', newV)
    //     console.log('old', oldV)
    //   },
    //   immediate: true,
    //   deep: true
    // },
    // 'student.name' (newV, oldV) {
    //   console.log('new', newV)
    //   console.log('old', oldV)
    // }
  },
  async created () {
    await this.getHospitalList()
  },
  methods: {
    handleSizeChange (val) {
      this.limit = val
    },
    handleCurrentChange (val) {
      this.page = val
    },
    deleteItem (id) {
      console.log('delete' + id)
    },
    handleClose (done) {
      this.$confirm('确认保存？')
        .then(_ => {
          this.saveEdit()
          done()
        })
        .catch(_ => {})
    },
    edit (id) {
      console.log(id)
      this.dialogVisible = true
      for (let item of this.hospitalList) {
        if (Number(item.hosID) === Number(id)) {
          this.form = item
        }
      }
      console.log(this.form)
      console.log(this.form)
    },
    async saveEdit () {
      let item = this.form
      let data = JSON.stringify(item)
      this.$axios.put('/hospital', data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then((res) => {
        console.log('编辑医院信息保存')
        this.drawer = false
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.dialogVisible = false
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },
    async getHospitalList () {
      let that = this
      let res = await this.$axios.post('/hospital/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        that.hospitalList = res.data.data
        that.total = res.data.data.length
      }).catch((err) => {
        console.log(err)
      })
      console.log(res)
    }
  }
}
</script>

<style>
/* .hospital-list-model .el-table .el-table--fit{
  border-top: 1px solid #dedede;
} */
.hospital-list-model .type-form .el-form-item{
  margin-bottom:10px;
}
</style>
<style scoped>
.hospital-list-model{
  height:1000px;
}
.hospital-list-model .show-header{
  height:52px;
  line-height:52px;
  padding-top:10px;
}
.hospital-list-model .show-header .type-form{
  margin-bottom:0;
  margin-left: 20px;
  height:52px;
  float:left;
}
.hospital-list-model .show-header .type-form .type-select{
  width:150px;
}
.hospital-list-model .show-table{
  border-top: 1px solid #dedede;
}
.hospital-list-model .show-table .btn-name{
  color: #409EFF;
  width:250px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.hospital-list-model .show-table .action-icon{
  cursor:pointer;
}
.hospital-list-model .show-footer{
  line-height:40px;
  padding:10px 20px;
}
.hospital-list-model .show-footer .pagination{
  float:right;
}
.hospital-list-model .show-footer .pagination .limit-select{
  width:80px;
}
.hospital-list-model .show-footer .pagination .pagination-action{
  padding:2px 4px 4px 4px;
  cursor:pointer;
  border:1px solid #dedede;
  border-radius:3px;
}
</style>
