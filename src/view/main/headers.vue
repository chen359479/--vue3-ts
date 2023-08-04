<template>
  <header class="headers">
    <div class="logo _fontColor"><img src="../../assets/img/orange.png" alt="orange_logo"></div>
    <div class="pattern">
      <i v-show="state.pattern" class="iconfont icon-baitian" title="亮色模式" />
      <i v-show="!state.pattern" class="iconfont icon-heiyemoshi" title="深色模式" />
    </div>
    <!--  通知  -->
    <div class="_fontColor" title="广播消息">
      <el-icon style="position: relative;top: 2px"><ChatLineSquare /></el-icon>
    </div>

    <el-dropdown>
      <span class="user _fontColor">
        <el-avatar size="small" :src="state.squareUrl" />&nbsp;
        {{ store.userInfo?.username || 'admin' }}
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item icon="User">个人中心</el-dropdown-item>
          <el-dropdown-item icon="Position">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

  </header>
</template>

<script setup lang="ts">
import { userStore } from '@/store/user'
const store = userStore()
const state = {
  squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
  notifications: 1,
  pattern: true,
  drawer: false
}
</script>

<style scoped lang="scss">
@import "../../assets/css/global";

header {
  height: 46px;
  line-height: 46px;
  background-color: $themeColor;
  border-bottom: 1px solid #eee;
  text-align: right;
  overflow: hidden;

  > div {
    display: inline-block;
    margin: 0 15px;
    text-align: center;

    > i {
      color: $fontColor;
      cursor: pointer;
    }
  }

  .logo {
    float: left;
    clear: both;
  }

  .pattern {
    width: 15px;
    cursor: pointer;
  }

  .user {
    cursor: default;
    font-size: 14px;
    > span {
      vertical-align: middle;
    }
  }
}
</style>

<style lang='scss' scoped>
::v-deep .el-dropdown {
  line-height: 46px
}
</style>
