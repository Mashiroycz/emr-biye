import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    name: 'Mashiroycz',
    memberMsg: {},
    hospitalMsg: {},
    mydata: {
      medicalRecordList: [
        {
          medID: '1',
          name: 'lingke',
          docName: 'zzz',
          recordTime: '19.30'
        }
      ]
    },
    cityList: [{
      value: '北京',
      label: '北京',
      children: [
        {
          value: '东城区',
          label: '东城区'
        },
        {
          value: '西城区',
          label: '西城区'
        },
        {
          value: '朝阳区',
          label: '朝阳区'
        },
        {
          value: '丰台区',
          label: '丰台区区'
        },
        {
          value: '海淀区',
          label: '海淀区'
        },
        {
          value: '门头沟区',
          label: '门头沟区'
        },
        {
          value: '房山区',
          label: '房山区'
        },
        {
          value: '通州区',
          label: '通州区'
        },
        {
          value: '顺义区',
          label: '顺义区'
        },
        {
          value: '昌平区',
          label: '昌平区'
        },
        {
          value: '大兴区',
          label: '大兴区'
        }
      ]
    }, {
      value: '上海',
      label: '上海',
      children: [
        {
          value: '黄埔区',
          label: '黄埔区'
        },
        {
          value: '徐汇区',
          label: '徐汇区'
        },
        {
          value: '长宁区',
          label: '长宁区'
        },
        {
          value: '静安区',
          label: '静安区'
        },
        {
          value: '虹口区',
          label: '虹口区'
        },
        {
          value: '普陀区',
          label: '普陀区'
        }
      ]
    }, {
      value: '广州',
      label: '广州',
      children: [
        {
          value: '天河区',
          label: '天河区'
        }
      ]
    }, {
      value: '深圳',
      label: '深圳',
      children: [
        {
          value: '房山区',
          label: '房山区'
        },
        {
          value: '通州区',
          label: '通州区'
        }
      ]
    }]
  },
  getters: {},
  mutations: {
    updateMyData (state, medObj) {
      state.mydata.medicalRecordList.push(medObj)
    },
    setUserinfo (state, userinfo) {
      state.memberMsg = userinfo
    },
    setHosinfo (state, hosinfo) {
      state.hospitalMsg = hosinfo
    }
  },
  actions: {},
  modules: {}
})
