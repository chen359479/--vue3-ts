<template>
  <div class="main">
    <headers />
    <main class="main-scrollbar">
      <menu-nav :tab-menu="state.tabMenu" :menu-list="state.menuList" @sidebarExpand="state.isCollapse = !state.isCollapse" />
      <div class="tabs-content" :style="state.isCollapse?'padding-left:64px':'padding-left:201px'">
        <el-tabs v-model="state.editableTabsValue" type="card" class="demo-tabs" @tab-remove="removeTab" @tab-click="tabClick">
          <el-tab-pane v-for="item in state.editableTabs" :key="item.name" :label="item.label" :name="item.name" :closable="item.closable" />
        </el-tabs>
        <el-scrollbar class="el-scrollbar-view">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-scrollbar>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMenus as getMenusApi, getMenuList } from '@/api/menus'
import { menuStore } from '@/store/menu'

const store = menuStore()
const router = useRouter()

import MenuNav from './menu.vue'
import Headers from './headers.vue'

const state = reactive({
  menuList: [],
  tabMenu: '/main/home',
  isCollapse: false,
  editableTabsValue: '1',
  editableTabs: [ // 标签页选项卡
    {
      label: '首页',
      name: '1',
      content: '/main/home',
      closable: false
    }
  ],
  tabIndex: '1',
  allMenu: []
})

// 监听router的变化，改变
watch(
  () => router.currentRoute.value,
  (to: any, form : any) => {
    if (form && to.path !== form.path) {
      state.allMenu.forEach(item => {
        if (item.name === to.name) {
          state.tabMenu = to.path
          addTab(item.title, to.path)
        }
      })
    }
  },
  { immediate: true }
)

// 获取菜单
let getMenus = () => {
  getMenusApi().then(res => {
    state.menuList = res.data
  })
  getMenuList().then(res => {
    res.data.forEach((item:any) => {
      state.allMenu = state.allMenu.concat(item)
    })
    store.setAllMenuList(res.data)
  })
}

// 添加tab标签
let addTab = (name:string, indexPath:string) => {
  let tabs = state.editableTabs
  let checkoutView = tabs.filter(item => item.label === name)[0]
  if (checkoutView || indexPath === '/main/home') {
    state.editableTabsValue = checkoutView.name
  } else {
    let newTabName = ++state.tabIndex + ''
    state.editableTabs.push({
      label: name,
      name: newTabName,
      content: indexPath,
      closable: true
    })
    state.editableTabsValue = newTabName
  }
}
// 删除tab
let removeTab = (targetName) => {
  let tabs = state.editableTabs
  let activeName = state.editableTabsValue
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        let nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
          state.tabMenu = nextTab.content
          router.replace(nextTab.content)
        }
      }
    })
  }
  state.editableTabsValue = activeName
  state.editableTabs = tabs.filter(tab => tab.name !== targetName)
}

// tab点击的方法
let tabClick = (tab) => {
  if (tab.props.name !== state.tabIndex) {
    state.editableTabs.forEach(item => {
      if (item.name === tab.props.name) {
        state.editableTabsValue = tab.name
        state.tabMenu = item.content
        router.push(item.content)
      }
    })
  }
}

onMounted(() => {
  getMenus()
})

</script>

<style scoped lang="scss">
.main{
  width: 100vw;
  height: 100vh;
  overflow-x: hidden !important;
  .main-scrollbar{
    width: 100vw;
    height: calc(100vh - 46px);
    position: relative;
    .tabs-content {
      width: 100vw;
      height: calc(100vh - 86px);
      margin: 0;
      padding: 0;
      transition: width 0.3s, left 0.3s, right 0.3s, padding 0.3s;
      position: relative;
    }
  }
}
.el-scrollbar-view{
  padding: 10px 10px 0;
  height:calc(100vh - 88px);
  ::-webkit-scrollbar {
    width: 0 !important
  }
}
</style>
<style lang="scss">
@import "../../assets/css/global";
.main{
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border-top: none !important;
    border-left: none !important;
  }
  .el-tabs__header{
    margin: 0;
  }
  .el-scrollbar-view .el-scrollbar__wrap{
    margin-right: 0 !important;
  }
}

</style>
