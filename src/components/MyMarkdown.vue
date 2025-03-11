<!--
 * @Descripttion:渲染Markdown文档组件
 * @Author: congz
 * @Date: 2020-06-04 11:22:40
 * @LastEditors: congz
 * @LastEditTime: 2020-08-04 11:16:50
--> 

<template>
  
  <div id="my-markdown" class="markdown-body">
    <vue-markdown :source="notice">无</vue-markdown>
  </div>
</template>
<script>
import VueMarkdown from 'vue-markdown'
export default {
  name: 'MyMarkdown',
  components: {
    VueMarkdown
  },
  data() {
    return {
      notice: ''
    }
  },
  
}
</script>
<style>
@import '../assets/css/github-markdown.css';
.markdown-body {
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 40px;
}
</style>