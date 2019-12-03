<template>
    <el-card>
        <div id='examineAreaInfo' style='width：100%;height:500px'></div>
    </el-card>
</template>

<script>

import echarts from 'echarts'
import areaData from './area.json'
import testData from './test.json'

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
      areaData
  },
  mounted(){
    this.drawLine();
  },
  methods: {
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.$echarts.init(document.getElementById('examineAreaInfo'), 'light')
        this.$echarts.registerMap('area', areaData, {})
        // 绘制图表
        myChart.setOption({
            title : {
                text: '巡检区域视图',
                subtext: '区域信息',
                x:'left'
            },
            tooltip: {
		        trigger: 'item',
                formatter: '{b}<br/>包含{c}条线路'
		    },
		    visualMap: {
	            min: -1,
	            max: 50,
	            text:['最多线路','最少线路'],
	            left: 'right',
	            realtime: false,
	            calculable: true,
	            inRange: {
                    color: ['#2ec7c9','#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
                    symbolSize: [0, 50]
                },
                outOfRange:{  //定义 在选中范围外 的视觉元素。
                    color: ['#2b821d'],
                    symbolSize: [-1, 0]
                },
                show: true,
                type: 'piecewise',
                splitNumber:6, 
                pieces: [                          
                    {min: 50},              
                    {min: 40, max: 50},
                    {min: 30, max: 40},
                    {min: 20, max: 30},
                    {min: 10, max: 20},
                    {min: 1, max: 10},                
                    {value: 0,  label: '花圃', color: '#2b821d'},                 
                    {value: -1,  label: '车库', color: '#6be6c1'}              
                ],
	        },
		    series: [
		        {
		        	name: '巡检区域',
		            type: 'map',
		            mapType: 'area',
		            aspectScale: 1,  //地图长度比
		            label: {
		                normal: {
		                    show: true,
		                    textStyle: {
		                        color: '#fff'
		                    }
		                },
		                emphasis: {
		                    show: true,
		                    textStyle: {
		                        color: '#333'
		                    }
		                }
		            },
		            data: [
		            	{name: 'A区', value: 2},
	                    {name: 'B区', value: 15},
	                    {name: 'C区', value: 33},
	                    {name: 'D区', value: 24},
	                    {name: 'E区', value: 17},
	                    {name: 'F区', value: 50},
	                    {name: 'G区', value: 48},
	                    {name: 'H区', value: 24},
	                    {name: 'I区', value: 33},
	                    {name: 'J区', value: 16},
                        {name: 'K区', value: 19},
                        {name: '车库1', value: -1},
                        {name: '车库', value: -1},
	                    {name: '花圃1', value: 0},
	                    {name: '花圃2', value: 0}
		            ]
		        }                              
		    ]
        });
    }
  }
}
</script>