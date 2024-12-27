<template>
  <div class="home" id="home" name="home">
    <!-- 轮播图 -->
    <div class="block">
      <el-carousel height="460px" style="padding-top: 20px;">
        <el-carousel-item v-for="item in carousels" :key="item.id">
          <img style="height:460px;" :src="item.img_path" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 轮播图END -->
    <div class="main-box">
      <div class="main">
        <!-- 手机商品展示区域 -->
        <div class="phone">
          <div class="box-hd">
            <div class="title">手机</div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <img :src="'/img/phone.png'" />
            </div>
            <div class="list">
              <MyList :list="phonesList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
        <!-- 手机商品展示区域END -->

        <!-- 家电商品展示区域 -->
        <div class="appliance" id="promo-menu">
          <div class="box-hd">
            <div class="title">家电</div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <ul>
                <li>
                  <img
                    :src="'img/appliances1.png'"
                  />
                </li>
                <li>
                  <img
                    :src="'img/appliances2.png'"
                  />
                </li>
              </ul>
            </div>
            <div class="list">
              <MyList :list="televisionsList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
        <!-- 家电商品展示区域END -->

        <!-- 配件商品展示区域 -->
        <div class="accessory" id="promo-menu">
          <div class="box-hd">
            <div class="title">配件</div>
            <div class="more" id="more">
              <MyMenu :val="2" @fromChild="getChildMsg2">
                <span slot="1">保护套</span>
                <span slot="2">充电器</span>
              </MyMenu>
            </div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <ul>
                <li>
                  <img
                    :src="'/img/attachment1.png'"
                    alt
                  />
                </li>
                <li>
                  <img
                    :src="'/img/attachment2.png'"
                    alt
                  />
                </li>
              </ul>
            </div>
            <div class="list">
              <MyList :list="accessoryList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
        <!-- 配件商品展示区域END -->
      </div>
    </div>
  </div>
</template>
<script>

import * as productsAPI from '@/api/products/'

export default {
  data() {
    return {
      carousels: [
        { id: 1, img_path: '/img/carousel1.png' },
        { id: 2, img_path: '/img/carousel2.png' },
        { id: 3, img_path: '/img/carousel3.png' },
        { id: 4, img_path: '/img/carousel4.png' },
      ], // 轮播图数据
      phonesList: [], // 手机商品列表
      televisionsList: [], // 小米电视商品列表
      accessoryList: [], //配件商品列表
      phoneShellsList: [], // 保护套商品列表
      chargersList: [], //充电器商品列表
      accessoryActive: 1, // 配件当前选中的商品分类
      start: 0,
      limit: 7
    }
  },
  mounted() {
    this.getProduct(5, 'accessoryList');
  },
  watch: {
    accessoryActive(val) {
      if (val == 1) {
        // 1为保护套商品
        this.accessoryList = this.phoneShellsList
        return
      }
      if (val == 2) {
        // 2为充电器商品
        this.accessoryList = this.chargersList
        return
      }
    }
  },
  activated() {
    // 获取首页数据
    this.load()
  },
  methods: {
    load() {
      //获取手机列表
      this.getProduct(1, 'phonesList')
      //获取电视列表
      this.getProduct(2, 'televisionsList')
      //获取保护套列表
      this.getProduct(5, 'phoneShellsList')
      //获取充电器列表
      this.getProduct(7, 'chargersList')
    },
    // 获取家电模块子组件传过来的数据
    getChildMsg(val) {
      this.applianceActive = val
    },
    // 获取配件模块子组件传过来的数据
    getChildMsg2(val) {
      this.accessoryActive = val
    },
    // 获取各类商品数据方法封装
    getProduct(categoryID, val) {
      productsAPI
        .listProducts(categoryID, this.start, this.limit)
        .then(res => {
          if (res.status === 200) {
            this[val] = res.data.items
          } else {
            this.notifyError('获取失败', res.msg)
          }
        })
        .catch(err => {
          this.notifyError('获取失败', err)
        })
    }
  },
  beforeRouteEnter(to, from, next) {
    // 添加背景色
    document
      .querySelector('body')
      .setAttribute('style', 'background-color:#ffffff')
    next()
  },
  beforeRouteLeave(to, from, next) {
    // 去除背景色
    document
      .querySelector('body')
      .setAttribute('style', 'background-color:#f5f5f5')
    next()
  }
}
</script>
<style scoped>
@import '../assets/css/index.css';
/deep/.el-carousel__item img {
  width: 100%;       /* 让图片宽度填满父容器 */
  height: 100%;      /* 让图片高度填满父容器 */
  object-fit: cover; /* 保持图片比例裁剪多余部分 */
}
</style>