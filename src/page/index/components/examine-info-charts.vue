<template>
    <el-card>
        <div id='examineInfo' style='width：300px;height:300px'></div>
    </el-card>
</template>

<script>

import echarts from 'echarts'

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted(){
    this.drawLine();
  },
  methods: {
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('examineInfo'), 'light')
        // 绘制图表
        myChart.setOption({
              title : {
                  text: '今日巡检情况统计',
                  subtext: '2019-10-20',
                  x:'center'
              },
              tooltip : {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                  orient: 'vertical',
                  left: 'left',
                  data: ['正常','设备异常','线路异常','设施异常','人群异常','其他']
              },
              series : [
                  {
                      name: '情况统计',
                      type: 'pie',
                      radius : '55%',
                      center: ['50%', '60%'],
                      data:[
                          {value:3350, name:'正常'},
                          {value:310, name:'设备异常'},
                          {value:234, name:'线路异常'},
                          {value:135, name:'设施异常'},
                          {value:154, name:'人群异常'},
                          {value:154, name:'其他'}
                      ],
                      itemStyle: {
                          emphasis: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: 'rgba(0, 0, 0, 0.5)'
                          }
                      }
                  }
              ]
        });
    }
  }
}
</script>