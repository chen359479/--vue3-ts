import axios from '../assets/js/request'
interface classType{
  title: string,
  type: boolean,
  id?:number
}

// 获取分类
export function getTopClass(params?: { type : number }) {
  return axios.get('unApi/getTopClass', { params })
}

// 删除分类
export function deleteClass(data: { id : number | Array<number>}) {
  return axios.post('unApi/deleteClass', data)
}

// 新增分类
export function addClass(data: classType) {
  return axios.post('unApi/addClass', data)
}

// 修改分类
export function updateClass(data: classType) {
  return axios.post('unApi/updateClass', data)
}

