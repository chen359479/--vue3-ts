<template>
  <div class="sendBroadcast">
    <el-form ref="ruleForm" size="large" :inline="true" :model="state.msg" :rules="state.rules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="state.msg.title" placeholder="标题" />
      </el-form-item>
      <el-form-item label="等级" prop="grade">
        <el-select v-model="state.msg.grade" placeholder="等级">
          <el-option label="高" :value="1" />
          <el-option label="中" :value="2" />
          <el-option label="低" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="过期时间" prop="expiration_time">
        <el-date-picker
          v-model="state.msg.expiration_time"
          :picker-options="state.pickerOptions"
          type="datetime"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="vertical-align: middle" @click="submit(ruleForm)">发布</el-button>
      </el-form-item>
    </el-form>
    <t-editor ref="edit" :value="state.msg.content" :disabled="false" @getContent="getEditValue" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { writeBroadcast } from '@/api/broadcast'

import TEditor from '@/components/TEditor/index.vue'
import { userStore } from '@/store/user'
const edit = ref(null)
const store = userStore()
const ruleForm = ref<FormInstance>()
const state = reactive({
  msg: {
    title: '',
    content: '',
    grade: 1,
    expiration_time: null
  },
  rules: {
    title: [
      { required: true, message: '请输入标题名称', trigger: 'blur' },
      { min: 5, max: 40, message: '长度在 5 到 40 个字符', trigger: 'blur' }
    ],
    grade: [
      { required: true, message: '请选择广播等级', trigger: 'blur' }
    ],
    expiration_time: [
      { required: true, message: '请选择过期时间', trigger: 'blur' }
    ]
  },
  pickerOptions: {
    disabledDate(time : Date) {
      return time.getTime() < Date.now() - 8.64e7
    }
  }
})

let submit = (formEl: FormInstance) => {
  if (store.userInfo.broadcast !== 1) {
    ElMessage.warning('您已被禁用广播功能')
    return
  }
  if (!state.msg.content) {
    ElMessage.warning('请填写广播内容')
    return
  }
  formEl.validate((valid) => {
    if (valid) {
      writeBroadcast(state.msg).then(res => {
        ElMessage.success(res.msg)
      })
    }
  })
}

let getEditValue = (value : string) => {
  state.msg.content = value
}
</script>

<style scoped lang="scss">

</style>
