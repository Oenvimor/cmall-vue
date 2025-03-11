import axios from 'axios'

// 读取分类列表
const listCategories = () =>
  axios.get('/api/v1/categories').then(res => res.data)

export { listCategories }