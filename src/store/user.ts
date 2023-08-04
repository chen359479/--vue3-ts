import { defineStore } from 'pinia'

interface UIType {
    broadcast : number,
    created_time : string,
    id : number,
    phone : string,
    sex: number,
    state: number,
    token : string,
    type: string,
    update_time: string,
    username: string,
}

export const userStore = defineStore('user', {
  state: () => {
    return {
      userInfo: {
        token: '',
        username: '',
        id: 0,
        broadcast: 1
      }, // 用户信息
      userJit: [ // 用户权限
        {
          label: '超级管理员',
          value: 'superAdmin'
        }, {
          label: '管理员',
          value: 'admin'
        }, {
          label: '用户',
          value: 'user'
        }
      ],
      userState: [ // 用户状态
        {
          label: '启用',
          value: 1
        }, {
          label: '锁定',
          value: 2
        }, {
          label: '销户',
          value: 3
        }
      ]
    }
  },
  getters: {},
  actions: {
    setUserInfo(data : UIType) {
      this.userInfo = data
    }
  }
})
