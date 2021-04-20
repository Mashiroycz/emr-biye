<template>
  <div class="member-list-model">
    <div class="show-header">
      <el-form class="type-form" inline>
        <el-form-item>
          <el-select class="type-select" v-model="selected" @change="updateList()">
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
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="type" label="身份类别"></el-table-column>
      <el-table-column label="所属医院">
        <template slot-scope="scope">
          <span class="action-icon"><el-button type="text">{{scope.row.belHos}}</el-button></span>
        </template>
      </el-table-column>
      <el-table-column prop="identity" label="身份证号"></el-table-column>
      <el-table-column prop="phoneNumber" label="联系方式"></el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <span class="action-icon"><i class="el-icon-edit-outline"></i></span>
          <span class="action-icon" @click="deleteItem(scope.row.mbID)"><i class="el-icon-delete"></i></span>
        </template>
      </el-table-column>
    </el-table>
    <div class="show-footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5, 2, 10, 15]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  name: 'memberList',
  data () {
    return {
      total: 100,
      limit: 5,
      page: 1,
      selected: '',
      search_key: '',
      memberList: [],
      typeOptions: [
        {
          label: '全部用户',
          value: '全部用户'
        },
        {
          label: '管理员',
          value: '管理员'
        },
        {
          label: '医生',
          value: '医生'
        },
        {
          label: '后台医生',
          value: '后台医生'
        },
        {
          label: '患者',
          value: '患者'
        }
      ]
    }
  },
  computed: {
    showList () {
      let arrList = this.memberList.slice((this.page - 1) * this.limit, this.page * this.limit)
      return arrList
    }
  },
  watch: {
  },
  created () {
    if (this.$store.state.memberMsg.type === '管理员') {
      this.getList()
    }
    if (this.$store.state.memberMsg.type === '后台医生') {
      this.updateList()
    }
  },
  methods: {
    handleSizeChange (val) {
      this.limit = val
      // this.updateList()
    },
    handleCurrentChange (val) {
      this.page = val
      // this.updateList()
    },
    deleteItem (id) {
      console.log('delete' + id)
    },
    async updateList () {
      await this.getList()
      let newMemberList = []
      console.log(this.selected)
      if (this.$store.state.memberMsg.type === '后台医生') {
        for (let item of this.memberList) {
          if (item.belHos === this.$store.state.memberMsg.belHos) {
            newMemberList.push(item)
          }
        }
      }
      if (this.selected !== '全部用户') {
        for (let item of this.memberList) {
          if (item.type === this.selected) {
            newMemberList.push(item)
          }
        }
        this.total = newMemberList.length
        this.memberList = newMemberList
      }
    },
    async getList () {
      let that = this
      let res = await this.$axios.post('/member/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        that.memberList = res.data.data
        that.total = res.data.data.length
      }).catch((err) => {
        console.log(err)
      })
      console.log(res)
    },
    getList2 () {
      let that = this
      this.$axios.get('/member/page', {
        params: {
          pageNum: this.page,
          pageSize: this.limit,
          name: '殷承宗'
        }
      }
      ).then((res) => {
        that.memberList = res.data.data.content
        that.total = res.data.data.totalElements
        console.log(res.data.data.content)
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style>
.member-list-model .type-form .el-form-item{
  margin-bottom:10px;
}
</style>
<style scoped>
.member-list-model{
  height:1000px;
}
.member-list-model .show-header{
  height:52px;
  line-height:52px;
  padding-top:10px;
}
.member-list-model .show-header .type-form{
  margin-bottom:0;
  margin-left: 20px;
  height:52px;
  float:left;
}
.member-list-model .show-header .type-form .type-select{
  width:150px;
}
.member-list-model .show-table{
  border-top: 1px solid #dedede;
}
.member-list-model .show-table .btn-name{
  color: #409EFF;
  width:250px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.member-list-model .show-table .action-icon{
  cursor:pointer;
}
.member-list-model .show-footer{
  line-height:40px;
  padding:10px 20px;
}
.member-list-model .show-footer .pagination{
  float:right;
}
.member-list-model .show-footer .pagination .limit-select{
  width:80px;
}
.member-list-model .show-footer .pagination .pagination-action{
  padding:2px 4px 4px 4px;
  cursor:pointer;
  border:1px solid #dedede;
  border-radius:3px;
}
</style>
