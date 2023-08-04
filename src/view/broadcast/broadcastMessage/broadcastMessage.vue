<template>
  <div class="broadcastMessage">
    <main v-show="!state.read">
      <header>
        <el-select v-model="state.searchForm.grade" placeholder="请选择" class="_w_100">
          <el-option v-for="item in state.gradeTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input v-model.trim="state.searchForm.title" placeholder="待搜索的消息名称" class="_w_200" />
        <el-input v-model.trim="state.searchForm.username" placeholder="待搜索的发布者名称" class="_w_200" />
        <el-button type="primary" icon="Search" @click="getBroadcastList">搜索</el-button>
        <el-button type="warning" @click="empty">清空</el-button>
      </header>
      <el-table
        :data="state.gradeList"
        border
        style="width: 100%"
      >
        <el-table-column
          label="标题"
          align="center"
        >
          <template #default="scope">
            <el-link :underline="false" :type="!scope.row.pastDue && !scope.row.read ?'primary':'info'" @click="readGrade(scope.row)">{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_time"
          label="发布时间"
          align="center"
          width="220"
        />
        <el-table-column
          prop="expiration_time"
          label="过期时间"
          align="center"
          width="220"
        />
        <el-table-column
          label="等级"
          align="center"
          width="220"
        >
          <template #default="scope">
            <el-link :type="gradeFn(scope.row.grade)">{{ state.gradeTypeList.filter(item=>item.value === scope.row.grade)[0].label }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="220"
        >
          <template #default="scope">
            <el-link type="primary" :underline="false" @click="readGrade(scope.row)">查阅</el-link>
            <el-link type="warning" :underline="false" style="margin: 0 5px" @click="deleteGrade(scope.row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="_pagination"
        :current-page=" state.searchForm.page"
        :page-sizes="[10,20,30]"
        :page-size=" state.searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total=" state.searchForm.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </main>
    <div v-show=" state.read" class="msg-content">
      <el-page-header @back="state.read = false" />
      <h5>{{ state.msgData.title }}</h5>
      <p>
        <el-link :underline="false">广播有效期: {{ state.msgData.expiration_time }}</el-link>
        <el-link :type="gradeFn( state.msgData.grade)" :underline="false">
          {{ state.gradeTypeList.filter(item=>item.value === state.msgData.grade)[0].label }}
        </el-link>
      </p>
      <div v-html=" state.msgData.content" />
      <p>
        <el-link type="info" :underline="false">{{ state.msgData.created_time }}</el-link>
        <el-link type="info" :underline="false">{{ state.msgData.username }}</el-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { getBroadcastList as getBroadcastListApi, deleteBroadcast as deleteBroadcastApi, getBroadcastInfo as getBroadcastInfoApi } from '@/api/broadcast'

const state = reactive({
  read: false,
  searchForm: { // 搜索文档的
    title: '',
    username: '',
    grade: 0,
    page: 1,
    pageSize: 10,
    total: 10
  },
  gradeTypeList: [ // 广播消息等级
    {
      value: 0,
      label: '全部'
    }, {
      value: 1,
      label: '高'
    }, {
      value: 2,
      label: '中'
    }, {
      value: 3,
      label: '低'
    }
  ],
  gradeList: [],
  msgData: {
    content: '',
    created_time: '',
    expiration_time: '',
    grade: 1,
    id: 1,
    pastDue: false,
    read: false,
    state: 1,
    title: '',
    username: ''
  },
  rg: [0]
})

let handleSizeChange = (val : number) => {
  state.searchForm.page = 1
  state.searchForm.pageSize = val
  getBroadcastList()
}

let handleCurrentChange = (val: number) => {
  state.searchForm.page = val
  getBroadcastList()
}

// 获取广播列表
let getBroadcastList = () => {
  getBroadcastListApi(state.searchForm).then(res => {
    state.gradeList = res.data.map((item : any) => {
      item.read = state.rg.includes(item.id)
      return item
    })
    state.searchForm.total = res.total
  })
}

// 清空方法
let empty = () => {
  state.searchForm = {
    title: '',
    username: '',
    grade: 0,
    page: 1,
    pageSize: 10,
    total: 10
  }
}
// 标识等级type
let gradeFn = (grade : number) => {
  if (grade === 1) return 'warning'
  else if (grade === 2) return 'primary'
  else return 'info'
}

interface readGradeType{
  content:string,
  created_time: string,
  expiration_time: string,
  grade: number,
  id: number,
  pastDue: boolean,
  read: boolean,
  state: number,
  title: string,
  username: string,
}
// 获取广播内容
let readGrade = (row : readGradeType) => {
  if (!state.rg.includes(row.id)) {
    state.rg.push(row.id)
  }
  getBroadcastInfoApi({ id: row.id }).then(res => {
    state.read = true
    state.msgData = {
      ...row,
      content: res.data
    }
  })
}

// 删除广播的方法
let deleteGrade = (id : number) => {
  ElMessageBox.confirm('确定删除此条广播吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deleteBroadcastApi(id).then(res => {
      ElMessage.success('删除成功')
      getBroadcastList()
    })
  })
}

onMounted(() => {
  let rg = localStorage.getItem('readGrade')
  if (!rg) {
    state.rg = []
    localStorage.setItem('readGrade', '[]')
  } else state.rg = JSON.parse(rg)
  getBroadcastList()
})
</script>

<style lang="scss" scoped>
.broadcastMessage {
  margin: 0;
  >main{
    padding-bottom: 60px;
    > header {
      margin-bottom: 10px;
      > * {
        margin: 0 10px;
      }

      :first-child {
        margin-left: 0;
      }
    }
  }
  .msg-content{
    margin: 10px 20px;
    padding:2vh 10vw;
    box-sizing: border-box;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    >h5{
      font-size: 26px;
      text-align: center;
    }
    >p{
      display: flex;
      justify-content: space-between;
      line-height: 50px;
    }
  }

}
</style>
