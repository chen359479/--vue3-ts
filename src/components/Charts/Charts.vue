<template>
  <div :id="props.chartsId" :key="state.chartData" :style="'width:'+props.chartsWidth+';height:'+props.chartsHeight" />
</template>

<script setup lang="ts">
import { onMounted, defineProps, defineEmits, withDefaults, watch, reactive } from 'vue'
import * as echarts from 'echarts'

type EChartsOption = echarts.EChartsOption

let myChart = null

const props = withDefaults(
  defineProps<{
      option: EChartsOption,
      chartsWidth?: string,
      chartsHeight?: string,
      chartsId?: string,
    }>(),
  {
    option: {},
    chartsWidth: '400px',
    chartsHeight: '400px',
    chartsId: 'chart'
  }
)

const state = reactive({
  chartData: {
    textStyle: {
      fontFamily: 'Microsoft YaHei',
      fontSize: 12,
      fontStyle: 'normal',
      fontWeight: 'normal'
    }
  }
})

watch(
  () => props.option,
  () => {
    state.chartData = Object.assign(state.chartData, props.option)
    myChart.setOption(state.chartData)
  }
)

onMounted(() => {
  let chartDom = document.getElementById(props.chartsId)
  myChart = echarts.init(chartDom)
  state.chartData = Object.assign(state.chartData, props.option)
  myChart.setOption(state.chartData)
})
</script>
