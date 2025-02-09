<template>
  <div class="goods" id="goods" name="goods">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>全部商品</el-breadcrumb-item>
        <el-breadcrumb-item v-if="search">搜索</el-breadcrumb-item>
        <el-breadcrumb-item v-else>分类</el-breadcrumb-item>
        <el-breadcrumb-item v-if="search">{{search}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 面包屑END -->

    <!-- 分类标签 -->
    <div class="nav">
      <div class="product-nav">
        <div class="title">分类</div>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane
            v-for="item in categoryList"
            :key="item.category_id"
            :label="item.category_name"
            :name="''+item.category_id"
          />
        </el-tabs>
      </div>
    </div>
    <!-- 分类标签END -->

    <!-- 主要内容区 -->
    <div class="main">
      <div class="list">
        <MyList :list="product" v-if="product.length>0"></MyList>
      </div>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!-- 分页END -->
    </div>
    <!-- 主要内容区END -->
  </div>
</template>
<script>
import * as productAPI from '@/api/products'
import * as categoryAPI from '@/api/categories'

export default {
  data() {
    return {
      categoryList: '', //分类列表
      categoryID: [], // 分类id
      product: '', // 商品列表
      productList: '',
      total: 0, // 商品总量
      pageSize: 15, // 每页显示的商品数量
      currentPage: 1, //当前页码
      activeName: '-1', // 分类列表当前选中的id
      search: '', // 搜索条件
      start: 0,
      limit: 15
    }
  },
  created() {
    // 获取分类列表
    this.getCategory()
  },
  activated() {
    this.activeName = '-1' // 初始化分类列表当前选中的id为-1
    this.total = 0 // 初始化商品总量为0
    this.currentPage = 1 //初始化当前页码为1
    // 如果路由没有传递参数，默认为显示全部商品
    if (Object.keys(this.$route.query).length == 0) {
      this.categoryID = []
      this.activeName = '0'
      return
    }
    // 如果路由传递了categoryID，则显示对应的分类商品
    if (this.$route.query.categoryID != undefined) {
      this.categoryID = this.$route.query.categoryID
      if (this.categoryID.length == 1) {
        this.activeName = '' + this.categoryID[0]
      }
      return
    }
    // 如果路由传递了search，则为搜索，显示对应的分类商品
    if (this.$route.query.search != undefined) {
      this.search = this.$route.query.search
    }
  },
  watch: {
    // 监听点击了哪个分类标签，通过修改分类id，响应相应的商品
    activeName: function(val) {
      if (val == 0) {
        this.categoryID = []
      }
      if (val > 0) {
        this.categoryID = [Number(val)]
      }
      // 初始化商品总量和当前页码
      this.total = 0
      this.currentPage = 1
      // 更新地址栏链接，方便刷新页面可以回到原来的页面
      this.$router.push({
        path: '/goods',
        query: { categoryID: this.categoryID }
      })
    },
    // 监听搜索条件，响应相应的商品
    search: function(newVal, oldVal) {
      if (newVal !== '' && newVal !== oldVal) {
        this.updateRouteWithSearchQuery(newVal);
      }
    },
    // 监听分类id，响应相应的商品
    categoryID: function(newVal, oldVal) {
      this.getData();
      this.search = '';
    },
    // 监听路由变化，更新路由传递了搜索条件
    '$route': function(newVal, oldVal) {
      if (newVal.path === '/goods' && newVal.query.search !== oldVal.query.search) {
        this.activeName = '-1';
        this.currentPage = 1;
        this.total = 0;
        this.search = newVal.query.search;
      }
    }
  },
  methods: {
     // 更新路由并获取商品数据
     updateRouteWithSearchQuery(searchQuery) {
      this.$router.replace({ path: '/goods', query: { search: searchQuery } });
      this.getProductBySearch(searchQuery);
    },
    // 返回顶部
    backtop() {
      const timer = setInterval(function() {
        const top =
          document.documentElement.scrollTop || document.body.scrollTop
        const speed = Math.floor(-top / 5)
        document.documentElement.scrollTop = document.body.scrollTop =
          top + speed

        if (top === 0) {
          clearInterval(timer)
        }
      }, 20)
    },
    handleCurrentChange(val) {
      this.start = this.limit * (val - 1) // val 页面
      this.getData()
    },
    // 向后端请求分类列表数据
    getCategory() {
      categoryAPI
        .listCategories()
        .then(res => {
          if (res.status === 200) {
            const val = {
              category_id: 0,
              category_name: '全部'
            }
            const cate = res.data
            cate.unshift(val)
            this.categoryList = cate
          } else {
            this.notifyError('获取分类失败', res.msg)
          }
        })
        .catch(err => {
          this.notifyError('获取分类失败', err)
        })
    },
    // 向后端请求全部商品或分类商品数据
    getData() {
      // 如果分类列表为空则请求全部商品数据，否则请求分类商品数据
      if (this.categoryID.length === 0) {
        productAPI
          .listProducts(0, this.start, this.limit)
          .then(res => {
            if (res.status === 200) {
              this.product = res.data.items
              this.total = res.data.total
            } else {
              this.notifyError('获取商品失败', res.msg)
            }
          })
          .catch(err => {
            this.notifyError('获取商品失败', err)
          })
      } else {
        let id = this.categoryID[0]
        productAPI
          .listProducts(id, this.start, this.limit)
          .then(res => {
            if (res.status === 200) {
              this.product = res.data.items
              this.total = res.data.total
            } else {
              this.notifyError('获取分类商品失败', res.msg)
            }
          })
          .catch(err => {
            this.notifyError('获取分类商品失败', err)
          })
      }
    },
    // 通过搜索条件向后端请求商品数据
    getProductBySearch() {
      var form = {
        search: this.search
      }
      productAPI
        .searchProducts(form)
        .then(res => {
          if (res.status === 200) {
            this.product = res.data
          } else {
            this.notifyError('搜索失败', res.msg)
          }
        })
        .catch(err => {
          this.notifyError('搜索失败', err)
        })
    }
  }
}
</script>

<style scoped>
.goods {
  background-color: #f2f2f2;
}
/* 面包屑CSS */
.el-tabs--card .el-tabs__header {
  border-bottom: none;
}
.goods .breadcrumb {
  height: 50px;
  background-color: #f2f2f2;
}
.goods .breadcrumb .el-breadcrumb {
  width: 1225px;
  line-height: 30px;
  font-size: 16px;
  margin: 0 auto;
}
/* 面包屑CSS END */

/* 分类标签CSS */
.goods .nav {
  background-color: #f2f2f2;
}
.goods .nav .product-nav {
  width: 1225px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
}
.nav .product-nav .title {
  width: 50px;
  font-size: 16px;
  font-weight: 700;
  float: left;
}
/* 分类标签CSS END */

/* 主要内容区CSS */
.goods .main {
  margin: 0 auto;
  max-width: 1225px;
}
.goods .main .list {
  min-height: 650px;
  padding-top: 14.5px;
  margin-left: -13.7px;
  overflow: auto;
}
.goods .main .pagination {
  height: 50px;
  text-align: center;
}
.goods .main .none-product {
  color: #333;
  margin-left: 13.7px;
}
/* 主要内容区CSS END */
</style>