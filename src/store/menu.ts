import { defineStore } from 'pinia'

interface MLType {
    astrict?:string,
    children?:string,
    conclude?:boolean,
    hierarchy?: number,
    icon?:string,
    id?: number,
    name?: string,
    sequence?: number,
    title: string,
    type: boolean,
    viewPath: string
}

export const menuStore = defineStore('menu', {
  state: () => {
    return {
      allMenuList: [{}, {}, {}]
    }
  },
  getters: {},
  actions: {
    setAllMenuList(data : [MLType, MLType, MLType|{}]) {
      this.allMenuList = data
    }
  }
})
