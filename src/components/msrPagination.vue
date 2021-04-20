<template>
  <div class="msr-pagination">
    <div class="pagination">
      <el-select class="limit-select" v-model="limit" @change="$emit('pagechange')" size="small">
        <el-option
          v-for="item in limitList"
          :key=item
          :value=item>
        </el-option>
      </el-select>
      <span>条/页</span>
      <span class="pagination-action" @click="moveTo(1)"><i class="el-icon-arrow-left"></i></span>
      <el-select class="limit-select" v-model="page" @change="$emit('pagechange')" size="small">
        <el-option
          v-for="item in pageList"
          :key=item
          :value=item>
        </el-option>
      </el-select>
      <span class="pagination-action" @click="moveTo(2)"><i class="el-icon-arrow-right"></i></span>
    </div>
    <div>共{{total}}条记录，当前为{{currentMin}}~{{currentMax}}条</div>
  </div>
</template>

<script>
export default {
  name: 'msrPagination',
  props: ['total', 'limit', 'page'],
  data () {
    return {
      limitList: [6, 7, 8],
      pageList: [1, 2, 3, 4, 5]
    }
  },
  computed: {
    currentMin () {
      return (this.page - 1) * this.limit + 1
    },
    currentMax () {
      return this.page * this.limit
    }
  },
  methods: {
    moveTo (type) {
      if (type === 1) {
        console.log('1')
      }
      if (type === 2) {
        console.log('2')
      }
    }
  }
}
</script>

<style scoped>
.msr-pagination .pagination{
  float: right
}
.msr-pagination .pagination .limit-select{
  width:80px;
}
.msr-pagination .pagination .pagination-action{
  padding:2px 4px 4px 4px;
  cursor:pointer;
  border:1px solid #dedede;
  border-radius:3px;
}
</style>
