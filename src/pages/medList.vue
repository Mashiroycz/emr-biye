<template>
  <div class="med-list-model">
    <div class="show-header">
      <el-form class="type-form" inline>
        <el-form-item>
          <el-select class="type-select" v-model="selected" @change="updateList(index)">
            <el-option
              v-for="item in ksOptions"
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
      <el-table-column prop="medID" label="medID"></el-table-column>
      <el-table-column prop="patitentMsg.name" label="病人名称"></el-table-column>
      <el-table-column label="医生名称">
        <template slot-scope="scope">
          <div>{{scope.row.doctorMsg.name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="病历记录时间">
        <template slot-scope="scope">
          <div>{{scope.row.createTime}}</div>
        </template>
      </el-table-column>
      <el-table-column label="科室名称/科室类别">
        <template slot-scope="scope">
          <div>{{scope.row.ksMsg.ksName}}/{{scope.row.ksMsg.ksType}}</div>
        </template>
      </el-table-column>
      <el-table-column label="医院名称">
        <template slot-scope="scope">
          <div>{{scope.row.hosMsg.hosName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="审查归档">
        <template slot-scope="scope">
          <el-switch
            v-model='scope.row.isCheck'
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="true"
            inactive-value="false"
            @change=changeSwitch(scope.row.medID,scope.row.isCheck)
            v-if="$store.state.memberMsg.type==='后台医生' || $store.state.memberMsg.type==='管理员'">
          </el-switch>
          <div style="color: red;" v-if="$store.state.memberMsg.type==='医生' && scope.row.isCheck === 'false'">审核中</div>
          <div style="color: #67C23A;" v-if="$store.state.memberMsg.type==='医生' && scope.row.isCheck === 'true'">已归档</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit-outline"
            size="mini"
            circle
            @click="handleEdit(scope.row.medID)"></el-button>
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            circle
            @click="handleDelete(scope.row.medID)"></el-button>
          <el-button
            icon="el-icon-download"
            size="mini"
            type="success"
            circle
            @click="handleDownload(scope.row.medID)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      class="drawer"
      title="病历详情"
      :visible.sync="drawer"
      :direction="direction"
      size="50%"
      :before-close="handleClose">
      <div class="content">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="主诉:">
            <el-input type="textarea" class="rule-form-input" v-model="form.mainSuit"></el-input>
          </el-form-item>
          <el-form-item label="现病史:">
            <el-input type="textarea" class="rule-form-input" v-model="form.nowHistory"></el-input>
          </el-form-item>
          <el-form-item label="既往史:">
            <el-input type="textarea" class="rule-form-input" v-model="form.pastHistory"></el-input>
          </el-form-item>
          <el-form-item label="家族史:">
            <el-input type="textarea" class="rule-form-input" v-model="form.famHistory"></el-input>
          </el-form-item>
          <el-form-item label="体格检查:">
            <el-input type="textarea" class="rule-form-input" v-model="form.health"></el-input>
          </el-form-item>
          <el-form-item label="ct检查:">
            <el-input type="textarea" class="rule-form-input" v-model="form.ct"></el-input>
          </el-form-item>
          <el-form-item label="症状:">
            <el-input type="textarea" class="rule-form-input" v-model="form.symptom"></el-input>
          </el-form-item>
          <el-form-item label="诊断:">
            <el-input type="textarea" class="rule-form-input" v-model="form.diagnose"></el-input>
          </el-form-item>
          <el-form-item label="处理意见:">
            <el-input type="textarea" class="rule-form-input" v-model="form.disposed"></el-input>
          </el-form-item>
          <el-form-item label="开药:">
            <el-input type="textarea" class="rule-form-input" v-model="form.prescription"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveEdit()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
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
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'
export default {
  name: 'medList',
  data () {
    return {
      form: {},
      drawer: false,
      direction: 'ltr',
      total: 100,
      limit: 5,
      page: 1,
      selected: '',
      search_key: '',
      memberList: [],
      hospitalList: [],
      ksList: [],
      celist: [
        {
          medID: 1
        },
        {
          medID: 2
        }
      ],
      medList: [],
      oldmedList: [],
      orginalList: [], // 原始数据.为什么变了？
      ksOptions: [
        {
          label: '全部科室',
          value: '全部科室'
        },
        {
          label: '内科',
          value: '内科'
        },
        {
          label: '外科',
          value: '外科'
        },
        {
          label: '其他科室',
          value: '其他科室'
        }
      ]
    }
  },
  computed: {
    showList () {
      console.log(this.medList, 'com')
      let arrList = this.medList.slice((this.page - 1) * this.limit, this.page * this.limit)
      return arrList
    }
  },
  watch: {
  },
  async created () {
    await this.getList()
    console.log(this.medList, 'now')
    // this.medList = this.$store.state.mydata.medicalRecordList
  },
  methods: {
    async changeSwitch (index, infer) {
      let obj = {}
      console.log('a', index, infer)
      let res = await this.$axios.post('/medical/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }})
      console.log(res, 'swicth')
      if (Number(res.data.code) === 0) {
        for (let item of res.data.data) {
          if (item.medID === index) {
            obj = item
          }
        }
        obj.isCheck = String(infer)
        let data = JSON.stringify(obj)
        this.$axios.put('/medical', data, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((res) => {
          console.log('审核事件', infer)
          if (infer === 'false') {
            this.$message({
              message: '已经取消审核',
              type: 'warning'
            })
            console.log('审核事件2', infer)
            return false
          }
          this.$message({
            message: '审核成功',
            type: 'success'
          })
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
        console.log(obj)
      }
    },
    saveEdit () {
      let item = this.form
      console.log()
      if (item.isCheck === 'true') {
        this.$message({
          message: '已经归档，不可修改',
          type: 'warning'
        })
        return false
      }
      delete item.createTime
      delete item.doctorMsg
      delete item.hosMsg
      delete item.ksMsg
      delete item.patitentMsg
      let data = JSON.stringify(item)
      this.$axios.put('/medical', data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then((res) => {
        console.log('编辑病历事件触发')
        this.drawer = false
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },
    handleDownload (medID) {
      // let that = this
      // 读取并获得模板文件的二进制内容
      let form = {}
      for (let item of this.medList) {
        if (item.medID === medID) {
          form = item
        }
      }
      form.hosName = form.hosMsg.hosName
      let patient = this.idCard(form.patitentMsg.identity)
      form.age = patient.age
      form.xin = patient.xin
      form.name = form.patitentMsg.name
      console.log(form.patitentMsg, 'fefe')
      // form.name = form.patientMsg.name
      form.docName = form.doctorMsg.name
      form.ksName = form.ksMsg.ksName
      form.time = this.formatDate(form.time)
      for (let i in form) {
        if (!form[i]) {
          form[i] = '无'
        }
        console.log(i, form[i])
      }
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
          ...form
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
        saveAs(out, '电子病历.docx')
      })
    },
    async deleteByID (id) {
      let res = await this.$axios.get('/medical/del', {
        params: {
          medID: id
        }
      })
      console.log(res)
    },
    async handleDelete (medID) {
      let that = this
      this.$confirm('此操作删除此病历, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.deleteByID(medID)
        console.log('delelte')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleEdit (medID) {
      this.drawer = true
      console.log(medID)
      for (let item of this.medList) {
        if (item.medID === medID) {
          this.form = item
        }
      }
      console.log(this.form)
    },
    handleClose () {
      console.log('弹窗close')
      this.drawer = false
    },
    handleSizeChange (val) {
      this.limit = val
    },
    handleCurrentChange (val) {
      this.page = val
    },
    deleteItem (id) {
      console.log('delete' + id)
    },
    updateList () {
    },
    async getList () {
      let that = this
      let res = await this.$axios.post('/medical/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }})
      console.log(res, '获取了病历数据')
      if (Number(res.data.code) === 0) {
        console.log('预期顺序-1')
        that.orginalList = res.data.data
        that.oldmedList = res.data.data
        console.log('预期顺序0', that.orginalList)
        that.total = res.data.data.length
        await this.getDataAll()
        that.medList = await this.passDataFinal()
        // 在这里判断登录医生权限，来显示表格内容
        let quanList = []
        if (that.$store.state.memberMsg.type === '医生') {
          for (let item of that.medList) {
            if (item.doctorID === that.$store.state.memberMsg.mbID) {
              quanList.push(item)
            }
          }
          that.medList = quanList
          that.total = quanList.length
        }
        if (that.$store.state.memberMsg.type === '后台医生') {
          for (let item of that.medList) {
            if (item.hosID === that.$store.state.hospitalMsg.hosID) {
              quanList.push(item)
            }
          }
          that.medList = quanList
          that.total = quanList.length
        }
        console.log('预期顺序1', that.$store.state.memberMsg.type)
      }
    },
    async passDataFinal () {
      console.time('a')
      let arr = this.oldmedList
      for (let i of this.hospitalList) {
        for (let j of arr) {
          if (i.hosID === j.hosID) {
            j.hosMsg = i
          }
        }
      }
      for (let i of this.memberList) {
        for (let j of arr) {
          if (i.mbID === j.mbID) {
            j.patitentMsg = i
          }
        }
      }
      for (let i of this.memberList) {
        for (let j of arr) {
          if (i.mbID === j.doctorID) {
            j.doctorMsg = i
          }
        }
      }
      for (let i of this.ksList) {
        for (let j of arr) {
          if (i.ksID === j.ksID) {
            j.ksMsg = i
          }
        }
      }
      for (let j of arr) {
        console.log(j.time)
        j.createTime = this.formatDate(j.time)
      }
      console.timeEnd('a')
      console.log(arr, '最终数组')
      return arr
    },
    // 写个方法获取所有信息存在一个对象里
    async getDataAll () {
      // 先塞病人信息吧
      let that = this
      let res = await this.$axios.post('/member/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        that.memberList = res.data.data
      }).catch((err) => {
        console.log(err)
      })
      console.log(res)
      let res2 = await this.$axios.post('/hospital/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        that.hospitalList = res.data.data
      }).catch((err) => {
        console.log(err)
      })
      console.log(res2)
      let res3 = await this.$axios.post('/ks/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        that.ksList = res.data.data
      }).catch((err) => {
        console.log(err)
      })
      console.log(res3)
      /*
      medID
      医院信息塞在病历里，病人信息也塞进去，再塞医生信息
      */
    },
    idCard (cardID) {
      // 获取输入身份证号码
      let cardNum = cardID
      let obj = {}
      // 获取出生日期
      // cardNum.substring(6, 10) + '-' + cardNum.substring(10, 12) + '-' + cardNum.substring(12, 14)
      // 获取性别
      if (parseInt(cardNum.substr(16, 1)) % 2 === 1) {
        obj.xin = '男'
      } else {
        obj.xin = '女'
      }
      // 获取年龄
      let myDate = new Date()
      let month = myDate.getMonth() + 1
      let day = myDate.getDate()
      let age = myDate.getFullYear() - cardNum.substring(6, 10) - 1
      if (
        cardNum.substring(10, 12) < month ||
        (Number(cardNum.substring(10, 12)) === month && cardNum.substring(12, 14) <= day)
      ) {
        age++
      }
      // 年龄 age
      obj.age = age
      console.log(obj)
      return obj
    },
    formatDate (date2) {
      // let date = new Date(date2)
      // console.log(date)
      // let YY = date.getFullYear() + '-'
      // let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      // let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
      // let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      // let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      // let ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      // return YY + MM + DD + '' + hh + mm + ss
      return new Date(parseInt(date2)).toLocaleString().replace(/:\d{1,2}$/, '')
    }
  }
}
</script>

<style>
/* .med-list-model .el-table .el-table--fit{
  border-top: 1px solid #dedede;
} */
.med-list-model .type-form .el-form-item{
  margin-bottom:10px;
}
.med-list-model .el-drawer{
  overflow: auto;
}
</style>
<style scoped>
.med-list-model{
  height:1000px;
}
.med-list-model .show-header{
  height:52px;
  line-height:52px;
  padding-top:10px;
}
.med-list-model .show-header .type-form{
  margin-bottom:0;
  margin-left: 20px;
  height:52px;
  float:left;
}
.med-list-model .show-header .type-form .type-select{
  width:150px;
}
.med-list-model .show-table{
  border-top: 1px solid #dedede;
}
.med-list-model .show-table .btn-name{
  color: #409EFF;
  width:250px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.med-list-model .show-table .action-icon{
  cursor:pointer;
}
.med-list-model .show-footer{
  line-height:40px;
  padding:10px 20px;
}
.med-list-model .show-footer .pagination{
  float:right;
}
.med-list-model .show-footer .pagination .limit-select{
  width:80px;
}
.med-list-model .show-footer .pagination .pagination-action{
  padding:2px 4px 4px 4px;
  cursor:pointer;
  border:1px solid #dedede;
  border-radius:3px;
}
</style>
