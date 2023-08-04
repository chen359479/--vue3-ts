import axios from '../assets/js/request'

interface getArticleType{
  classID: number,
  page: number,
  pageSize: number,
  type: number | null,
  total: number
}

interface addArticleInfoType{
  title: string,
  price: number,
  discount: number,
  status: boolean,
  imageUrl: string,
  videoType: boolean,
  url: string,
  classID: number,
  id?:number
}

interface addArticleTextInfoType{
  title: string,
  price: number,
  discount: number,
  status: boolean,
  imageUrl: string,
  content: string,
  classID: number,
  id?:number
}

// 根据表名获取资源列表
export function getArticleList(params : getArticleType) {
  return axios.get('api/articleList', { params })
}

// 获取文本列表
export function getArticleTextList(params : getArticleType) {
  return axios.get('api/articleTextList', { params })
}
// 获取资源内容
export function getArticleInfo(params : { id : number }) {
  return axios.get('api/articleInfo', { params })
}

// 新增资源内容
export function addArticleInfo(data : addArticleInfoType) {
  return axios.post('api/addArticleInfo', data)
}

// 修改资源内容
export function updateArticleInfo(data : addArticleInfoType) {
  return axios.post('api/updateArticleInfo', data)
}

// 获取文本内容
export function getArticleTextInfo(params : { id : number }) {
  return axios.get('api/articleTextInfo', { params })
}

// 新增文本内容
export function addArticleTextInfo(data : addArticleTextInfoType) {
  return axios.post('api/addArticleTextInfo', data)
}

// 修改文本内容
export function updateArticleTextInfo(data : addArticleTextInfoType) {
  return axios.post('api/updateArticleTextInfo', data)
}
// 删除资源
export function deleteArticle(data : { id:number|Array<number> }) {
  return axios.post('api/deleteArticle', data)
}

// 删除资源
export function deleteArticleText(data : { id:number|Array<number> }) {
  return axios.post('api/deleteArticleText', data)
}
