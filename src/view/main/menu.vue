<template>
  <el-scrollbar class="menu-navs" :style="state.isCollapse?'width:64px':''">
    <el-menu
      :default-active="props.tabMenu"
      :collapse="state.isCollapse"
      style="width: 100%;"
      router
    >
      <template v-for="item in props.menuList">
        <el-menu-item v-if="item.type" :key="item.id" :index="item.viewPath">
          <el-icon><House /></el-icon>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
        <el-sub-menu v-else :key="item.id" :index="item.title">
          <template #title>
            <el-icon>
              <component :is="item.name" style="width: 1rem;height: 1rem" />
            </el-icon>
            <span slot="title">{{ item.title }}</span>
          </template>
          <el-menu-item-group>
            <template v-for="twoChilItem in item.children">
              <el-menu-item v-if="twoChilItem.type" :key="twoChilItem.id" :index="twoChilItem.viewPath">{{ twoChilItem.title }}
              </el-menu-item>
              <el-sub-menu v-else :key="twoChilItem.id" :index="twoChilItem.title">
                <el-menu-item v-for=" threeChilItem in twoChilItem.children" :key="threeChilItem.id" :index="threeChilItem.viewPath">
                  <span slot="title">{{ threeChilItem.title }}</span>
                </el-menu-item>

              </el-sub-menu>
            </template>
          </el-menu-item-group>

        </el-sub-menu>
      </template>
    </el-menu>
    <div class="Sidebar-Expand" @click="sidebarExpand">
      <el-icon v-show="state.isCollapse" title="展开侧边栏"><DArrowRight /></el-icon>
      <el-icon v-show="!state.isCollapse" title="收起侧边栏"><DArrowLeft /></el-icon>
      <span v-show="!state.isCollapse"> 收起侧边栏 </span>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { reactive, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  menuList: [],
  tabMenu:''
}>()

const emit = defineEmits(['sidebarExpand'])

const state = reactive({
  isCollapse: false
})

let sidebarExpand = () => {
  state.isCollapse = !state.isCollapse
  emit('sidebarExpand')
}
// 选中的菜单
let handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped lang="scss">
@import "../../assets/css/global";
.menu-navs {
  transition: width 0.3s, left 0.3s, right 0.3s;
  position: absolute;
  z-index: 600;
  top: 0;
  left: 0;
  box-shadow: inset -1px 0 0 #dbdbdb;
  transform: translate3d(0, 0, 0);
  height: calc(100vh - 46px);
  padding-bottom:38px;
  background-color: $themeColor;
  width: 201px;
  .Sidebar-Expand{
    position: fixed;
    left: 0;
    bottom: 0;
    height: 38px;
    line-height: 38px;
    font-size: 18px;
    text-align: center;
    border-top: 1px solid #dbdbdb;
    cursor: pointer;
    width: 100%;
    color: $fontColor;
    >span{
      font-size: 15px;
      position: relative;
      top: -1px;
    }
  }

}
</style>
