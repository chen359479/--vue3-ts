import axios from '../assets/js/request'

export function systemInfo() {
  return axios.get('api/systemInfo')
}

export function upload(data: any) {
  return axios.post('api/uploadFile', data)
}
