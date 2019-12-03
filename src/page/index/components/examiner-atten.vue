<template>
    <el-card>
        <div id='examinerAtten' style='width：300px;height:300px'></div>
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
        let myChart = this.$echarts.init(document.getElementById('examinerAtten'), 'light')
        // 绘制图表
        myChart.setOption({
                title : {
                    text: '巡检员签到情况',
                    subtext: '2019-10-20',
                    x:'center'
                },
               tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [
                    {
                        name:'巡检员签到情况',
                        type:'pie',
                        radius: ['40%', '60%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '24',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:3350, name:'已签到'},
                            {value:310, name:'未签到'},
                            {value:234, name:'事假'},
                            {value:135, name:'病假'},
                            {value:154, name:'出差'},
                            {value:154, name:'其他'}
                        ]
                    }
                ]
        });
    }
  }
}
</script>