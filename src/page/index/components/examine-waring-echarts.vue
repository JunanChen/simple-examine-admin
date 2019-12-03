<template>
    <el-card>
        <div id='examineWaring' style='width：300px;height:300px'></div>
    </el-card>
</template>

<script>

import echarts from 'echarts'

export default {
  name: 'hello',
  data () {
    return {
      
    }
  },
  mounted(){
    this.drawLine();
  },
  methods: {
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('examineWaring'), 'light')
        // 绘制图表
        myChart.setOption({
             title : {
                text: '巡检告警统计',
                x:'center'
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line'
            }]
        });
    }
  }
}
</script>