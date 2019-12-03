<template>
    <div class="fillcontain">
        <div class="search_container searchlog">
            <el-form 
                :inline="true" 
                class="demo-form-inline search-form" :model="logNow"> 
                <el-form-item label="搜索">
                    <el-input v-model="search_data" placeholder="id" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size ="mini" icon="search" @click="searchBtn">筛选</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="info" size ="mini" icon="search" @click="emptySearch">清空</el-button>
                </el-form-item>

                <el-form-item class="btnRight">
                    <el-button type="danger" size ="mini" icon="view" @click="allDelete">全部删除</el-button>
                    <el-button type="warning" size ="mini" icon="view" :disabled="batchDeleteBtnState == false" @click="batchDelete">批量删除</el-button>
                    <el-button type="success" size ="mini" icon="view" :disabled="batchExportElcelBtnState == false" @click="exportExcel">导出Elcel</el-button>
                    <el-button type="primary" size ="mini" icon="view" @click="add" :disabled="true">添加</el-button>
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
                    prop="logTime"
                    label="时间"
                    align='center'
                    width="180"
                    sortable default-sort>
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.logTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="logUrl"
                    label="操作url"
                    align='center'
                    width="250">
                </el-table-column>
                <el-table-column
                    prop="logIp"
                    label="IP地址"
                    align='center'
                    width="140">
                </el-table-column>
                <el-table-column
                    prop="logMethod"
                    label="使用方法"
                    align='center'
                    width="180">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.logMethod === 0" type="success">GET</el-tag>
                        <el-tag v-if="scope.row.logMethod === 1" type="danger">POST</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="logDesc"
                    label="描述"
                    align='center'
                    width="180">
                </el-table-column>
                 <el-table-column
                    prop="logUsetime"
                    label="响应时间（/ms）"
                    align='center'
                    width="180">
                </el-table-column>
                 <el-table-column
                    prop="logStat"
                    label="状态"
                    align='center'
                    width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.logStat === 0" type="success">成功</el-tag>
                        <el-tag v-if="scope.row.logStat === 1" type="danger">失败</el-tag>
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
            <!-- 新增和编辑
            <el-dialog
                title="区域信息"
                :visible.sync="logShow"
                width="30%">
                <el-form ref="form" :model="logNow" :rules="rules" label-width="80px">
                    <el-form-item label="区域id" prop="logId">
                        <el-input v-model="logNow.logId" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="区域名" prop="logName">
                        <el-input v-model="logNow.logName"></el-input>
                    </el-form-item>
                    <el-form-item label="区域地址" prop="logAddress">
                        <el-input type="textlog" v-model="logNow.logAddress"></el-input>
                    </el-form-item>
                    <el-form-item label="区域描述" prop="logDesc">
                        <el-input type="textlog" v-model="logNow.logDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="区域状态" prop="logStat">
                        <el-select v-model="logNow.logStat" placeholder="请选择">
                            <el-option label="启用" :value="0">启用</el-option>
                            <el-option label="禁用" :value="1">禁用</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建人" prop="createBy">
                        <el-input v-model="logNow.createBy" :disabled="true"></el-input>
                    </el-form-item>
                     <el-form-item label="创建时间">
                        <el-col :span="11">
                            <el-form-item prop="createTime">
                                <el-date-picker
                                    v-model="logNow.createTime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="datetime"
                                    placeholder="请选择日期时间"
                                    default-time="12:00:00" :disabled="true">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="更新人" prop="updateBy">
                        <el-input v-model="logNow.updateBy" :disabled="true"></el-input>
                    </el-form-item>
                     <el-form-item label="更新时间">
                        <el-col :span="11">
                            <el-form-item prop="updateTime">
                                <el-date-picker
                                    v-model="logNow.updateTime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="datetime"
                                    placeholder="请选择日期时间"
                                    default-time="12:00:00" :disabled="true">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancle" >取 消</el-button>
                    <el-button type="primary" @click="ok" :loading="loading == true">确 定</el-button>
                </span>
            </el-dialog> -->

    </div>
