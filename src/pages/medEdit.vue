<template>
  <div class="medEdit-model">
    <div class="top"></div>
    <div class="right-nav"></div>
    <div class="content">
      <div class="paper">
        <div class="header">
          <p style="margin-bottom:5px">{{this.$store.state.hospitalMsg.hosName}}</p>
          <p style="font-size:15px;margin-bottom:5px">病历</p>
        </div>
        <div class="msg-section">
          <div class="msg-section-p"><p>姓名：{{currentPatient.name ? currentPatient.name : ''}}</p><p>病历号：{{currentPatient.name ? '20212576' : ''}}{{currentPatient.mbID?currentPatient.mbID:''}}</p></div>
          <div class="msg-section-p"><p>性别：{{xin ? xin : ''}}</p><p>科室：{{ksName}}</p></div>
          <div class="msg-section-p"><p>年龄：{{age ? age : ''}}岁</p><p>就诊时间：</p></div>
          <!-- new Date().toLocaleString().substring(0,8) -->
        </div>
        <hr>
        <ul class="main-content">
          <li class="main-li" v-for="(item, index) in medDetailList" :key="index">
            <p class="title-tip" @click="changeInputVisble(index)">{{item.title}}:</p>
            <p @click="changeInputVisble(index)">{{item.content}}</p>
            <el-input
              type="textarea"
              :rows="2"
              v-model="item.content"
              :class="{ visible: item.isActive}"
              @blur="changeInput(index)"></el-input>
          </li>
          <!-- <li class="main-li">
            <p class="title-tip" @click="changeInputVisble()">主诉：</p>
            <p @click="changeInputVisble()">{{msg1}}</p>
            <el-input
              type="textarea"
              :rows="2"
              v-model="msg1"
              :class="{ visible: isActive }"
              @change="changeInput()"></el-input>
          <li class="main-li"><span class="title-tip">现病史：</span>{{masr}}</li>
          <li class="main-li"><span class="title-tip">检查：</span>{{masr}}</li>
          <li class="main-li"><span class="title-tip">症状：</span>{{masr}}</li>
          <li class="main-li"><span class="title-tip">诊断：</span>{{masr}}</li>
          <li class="main-li"><span class="title-tip">处理意见：</span>{{masr}}</li> -->
        </ul>
        <div class="doc-name">签名：{{this.$store.state.memberMsg.name}}</div>
      </div>
    </div>
    <div class="right-content">
      <div class="header-section">
        <el-card class="box-card">
          <!-- <ul>
            <li v-for="(item, index) in patientList" :key="index">{{item.name}}</li>
          </ul> -->
          <el-button type="text" @click="toNext()" style="float:right">下一位：{{nextPatient.name ? nextPatient.name : '无'}}</el-button>
          <div style="font-size:25px">{{currentPatient.name ? currentPatient.name : '暂无病人'}}</div>
        </el-card>
      </div>
      <div class="model-section">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>模板选择</span>
            <el-button style="float: right; padding: 3px 0" type="text">添加模板</el-button>
          </div>
          <el-tabs tab-position="left" style="max-height:300px;min-height:300px;color：white;overflow:auto;">
            <el-tab-pane label="常用">
              <ul class="tag-wrapper">
                <li class="msr-tag" @click="toLove(index, item)" v-for="(item, index) in mydata.normalList" :key="index">{{item.content}}</li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="诊断">
              <ul class="tag-wrapper">
                <li class="msr-tag" @click="toLove(index, item)" v-for="(item, index) in mydata.diagnosisList" :key="index">
                  <p>{{item.content}}</p>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="检查">
              <ul class="tag-wrapper">
                <li class="msr-tag" @click="toLove(index, item)" v-for="(item, index) in mydata.jianchaList" :key="index">
                  <p>{{item.content}}</p>
                </li>
              </ul></el-tab-pane>
            <el-tab-pane label="药品">
              <ul class="tag-wrapper">
                <li class="msr-tag" @click="toLove(index, item)" v-for="(item, index) in mydata.yaopinList" :key="index">
                  <p>{{item.content}}</p>
                </li>
              </ul></el-tab-pane>
            <el-tab-pane label="处置">
              <ul class="tag-wrapper">
                <li class="msr-tag" @click="toLove(index, item)" v-for="(item, index) in mydata.chuzhiList" :key="index">
                  <p>{{item.content}}</p>
                </li>
              </ul></el-tab-pane>
            <el-tab-pane label="其他">
              <ul class="tag-wrapper">
                <li class="msr-tag" @click="toLove(index, item)" v-for="(item, index) in mydata.otherList" :key="index">
                  <p>{{item.content}}</p>
                </li>
              </ul></el-tab-pane>
            <el-tab-pane label="个人">
            <ul class="tag-wrapper">
              <li class="msr-tag" @click="toLove(index, item)" v-for="(item, index) in mydata.gerenList" :key="index">
                <p>{{item.content}}</p>
              </li>
            </ul></el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
      <div>
        <div class="header-section">
          <el-card class="box-card" style="min-height:90px;">
            <div>
              <el-popover
                placement="left"
                title="历史"
                width="600"
                trigger="click">
                <el-carousel indicator-position="outside">
                  <el-carousel-item v-for="(item, index) in historyList" :key="index">
                    <h3>病历：{{index+1}}</h3>
                    <div><span class="text-his">就诊时间：</span>{{formatDate(item.time)}}({{(item.hosName)}})</div>
                    <hr>
                    <div><span class="text-his">主诉：</span>{{item.mainSuit}}</div>
                    <div><span class="text-his">现病史：</span>{{item.nowHistory}}</div>
                    <div><span class="text-his">既往史：</span>{{item.pastHistory}}</div>
                    <div><span class="text-his">家族史：</span>{{item.famHistory}}</div>
                    <div><span class="text-his">体格检查：</span>{{item.health}}</div>
                    <div><span class="text-his">ct检查：</span>{{item.ct}}</div>
                    <div><span class="text-his">症状：</span>{{item.symptom}}</div>
                    <div><span class="text-his">处理意见：</span>{{item.disposed}}</div>
                    <div><span class="text-his">诊断：</span>{{item.diagnose}}</div>
                    <div><span class="text-his">开药：</span>{{item.prescription}}</div>
                  </el-carousel-item>
                </el-carousel>
                <el-button slot="reference" type="text" @click="historyLook(currentPatient.mbID)">历史记录</el-button>
              </el-popover>
              <el-button type="text">病历导出</el-button>
              <el-button type="text">诊疗记录</el-button>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="action-btn"><el-button class="msr-btn" type="success" @click="saveMed()">保存</el-button></div>
      <div class="action-btn"><el-button class="msr-btn" type="danger" @click="deleteForm()">删除</el-button></div>
      <el-popover
        placement="top"
        width="160"
        v-model="visible">
        <div style="text-align: center; margin: 0">
          <ul>
            <li class="tag-wrapper" v-for="(item, index) in flagList" :key="index"><el-tag :type="item.type" @click="selectTag(index)">{{item.tag}}</el-tag></li>
          </ul>
          <el-button size="mini" type="text" @click="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="addTag()">确定</el-button>
        </div>
        <div class="action-btn" slot="reference"><el-button class="msr-btn" type="primary">添加标签</el-button></div>
      </el-popover>
      <div class="action-btn"><el-button class="msr-btn" type="primary" @click="deleteTag()">清除标签</el-button></div>
    </div>
  </div>
