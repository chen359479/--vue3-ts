import axios from '../assets/js/request'
interface searchFormType {
  payStatus: number,
  orderID: string,
  title: string,
  page: number,
  pageSize: number,
  total?: number,
  userPhone: string
}

// 获取订单列表
export function getOrderList(params: searchFormType) {
  return axios.get('api/getOrderList', { params })
}

// 修改资源内容
export function deleteOrder(data: Array<number> | number) {
  return axios.post('api/deleteOrder', data)
}
