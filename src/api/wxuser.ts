import axios from '../assets/js/request'
interface getWxuserType{
  username: string,
  phone: string,
  page: number,
  pageSize: number,
  total: number
}
// 获取微信用户
export function getWxuserList(params: getWxuserType) {
  return axios.get('api/getWxuserList', { params })
}

// 删除微信用户
export function deleteWxuser(data: { id:number|Array<number> }) {
  return axios.post('api/deleteWxuser', data)
}
