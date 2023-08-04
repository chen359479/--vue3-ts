import axios from '../assets/js/request'

interface CanAddSubsetType{
  hierarchy:number,
  children:string
}

interface menuType{
  viewPath: string,
  name: string,
  title: string,
  sequence: number,
  children?: Array<any>,
  icon: string,
  astrict: Array<string>,
  type: boolean,
  msg: string,
  hierarchy: string,
  id?:number
}

export function getMenus() {
  return axios.get('api/getMenus')
}

export function getMenuList() {
  return axios.get('api/getMenuList')
}

export function getCanAddSubset(params: CanAddSubsetType) {
  return axios.get('api/getCanAddSubset', { params })
}

export function deleteMenu(data: { id : number }) {
  return axios.post('api/deleteMenu', data)
}

export function updateMenus(data: menuType) {
  return axios.post('api/updateMenus', data)
}

export function writeMenus(data: menuType) {
  return axios.post('api/writeMenus', data)
}

