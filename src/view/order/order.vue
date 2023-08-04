<template>
  <div class="order">
    <header>
      <el-select v-model="state.searchForm.payStatus" placeholder="请选择" class="_w_100">
        <el-option v-for="item in state.payStateList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model.trim="state.searchForm.orderID" placeholder="订单号" class="_w_200" />
      <el-input v-model.trim="state.searchForm.title" placeholder="订单名称" class="_w_200" />
      <el-input v-model.trim="state.searchForm.userPhone" type="number" placeholder="手机号" class="_w_200" />
      <el-button type="primary" icon="Search" @click="getOrderList">搜索</el-button>
      <el-button type="danger" icon="Delete" :disabled="!state.activePays.length" @click="deletePays">批量删除</el-button>
    </header>
    <main>
      <el-table :data="state.payList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="orderID" label="订单编号" align="center" />
        <el-table-column prop="title" label="订单名称" align="center" />
        <el-table-column prop="userName" label="用户名称" align="center" />
        <el-table-column prop="userPhone" label="用户手机号" align="center" />
        <el-table-column prop="created_time" label="订单创建时间" align="center" />
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-link v-if="Number(scope.row.payStatus) === 1" type="success" :underline="false">
              {{ state.payStateList.filter(item=>item.value === Number(scope.row.payStatus))[0].label }}
            </el-link>
            <el-link v-else type="danger" :underline="false">
              {{ state.payStateList.filter(item=>item.value === scope.row.payStatus)[0].label }}
            </el-link>
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
import { getOrderList as getOrderListApi, deleteOrder as deleteOrderApi } from '@/api/order'

const state = reactive({
  searchForm: {
    payStatus: 0,
    orderID: '',
    title: '',
    page: 1,
    pageSize: 10,
    total: 0,
    userPhone: ''
  },
  // 订单状态表单
  payStateList: [
    {
      value: 0,
      label: '全部'
    }, {
      value: 1,
      label: '已付款'
    }, {
      value: 2,
      label: '未付款'
    }
  ],
  payList: [],
  activePays: []
})

// 获取订单列表
let getOrderList = () => {
  getOrderListApi(state.searchForm).then(res => {
    state.payList = res.data
    state.searchForm.total = res?.total
  })
}
// 删除订单
let deletePays = () => {
  ElMessageBox.confirm('确定删除这些订单?', '提示', {
    type: 'warning'
  }).then(() => {
    let id = this.activePays.map(item => item.id)
    deleteOrderApi({ id }).then(res => {
      getOrderList()
      ElMessage.success('删除成功!')
    })
  }).catch(() => {
    ElMessage('已取消删除')
  })
}
// 表格选中的方法
let handleSelectionChange = (val : any) => {
  state.activePays = val
}

let handleSizeChange = (val : number) => {
  state.searchForm.page = 1
  state.searchForm.pageSize = val
  getOrderList()
}
let handleCurrentChange = (val : number) => {
  state.searchForm.page = val
  getOrderList()
}

onMounted(() => {
  getOrderList()
})

</script>

<style scoped lang="scss">
.order {
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

