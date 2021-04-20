<template>
  <div class="ks-list-model">
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
      :data="ksList"
      class="show-table">
      <el-table-column prop="ksID" label="ID"></el-table-column>
      <el-table-column label="科室名称">
        <template slot-scope="scope">
          <el-popover
            placement="bottom-end"
            width="200"
            trigger="hover"
            :content="scope.row.ksName">
            <p class="btn-name" slot="reference">{{scope.row.ksName}}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="ksType" label="科室类别"></el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <span class="action-icon"><i class="el-icon-edit-outline"></i></span>
          <span class="action-icon" @click="deleteItem(scope.row.ksID)"><i class="el-icon-delete"></i></span>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- <h1>测试页面</h1>
    <div
      class="static"
      v-bind:class="{ 'active': isActive, 'text-danger': hasError }"
    >Mashiroycz
      <div><button @click="backVal('fwfwfwfwf',$event)">获取val值</button></div>
      <div><input type="text" v-model="name">{{name}}</div>
      <div><input type="text" v-bind:value="name" v-on:input="name = $event.target.value">{{name}}</div>
      <msr-input v-model="value2"></msr-input>{{value2}}
      <el-button type="primary">el-button</el-button>
      <msrheader
        v-for="item in titles"
        :title="item"
        :key="item.id"
        @alertb="warn($event)">插槽内容</msrheader>
    </div>
    <div>
      <p>Name: <input type="text" v-model="Name"></p>
      <p><button @click="studentChange">点击改变</button></p>
    </div> -->
  </div>
</template>

<script>
import msrPagination from '../components/msrPagination'

export default {
  name: 'ksList',
  components: {
    msrPagination: msrPagination
  },
  data () {
    return {
      total: 100,
      limit: 5,
      page: 1,
      selected: 0,
      search_key: '',
      ksList: [
        {
          ksID: '0098',
          ksName: '神经内科',
          ksType: '内科'
        }
      ],
      typeOptions: [
        {
          label: '全部科室',
          value: 0
        },
        {
          label: '内科',
          value: 1
        },
        {
          label: '外科',
          value: 2
        },
        {
          label: '辅助科室',
          value: 3
        }
      ]
    }
    // return {
    //   value2: 'ss',
    //   name: 'dd',
    //   isActive: true,
    //   hasError: true,
    //   titles: [
    //     {
    //       id: 1,
    //       titleName: '标题1',
    //       beizhu: 'de1de我是备注1'
    //     },
    //     {
    //       id: 2,
    //       titleName: '标题2',
    //       beizhu: 'de2d2我是备注2'
    //     },
    //     {
    //       id: 3,
    //       titleName: '标题3',
    //       beizhu: 'de3de3我是备注3'
    //     }
    //   ],
    //   Name: 'zhangsan',
    //   student: {
    //     name: 'alex',
    //     age: 18
    //   }
    // }
  },
  computed: {
    showList () {
      let arrList = this.ksList.slice((this.page - 1) * this.limit, this.page * this.limit - 1)
      return arrList
    }
    // currentMin () {
    //   return (this.page - 1) * this.limit + 1
    // },
    // currentMax () {
    //   return this.page * this.limit
    // }
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
  created () {
    this.getList()
  },
  methods: {
    handleSizeChange (val) {
      this.limit = val
      this.updateList()
    },
    handleCurrentChange (val) {
      this.page = val
      this.updateList()
    },
    deleteItem (id) {
      console.log('delete' + id)
    },
    updateList () {
      this.getList()
    },
    getList () {
      let that = this
      this.$axios.get('/ks/page', {
        params: {
          pageNum: this.page,
          pageSize: this.limit
        }
      }
        // headers: {
        //   'Content-Type': 'application/json;charset=UTF-8'
        // }
      ).then((res) => {
        that.ksList = res.data.data.content
        that.total = res.data.data.totalElements
        console.log(res.data.data.content)
      }).catch((err) => {
        console.log(err)
      })
    }
    // studentChange () {
    //   this.student.name = 'rng'
    //   console.log('changestudent')
    // },
    // backVal (message, event) {
    //   if (event) {
    //     event.preventDefault()
    //   }
    //   alert(message)
    // },
    // warn (event) {
    //   alert(event)
    // }
  }
}
</script>

<style>
/* .ks-list-model .el-table .el-table--fit{
  border-top: 1px solid #dedede;
} */
.ks-list-model .type-form .el-form-item{
  margin-bottom:10px;
}
</style>
<style scoped>
.ks-list-model{
  height:1000px;
}
.ks-list-model .show-header{
  height:52px;
  line-height:52px;
  padding-top:10px;
}
.ks-list-model .show-header .type-form{
  margin-bottom:0;
  height:52px;
  float:right;
}
.ks-list-model .show-header .type-form .type-select{
  width:150px;
}
.ks-list-model .show-table{
  border-top: 1px solid #dedede;
}
.ks-list-model .show-table .btn-name{
  color: #409EFF;
  width:250px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.ks-list-model .show-table .action-icon{
  cursor:pointer;
}
.ks-list-model .show-footer{
  line-height:40px;
  padding:10px 20px;
}
.ks-list-model .show-footer .pagination{
  float:right;
}
.ks-list-model .show-footer .pagination .limit-select{
  width:80px;
}
.ks-list-model .show-footer .pagination .pagination-action{
  padding:2px 4px 4px 4px;
  cursor:pointer;
  border:1px solid #dedede;
  border-radius:3px;
}

</style>
