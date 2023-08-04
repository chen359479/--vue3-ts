<template>
  <div class="home">
    <el-card>
      <div class="info">
        <span>主机名称: {{ state.data.hostname }} </span>
        <span>CPU数量: {{ state.data.cpuCount }}核 </span>
        <span>处理器架构: {{ state.data.arch }} </span>
        <span>操作系统: {{ state.data.type }} </span>
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">内存使用情况：</div>
      <div class="info">
        <span>总内存: {{ Math.ceil(state.data.totalmem/1024) }}G </span>
        <span>空闲内存: {{ (state.data.freemem/1024).toFixed(2) }}G </span>
        <span>可用内存百分比: {{ ((state.data.freemem/state.data.totalmem)*100).toFixed(2) + '%' }} </span>
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">磁盘使用情况：</div>
      <div v-for="item in state.data.aDrives" :key="item.mounted" class="info">
        <span>磁盘名称: {{ item.mounted }}盘 </span>
        <span>磁盘总容量: {{ item.blocks }} </span>
        <span>可用容量: {{ item.available }} </span>
        <span>已用容量百分比: {{ item.capacity }} </span>
      </div>
    </el-card>
    <el-card>
      <div class="info">
        <div class="charts">
          <h3>内存用量</h3>
          <charts :option="state.internalData" />
        </div>
        <div v-for="(item,index) in state.diskData" :key="index" class="charts">
          <h3>{{ item.name }}盘用量</h3>
          <charts :charts-id="'chart'+index" :option="item" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import Charts from '@/components/Charts/Charts.vue'

import { systemInfo } from '@/api/system'

const state = reactive({
  data: {
    totalmem: 0,
    freemem: 0
  },
  internalData: {},
  diskData: [],
  timer: null
})

let chartData = (value : number, name : string) => {
  return {
    name: name,
    series: [
      {
        name,
        type: 'gauge',
        progress: {
          show: true
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          fontSize: 18
        },
        data: [
          {
            value,
            name: '用量'
          }
        ]
      }
    ]
  }
}

// 获取系统信息
let getSystemInfo = () => {
  systemInfo().then(res => {
    state.data = { ...res.data }
    // 内存用量
    let freemem = (((res.data.totalmem - res.data.freemem) / res.data.totalmem) * 100).toFixed(2)
    state.internalData = chartData(freemem, '内存用量')
    // 磁盘用量
    state.diskData = res.data.aDrives.map((item : any) => {
      return chartData(parseInt(item.capacity), item.mounted)
    })
  })
}

onMounted(() => {
  getSystemInfo()
})

</script>

<style scoped lang="scss">
.home{
  >*{
    margin-top: 20px;
  }
}
.info{
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  .charts{
    >h3{
      text-align: center;
    }
  }
}
</style>
