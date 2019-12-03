<template>
    <div class="fillcontain">
        <div class="search_container searchtask">
            <el-form 
                :inline="true" 
                class="demo-form-inline search-form" :model="taskNow"> 
                <el-form-item label="搜索">
                    <el-input v-model="search_data" placeholder="id" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size ="mini" icon="search" @click="searchBtn">筛选</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="info" size ="mini" icon="search" @click="emptySearch">清空</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="warning" size ="mini" icon="" @click="importData">导入数据</el-button>
                </el-form-item>

                <el-form-item class="btnRight">
                    <el-button type="danger" size ="mini" icon="view" :disabled="batchDeleteBtnState == false" @click="batchDelete">批量删除</el-button>
                    <el-button type="success" size ="mini" icon="view" :disabled="batchExportElcelBtnState == false" @click="exportExcel">导出Elcel</el-button>
                    <el-button type="primary" size ="mini" icon="view" @click="add">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table  v-loading="tableLoading"
                :data="tableData"
                style="width: 100%"
                border
                align='center'
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    align='center'
                    width="60">
                </el-table-column>
                  <el-table-column
                    type="index"
                    label="索引"
                    align='center'
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="createBy"
                    label="发布人"
                    align='center'
                    width="100">
                    <template slot-scope="scope">
                        <span v-for="item in adminList" v-if="item.adminId === scope.row.createBy">{{item.adminName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="taskStaff"
                    label="巡检员"
                    align='center'
                    width="100">
                    <template slot-scope="scope">
                        <span v-for="item in staffList" v-if="item.staffId === scope.row.taskStaff">{{item.staffName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="taskDesc"
                    label="线路描述"
                    align='center'
                    width="180">
                    <template slot-scope="scope">
                        <span v-for="item in lineList" v-if="item.lineId === scope.row.taskLine">{{item.lineDesc}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="taskLine"
                    label="巡检线路"
                    align='center'
                    width="180">
                    <template slot-scope="scope">
                        <span v-for="item in lineList" v-if="item.lineId === scope.row.taskLine">{{item.lineName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column
                    prop="taskStat"
                    label="状态"
                    align='center'
                    width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.taskStat === 0" type="primary">执行中</el-tag>
                        <el-tag v-if="scope.row.taskStat === 1" type="success">已完成</el-tag>
                        <el-tag v-if="scope.row.taskStat === 2" type="danger">未完成</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    align='center'
                    width="200"
                    sortable>
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.createTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="startTime"
                    label="开始时间"
                    align='center'
                    width="200"
                    sortable>
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.startTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="endTime"
                    label="结束时间"
                    align='center'
                    width="200"
                    sortable>
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.endTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="operation"
                    fixed="right"
                    align='center'
                    label="操作"
                    width="180">
                    <template slot-scope='scope'>
                        <el-button 
                            type="warning" 
                            icon='edit' 
                            size="mini"
                            @click="edit(scope.row)"
                        >编辑</el-button>
                        <el-button 
                            type="danger" 
                            icon='delete' 
                            size="mini"
                            @click="remove(scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <br>
            <br>
            <el-pagination
                background
                layout="total, sizes, prev, pager, next" :pager-count=5 :current-page="page.pageNow" :page-count="page.pageCount"
                :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize"
                :total="page.tatolCount" style="text-align: center" @size-change="pageSizeChange" @current-change="pageNowChange">
            </el-pagination>
            <br>
            </div>
            <!-- 新增和编辑 -->
            <el-dialog
                title="区域信息"
                :visible.sync="taskShow"
                width="30%">
                <el-form ref="form" :model="taskNow" :rules="rules" label-width="80px">
                    <el-form-item label="任务编号" prop="taskId">
                        <el-input v-model="taskNow.taskId" :disabled="true" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="巡检线路" prop="taskLine">
                        <el-cascader
                            v-model="taskNow.taskLine"
                            :options="areaOptions"
                            size="medium"
                            @change="lineChange" style="width: 100%">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="巡检员" prop="taskStaff" width="200px">
                        <el-select v-model="taskNow.taskStaff" placeholder="请选择巡检员" size="medium" style="width: 100%">
                            <el-option
                            v-for="item in staffList"
                            :key="item.value"
                            :label="item.staffName"
                            :value="item.staffId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建人" prop="createBy">
                        <el-input v-model="taskNow.createBy" :disabled="true" size="medium"></el-input>
                    </el-form-item>
                     <el-form-item label="创建时间" prop="taskDesc">
                        <el-date-picker
                            v-model="taskNow.createTime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="请选择日期时间"
                            default-time="12:00:00" :disabled="true" style="width: 100%">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="startTime">
                        <el-date-picker
                            v-model="taskNow.startTime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="请选择日期时间"
                            default-time="12:00:00" style="width: 100%">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endTime">
                        <el-date-picker
                            v-model="taskNow.endTime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="请选择日期时间"
                            default-time="12:00:00" style="width: 100%">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="任务状态" prop="taskStat">
                        <el-select v-model="taskNow.taskStat" placeholder="请选择" style="width: 100%">
                            <el-option label="执行中" :value=0>执行中</el-option>
                            <el-option label="已完成" :value=1>已完成</el-option>
                            <el-option label="未完成" :value=2>未完成</el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancle" >取 消</el-button>
                    <el-button type="primary" @click="ok" :loading="loading == true">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 导入数据dialog -->
            <el-dialog
            title="导入数据"
            :visible.sync="importDataShow"
            width="30%">
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="/wm/upload/"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    drag
                    :show-file-list="false"
                    :on-change="readExcel"
                    :auto-upload="false">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击选择excel文件</em></div>
                    <div class="el-upload__tip" slot="tip"></div>
                </el-upload>
                 已选择：{{ fileName }}
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancleImport">取 消</el-button>
                    <el-button type="primary" @click="importOk" :loading="loading">导 入</el-button>
                </span>
            </el-dialog>

    </div>
</template>

<script>
import axios from '@/utils/axios'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
    export default {
        data(){
            return {
                tableLoading : true,
                tableData:[],
                search_data: '',
                taskShow: false, //是否显示新增或编辑的弹出框
                taskNow: {},     //正在编辑的task
                taskNowBefore: null,   //编辑之前的partrol
                edittask: false,
                rules: {           //定义校检方案
                   lineName: [
                        { taskName: true, message: '请输入区域名', trigger: 'change' }
                    ],
                    lineAddress: [
                        { taskAddress: true, message: '请输入区域地址', trigger: 'change' }
                    ],
                    lineStat: [
                        { taskStat: true, message: '请选择状态', trigger: 'change' }
                    ]
                },
                chekcedData:[],                       //被选中的数据项
                batchDeleteBtnState: false,           //批量删除按钮
                batchExportElcelBtnState: false,      //批量导出按钮
                importDataShow: false,                //导入数据面板
                fileData: null,                       //指向最新上传excel文件数据
                fileName: '',                         //文件名
                page: {
                    pageNow: 1,
                    totalCount: 1,
                    pageSize: 10,
                    pageCount: 1
                },
                loading: false,          //编辑页确认按钮
                areaOptions: [],          //全部区域线路信息
                staffList: [],         //全部巡检人员
                lineList: [],            //全部线路
                adminList:[]            //全部管理员
            }
        },
        components:{
        },
        methods: {
            searchBtn() {
                if (this.search_data.length > 0) { 
                    this.page.pageNow = 1
                    this.getSearchData()
                } else {
                    this.$message.error("未输入id！");
                }
            },
            emptySearch() {
                this.search_data = '',
                this.getData()
            },
            add() {
                this.taskNow = {}
                this.taskShow = true
                this.edittask = false
            },
            edit(row) {
                this.taskNow = JSON.parse(JSON.stringify(row))
                this.taskNowBefore = row
                this.taskShow = true
                this.edittask = true
            },
            batchDelete() {
                if(this.chekcedData.length === 1) {
                    this.remove(this.chekcedData[0])
                    return 
                }
                var tasks = []
                for(var task  of this.chekcedData) {
                    tasks.push(task.taskId)
                }
                this.$confirm('此操作将永久删除这些记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        method: 'post',
                        url:'/task/delete',
                        data: tasks
                    }).then(resp => {
                        if(resp.code === 200) {
                            this.$message.success("删除成功");
                            this.getData() 
                        } else {
                            this.$message.error(resp.message);
                        }
                    })
                }).catch(() => {});
            },
            remove(row) {
                this.$confirm('此操作将永久删除这行记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        method: 'post',
                        url:'/task/delete/' + row.taskId,
                    }).then(resp => {
                        if(resp.code === 200) {
                            this.$message.success("删除成功");
                            this.getData() 
                        } else {
                            this.$message.error(resp.message);
                        }
                    })
                }).catch(() => {});
            },
            cancle() {
                this.taskShow = false
            },
            ok() {
                this.$refs['form'].validate((valid) => {
                    if (valid) { 
                        this.loading = true
                        if(this.edittask) {
                            //编辑
                            axios({
                                method: 'post',
                                url:'/task/update',
                                data: this.taskNow
                            }).then(resp => {
                                this.loading = false
                                if(resp.code === 200) {
                                    this.getData()
                                    this.taskShow = false
                                    this.$message.success("更新成功！");
                                }
                            }).catch(error => {
                                this.loading = false
                            })
                            this.taskNowBefore = null
                        } else  {
                            //新增
                            axios({
                                method: 'post',
                                url:'/task/save',
                                data: this.taskNow
                            }).then(resp => {
                                if(resp.code === 200) {
                                    this.loading = false
                                    this.taskShow = false
                                    this.$message.success("新增成功！");
                                    this.getData()
                                }
                            }).catch(error => {
                                this.loading = false
                            })
                        }
                    } 
                })
            },
            handleSelectionChange(val) {
                this.chekcedData = val
                if(this.chekcedData.length > 0) {
                    this.batchDeleteBtnState = true
                    this.batchExportElcelBtnState = true
                } else  {
                    this.batchDeleteBtnState = false
                    this.batchExportElcelBtnState = false
                }
            },
            importData(){
                this.importDataShow = true
            },
            cancleImport() {
                this.importDataShow = false
                this.fileData = null
            },
            importOk() {
                this.loading = true
                axios({
                    method: 'post',
                    url:'/task/save/batch',
                    data: this.fileData
                }).then(resp => {
                    if(resp.code === 200) {
                        this.$message.info("导入成功");
                        this.loading = false
                        this.getData() 
                        this.fileData = null
                        this.importDataShow = false
                    } else {
                        this.$message.error(resp.message);
                    }
                }).catch(error => {
                    this.loading = false
                })
            },
            readExcel(file) {
                this.fileName = file.name
                const fileReader = new FileReader();
                fileReader.onload = (ev) => {
                try {
                    const data = ev.target.result;
                    const workbook = XLSX.read(data, {
                    type: 'binary'
                    });
                    for (let sheet in workbook.Sheets) {
                        this.fileData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                        break
                    }
                } catch (e) {
                    this.$message.warning('文件类型不正确！');
                    return false;
                }
                };
                console.log(this.fileData)
                fileReader.readAsBinaryString(file.raw);
            },
            pageSizeChange(pageSize) {
                this.page.pageSize = pageSize
                this.page.pageNow = 1
                if(this.search_data.length > 0) {
                    this.getSearchData()
                } else {
                    this.getData() 
                }
            },
            pageNowChange(pageNow) {
                this.page.pageNow = pageNow
                if(this.search_data.length > 0) {
                    this.getSearchData()
                } else {
                    this.getData()    
                }
            },
            formatJson(filterVal, jsonData) {  //此方法配合exportExcel一起使用
        　　　　return jsonData.map(v => filterVal.map(j => v[j]))
        　　},
            exportExcel() {
                require.ensure([], () => {
        　　　　　　const { export_json_to_excel } = require('../../../vendor/Export2Excel');
        　　　　　　const tHeader = ['任务编号','巡检员','巡检线路','创建人','描述','创建时间','开始时间','结束时间','状态'];
        　　　　　　const filterVal = ['taskId', 'taskStaff', 'taskLine', 'createBy', 'taskDesc', 'createTime', 'startTime', 'endTime', 'taskStat'];
        　　　　　　const list = this.chekcedData;
        　　　　　　const data = this.formatJson(filterVal, list);
        　　　　　　export_json_to_excel(tHeader, data, 'task');
    　　　　    })
            },
            getData() {
               axios({
                    method: 'get',
                    url:'/task/all/' + this.page.pageNow + '/' + this.page.pageSize
                }).then(resp => {
                    if(resp.code === 200) {
                        this.tableData = resp.data.list
                        this.page = resp.data
                        this.tableLoading = false
                    }
                }).catch(error => {
                    this.tableLoading = false
                })
            },
            getSearchData() {
                axios({
                    method: 'get',
                    url:'/task/search/' + this.search_data + '/' + this.page.pageNow +'/' + this.page.pageSize,
                }).then(resp => {
                    if(resp.code === 200) {
                        this.tableData = resp.data.list
                        this.page = resp.data
                    }
                })
            },
            getAllArea() {
                axios({
                    method: 'get',
                    url:'/area/all/line'
                }).then(resp => {
                    if(resp.code === 200) {
                        var areas = JSON.parse(JSON.stringify(resp.data).replace(/areaId/g, "value").replace(/areaName/g, "label").replace(/lines/g, "children").replace(/lineId/g, "value").replace(/lineName/g, "label"));
                        this.areaOptions = areas
                    }
                })
            },
            lineChange() {
                this.taskNow.taskLine = this.taskNow.taskLine[1]
            },
            getAllStaff() {
                axios({
                    method: 'get',
                    url:'/staff/all'
                }).then(resp => {
                    if(resp.code === 200) {
                        this.staffList = resp.data
                    }
                })
            },
            getAllLine() {
                axios({
                    method: 'get',
                    url:'/line/all'
                }).then(resp => {
                    if(resp.code === 200) {
                        this.lineList = resp.data
                    }
                })
            },
            getAdminAll() {
                axios({
                    method: 'get',
                    url:'/admin/info/all'
                }).then(resp => {
                    if(resp.code === 200) {
                        this.adminList = resp.data
                    }
                })
            }
        },
        created: function() {
            this.getData()
            this.getAllArea()
            this.getAllStaff()
            this.getAllLine()
            this.getAdminAll()
        }
    }
</script>


<style lang="less" scoped>
.search_container{
        margin-bottom: 20px;
    }
    .btnRight{
        float: right;
        margin-right: 0px !important;
    }
    .searchtask{
        background:rgba(255,255,255,1);
        border-radius:2px;
        padding: 18px 18px 0;
    }
    .table_container{
        padding: 10px;
        background: #fff;
        border-radius: 2px;
    }
    .el-dialog--small{
       width: 600px !important;
    }
    .pagination{
        text-align: left;
        margin-top: 10px;
    }
     
</style>


