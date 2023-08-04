import axios from '../assets/js/request'

interface getBroadcastListType{
  title: string,
  username: string,
  grade: number,
  page: number,
  pageSize: number,
  total?: number
}

interface writeBroadcastType{
  title: string,
  content: string,
  grade: number,
  expiration_time: Date
}

export function getBroadcastList(params: getBroadcastListType) {
  return axios.get('api/broadcastList', { params })
}

export function getBroadcastInfo(params : { id: number }) {
  return axios.get('api/getBroadcastInfo', { params })
}

export function writeBroadcast(data: writeBroadcastType) {
  return axios.post('api/writeBroadcast', data)
}

export function deleteBroadcast(id: number) {
  return axios.post('api/deleteBroadcast', { id })
}

