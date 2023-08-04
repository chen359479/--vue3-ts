<template>
  <div class="userManagement">
    <header>
      <el-select v-model="state.searchForm.state" placeholder="请选择" class="_w_100">
        <el-option v-for="item in state.userStateList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>

      <el-input v-model.trim="state.searchForm.username" placeholder="输入用户名" class="_w_200" />
      <el-input v-model.trim="state.searchForm.phone" type="number" placeholder="输入手机号" class="_w_200" />
      <el-button type="primary" icon="Search" @click="getUserLists">搜索</el-button>
      <el-button type="success" icon="Plus" @click.stop="openUserForm()">添加</el-button>
      <el-button type="danger" icon="Delete" @click="deleteUser()">批量删除</el-button>
    </header>
    <main>
      <el-table :data="state.userList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="username" label="用户名" align="center" />
        <el-table-column label="角色" align="center">
          <template #default="scope">
            <span> {{ store.userJit.filter(item=>item.value === scope.row.type)[0].label }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column label="性别" align="center">
          <template #default="scope">
            <span> {{ scope.row.sex?'男':'女' }} </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-link v-if="scope.row.state === 1" type="success" :underline="false">{{
              store.userState.filter(item=>item.value === scope.row.state)[0].label
            }}
            </el-link>
            <el-link v-else-if="scope.row.state === 2" type="warning" :underline="false">{{
              store.userState.filter(item=>item.value === scope.row.state)[0].label
            }}
            </el-link>
            <el-link v-else-if="scope.row.state === 3" type="danger" :underline="false">{{
              store.userState.filter(item=>item.value === scope.row.state)[0].label
            }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="最近操作时间" align="center" />
        <el-table-column label="操作" align="center" width="180">
          <template #default="scope">
            <el-link type="success" @click="openUserForm(scope.row)">编辑</el-link>
            <el-link type="danger" style="margin: 0 10px" @click="deleteUser(scope.row.id)">删除</el-link>
            <el-link type="info" @click="updatePassword(scope.row.id)">修改密码</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="_pagination"
        :current-page="state.searchForm.page"
        :page-sizes="[10,20,30]"
        :page-size="state.searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.searchForm.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </main>
    <el-dialog
      v-model="state.userFormShow"
      :title="state.userFormTitle"
      width="30%"
    >
      <el-form ref="ruleFormRef" :model="state.userForm" :rules="state.rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="state.userForm.username" />
        </el-form-item>
        <el-form-item v-if=" state.userFormTitle === '添加用户' " label="密码" prop="password">
          <el-input v-model.trim="state.userForm.password" show-password />
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
        <el-form-item label="广播" prop="sex">
          <el-radio-group v-model="state.userForm.broadcast">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">只读</el-radio>
            <el-radio :label="3">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="state.userForm.state">
            <el-radio v-for="item in store.userState" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="state">
          <el-radio-group v-model="state.userForm.type">
            <el-radio v-if="store.userInfo.type === 'superAdmin'" :label="store.userJit[1].value">{{ store.userJit[1].label }}</el-radio>
            <el-radio v-if="store.userInfo.type !== 'user'" :label="store.userJit[2].value">{{ store.userJit[2].label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="state.userFormShow = false">取 消</el-button>
        <el-button v-if="state.userFormTitle === '添加用户'" type="primary" @click.stop="createUser(ruleFormRef)">确 定</el-button>
        <el-button v-else type="primary" @click.stop="updateUser(ruleFormRef)">确 定</el-button>
      </template>
    </el-dialog>
    <el-dialog
      v-model="state.updatePasswordForm.show"
      title="修改密码"
      width="30%"
    >
      <el-form ref="pwRuleForm" :model="state.updatePasswordForm" :rules="state.pwRules" label-width="100px">

        <el-form-item label="管理员密码" prop="adminPassword">
          <el-input v-model.trim="state.updatePasswordForm.adminPassword" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model.trim="state.updatePasswordForm.newPassword" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input v-model.trim="state.updatePasswordForm.rePassword" show-password />
        </el-form-item>

      </el-form>
      <template #footer>
        <el-button @click="state.updatePasswordForm.show = false">取 消</el-button>
        <el-button type="primary" @click="updateUserPassword(pwRuleForm)">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { Md5 } from 'ts-md5'
import { userStore } from '@/store/user'
import { register, getUserList as getUserListApi, updateUserPassword as updateUserPasswordApi, deleteUser as deleteUserApi, updateUser as updateUserApi } from '@/api/user'

const store = userStore()
const ruleFormRef = ref<FormInstance>()
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
  searchForm: { // 搜索用户表单
    username: '',
    phone: '',
    state: '0',
    page: 1,
    pageSize: 10,
    total: 10
  },
  // 用户状态表单
  userStateList: [
    {
      value: '0',
      label: '全部'
    },
    ...store.userState
  ],
  userList: [],
  activeUserList: [], // 选中的列表
  currentPage: 1,
  userFormShow: false, // 控制表单的显隐
  userFormTitle: '', // 表单的标题
  userForm: {
    username: '',
    phone: '',
    state: 1,
    sex: 1,
    type: 'user',
    broadcast: 1,
    password: ''
  },
  rules: {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' },
      { pattern: /^[0-9a-zA-Z]*$/g, message: '用户名为数字，小写字母，大写字母' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: '请输入合法手机号/电话号', trigger: 'blur' }
    ],
    sex: [
      { required: true, message: '请选择性别', trigger: 'blur' }
    ],
    state: [
      { required: true, message: '请设置用户状态', trigger: 'blur' }
    ],
    type: [
      { required: true, message: '请设置用户角色', trigger: 'blur' }
    ],
    password: [
      { required: true, min: 6, message: '请设置最少6位用户密码', trigger: 'blur' },
      { pattern: /^[0-9a-zA-Z]*$/g, message: '密码由最少6位为数字或小写字母或大写字母组成' }
    ],
    broadcast: [{ required: true, trigger: 'blur' }]
  },
  updatePasswordForm: {
    adminPassword: '',
    newPassword: '',
    rePassword: '',
    show: false,
    id: 1
  },
  pwRules: {
    adminPassword: [
      { required: true, min: 6, message: '请输入最少6位密码', trigger: 'blur' },
      { pattern: /^[0-9a-zA-Z]*$/g, message: '密码由最少6位为数字或小写字母或大写字母组成' }
    ],
    newPassword: [
      { required: true, min: 6, message: '请输入密码', trigger: 'blur' },
      { pattern: /^[0-9a-zA-Z]*$/g, message: '密码为6位由数字或小写字母或大写字母组成' }
    ],
    rePassword: [
      { required: true, validator: validatePass2, trigger: 'blur' }
    ]
  }
})

// 列表选中事件
let handleSelectionChange = (val : any) => {
  state.activeUserList = val
}

let handleSizeChange = (val : number) => {
  state.searchForm.page = 1
  state.searchForm.pageSize = val
  getUserLists()
}

let handleCurrentChange = (val:number) => {
  state.searchForm.page = val
  getUserLists()
}

// 获取用户列表
let getUserLists = () => {
  getUserListApi(state.searchForm).then(res => {
    state.userList = res.data
    state.searchForm.total = res.total
  })
}
// 删除用户
let deleteUser = (id?:number) => {
  ElMessageBox.confirm(`确定删除${id ? '此' : '这些'}用户?`, '提示', {
    type: 'warning'
  }).then(() => {
    deleteUserApi({ id: id || state.activeUserList.map((item : { id:number }) => item.id) }).then(res => {
      getUserLists()
      ElMessage.success('删除成功!')
    })
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 打开编辑用户的弹框
let openUserForm = (data : any) => {
  state.userFormShow = true
  if (data) {
    state.userFormTitle = '编辑用户'
    state.userForm = { ...data }
  } else {
    state.userFormTitle = '添加用户'
    state.userForm = {
      username: '',
      phone: '',
      state: 1,
      sex: 1,
      type: 'user',
      broadcast: 1,
      password: ''
    }
  }
}

// 创建用户
let createUser = (formEl: FormInstance) => {
  formEl.validate((valid) => {
    if (valid) {
      state.userForm.password = Md5.hashStr(state.userForm.password).toUpperCase()
      register(state.userForm).then(res => {
        getUserLists()
        state.userFormShow = false
        ElMessage.success(res.msg)
      })
    }
  })
}

// 更新用户信息
let updateUser = (formEl: FormInstance) => {
  formEl.validate((valid) => {
    if (valid) {
      updateUserApi(state.userForm).then(res => {
        getUserLists()
        state.userFormShow = false
        ElMessage.success('更新用户信息成功')
      })
    }
  })
}

// 更新用户密码
let updatePassword = (id:number) => {
  state.updatePasswordForm.show = true
  state.updatePasswordForm.id = id
}

// 更新用户密码接口
let updateUserPassword = (formEl: FormInstance) => {
  formEl.validate((valid) => {
    if (valid) {
      let f : { adminPassword:string, newPassword:string, id : number} = {
        adminPassword: '',
        newPassword: '',
        id: 0
      }

      f.adminPassword = Md5.hashStr(state.updatePasswordForm.adminPassword).toUpperCase()
      f.newPassword = Md5.hashStr(state.updatePasswordForm.adminPassword).toUpperCase()
      f.id = state.updatePasswordForm.id
      updateUserPasswordApi(f).then(res => {
        state.updatePasswordForm.show = false
        ElMessage.success(res.msg)
      })
    }
  })
}

onMounted(() => {
  getUserLists()
})
</script>

<style scoped lang="scss">
.userManagement {
  > header {
    > * {
      margin: 0 10px;
    }

    :first-child {
      margin-left: 0;
    }
  }

  > main {
    margin-top: 20px;
    padding-bottom: 60px;
  }
}
</style>
