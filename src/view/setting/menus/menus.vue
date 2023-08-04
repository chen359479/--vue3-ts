<template>
  <div class="menus">
    <el-row>
      <el-col :span="4">
        <el-scrollbar class="el-scrollbar-view">
          <el-card v-for="(item,index) in store.allMenuList" :key="index" class="box-card" shadow="always">
            <div slot="header" class="clearfix">
              <span v-if="index === 0">顶级菜单</span>
              <span v-else-if="index === 1">二级菜单</span>
              <span v-else-if="index === 2">三级菜单</span>
              <el-link type="primary" style="float: right; padding: 3px 0" :underline="false" @click="addMenuForm(index)">添加菜单</el-link>
            </div>
            <div v-for="i in item" :key="i.id" class="link">
              <el-link :type="i.conclude?'info':'primary'" :title="i.conclude?'已被纳入上级菜单中':'未被纳入上级菜单中'" @click="updateMenuForm(i)">{{ i.title }}</el-link>
              <el-link v-if="i.name !== 'home'" type="danger" :underline="false" @click="deleteMenu(i.id)">删除</el-link>
            </div>
          </el-card>
        </el-scrollbar>
      </el-col>
      <el-col :span="14">
        <el-card shadow="always" style="margin:20px 0 0 20px;">
          <el-form ref="ruleFormRef" size="large" :model="state.menuForm" :rules="state.rules" label-width="100px">
            <h2 class="h2"> {{ state.menuForm.msg }} </h2>
            <el-form-item label="菜单路径" prop="viewPath">
              <el-input v-model="state.menuForm.viewPath" placeholder="页面路径" />
            </el-form-item>
            <el-form-item label="组件名称" prop="name">
              <el-input v-model="state.menuForm.name" placeholder="组件名称" />
            </el-form-item>
            <el-form-item label="菜单名称" prop="title">
              <el-input v-model="state.menuForm.title" placeholder="菜单名称" />
            </el-form-item>
            <el-form-item label="排序" prop="sequence">
              <el-input-number v-model="state.menuForm.sequence" style="width: 100%" :controls="false" :min="0" placeholder="请输入数字，数字越小排序越靠前" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-switch v-model="state.menuForm.type" active-text="页面" inactive-text="菜单" @change="changeType" />
            </el-form-item>
            <el-form-item v-if="!state.menuForm.type" label="子集">
              <el-select v-model="state.menuForm.children" no-data-text="没有可以添加的子集" style="width: 100%" multiple collapse-tags placeholder="请选择">
                <el-option
                  v-for="item in state.canSubset"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="菜单图标" prop="icon">
              <el-input v-model="state.menuForm.icon" placeholder="请选择icon" @click="()=>state.dialogVisible = true">
                <template #prepend> <el-button :icon="state.menuForm.icon" /></template>
              </el-input>
            </el-form-item>
            <el-form-item label="查看权限">
              <el-checkbox-group v-model="state.menuForm.astrict">
                <el-checkbox v-for="item in userStore.userJit" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="state.menuForm.id?updateMenus(ruleFormRef):addMenus(ruleFormRef)">提交</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always" style="margin:20px 0 0 20px;">
          <div style="height: 60vh">
            <el-steps direction="vertical" :active="3">
              <el-step title="添加菜单">
                <div slot="description">
                  <p>菜单路径、组件名称、菜单名称请勿与现有菜单重复。</p>
                  <p>菜单路径为地址栏显示路径。</p>
                  <p style="color: red">组件名称必须与router.js的name保持一致!!!。</p>
                </div>
              </el-step>
              <el-step title="归纳菜单" description="将新添加的菜单归纳到其上级菜单的子集中。（顶级菜单不用）" />
              <el-step title="重新获取" description="退出，重新登录。" />
            </el-steps>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      v-model="state.dialogVisible"
      title="请选择图标"
      width="80%"
      :before-close="()=>state.dialogVisible = false"
    >
      <div style="display: flex;flex-wrap: wrap">
        <div
          v-for="(name,index) in state.icons"
          :key="index"
          :index="index"
          style="cursor: pointer;padding: 1rem;border: .5px solid #ccc"
          @click="setIcon(name)"
        >
          <component :is="name" style="width: 2rem;height: 2rem" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, computed } from 'vue'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { menuStore } from '@/store/menu'
import { userStore as userStore1 } from '@/store/user'

import { getMenuList as getMenuListApi, getCanAddSubset as getCanAddSubsetApi, deleteMenu as deleteMenuApi, updateMenus as updateMenusApi, writeMenus } from '@/api/menus'
const store = menuStore()
const userStore = userStore1()

