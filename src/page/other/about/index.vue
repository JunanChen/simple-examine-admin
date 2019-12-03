<template>
    <el-card class="box-card">
        <p style="text-align: center">
            关于
        </p>
        <br>
        <br>
        <el-row>
            <el-col :offset="6" :span="12">
                <div class="grid-content">
                   项目简介：<br>
                   <p><span class="suojin"></span>医院后勤管理中,为了保障专业医疗设备和园区基础设施的正常运行,需要定期对此类设备进行巡检。目前医院普遍采用传统人工巡检方式，通过纸质记录和手工操作，不仅数据记录、存储效率低下，数据统计和检索困难，而且缺少技术手段监督巡检人员到位情况。</p>
                   <p><span class="suojin"></span>本项目拟开发一套基于RFID精确定位的智慧医院巡检系统，可实现室内精确定位、巡检任务自动派发、任务状态可视、数据快速记录、数据分析与趋势预测等主要功能，极大提高医院巡检活动的效率和可靠性，同时有力支撑医院的运维决策。</p>
                </div>
            </el-col>
        </el-row>
        <br>
         <el-row>
            <el-col :offset="6" :span="12">
                <div class="grid-content">
                    使用技术：<br>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :offset="6" :span="12">
                <div class="grid-content">
                    <span class="suojin"></span>后端技术：springboot 2.1.9.RELEASE + mybatisplus 3.2.0
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :offset="6" :span="12">
                <div  class="grid-content"> 
                    <span class="suojin"></span>数据库技术：MySql 5.7
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :offset="6" :span="12">
                <div class="grid-content">
                    <span class="suojin"></span>前端技术：<el-link target="_blank" href="https://github.com/wdlhao/vue2-element-touzi-admin" type="success">vue2-element-touzi-admin</el-link> , vue 2.6.10, elementui 2.11.1
                </div>
            </el-col>
        </el-row>
          <br>
    <br>
    <br>
    </el-card>
</template>

<style>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .suojin {
      padding-left:2em;
  }
</style>