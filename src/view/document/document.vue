<template>
  <div class="excel">
    <header>
      <el-input v-model.trim="state.searchForm.type" placeholder="文件类型" class="_w_200" />
      <el-input v-model.trim="state.searchForm.name" placeholder="文件名称" class="_w_200" />
      <el-button type="primary" icon="Search" @click="getDocumentList">搜索</el-button>
      <el-button type="danger" icon="Delete" :disabled="!state.activeList.length">批量删除</el-button>
      <el-button type="success" @click="openAdd(false)">单个上传</el-button>
      <el-button type="warning" @click="openAdd(true)">批量上传</el-button>
    </header>
    <main>
      <el-table :data="state.docList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="name" label="文件名" align="center" />
        <el-table-column prop="type" label="文件类型" align="center" width="220" />
        <el-table-column prop="created_time" label="文件上传时间" align="center" width="300" />
        <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
            <el-link type="primary" @click="downloadDoc(scope.row)">下载</el-link>
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
      <el-dialog v-model="state.addDocumentShow" title="文件上传" width="30%">
        <div style="text-align: center">
          <el-upload
            drag
            :headers="state.headers"
            :before-upload="beforeAvatarUpload"
            :on-success="fileSuccess"
            action="/api/addDocument"
            accept=".img,.jpg,.png ,.img,.docx,.doc,.ppt,.excel,.pptx,.txt,.xls,.xlsx"
            :multiple="state.multiple"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="state.addDocumentShow = false">取 消</el-button>
          <el-button type="primary" @click="state.addDocumentShow = false">确 定</el-button>
        </span>
      </el-dialog>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

import { getDocumentList as getDocumentListApi } from '@/api/document'

import { userStore } from '@/store/user'
const store = userStore()

const state = reactive({
  searchForm: {
    name: '',
    page: 1,
    pageSize: 10,
    type: '',
    total: 0
  },
  activeList: [],
  docList: [],
  addDocumentShow: false,
  // 是否多文件上传
  multiple: false,
  headers: {
    authorization: store.userInfo.token
  }
})

let handleSelectionChange = (val:any) => {
  state.activeList = val
}

let handleSizeChange = (val:number) => {
  state.searchForm.page = 1
  state.searchForm.pageSize = val
  getDocumentList()
}

let handleCurrentChange = (val:number) => {
  state.searchForm.page = val
  getDocumentList()
}

// 获取文档数据
let getDocumentList = () => {
  getDocumentListApi(state.searchForm).then(res => {
    state.docList = res.data
    state.searchForm.total = res.total
  })
}

// 下载文档
let downloadDoc = (row:any) => {
  let elemIF = document.createElement('iframe')
  elemIF.src = row.url
  elemIF.style.display = 'none'
  document.body.appendChild(elemIF)
}
// 打开文件上传按钮
let openAdd = (type:boolean) => {
  state.multiple = type
  state.addDocumentShow = true
}

//  限制上传的文件
let beforeAvatarUpload = (file:any) => {
  let i = file.name.lastIndexOf('.') // 找到后缀名点的位置
  let suffix = file.name.substring(i, file.name.length) // 截取文件的后缀名
  let arr = ['.img', '.jpg', '.png', '.img', '.docx', '.doc', '.ppt', '.excel', '.pptx', '.txt', '.xls', '.xlsx']
  const type = arr.includes(suffix)
  if (!type) {
    ElMessage.error('上传的文件类型只能是' + arr.join('|') + '中的类型')
  }
  return type
}

// 文件上传成功
let fileSuccess = () => {
  ElMessage.success('文件上传成功！')
  state.addDocumentShow = false
}

onMounted(() => {
  getDocumentList()
})
</script>

<style scoped lang="scss">
.excel {
  >header{
    >*{
      margin-right: 10px;
    }
    margin-bottom: 20px;
  }
  > main {
    margin-top: 20px;
    padding-bottom: 60px;
  }
}
</style>
