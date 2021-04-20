<template>
  <div class="register-main-model">
    <div class="img-header"></div>
    <div class="search-section" id="boxFixed" :class="{'is_fixed' : isFixed}">
      <div><el-input class="msr-input" v-model="searchKey" placeholder="请输入医院名称" prefix-icon="el-icon-search"></el-input></div>
    </div>
    <div class="search-box">
      <h3>医院</h3>
      <div>
        <span class="text-tip">城市：</span>
        <span class="text-item"
          :class="{selected: clickIndex === i}" @click="selected(i, 1)" v-for="(item, i) in cityList" :key="i">{{item.value}}</span>
      </div>
      <div>
        <span class="text-tip">等级：</span>
        <span class="text-item"
          :class="{selected: clickIndex2 === i}" @click="selected(i, 2)" v-for="(item, i) in levelList" :key="i">{{item}}医院</span>
      </div>
      <div>
        <div class="text-tip">地区：</div>
        <div class="city-section">
          <span class="text-item"
          :class="{selected: clickIndex3 === i}" @click="selected(i, 3)" v-for="(item, i) in sectionList" :key="i">{{item.value}}</span></div>
      </div>
    </div>
    <ul class="hospital-box">
      <li class="hospital-list" @click="goTo(item.hosID)" v-for="(item, index) in showList" :key="index">
        <div class="list-content">
          <p class="text-name">{{item.hosName}}</p>
          <p class="text-level"><i class="el-icon-s-data"></i>{{item.hosLevel}}</p>
        </div>
        <img class="img-hospital" :src="item.hosPicture" alt="">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'register',
  data () {
    return {
      de: 'd',
      searchKey: '',
      isSelect: false,
      clickIndex: 0,
      clickIndex2: 0,
      clickIndex3: 0,
      isFixed: false, // 滑动框事件触发
      levelList: ['全部', '三级', '二级', '一级'],
      // sectionList: ['全部', '东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区',
      //   '门头沟区', '房山区', '通州', '昌平区', '通州区', '顺义区', '大兴区',
      //   '门头沟区', '房山区', '通州', '昌平区', '通州区', '顺义区', '大兴区'],
      hospitalList: []
    }
  },
  watch: {
  },
  computed: {
    showList () {
      let arrList = this.hospitalList
      return arrList
    },
    cityList () {
      return this.$store.state.cityList
    },
    sectionList () {
      let arrList = this.$store.state.cityList[this.clickIndex].children
      return arrList
    },
    nowCity () {
      return this.cityList[this.clickIndex].value
    },
    nowSection () {
      return this.sectionList[this.clickIndex3].value
    },
    nowLevel () {
      return this.levelList[this.clickIndex2]
    }
  },
  created () {
    this.updateList()
    console.log(this.nowCity)
    console.log(this.nowSection)
    console.log(this.nowLevel)
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    goTo (i) {
      console.log(i)
      this.$router.push({ path: '/patient/hospitalDetail', query: {id: i} })
    },
    async updateList () {
      let that = this
      await this.getList()
      let newList = []
      console.log(that.hospitalList, 'dddwed')
      for (let item of that.hospitalList) {
        if (item.hosCity === that.nowCity &&
          item.hosSection === that.nowSection &&
          (that.nowLevel !== '全部' ? item.hosLevel === that.nowLevel : true)) {
          newList.push(item)
        }
      }
      this.hospitalList = newList
      console.log('update')
    },
    async getList () {
      let that = this
      let res = await this.$axios.post('/hospital/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        console.log(res)
        that.hospitalList = res.data.data
        that.total = res.data.data.length
      }).catch((err) => {
        console.log(err)
      })
      console.log(res)
    },
    selected (i, num) {
      if (num === 1) {
        this.clickIndex = i
        this.clickIndex3 = 0
      }
      if (num === 2) {
        this.clickIndex2 = i
      }
      if (num === 3) {
        this.clickIndex3 = i
      }
      this.updateList()
    },
    handleScroll () {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      let offsetTop1 = document.querySelector('#boxFixed').offsetTop
      // if (scrollTop > offsetTop1) {
      //   this.$emit('msremit', '子组件传值')
      // }
      scrollTop > offsetTop1 ? (this.isFixed = true) : (this.isFixed = false)
      this.$emit('msremit', this.isFixed)
    }
  }

}
</script>

<style>
</style>
<style scoped>
.register-main-model .img-header{
  background: url(../../../static/image/hos2.jpg) no-repeat;
  height: 200px;
}
/* 搜索区 */
.register-main-model .search-section{
  text-align: center;
  margin-top: 16px;
}
.register-main-model .search-section.is_fixed{
  display: none;
}
.register-main-model .search-section .msr-input{
  width: 800px;
}
/* 选择框区 */
.register-main-model .search-box .text-tip{
  color: #999;
  float: left;
  width: 50px;
}
.register-main-model .search-box .city-section{
  margin-left: 50px;
}
.register-main-model .search-box .text-item{
  cursor: pointer;
  margin-left: 28px;
  display: inline-block;
  margin-bottom: 15px;
  color: #666;
}
.register-main-model .search-box .text-item:hover{
  color: #409EFF;
}
.register-main-model .search-box .text-item.selected{
  color: #409EFF;
  font-weight: 600;
}
/* 医院展示区 */
.register-main-model .hospital-box{
  margin: 0 10px;
}
.register-main-model .hospital-box .hospital-list{
  display: inline-block;
  width: 50%;
  box-sizing: border-box;
  cursor: pointer;
  padding: 15px;
}
.register-main-model .hospital-box .hospital-list:hover{
  box-shadow: 1px 1px 10px #999;
}
.register-main-model .hospital-box .hospital-list:hover .img-hospital{
  margin-right: 30px;
}
.register-main-model .hospital-box .hospital-list:hover .list-content .text-name{
  font-weight: 600;
}
.register-main-model .hospital-box .hospital-list .list-content{
  display: inline-block;
}
.register-main-model .hospital-box .hospital-list .list-content .text-name{
  margin-top: 10px;
}
.register-main-model .hospital-box .hospital-list .list-content .text-level{
  margin-top: 20px;
  color: #999;
  font-size: 14px;
}
.register-main-model .hospital-box .hospital-list .list-content .el-icon-s-data{
  margin-right: 10px;
}
.register-main-model .hospital-box .hospital-list .img-hospital{
  float: right;
  width: 80px;
  height: 80px;
  margin-right: 50px;
  transition: margin-right .5s;
}
</style>
