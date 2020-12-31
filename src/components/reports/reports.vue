<template>
  <div class="reports">
    <div id="main" style="width: 750px;height:400px;"></div>
  </div>
</template>

<script>
//导入echarts
import echarts from 'echarts'
import _ from 'lodash'

export default {
  data() {
    return {
      options: {
        title: {
          text: 'ECharts 入门示例',
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      },
    }
  },
  created() {},
  //页面初始化完成进行dom操作
  async mounted() {
    var echarts = require('echarts')
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    //获取图标接口
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    this.$message.success(res.meta.msg)
    // console.log(res.data)
    //准备数据和配置项
    const result = _.merge(res.data, this.options)

    // 绘制图表
    myChart.setOption(result)
  },
  methods: {},
}
</script>

<style lang="less" scoped>
</style>