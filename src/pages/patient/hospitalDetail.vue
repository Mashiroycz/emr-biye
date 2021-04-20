<template>
  <div class="hospital-detail-model">
    <!-- 侧边栏 -->
    <div class="nav-section">
      <div class="nav-list" :class="{navselected : true}">预约挂号</div>
      <div class="nav-list">医院详情</div>
      <div class="nav-list">预约须知</div>
      <div class="nav-list">停诊信息</div>
      <div class="nav-list">查询/取消</div>
    </div>
    <!-- 主栏框 -->
    <div class="main-section">
      <!-- 信息介绍 -->
      <div>
        <div class="text-hospital-name"><span>{{hospitalMsg.hosName}}</span></div>
        <div class="img-hospital" :class="{changeImg: pageChoose}"><img :src="hospitalMsg.hosPicture" alt=""></div>
        <div class="hospital-detail-box" :class="{changeDetail: pageChoose}">
          <h4 class="title">医院预约规则</h4>
          <p>1：受疫情影响，来自或去过中/高地区的患者就诊须持<span class="text-city">{{hospitalMsg.hosCity}}</span> 市7日内正规机构核酸检测阴性结果证明，否则将不能正常就诊，请主动配合入口处管理和预检分诊。</p>
          <p>2：为减少院内聚集，避免交叉感染风险，每位患者仅允许一位家属陪同。</p>
          <p>3. 首次预约患者,预约时必须填写“亲属姓名”用于建档备查，首次填写后无需再填写。</p>
          <p>4. 预约成功的医保报销用户请首先确保为本院定点医保用户，首次来院就诊时需到窗口关联医保卡后，再到医院医保自助机取号就诊。预约成功的自费用户请在非医保自助机取号就医。</p>
          <p>5. 使用身份证以外其它证件注册预约的患者，只能到窗口取号。</p>
          <p>6. 本院【小儿科】只预约小于14周岁(不包含14周岁)的患儿。</p>
          <p>7. 预约成功后，请患者于就诊当日携带患者本人的有效证件、银行卡、医保卡、及预约识别码到医院自助挂号机上进行取号（医保报销用户须在医保自助机取号，在非医保自助机取号为自费），如预约登记信息有误，则无法正常取号就诊。</p>
          <p>8. 本院【口腔科】下的小儿牙科只对12周岁以下患儿预约。</p>
        </div>
        <div class="choose-doc-box" v-if="pageChoose">
          <p><span style="color:#666">{{ksMsg.name}}></span><span>{{ksMsg.name2}}</span></p>
          <ul class="choose-doc-item">
            <li class="choose-doc-list" v-for="(item, index) in memberList" :key=index>
              <div class="action">
                <el-button class="msr-btn" @click="guaHao(item.mbID, item)" type="primary">剩余{{item.totalNum-item.currentNum}}</el-button>
              </div>
              <div class="doc-msg">
                <p><span class="text-doc-level">专家号</span><span class="text-doc-name">{{item.name}}</span></p>
                <p><span class="text-doc-phone">联系方式:</span><span class="text-doc-phone">{{item.phoneNumber}}</span></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 特殊框 监听吸附 -->
      <div class="choose-box" v-if="!pageChoose">
        <div class="choose-box-title"><p>选择科室</p></div>
        <ul class="ks-item">
          <li class="ks-list" :class="{selected : topIndex === index}" @click="scrollTo(index)" v-for="(item, index) in ksList" :key="index">{{item.typeName}}</li>
        </ul>
        <!-- 右边滑动 -->
        <ul class="ks-inner-item">
          <li class="ks-inner-list" :class="'ks-inner-list'+index" v-for="(item, index) in ksList" :key="index">
            <div class="type-title"><span class="tip" :class="{selected : topIndex === index}"></span>{{item.typeName}}</div>
            <div class="text-litte-ks" @click="handleKsChoose(index, index2)" v-for="(item2, index2) in item.innerList" :key="index2">
              {{item2.name}}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hospitalDetail',
  data () {
    return {
      topIndex: 0,
      isSelect: false,
      hospitalList: [],
      hospitalMsg: {},
      ksList: [],
      memberList: [],
      memberDocter: [],
      ksMsg: {}, // 当前选择科室的信息
      testDocList: [
        {name: 'a', shengyu: 5},
        {name: 'a', shengyu: 5},
        {name: 'c', shengyu: 2}
      ],
      pageChoose: false // 页面切换
    }
  },
  created () {
    console.log(this.$route.query.id)
    if (this.$route.query.id) {
      this.getList()
      this.getKsList()
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    guaHao (docID, item) {
      console.log(item, '现在的item')
      if (!this.$store.state.memberMsg.mbID || this.$store.state.memberMsg.type !== '患者') {
        this.$message({
          message: '请登录',
          type: 'warning'
        })
        return
      }
      if (item.temp) {
        let arr1 = item.temp.split('-')
        for (let i of arr1) {
          if (Number(i) === this.$store.state.memberMsg.mbID) {
            this.$message({
              message: '您已经挂过号了',
              type: 'warning'
            })
            return
          }
        }
        item.temp = item.temp + '-' + String(this.$store.state.memberMsg.mbID)
      } else {
        item.temp = '-' + String(this.$store.state.memberMsg.mbID)
      }
      item.currentNum += 1
      let data = JSON.stringify(item)
      this.$axios.put('/member', data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then((res) => {
        console.log('挂号事件触发')
        this.$message({
          message: '挂号成功',
          type: 'success'
        })
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },
    async handleKsChoose (index, index2) {
      console.log(index, index2, '查看传递参数2')
      window.removeEventListener('scroll', this.handleScroll)
      await this.getMemberList(index, index2)
      this.ksMsg.name = this.ksList[index].typeName
      this.ksMsg.name2 = this.ksList[index].innerList[index2].name
      this.pageChoose = true
    },
    async getList () {
      let that = this
      let res = await this.$axios.post('/hospital/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        that.hospitalList = res.data.data
        for (let item of res.data.data) {
          if (item.hosID === Number(that.$route.query.id)) {
            that.hospitalMsg = item
          }
        }
      }).catch((err) => {
        console.log(err)
      })
      console.log(this.hospitalMsg, 'dff', res)
    },
    // 获取科室列表
    async getKsList () {
      let that = this
      let res = await this.$axios.post('/ks/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        that.passData(res.data.data)
        console.log(res.data.data)
      }).catch((err) => {
        console.log(err)
      })
      console.log(this.hospitalMsg, 'dff', res)
    },
    async getMemberList (index, index2) {
      let that = this
      this.memberList = []
      let res = await this.$axios.post('/member/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        for (let item of res.data.data) {
          if (item.belKs === String(that.ksList[index].innerList[index2].ksID)) {
            that.memberList.push(item)
          }
        }
      }).catch((err) => {
        console.log(err)
      })
      console.log(res)
    },
    // 处理科室列表
    passData (List) {
      // 1.先筛选医院
      let newList = [] // 数据库筛选后的本医院的科室列表
      let newKsList = [] // 这是要生成新数据结构的科室列表
      let firstList = []
      for (let item of List) {
        if (item.blHosID === Number(this.$route.query.id)) {
          newList.push(item)
          firstList.push(item.ksType)
        }
      }
      firstList = [...new Set(firstList)] // 去重
      console.log(firstList, '新数组')
      for (let i of firstList) {
        newKsList.push({
          typeName: i,
          innerList: []
        })
      }
      for (let j of newKsList) { // 外层循环大科室类别
        for (let i of newList) { // 内层循环小科室
          if (i.ksType === j.typeName) {
            j.innerList.push({name: i.ksName, ksID: i.ksID})
          }
        }
      }
      this.ksList = newKsList
      console.log(newKsList, '新ks数组')
    },
    handleScroll () {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
        // ks-inner-list
      let offsetTop1 = document.querySelector('.ks-inner-list' + this.topIndex).offsetTop
      let offsetHeight = document.querySelector('.ks-inner-list' + this.topIndex).offsetHeight
      if (scrollTop > offsetTop1) {
        this.topIndex = this.topIndex + 1
      } else {
        // 791 > 790
        // 792 < 850-80
        if (scrollTop < offsetTop1 - offsetHeight) {
          this.topIndex = this.topIndex - 1 >= 0 ? this.topIndex - 1 : 0
        }
      }
      // console.log(scrollTop, '--', offsetTop1, '--', this.topIndex, offsetHeight)
    },
    scrollTo (index) {
      this.$nextTick(() => {
        const top = document.querySelector('.ks-inner-list' + index).offsetTop - 121
        // console.log('...', top)
        this.topIndex = index
        document.documentElement.scrollTop = top
        // document.querySelector('.ks-inner-list' + index).scrollIntoView({ block: 'start', behavior: 'smooth' })
        this.topIndex = index
      })
      console.log(index)
    }
  }

}
</script>