</template>

<script>
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'

export default {
  name: 'medEdit',
  computed: {
    age () {
      let a = ''
      if (this.currentPatient.identity) {
        a = this.idCard(this.currentPatient.identity).age
      }
      return a
    },
    xin () {
      let a = ''
      if (this.currentPatient.identity) {
        a = this.idCard(this.currentPatient.identity).xin
      }
      return a
    }
  },
  data () {
    return {
      masr: 'xxxxx',
      currentInputIndex: 1,
      msg1: '',
      docName: 'ycz',
      visible: false,
      currentPatient: {},
      nextPatient: {},
      patientList: [],
      historyList: [],
      hospitalList: [],
      strFromDoc: '',
      modelList: [],
      flagList: [
        {
          tag: '家族史',
          type: 'info'
        },
        {
          tag: '体格检查',
          type: 'info'
        },
        {
          tag: 'ct检查',
          type: 'info'
        },
        {
          tag: '开药',
          type: 'info'
        }
      ],
      medDetailList: [
        {
          title: '主诉',
          content: '',
          isActive: false
        },
        {
          title: '现病史',
          content: '',
          isActive: true
        },
        {
          title: '既往史',
          content: '',
          isActive: true
        },
        {
          title: '症状',
          content: '',
          isActive: true
        },
        {
          title: '诊断',
          content: '',
          isActive: true
        },
        {
          title: '处理意见',
          content: '',
          isActive: true
        }
      ],
      ksName: '',
      mydata: {
        diagnosisList: [],
        chuzhiList: [],
        yaopinList: [],
        jianchaList: [],
        otherList: [],
        gerenList: [],
        normalList: []
      }
    }
  },
  created () {
    this.getModelList()
    this.getKsList()
    this.getList()
  },
  methods: {
    // 1. 获取数据
    // 2. 处理数据
    // 3. 存入数据库
    deleteTag () {
      this.medDetailList.pop()
    },
    changeInput (index) {
      console.log('隐藏', index)
      this.currentInputIndex = index
      this.medDetailList[index].isActive = true
    },
    changeInputVisble (index) {
      console.log('出现', index)
      this.medDetailList[index].isActive = false
    },
    async getList () {
      let that = this
      let res = await this.$axios.post('/member/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        // 获取医生的最新信息
        // 获取医生的temp表
        let str = ''
        for (let item of res.data.data) {
          if (item.mbID === this.$store.state.memberMsg.mbID) {
            str = item.temp
            console.log(str, '医生的str数据')
            that.strFromDoc = str
          }
        }
        // 拆分temp表转化为病人数组
        let arrList = str.split('-')
        if (arrList.length !== 0) {
          arrList.shift() // 弹出第一个多余元素
        }
        console.log(arrList, '医生的arr数据')
        // 把病人信息全部添加到this.patientList
        for (let i of arrList) {
          for (let item of res.data.data) {
            if (Number(i) === item.mbID) {
              that.patientList.push(item)
            }
          }
        }
        this.currentPatient = this.patientList[0]
        this.nextPatient = this.patientList[1] ? this.patientList[1] : {}
        console.log(this.patientList, '病人信息')
      }).catch((err) => {
        console.log(err)
      })
      console.log(res)
    },
    passData (List) {
      let obj = {}
      for (let item of List) {
        if (item.title === '主诉') {
          obj.mainSuit = item.content
        } else if (item.title === '现病史') {
          obj.nowHistory = item.content
        } else if (item.title === '既往史') {
          obj.pastHistory = item.content
        } else if (item.title === '家族史') {
          obj.famHistory = item.content
        } else if (item.title === '症状') {
          obj.symptom = item.content
        } else if (item.title === '诊断') {
          obj.diagnose = item.content
        } else if (item.title === '处理意见') {
          obj.disposed = item.content
        } else if (item.title === '体格检查') {
          obj.health = item.content
        } else if (item.title === 'ct检查') {
          obj.ct = item.content
        } else if (item.title === '开药') {
          obj.prescription = item.content
        }
      }
      return obj
    },
    async saveAfter () {
      // 找到医生信息
      let item = {}
      let res = await this.$axios.post('/member/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }})
      for (let item2 of res.data.data) {
        if (this.$store.state.memberMsg.mbID === item2.mbID) {
          console.log(item2, 'res结构')
          item = item2
        }
      }
      console.log(item.currentNum, 'gdefefegggggggggg', res)
      let str = this.strFromDoc.substring(1)
      let flag = str.indexOf('-')
      console.log('现在的', flag, str)
      if (flag !== -1) {
        str = str.substring(flag)
      } else {
        str = ''
      }
      console.log('现2在的', flag, str)
      // let arrList = this.strFromDoc.split('')
      // console.log(arrList, '查看数组测试')
      // arrList.shift()
      // arrList.shift()
      item.temp = str
      console.log(item.currentNum, 'ffffffffffffffffffffffffffff')
      item.currentNum = item.currentNum - 1 >= 0 ? item.currentNum - 1 : item.currentNum
      // 删除医生的temp数据
      let data = JSON.stringify(item)
      let res2 = await this.$axios.put('/member', data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
      console.log(res2, res.data.code)
      if (Number(res2.data.code) === 0) {
        console.log('删除数据成功')
        this.getList()
        this.$router.go(0)
      }
    },
    async saveMed () {
      let now = new Date()
      let nowTime = now.getTime().toString()
      console.log(this.medDetailList, '病历详情')
      console.log(nowTime, 'nowTime')
      let obj = this.passData(this.medDetailList)
      obj.mbID = this.currentPatient.mbID
      obj.doctorID = this.$store.state.memberMsg.mbID
      obj.hosID = this.$store.state.hospitalMsg.hosID
      obj.ksID = this.$store.state.memberMsg.belKs
      obj.time = nowTime
      obj.isCheck = false
      let data = JSON.stringify(obj)
      let res = await this.$axios.post('/medical', data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
      console.log(Number(res.data.code))
      if (Number(res.data.code) === 0) {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        await this.saveAfter()
      }
      // .then((res) => {
      //   // 保存成功后删除医生表的temp数据（update）
      //   this.$message({
      //     message: '保存成功',
      //     type: 'success'
      //   })
      //   console.log(res)
      // }).catch((err) => {
      //   console.log(err)
      // })
    },
    async historyLook (index) {
      let list = []
      let hos = await this.getHosList()
      let res = await this.$axios.post('/medical/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }})
      console.log(res, 'lishi')
      if (Number(res.data.code) === 0) {
        for (let item of res.data.data) {
          if (item.mbID === index) {
            list.push(item)
          }
        }
      }
      for (let j of list) {
        for (let i of this.hospitalList) {
          if (i.hosID === j.hosID) {
            j.hosName = i.hosName
          }
        }
      }
      this.historyList = list

      console.log(list, 'feflishi', hos)
    },
    selectTag (index) {
      console.log(index)
      if (this.flagList[index].type === 'info') {
        this.flagList[index].type = 'success'
      } else {
        this.flagList[index].type = 'info'
      }
    },
    toLove (index, item) {
      // for (let i of this.medDetailList) {
      //   if (i.title === '诊断') {
      //     i.content = i.content + item.content + ';'
      //   }
      // }
      this.medDetailList[this.currentInputIndex].content = this.medDetailList[this.currentInputIndex].content + item.content + ';'
      console.log(index, item)
      console.log(item.content)
    },
    toNext () {
    },
    async getKsList () {
      let that = this
      let res = await this.$axios.post('/ks/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        console.log(res, '科室信息')
        for (let item of res.data.data) {
          if (Number(item.ksID) === Number(that.$store.state.memberMsg.belKs)) {
            that.ksName = item.ksName
            console.log(item.ksID, '科室信息')
          }
        }
      }).catch((err) => {
        console.log(err)
      })
      console.log(res)
    },
    async getHosList () {
      let res = await this.$axios.post('/hospital/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        this.hospitalList = res.data.data
      }).catch((err) => {
        console.log(err)
      })
      console.log(res)
    },
    async getModelList () {
      let that = this
      let res = await this.$axios.post('/stencil/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        that.modelList = res.data.data
        for (let item of res.data.data) {
          if (item.modelType === '诊断' && Number(item.belKs) === Number(that.$store.state.memberMsg.belKs)) {
            that.mydata.diagnosisList.push(item)
          }
          if (item.modelType === '常用' && Number(item.belKs) === Number(that.$store.state.memberMsg.belKs)) {
            that.mydata.normalList.push(item)
          }
          if (item.modelType === '其他' && Number(item.belKs) === Number(that.$store.state.memberMsg.belKs)) {
            that.mydata.otherList.push(item)
          }
          if (item.modelType === '药品' && Number(item.belKs) === Number(that.$store.state.memberMsg.belKs)) {
            that.mydata.yaopinList.push(item)
          }
          if (item.modelType === '处置' && Number(item.belKs) === Number(that.$store.state.memberMsg.belKs)) {
            that.mydata.chuzhiList.push(item)
          }
          if (Number(item.belDoc) === Number(that.$store.state.memberMsg.mbID) && item.modelType === '个人' && Number(item.belKs) === Number(that.$store.state.memberMsg.belKs)) {
            that.mydata.gerenList.push(item)
          }
          if (item.modelType === '检查' && Number(item.belKs) === Number(that.$store.state.memberMsg.belKs)) {
            that.mydata.jianchaList.push(item)
          }
          console.log(item.modelType, item.belKs, that.$store.state.memberMsg.belKs)
        }
      }).catch((err) => {
        console.log(err)
      })
      console.log(res)
    },
    addTag () {
      this.visible = false
      let newTagList = []
      let length1 = this.medDetailList.length
      for (let item of this.flagList) {
        console.log(item)
        if (item.type === 'success') {
          newTagList.push({
            title: item.tag,
            content: '',
            isActive: true
          })
        }
      }
      console.log(newTagList.length)
      for (let item2 of newTagList) {
        this.medDetailList.splice(length1, 0, item2)
      }
    },
    deleteForm () {
      this.$confirm('此操作删除所有已填信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let item of this.medDetailList) {
          item.content = ''
        }
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
    download () {
      let that = this
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
          hosName: that.$store.state.hospitalMsg.hosName,
          docName: that.$store.state.memberMsg.name
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
.el-carousel__item:nth-child(2n) {
  background-color: rgba(255, 255, 255, 0.5);
}
.el-carousel__item:nth-child(2n+1) {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
<style scoped>
.visible{
  display: none;
}
.medEdit-model{
  position: relative;
}
.text-his{
 font-weight: 600;
}
.medEdit-model .top{
  position: relative;
}
.medEdit-model .right-nav{
  position: absolute;
  top: 0;
  right: 0;
}
.medEdit-model .content{
  position: relative;
  margin-bottom: 98px;
  height: 1200px;
  padding-left: 30px;
  padding-top: 30px;
  background-color: #a8a8a8;
}
.medEdit-model .content .paper{
  width: 630px;
  height: 900px;
  padding: 10px 40px;
  box-sizing: border-box;
  background-color: #ffffff;
}
.medEdit-model .content .paper .header{
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}

.medEdit-model .content .paper .msg-section .msg-section-p{
  display: inline-block;
  width: 180px;
}
.medEdit-model .content .paper .msg-section .msg-section-p:first-child{
  display: inline-block;
  width: 210px;
}
.medEdit-model .content .paper .msg-section .msg-section-p:nth-child(2){
  display: inline-block;
  width: 150px;
}
.medEdit-model .content .paper .main-content .main-li{
  margin-bottom: 6px;
}
.medEdit-model .content .paper .main-content .main-li .title-tip{
  font-weight: 600;
}
.medEdit-model .content .paper .doc-name{
  margin-top: 100px;
  margin-bottom: 100px;
  float: right;
}
/* 右边栏 */
.right-content{
  position:fixed;
  height: 100%;
  width: 400px;
  top: 0;
  right: 0;
  background: #F4F5F8;
}
.right-content .box-card{
  border-radius: 10px;
  margin: 10px 10px;
  padding: 0 15px 15px 15px;
}
.right-content .tag-wrapper{
  padding: 5px;
}
.right-content .tag-wrapper .msr-tag{
  padding: 2px 4px;
  border: 1px solid #e9e9eb;
  background-color: #f4f4f5;
  color: #909399;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 5px;
}
.right-content .tag-wrapper .msr-tag:hover{
  padding: 2px 6px;
  border: 1px solid #d9ecff;;
  background-color:#ecf5ff;
  color: #409EFF;;
  border-radius: 5px;
  margin-bottom: 5px;
}
.medEdit-model .bottom{
  position: fixed;
  width: 100%;
  bottom: 0;
  padding-left: 30px;
  padding-top: 30px;
  box-sizing: border-box;
  height: 100px;
  background-color: #DCDFE6;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5)
  /* border-top-left-radius: 20px;
  border-top-right-radius: 20px; */
}
.medEdit-model .bottom .action-btn{
  display: inline-block;
  margin-right: 40px;
}
.medEdit-model .bottom .action-btn .msr-btn{
  border-radius: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
}
/*  */
.tag-wrapper{
  margin-bottom: 10px;
}
</style>
