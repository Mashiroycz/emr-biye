<template>
  <div class="patientMsg-main-model">
    <el-card class="box-card">
      <div class="img-header"></div>
    </el-card>
    <el-card class="box-card">
      <el-button
        style="float: right;"
        icon="el-icon-edit-outline"
        size="mini"
        @click="dialogVisible = true">修改</el-button>
      <p style="font-weight:600;margin-bottom:5px;">个人信息</p>
      <div class="msg-item"><span class="msg-tip">姓名：</span><span class="msg-tip2">{{myMsg.name}}</span></div>
      <div class="msg-item"><span class="msg-tip">手机号：</span><span class="msg-tip2">{{myMsg.phoneNumber}}</span></div>
      <div class="msg-item"><span class="msg-tip">身份证号：</span><span class="msg-tip2">{{myMsg.identity}}</span></div>
      <div class="msg-item"><span class="msg-tip">登录密码：</span><span class="msg-tip2">******</span></div>
    </el-card>
    <el-card class="box-card">
    <div v-if="isLogin">
      <p style="font-weight:600;margin-bottom:5px;">诊疗记录</p>
      <el-table
        :data="showList"
        class="show-table">
        <el-table-column prop="medID" label="medID"></el-table-column>
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
        <el-table-column label="医院地址">
          <template slot-scope="scope">
            <div>{{scope.row.hosMsg.hosAddress}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-view"
              size="mini"
              circle
              @click="handleView(scope.row.medID)"></el-button>
            <el-button
              icon="el-icon-download"
              size="mini"
              type="success"
              circle
              @click="handleDownload(scope.row.medID)"></el-button>
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
    </el-card>
    <el-dialog
      title="编辑个人信息"
      :visible.sync="dialogVisible"
      width="30%">
      <div>
        <el-form ref="form" :model="myMsg" label-width="100px">
          <el-form-item label="我的姓名:">
            <el-input class="rule-form-input" v-model="myMsg.name"></el-input>
          </el-form-item>
          <el-form-item label="我的身份证号:">
            <el-input class="rule-form-input" v-model="myMsg.identity"></el-input>
          </el-form-item>
          <el-form-item label="我的手机号:">
            <el-input class="rule-form-input" v-model="myMsg.phoneNumber"></el-input>
          </el-form-item>
          <el-form-item label="我的密码:">
            <el-input class="rule-form-input" v-model="myMsg.password"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="病历详情"
      :visible.sync="dialogVisible2"
      width="30%">
      <div>
        <div><span class="text-his">就诊时间：</span>{{formatDate(medDetailObj.time)}}</div>
        <hr>
        <div><span class="text-his">主诉：</span>{{medDetailObj.mainSuit}}</div>
        <div><span class="text-his">现病史：</span>{{medDetailObj.nowHistory}}</div>
        <div><span class="text-his">既往史：</span>{{medDetailObj.pastHistory}}</div>
        <div><span class="text-his">体格检查：</span>{{medDetailObj.health}}</div>
        <div><span class="text-his">ct检查：</span>{{medDetailObj.ct}}</div>
        <div><span class="text-his">诊断：</span>{{medDetailObj.diagnose}}</div>
        <div><span class="text-his">开药：</span>{{medDetailObj.prescription}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'
export default {
  name: 'patientMsg',
  data () {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      myMsg: {},
      medDetailObj: {},
      form: {},
      isLogin: false,
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
  watch: {
  },
  computed: {
    showList () {
      console.log(this.medList, 'com')
      let arrList = this.medList.slice((this.page - 1) * this.limit, this.page * this.limit)
      return arrList
    }
  },
  async created () {
    this.myMsg = this.$store.state.memberMsg
    if (this.$store.state.memberMsg.name) {
      this.isLogin = true
    }
    await this.getList()
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    handleView (id) {
      this.dialogVisible2 = true
      for (let item of this.medList) {
        if (id === item.medID) {
          this.medDetailObj = item
        }
      }
      console.log(id, this.medDetailObj)
    },
    async saveEdit () {
      let item = this.myMsg
      let data = JSON.stringify(item)
      this.$axios.put('/member', data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then((res) => {
        console.log('编辑ge信息保存')
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
        if (that.$store.state.memberMsg.type === '患者') {
          for (let item of that.medList) {
            if (item.mbID === that.$store.state.memberMsg.mbID) {
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
    formatDate (date2) {
      return new Date(parseInt(date2)).toLocaleString().replace(/:\d{1,2}$/, '')
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
    }
  }

}
</script>

<style>
</style>
<style scoped>
.patientMsg-main-model .img-header{
  background: url(../../../static/image/guanliyuan.jpg) no-repeat center;
  height: 200px;
}
.msg-item{
  padding: 5px;
  margin-bottom: 5px;
}
.msg-tip{
  font-size: 14px;
  color: #666;
}
.msg-tip2{
  font-size: 16px;
}
.box-card{
  margin-bottom: 30px;
}
.text-his{
  font-weight: 600;
}
</style>
