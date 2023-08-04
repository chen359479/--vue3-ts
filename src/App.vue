<template>
  <router-view />
</template>
<style lang="scss">
@import "./assets/css/global";
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

._fontColor{
  color: $fontColor;
}
._themeColor{
  background-color: $themeColor;
}
._w_200{
  width: $w_200 !important;
}
._w_100{
  width: $w_100 !important;
}
</style>
