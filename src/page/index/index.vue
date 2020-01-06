<template>
	<div>
		<section class="data_section" ref="data_section"> 
			<el-alert
				:title="indexTitle"
				type="error"
				effect="dark"
				center
				style="margin-bottom:10px">
			</el-alert>
				<el-row :gutter="10" class="row_list">
					<el-col :span="12">
						<div class="row_left row_base">
							<el-col :span="8">
								<div class="pay taxBgcolor data_list rflex">
									<div class="leftItem cflex wflex">
										<p class="investor">今日巡检</p>
										<p class="number"><animate-number from="1" :to="headerData.needNums"></animate-number><span class="perTitle">(项)</span></p>
									</div>
									<div class="rightItem">
										<icon-svg icon-class="el-icon-s-flag" />
									</div>
								</div>
							</el-col>
							<el-col :span="8">
								<div class="pay saleBgcolor data_list rflex">
									<div class="leftItem cflex wflex">
										<p class="investor">今日已巡检</p>
										<p class="number"><animate-number from="1" :to="headerData.workedNums"></animate-number><span class="perTitle">(项)</span></p>
										<p class="cardText">约占<animate-number from="1" to="0"></animate-number>%</p>
									</div>
									<div class="rightItem">
										<icon-svg icon-class="el-icon-s-claim" />
									</div>
								</div>
							</el-col>
							<el-col :span="8">
								<div class="linkBgColor data_list rflex">
									<div class="leftItem cflex wflex">
										<p class="investor">今日设备故障</p>
										<p class="number"><animate-number from="1" :to="headerData.failedNums"></animate-number><span class="perTitle">(次)</span></p>
										<p class="cardText"><animate-number from="1" to="0"></animate-number>%已处理</p>
									</div>
									<div class="rightItem">
										<icon-svg icon-class="el-icon-warning" />
									</div>
								</div>
							</el-col>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="row_right row_base">
							<el-col :span="8">
								<div class="extenedBgcolor data_list rflex">
									<div class="leftItem cflex wflex">
										<p class="investor">巡检人员</p>
										<p class="number"><animate-number from="1" :to="headerData.staffNums"></animate-number><span class="perTitle">(个)</span></p>
										<p class="cardText">今日新增0%</p>
									</div>
									<div class="rightItem">
										<icon-svg icon-class="el-icon-s-custom" />
									</div>
								</div>
							</el-col>
							<el-col :span="8">
								<div class="likeBgcolor data_list rflex">
									<div class="leftItem cflex wflex">
										<p class="investor">设备总数</p>
										<p class="number"><animate-number from="1" :to="headerData.equNums"></animate-number><span class="perTitle">(台)</span></p>
										<p class="cardText">今日新增<animate-number from="0" to="0"></animate-number>%</p>
									</div>
									<div class="rightItem">
										<icon-svg icon-class="el-icon-s-finance" />
									</div>
								</div>
							</el-col>
							<el-col :span="8">
								<div class="keleBgColor data_list rflex">
									<div class="leftItem cflex wflex">
										<p class="investor">已采集巡检记录</p>
										<p class="number"><animate-number from="1" :to="headerData.patrolNums"></animate-number><span class="perTitle">(条)</span></p>
										<p class="cardText"><animate-number from="1" to="80"></animate-number>%已进行统计</p>
									</div>
									<div class="rightItem">
										<icon-svg icon-class="el-icon-folder-checked" />
									</div>
								</div>
							</el-col>
						</div>
					</el-col>
				</el-row>
			<el-row :gutter="10" class="row_list order_list">
				<el-col :span="24">
					<examineArea></examineArea>
				</el-col>
			</el-row>
			<el-row :gutter="10" class="row_list order_list">
				<el-col :span="9">
					<examineWaring></examineWaring>
				</el-col>
				<el-col :span="15">
					<examineInfo></examineInfo>
				</el-col>
			</el-row>
			<el-row :gutter="10" class="row_list order_list">
				<el-col :span="7">
				    <examinerAtten></examinerAtten>
				</el-col>
				<el-col :span="17">
					<examineMouthInfo></examineMouthInfo>
				</el-col>
			</el-row> 	
		</section>
				
	</div>
</template>

<script>
	import { github } from "@/utils/env"
	import examineArea from './components/examine-area-charts'   		//巡检告警图
	import examineWaring from './components/examine-waring-echarts'   	//巡检告警图
	import examineInfo from './components/examine-info-charts'    		//本日巡检情况图
	import examinerAtten from './components/examiner-atten'    			//巡检员签到情况图
	import examineMouthInfo from './components/examine-mouth-info-charts'    //本年度巡检情况图
	import { getToken } from '@/utils/auth'
	import { getHeaderData } from '@/api/index'

    export default {
    	data(){
    		return {
				github:github,
				dateTime: new Date(),
				indexTitle: "欢迎您，管理员，您的ip为 " + getToken("ipAddress") + "，当前日期为 " + new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月' + new Date().getDate() + '日',
				headerData: {
					equNums: 4,
					failedNums: 0,
					needNums: 0,
					patrolNums: 77,
					staffNums: 6,
					workedNums: 0
				},
			}
    	},
    	components: {
			examineArea,
			examineWaring,
			examineInfo,
			examinerAtten,
			examineMouthInfo
		},	
		created(){
			getHeaderData().then(resp => {
				console.log(resp)
				this.headerData = resp.data.data
			}).catch(err => {})
		},
    	methods: {
    	}
    }
</script>
<style lang="less" scoped>
	.data_section{
		margin: 20px;
		border-radius: 2px;
		.row_list{
			margin-bottom: 20px;
			.row_base{
				padding: 10px;
				box-sizing: border-box;
				background: #fff;
				border-radius: 6px;
				height: 120px;
			}
		}
		.order_list{
			.orderArea{
				width: 100%;
				height: 300px;
				background: #fff !important;
				border-radius: 6px;
				box-sizing: border-box;
				padding: 10px;
				padding-top: 40px;
				overflow: hidden;
			}
			.orderbarArea{
				height: 370px;
			}
		}
		.data_list{
			text-align: center;
			font-size: 14px;
            border-radius: 6px;
			padding: 10px;
			color:#fff;
			height: 80px;
			.leftItem{
				align-items: start;
				justify-content: space-between;
				text-align: left;
			}
			.rightItem{
				width:62px;
				display: flex;
				align-items: center;
				justify-content: center;
				.svg-icon{
					font-size: 30px;
				}
			}
		    .number{
				font-size: 22px;
				font-weight: bold;
				.perTitle{
					font-size: 13px;
   				    margin-left: 5px;
				}
			}
		}
		.pay{
			.leftItem{
				justify-content: space-around;
			}
		}
     
	}
  
</style>
