import axios from '../assets/js/request'

interface loginType {
  username?: string,
  password: string,
  phone?: string,
  model: boolean,
  checked: boolean
}

interface getUserListType{
  username: string,
  phone: string,
  state: string,
  page: number,
  pageSize: number,
  total: number
}

interface userType {
  username: string,
  phone: string,
  state: number,
  sex: number,
  type: string,
  broadcast: number,
  password: string,
  id?:number
}

interface upUserPWType{
  adminPassword: string,
  newPassword: string,
  id: number
}

interface upMePwType{
  newPassword: string,
  rePassword: string,
  id: number
}

export function login(data: loginType) {
  return axios.post('unApi/login', data)
}

export function register(data: userType) {
  return axios.post('api/register', data)
}

export function getUserList(params: getUserListType) {
  return axios.get('api/userList', { params })
}

export function updateUserPassword(data: upUserPWType) {
  return axios.post('api/updateUserPassword', data)
}

export function deleteUser(data: { id:number|Array<number> }) {
  return axios.post('api/deleteUser', data)
}

export function updateUser(data: userType) {
  return axios.post('api/updateUser', data)
}

export function updateMePassword(data: upMePwType) {
  return axios.post('api/updateMePassword', data)
}