</template>

<script>
import axios from '@/utils/axios'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
    export default {
        data(){
            return {
                tableData:[
                    {
                       logId: 'asdfoijsdf',
                       logTime: '1997-06-20 10:20:30',
                       logUrl: 'asdfoijsdf',
                       logIp: 'asdfoijsdf',
                       logStat: 0,
                       logMethod: 0,
                       logDesc: 'sadfuishdaf',
                       logUsetime: 200
                    }
                ],
                tableLoading: true,
                search_data: '',
                logShow: false, //是否显示新增或编辑的弹出框
                logNow: {},     //正在编辑的log
                logNowBefore: null,   //编辑之前的partrol
                editlog: false,
                rules: {           //定义校检方案
                   lineName: [
                        { logName: true, message: '请输入区域名', trigger: 'change' }
                    ],
                    lineAddress: [
                        { logAddress: true, message: '请输入区域地址', trigger: 'change' }
                    ],
                    lineStat: [
                        { logStat: true, message: '请选择状态', trigger: 'change' }
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
                this.logNow = {}
                this.logShow = true
                this.editlog = false
            },
            edit(row) {
                this.logNow = JSON.parse(JSON.stringify(row))
                this.logNowBefore = row
                this.logShow = true
                this.editlog = true
            },
            allDelete() {
                this.$confirm('此操作将永久删除这些记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        method: 'post',
                        url:'/log/delete/all',
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
            batchDelete() {
                if(this.chekcedData.length === 1) {
                    this.remove(this.chekcedData[0])
                    return 
                }
                var logs = []
                for(var log  of this.chekcedData) {
                    logs.push(log.logId)
                }
                this.$confirm('此操作将永久删除这些记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        method: 'post',
                        url:'/log/delete',
                        data: logs
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
                        url:'/log/delete/' + row.logId,
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
                this.logShow = false
            },
            ok() {
                this.$refs['form'].validate((valid) => {
                    if (valid) { 
                        this.loading = true
                        if(this.editlog) {
                            //编辑
                            axios({
                                method: 'post',
                                url:'/log/update',
                                data: this.logNow
                            }).then(resp => {
                                this.loading = false
                                if(resp.code === 200) {
                                    this.getData()
                                    this.logShow = false
                                    this.$message.success("更新成功！");
                                }
                            }).catch(error => {
                                this.loading = false
                            })
                            this.logNowBefore = null
                        } else  {
                            //新增
                            axios({
                                method: 'post',
                                url:'/log/save',
                                data: this.logNow
                            }).then(resp => {
                                if(resp.code === 200) {
                                    this.loading = false
                                    this.logShow = false
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
                    url:'/log/save/batch',
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
        　　　　　　const tHeader = ['编号','访问时间', '访问链接', '访问IP','访问状态','访问方式','访问描述', '响应时间'];
        　　　　　　const filterVal = ['logId','logTime', 'logUrl', 'logIp','logStat','logMethod','logDesc', 'logUsetime'];
        　　　　　　const list = this.chekcedData;
        　　　　　　const data = this.formatJson(filterVal, list);
        　　　　　　export_json_to_excel(tHeader, data, 'log');
    　　　　    })
            },
            getData() {
               this.tableLoading = true
               axios({
                    method: 'get',
                    url:'/log/all/' + this.page.pageNow + '/' + this.page.pageSize
                }).then(resp => {
                    if(resp.code === 200) {
                        this.tableData = resp.data.list
                        this.page = resp.data
                    }
                    this.tableLoading = false
                }).catch(error => {
                    this.tableLoading = false
                })
            },
            getSearchData() {
                axios({
                    method: 'get',
                    url:'/log/search/' + this.search_data + '/' + this.page.pageNow +'/' + this.page.pageSize,
                }).then(resp => {
                    if(resp.code === 200) {
                        this.tableData = resp.data.list
                        this.page = resp.data
                    }
                })
            }
        },
        created: function() {
            this.getData()
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
    .searchlog{
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


