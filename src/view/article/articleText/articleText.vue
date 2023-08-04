<template>
  <div class="articleText">
    <header v-show="!state.update.switch">
      <el-select v-model="state.searchForm.classID" placeholder="请选择" @change="topClassChange">
        <el-option v-for="item in state.articleTextClass" :key="item.id" :label="item.title" :value="item.id" />
      </el-select>
      <el-select v-model="state.searchForm.type" placeholder="请选择" @change="statusChange">
        <el-option v-for="item in state.statusList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" icon="Plus" @click="updateArticle(true)">添加</el-button>
      <el-button type="danger" icon="Delete" :disabled="!state.activeArticleList.length" @click="deleteArticle()">批量删除</el-button>
    </header>
    <main v-show="!state.update.switch">
      <el-table :data="state.activeTextData" border :default-sort="{prop: 'hits'}" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="title" label="标题" align="center" width="800" show-overflow-tooltip />
        <el-table-column prop="price" label="价格" align="center" />
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-link v-if="scope.row.status" type="success" :underline="false">上架</el-link>
            <el-link v-else type="warning" :underline="false">下架</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="hits" sortable label="浏览次数" align="center" />
        <el-table-column prop="created_time" label="创建时间" align="center" />
        <el-table-column label="操作" align="center" width="180">
          <template #default="scope">
            <el-link type="primary" style="margin: 0 10px" @click="updateArticle(true,scope.row.id)">编辑</el-link>
            <el-link type="danger" style="margin: 0 10px" @click="deleteArticle(scope.row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="state.searchForm.page"
        :page-sizes="[10,20,30]"
        class="_pagination"
        :page-size="state.searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.searchForm.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </main>
    <update-article-text v-if="state.update.switch" :id="state.update.id" :class-i-d="state.update.classID" @closeUp="closeUpdateTextArticle()" />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { getTopClass as getTopClassApi } from '@/api/class'
import { getArticleTextList as getArticleTextListApi, deleteArticleText as deleteArticleTextApi } from '@/api/article'
import UpdateArticleText from './updateArticleText.vue'

const state = reactive({
  searchForm: {
    classID: 0,
    page: 1,
    pageSize: 10,
    type: 3,
    total: 0
  },
  // 分类
  articleTextClass: [],
  activeTextData: [],
  activeArticleList: [],
  statusList: [
    {
      label: '全部',
      value: 3
    }, {
      label: '上架',
      value: 1
    }, {
      label: '下架',
      value: 0
    }
  ],
  // 修改的表单
  update: {
    title: '编辑',
    switch: false,
    id: 0,
    classID: 0
  }
})

let handleSelectionChange = (val : any) => {
  state.activeArticleList = val
}
let handleSizeChange = (val:number) => {
  state.searchForm.page = 1
  state.searchForm.pageSize = val
  getArticleTextList()
}
let handleCurrentChange = (val:number) => {
  state.searchForm.page = val
  getArticleTextList()
}
// 获取分类
let getTopClass = () => {
  getTopClassApi({ type: 0 }).then(res => {
    state.articleTextClass = res.data
    state.searchForm.classID = res.data[0].id
    getArticleTextList()
  })
}
// 分类的切换
let topClassChange = (val : number) => {
  state.searchForm.page = 1
  state.searchForm.classID = val
  getArticleTextList()
}
// 状态切换事件
let statusChange = (val : number) => {
  state.searchForm.page = 1
  state.searchForm.type = val
  getArticleTextList()
}
// 获取数据
let getArticleTextList = () => {
  let f = {
    ...state.searchForm,
    type: state.searchForm.type === 3 ? null : state.searchForm.type
  }
  getArticleTextListApi(f).then(res => {
    state.activeTextData = res.data
    state.searchForm.total = res.total
  })
}
// 删除
let deleteArticle = (id : number) => {
  ElMessageBox.confirm(`确定删除${id ? '此' : '这些'}资源?`, '提示', {
    type: 'warning'
  }).then(() => {
    deleteArticleTextApi({ id: id || state.activeArticleList.map((item : { id:number }) => item.id) }).then(res => {
      getArticleTextList()
      ElMessage.success('删除成功!')
    })
  })
}
// 修改
let updateArticle = (type:boolean, id:number) => {
  state.update = {
    title: id ? '编辑' : '新增',
    switch: type,
    id,
    classID: state.searchForm.classID
  }
}
// 关闭新增和编辑
let closeUpdateTextArticle = () => {
  state.update.switch = false
  getArticleTextList()
}

onMounted(() => {
  getTopClass()
})
</script>

<style scoped lang="scss">
.articleText {
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
