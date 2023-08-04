import axios from '../assets/js/request'

interface getDocumentType{
  name: string,
  page: number,
  pageSize: number,
  type: string,
  total: number
}

// 获取文件
export function getDocumentList(params: getDocumentType) {
  return axios.get('api/documentList', { params })
}

// 新增文件
export function addDocument(data: any) {
  return axios.post('api/addDocument', data)
}
