<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 2.为Echarts准备一个Dom -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'   // 1.导入echarts
import _ from 'lodash'      

export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {
  },
  // 此时,页面上的元素,已经被渲染完毕了
  async mounted() { 
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));

    // 4.准备数据项和配置项   (发送请求获取图表数据)
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message('获取折线图数据失败!')

    const result = _.merge(res.data, this.options)    // 合并获取的数据和定义的数据

    // 5.展示数据
    myChart.setOption(result)
  },
}
</script>

<style lang="less" scoped>
</style>