<template>
  <div class="wxUser">
    <header>
      <el-input v-model.trim="state.searchForm.username" placeholder="输入用户名" class="_w_200" />
      <el-input v-model.trim="state.searchForm.phone" type="number" placeholder="输入手机号" class="_w_200" />
      <el-button type="primary" icon="Search" @click="getWxuserList">搜索</el-button>
      <el-button type="danger" icon="Delete" @click="deleteWxuser()">批量删除</el-button>
    </header>
    <main>
      <el-table :data="state.wxuserList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="username" label="用户名" align="center" />
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column label="性别" align="center">
          <template #default="scope">
            <span> {{ scope.row.sex?'男':'女' }} </span>
          </template>
        </el-table-column>
        <el-table-column label="头像" align="center" prop="city" />
        <el-table-column prop="created_time" label="创建时间" align="center" />
        <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
            <el-link type="danger" style="margin: 0 10px" @click="deleteWxuser(scope.row.id)">删除</el-link>
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
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { getWxuserList as getWxuserListApi, deleteWxuser as deleteWxuserApi } from '@/api/wxuser'

const state = reactive({
  searchForm: {
    username: '',
    phone: '',
    page: 1,
    pageSize: 10,
    total: 10
  },
  wxuserList: [],
  activeUserList: [{ id: 0 }] // 选中用户的列表
})

let handleSelectionChange = (val:any) => {
  state.activeUserList = val
}
let handleSizeChange = (val:number) => {
  state.searchForm.page = 1
  state.searchForm.pageSize = val
  getWxuserList()
}
let handleCurrentChange = (val:number) => {
  state.searchForm.page = val
  getWxuserList()
}
// 获取微信用户
let getWxuserList = () => {
  getWxuserListApi(state.searchForm).then(res => {
    state.wxuserList = res.data
    state.searchForm.total = res.total
  })
}

// 删除微信用户
let deleteWxuser = (id:number) => {
  ElMessageBox.confirm(`确定删除${id ? '此' : '这些'}用户?`, '提示', {
    type: 'warning'
  }).then(() => {
    deleteWxuserApi({ id: id || state.activeUserList.map(item => item.id) }).then(res => {
      getWxuserList()
      ElMessage.success('删除成功!')
    })
  })
}

onMounted(() => {
  getWxuserList()
})
</script>

<style scoped lang="scss">
.wxUser {
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
