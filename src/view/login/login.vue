<template>
  <div class="login">
    <div class="login-wrap">
      <h3>账号密码登录</h3>
      <el-form ref="ruleFormRef" :model="state.formInline" :rules="rules" size="large">
        <el-form-item v-if="state.formInline.model" prop="username">
          <el-input v-model.trim="state.formInline.username" prefix-icon="User" placeholder="用户名" @change=" state.model = false" />
        </el-form-item>
        <el-form-item v-else prop="phone">
          <el-input v-model.trim="state.formInline.phone" prefix-icon="phone" placeholder="手机号" @change=" state.model = false" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model.trim="state.formInline.password" prefix-icon="Lock" show-password placeholder="密码" @change=" state.model = false" @keyup.enter.native="onSubmit(ruleFormRef)" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="state.formInline.checked" :indeterminate="false">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%" type="primary" @click="onSubmit(ruleFormRef)">登 录</el-button>
        </el-form-item>
        <el-form-item>
          <p style="width: 100%;text-align: right">
            <el-link type="primary" @click="changeModel">{{ state.formInline.model?'手机号登录':'密码登录' }}</el-link>&nbsp;&nbsp;
            <el-link type="warning">忘记密码</el-link>
          </p>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Md5 } from 'ts-md5'
import { useRouter } from 'vue-router'
import { login } from '@/api/user'
import { userStore } from '@/store/user'

const store = userStore()
const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' },
    { pattern: /^[0-9a-zA-Z]*$/g, message: '密码为数字，小写字母，大写字母' }
  ],
  password: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
    { pattern: /^[0-9a-zA-Z]*$/g, message: '密码为数字，小写字母，大写字母' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: '请输入合法手机号/电话号', trigger: 'blur' }
  ]
})

const state = reactive({
  formInline: {
    username: '',
    password: '',
    phone: '',
    model: true,
    checked: false,
    time: ''
  },
  model: false
})

let onSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      let f = state.formInline
      !state.model ? f.password = Md5.hashStr(f.password).toUpperCase() : ''
      login(f).then(res => {
        if (f.checked) {
          f.time = String(new Date())
          localStorage.setItem('userForm', JSON.stringify(f))
        } else localStorage.removeItem('userForm')
        store.setUserInfo(res.data)
        router.push('/main/home')
      })
    }
  })
}

let getDays = (startDay : number, endDay : number) => {
  let sd = new Date(startDay).getTime()
  let end = new Date(endDay).getTime()
  return (end - sd) / (1000 * 60 * 60 * 24)
}

let changeModel = () => {
  state.formInline.model = !state.formInline.model
}

onMounted(() => {
  let u = localStorage.getItem('userForm')
  if (u) {
    u = JSON.parse(u)
    if (getDays(u.time, new Date().getTime()) <= 4) {
      state.formInline = { ...u }
      state.model = true
    } else {
      localStorage.removeItem('userForm')
      state.model = false
    }
  }
})
</script>

<style scoped lang="scss">
.login{
  width: 100vw;
  height: 100vh;
  background: url("../../assets/img/login.png") no-repeat 100% 100%;
  position: relative;
  z-index: 0;
  .login-wrap{
    position: absolute;
    width: 500px;
    height: 400px;
    padding:10px 30px;
    box-sizing: border-box;
    background-color: rgba(99,99,99,0.3);
    top: 20vh;
    left: calc(50% - 250px);
    z-index: 9;
    >h3{
      text-align: center;
      color: orange;
      height: 50px;
      line-height: 50px;
      font-size: 22px;
      margin-bottom: 20px;
    }
  }
}
</style>
