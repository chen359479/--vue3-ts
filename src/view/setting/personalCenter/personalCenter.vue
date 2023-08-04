<template>
  <div class="personalCenter">
    <div class="left-btn">
      <el-link :type="state.menu?'primary':'info'" :underline="false" @click="state.menu = 1">个人信息</el-link><br>
      <el-link :type="!state.menu?'primary':'info'" :underline="false" @click="state.menu = 0">修改密码</el-link>
    </div>
    <div v-show="state.menu" class="user-info">
      <el-form ref="ruleForm" size="large" :model="state.userForm" label-position="left" :rules="state.rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="state.userForm.username" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.trim="state.userForm.phone" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="state.userForm.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="type">
          <span> {{ store.userJit.filter(item=>item.value === state.userForm.type)[0].label }} </span>
        </el-form-item>
        <el-form-item label="创建时间" prop="created_time">
          <div>{{ state.userForm.created_time }}</div>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="updateUser(ruleForm)">提 交</el-button>
    </div>
    <div v-show="!state.menu" class="user-password">
      <el-form ref="pwRuleForm" size="large" :model="state.updatePasswordForm" :rules="state.pwRules" label-width="100px">
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model.trim="state.updatePasswordForm.newPassword" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input v-model.trim="state.updatePasswordForm.rePassword" show-password />
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="updateMePassword(pwRuleForm)">提 交</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { userStore } from '@/store/user'
import { Md5 } from 'ts-md5'

import { updateUser as updateUserApi, updateMePassword as updateMePasswordApi } from '@/api/user'

const store = userStore()
const ruleForm = ref<FormInstance>()
const pwRuleForm = ref<FormInstance>()

let validatePass2 = (rule : string, value : string, callback : Function) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== state.updatePasswordForm.newPassword) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const state = reactive({
  userForm: JSON.parse(JSON.stringify(store.userInfo)),
  menu: 1,
  rules: {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: '请输入合法手机号/电话号', trigger: 'blur' }
    ],
    sex: [
      { required: true, message: '请选择性别', trigger: 'blur' }
    ]
  },
  updatePasswordForm: {
    newPassword: '',
    rePassword: '',
    id: store.userInfo.id
  },
  pwRules: {
    newPassword: [
      { required: true, min: 6, message: '请输入最少6位密码', trigger: 'blur' },
      { pattern: /^[0-9a-zA-Z]*$/g, message: '密码由最少6位为数字或小写字母或大写字母组成', trigger: 'change' }
    ],
    rePassword: [
      { required: true, validator: validatePass2, trigger: 'blur' }
    ]
  }
})

// 修改个人信息
let updateUser = (formEl: FormInstance) => {
  formEl.validate((valid) => {
    if (valid) {
      updateUserApi(state.userForm).then(res => {
        ElMessage.success('更新用户信息成功')
        store.setUserInfo({ ...state.userForm })
      })
    }
  })
}

// 修改密码
let updateMePassword = (formEl: FormInstance) => {
  formEl.validate((valid) => {
    if (valid) {
      let u = { ...state.updatePasswordForm }
      u.newPassword = Md5.hashStr(u.newPassword).toUpperCase()
      updateMePasswordApi(u).then(res => {
        ElMessage.success('修改密码成功')
      })
    }
  })
}

</script>

<style scoped lang="scss">
.personalCenter{
  padding-top: 40px;
  .left-btn{
    text-align: right;
    width: 20%;
    display: inline-block;
    vertical-align: top;
    >a{
      height: 20px;
      line-height: 20px;
      font-size: 16px;
      padding-right: 30px;
      border-right: 2px solid #fff;
      margin-bottom: 20px;
      cursor: pointer;
    }
    .el-link--primary{
      border-right: 2px solid #409EFF;
    }

  }
  .user-info,.user-password{
    display: inline-block;
    margin-left: 80px;
    width: 600px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 15px 80px;
    >span{
      width: 100px;
      display: inline-block;
      text-align: center;
    }
  }
}
</style>