<style>
</style>
<style scoped>
.selected{
  font-weight: 700;
}
.hospital-detail-model{
  position: relative;
}
.hospital-detail-model .nav-section{
  position: sticky;
  display: inline-block;
  vertical-align: top;
  /* 注意以上 */
  top: 110px;
  left: 0px;
}
.hospital-detail-model .nav-section .nav-list{
  margin-bottom: 50px;
  cursor: pointer;
}
.hospital-detail-model .nav-section .nav-list.navselected{
  color: #4990f1;
  font-weight: 600;
}
.hospital-detail-model .nav-section .nav-list.navselected::before{
  content: '';
  position: absolute;
  left: -20px;
  top: 6px;
  display: inline-block;
  background-color: #4990f1;
  border-radius: 2px;
  width: 10px;
  height: 10px;
}
.hospital-detail-model .hospital-detail-box{
  /* position: absolute;
  left: 150px;
  top: 100px; */
  display: inline-block;
  width: 800px;
  font-size: 14px;
  color: #666;
  /* transition: top 5s; */
}
.hospital-detail-model .hospital-detail-box.changeDetail{
  /* top: 500px; */
}
.hospital-detail-model .hospital-detail-box .text-city{
  color: red;
  margin-right: -4px;
}
.hospital-detail-model .main-section .text-hospital-name{
  margin-top: 40px;
  font-size: 30px;
  font-weight: 600;
}
.hospital-detail-model .main-section .img-hospital{
  /* width: 100px;
  height: 100px;
  position: absolute;
  top: 150px; */
  display: inline-block;
  margin-top: 20px;
  margin-right: 46px;
  width: 100px;
  height: 100px;
  vertical-align: top;
  transition: margin 3s, visibility 2s, transform 3s;
  /* transition: top 5s, transform 5s */
}
.hospital-detail-model .main-section .img-hospital.changeImg{
  margin-top: 80px;
  transform: rotateX(360deg);
  /* visibility: hidden; */
}
.hospital-detail-model .hospital-detail-box .title{
  font-size: 16px;
  color: #000;
}
/* 选择科室下面区域 */
.hospital-detail-model .main-section{
  position: relative;
  display: inline-block;
  margin-left: 140px;
}
/* 挂号的区域 */
.hospital-detail-model .main-section .choose-doc-box{
  margin-top: 50px;
}
.hospital-detail-model .main-section .choose-doc-box .choose-doc-item{
  margin-top: 50px;
}
.hospital-detail-model .main-section .choose-doc-box .choose-doc-item .choose-doc-list{
  margin-bottom: 20px;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
  padding: 40px 40px;
}
.hospital-detail-model .main-section .choose-doc-box .choose-doc-item .choose-doc-list .doc-msg{
  margin-right: 200px;
}
.hospital-detail-model .choose-doc-list .doc-msg .text-doc-level{
  display: inline-block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 10px;
  margin-right: 10px;
}
.hospital-detail-model .choose-doc-list .doc-msg .text-doc-name{
  display: inline-block;
  color: #666;
  margin-bottom: 10px;
}
.hospital-detail-model .choose-doc-list .doc-msg .text-doc-phone{
  font-size: 14px;
  color: #666;
}
.hospital-detail-model .main-section .choose-doc-box .choose-doc-item .choose-doc-list .action{
  float: right;
  margin-top: 6px;
}
.hospital-detail-model .main-section .choose-doc-box .choose-doc-item .choose-doc-list .msr-btn{
  width: 120px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
}
/* 选择科室区域 */
.hospital-detail-model .main-section .choose-box{
}
.hospital-detail-model .main-section .choose-box .choose-box-title{
  font-weight: 600;
  position: sticky;
  z-index: 98;
  padding: 50px 0;
  background-color: #fff;
  top: 60px;
}
.hospital-detail-model .main-section .choose-box .ks-item{
  position: sticky;
  top: 180px;
  padding: 20px 0px 80px 0px;
  background-color: azure;
  text-align: center;
  display: inline-block;
  vertical-align: top;
}
.hospital-detail-model .main-section .choose-box .ks-item .ks-list{
  cursor: pointer;
  padding: 10px 16px;
}
.hospital-detail-model .main-section .choose-box .ks-inner-item{
  /* position: sticky;
  top: 140px; */
  margin-left: 60px;
  display: inline-block;
}
.hospital-detail-model .main-section .choose-box .ks-inner-item .ks-inner-list{
  position: relative;
  margin-bottom: 50px;
  width: 600px;
}
.hospital-detail-model .main-section .choose-box .ks-inner-item .ks-inner-list .type-title{
  margin-bottom: 24px;
  font-weight: 600;
}
.hospital-detail-model .main-section .choose-box .ks-inner-item .ks-inner-list .tip{
  width: 4px;
  height: 12px;
  display: inline-block;
  background-color: #4990f1;
  border-radius: 3px;
  margin-right: 4px;
}
.hospital-detail-model .main-section .choose-box .ks-inner-item .ks-inner-list .tip.selected{
  width: 16px;
}
.hospital-detail-model .main-section .choose-box .ks-inner-item .ks-inner-list .text-litte-ks{
  color: #666;
  display: inline-block;
  width: 200px;
  padding-bottom: 10px;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
