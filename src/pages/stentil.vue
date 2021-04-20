<template>
  <div class="stentil-model">
    <el-card style="height: 1000px;padding:50px;">
      <el-select class="type-select" v-model="selected2" @change="updateList()">
        <el-option
          v-for="item in showKsList"
          :key="item.ksID"
          :label="item.ksName"
          :value="item.ksID">
        </el-option>
      </el-select>
      <el-select class="type-select" v-model="selected" @change="updateList()">
         <!-- <el-cascader
          :options="options"
          @change="handleChange"></el-cascader> -->
        <el-option
          v-for="item in typeList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-card style="margin-top:50px;">
        <el-tag
          style="margin-right: 20px;margin-bottom:10px;"
          v-for="(item, index) in showTagList"
          :key="index + '-only'"
          type="success"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">{{item.content}}</el-tag>
        <span>
          <el-input
            class="input-new-tag"
            style="width: 80px;"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" style="margin-right: 20px;" size="small" @click="showInput">+ 新增</el-button>
        </span>
      </el-card>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'stentil',
  data () {
    return {
      showTagList: [],
      selected: '诊断',
      selected2: '',
      options: [],
      showKsList: [],
      inputVisible: false,
      inputValue: '',
      total: 100,
      limit: 5,
      page: 1,
      stentilList: [],
      typeList: [
        {label: '诊断', value: '诊断'},
        {label: '处置', value: '处置'},
        {label: '药品', value: '药品'},
        {label: '检查', value: '检查'},
        {label: '常用', value: '常用'},
        {label: '其他', value: '其他'}]
    }
  },
  computed: {
    showList () {
      let arrList = this.memberList.slice((this.page - 1) * this.limit, this.page * this.limit)
      return arrList
    }
  },
  created () {
    this.getList()
    this.getKsList()
  },
  watch: {
  },
  methods: {
    updateList () {
      let list = []
      this.showTagList = []
      console.log('sdf')
      for (let item of this.stentilList) {
        if (item.belKs === Number(this.selected2)) {
          list.push(item)
        }
      }
      console.log(list)
      for (let item of list) {
        if (item.modelType === this.selected) {
          this.showTagList.push(item)
        }
      }
    },
    handleClose (tag) {
      this.showTagaList.splice(this.showTagList.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.showTagList.push({
          content: inputValue
        })
      }
      this.inputVisible = false
      if (!this.selected2 || !inputValue) {
        return false
      }
      let data = JSON.stringify({
        belKs: this.selected2,
        modelType: this.selected,
        content: this.inputValue,
        useNum: 0,
        belDoc: '',
        belHos: this.$store.state.memberMsg.belHos
      })
      this.$axios.post('/stencil', data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then((res) => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
      this.inputValue = ''
    },
    async getList () {
      let that = this
      let modelList = []
      let res = await this.$axios.post('/stencil/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        modelList = res.data.data
        for (let item of modelList) {
          if (Number(item.belHos) === Number(this.$store.state.memberMsg.belHos) && item.modelType !== '个人') {
            that.stentilList.push(item)
          }
        }
        console.log(this.stentilList)
      }).catch((err) => {
        console.log(err)
      })
      console.log(res)
    },
    async getKsList () {
      let that = this
      let ksList = []
      let tempList = []
      let res = await this.$axios.post('/ks/find', {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }}).then((res) => {
        ksList = res.data.data
        console.log(ksList)
        for (let item of res.data.data) {
          if (Number(item.blHosID) === Number(that.$store.state.memberMsg.belHos)) {
            tempList.push(item)
          }
        }
        that.showKsList = tempList
      }).catch((err) => {
        console.log(err)
      })
      console.log(res)
    }
  }
}
</script>

<style>
</style>
