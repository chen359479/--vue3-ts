<template>
  <div class="classSet">
    <header>
      <el-button type="success" icon="Plus" @click.stop="addClass()">添加</el-button>
      <el-button type="danger" icon="Delete" :disabled="!state.activeClassList.length" @click="deleteClass()">批量删除</el-button>
    </header>

    <el-table :data="state.classList" style="width: 100%" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="title" label="名称" align="center" />
      <el-table-column label="类型" align="center">
        <template #default="scope">
          {{ scope.row.type?"资源":"文章" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <el-link type="success" @click="editClass(scope.row)">编辑</el-link>
          <el-link type="danger" style="margin: 0 10px" @click="deleteClass(scope.row.id)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="state.addClassForm"
      :title="state.form.edit"
      width="30%"
    >
      <div>
        <el-input v-model="state.form.title" placeholder="请输入类别名称" />
        <p style="height: 10px;width: 1px" />
        <el-switch v-model="state.form.type" active-text="资源" inactive-text="文章" />
      </div>
      <template #footer>
        <el-button @click="state.addClassForm = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTopClass as getTopClassApi, deleteClass as deleteClassApi, addClass as addClassApi, updateClass } from '@/api/class'

const state = reactive({
  // 控制
  addClassForm: false,
  form: {
    edit: '',
    title: '',
    type: false
  },
  // 类别列表
  classList: [],
  activeClassList: []
})

// 获取类别
let getTopClass = () => {
  getTopClassApi().then(res => {
    state.classList = res.data
  })
}

// 添加类别
let addClass = () => {
  state.form = {
    edit: '',
    title: '',
    type: false
  }
  state.form.edit = '添加'
  state.addClassForm = true
}

// 编辑类别
let editClass = (row : any) => {
  console.log(row)
  state.form = row
  state.form.edit = '修改'
  state.addClassForm = true
}

// 删除类别函数
let deleteClass = (id? : number) => {
  let msg = id ? '确定删除该类别？' : '确定删除这些类别？'
  ElMessageBox.alert(msg, '提示', {
    type: 'warning'
  }).then(() => {
    let obj = id ? { id } : {
      id: state.activeClassList.map((item:{id:number}) => {
        return item.id
      })
    }

    deleteClassApi(obj).then(res => {
      getTopClass()
      ElMessage.success('删除成功!')
    })
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 提交编辑
let submit = () => {
  if (state.form.edit === '添加') {
    addClassApi(state.form).then(res => {
      if (res.code === 200) {
        getTopClass()
        state.addClassForm = false
        ElMessage.success(res.msg)
      } else {
        ElMessage.error(res.msg)
      }
    })
  } else {
    updateClass(state.form).then(res => {
      if (res.code === 200) {
        getTopClass()
        state.addClassForm = false
        ElMessage.success(res.msg)
      } else {
        ElMessage.error(res.msg)
      }
    })
  }
}
// 表格选中
let handleSelectionChange = (val) => {
  state.activeClassList = val
}

onMounted(() => {
  getTopClass()
})
</script>

<style scoped lang="scss">
.classSet{
  >header{
    margin-bottom: 20px;
  }
}
</style>
