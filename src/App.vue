<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
    }
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  }
}
</script>

<style>
html{font-family:Arial,"Microsoft Yahei","SimSun",sans-serif;-webkit-text-size-adjust:100%;-moz-text-size-adjust:100%;-ms-text-size-adjust:100%;}
body{-webkit-overflow-scrolling:touch;margin:0;height:100%;font-family:"Microsoft Yahei";background-color:#fff}
ul{margin:0;padding:0;list-style:none;outline:0;}
a,button,img,input{-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;}
a{display:inline-block;margin:0;padding:0;text-decoration:none;background:0 0;outline:0;color:#000;}
img{display:block;border:0;width:100%;}
button,input{border:0;outline:0;}
.clearfix{clear:both;}
p{margin:0;}
</style>