const ruleFormRef = ref<FormInstance>()
// 初始化menuForm
const initialMenuForm = () => {
  return {
    viewPath: '',
    name: '',
    title: '',
    sequence: 99,
    children: [],
    icon: '',
    astrict: ['user'],
    type: true,
    msg: '',
    hierarchy: 0,
    dialogVisible: false
  }
}

const state = reactive({
  menuForm: initialMenuForm(),
  canSubset: [],
  dialogVisible: false,
  icons: computed(() => {
    let icons = []
    for (const name in ElementPlusIconsVue) {
      if (Object.prototype.hasOwnProperty.call(ElementPlusIconsVue, name)) {
        icons.push(name)
      }
    }
    return icons
  }),
  rules: {
    viewPath: [
      { required: true, message: '请输入菜单路径', trigger: 'blur' },
      { min: 2, max: 42, message: '长度在 2 到 42 个字符', trigger: 'blur' },
      { pattern: /^\/[0-9a-zA-Z\/]*$/g, message: '菜单路径以/开头后接数字、小写字母、大写字母' }
    ],
    name: [
      { required: true, message: '请输入组件名称', trigger: 'blur' },
      { min: 2, max: 42, message: '长度在 2 到 42 个字符', trigger: 'blur' },
      { pattern: /^[0-9a-zA-Z]*$/g, message: '组件名称为数字，小写字母，大写字母' }
    ],
    title: [
      { required: true, message: '请输入菜单名称', trigger: 'blur' },
      { min: 2, max: 42, message: '长度在 2 到 42 个字符', trigger: 'blur' }
    ],
    sequence: [
      { required: true, message: '请输入排列序号', trigger: 'blur' }
    ],
    icon: [
      { required: true, message: '请选择Icon图标', trigger: 'change' }
    ],
    type: [
      { required: true, message: '请选择菜单类型', trigger: 'blur' }
    ]
  }
})

// 获取列表
let getMenuList = () => {
  getMenuListApi().then(res => {
    store.setAllMenuList(res.data)
    addMenuForm(0)
  })
}

// 初始化添加表单
let addMenuForm = (index : number) => {
  state.menuForm = initialMenuForm()
  let mf = state.menuForm
  mf.hierarchy = index + 1
  switch (mf.hierarchy) {
    case 1:
      mf.msg = '添加顶级菜单'
      break
    case 2:
      mf.msg = '添加二级菜单'
      break
    case 3:
      mf.msg = '添加三级菜单'
  }
  let d = {
    hierarchy: mf.hierarchy,
    children: JSON.stringify(mf.children)
  }
  getCanAddSubset(d)
}

// 菜单类型切换事件
let changeType = () => {
  if (state.menuForm.hierarchy === 3) {
    state.menuForm.type = true
    ElMessage.warning('第三级禁止设置为菜单模式！')
  }
}

// 添加菜单
let addMenus = (formEl: FormInstance) => {
  formEl.validate((valid, fields) => {
    if (valid) {
      writeMenus(state.menuForm).then(res => {
        ElMessage.success(res.msg)
        getMenuList()
      })
    }
  })
}

// 获取能够添加的子集
let getCanAddSubset = (d : {
  hierarchy:number,
  children:string
}) => {
  // 三级菜单设计，减少一个接口请求
  if (d.hierarchy === 3) {
    state.canSubset = []
  } else {
    getCanAddSubsetApi(d).then(res => {
      state.canSubset = res.data
    })
  }
}

// 更新menuForm
let updateMenuForm = (data) => {
  state.menuForm = { ...data, children: JSON.parse(data.children), astrict: JSON.parse(data.astrict), msg: '修改菜单：' + data.title }
  let d = {
    hierarchy: data.hierarchy,
    children: JSON.stringify(data.children)
  }
  getCanAddSubset(d)
}

// 更新menus数据
let updateMenus = (formEl: FormInstance) => {
  formEl.validate((valid, fields) => {
    if (valid) {
      updateMenusApi(state.menuForm).then(res => {
        ElMessage.success(res.msg)
        getMenuList()
      })
    }
  })
}

// 设置icon图标
let setIcon = (icon) => {
  state.menuForm.icon = icon
  state.dialogVisible = false
}

// 删除菜单
let deleteMenu = (id) => {
  ElMessageBox.alert('确定删除此菜单?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteMenuApi({ id }).then(res => {
      ElMessage.success(res.msg)
      getMenuList()
    })
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

onMounted(() => {
  getMenuList()
})
</script>

<style lang="scss" scoped>
.box-card{
  margin-top: 20px;
}
.link{
  width: 100%;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
}
.el-scrollbar-view{
  overflow-x: hidden;
}
.h2{
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
}
.icon-list{
  text-align: center;
  border: 1px solid #999;
  cursor: pointer;
  height: 80px;
  line-height: 80px;
  .icon{
    font-size: 26px;
    width: 100%;
    height: 100%;
  }
}

</style>
