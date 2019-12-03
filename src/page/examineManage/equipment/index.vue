<template>
    <div class="fillcontain">
        <div class="search_container searchequ">
            <el-form 
                :inline="true" 
                class="demo-form-inline search-form" :model="equNow"> 
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
                    prop="equName"
                    label="设备名"
                    align='center'
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="equDesc"
                    label="设备描述"
                    align='center'
                    width="240">
                </el-table-column>
                <el-table-column
                    prop="equPoint"
                    label="所属点位"
                    align='center'
                    width="180">
                    <template slot-scope="scope">
                        <el-tag v-for="item in pointList" v-if="item.pointId == scope.row.equPoint"  type="success">
                            {{ item.pointName }}
                        </el-tag>
                    </template>
                </el-table-column>
                 <el-table-column
                    prop="equStat"
                    label="状态"
                    align='center'
                    width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.equStat === 0" type="success">启用</el-tag>
                        <el-tag v-if="scope.row.equStat === 1" type="danger">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createBy"
                    label="创建人"
                    align='center'>
                     <template slot-scope="scope">
                        <span v-for="item in adminList" v-if="item.adminId === scope.row.createBy">{{item.adminName}}</span>
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
                    prop="updateBy"
                    label="更新人"
                    align='center'
                    width="100">
                     <template slot-scope="scope">
                        <span v-for="item in adminList" v-if="item.adminId === scope.row.updateBy">{{item.adminName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="更新时间"
                    align='center'
                    width="200"
                    sortable>
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.updateTime}}</span>
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
                title="设备信息"
                :visible.sync="equShow"
                width="30%">
                <el-form ref="form" :model="equNow" :rules="rules" label-width="80px">
                    <el-form-item label="设备id" prop="equId">
                        <el-input v-model="equNow.equId" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="设备名" prop="equName">
                        <el-input v-model="equNow.equName"></el-input>
                    </el-form-item>
                    <el-form-item label="设备描述" prop="equDesc">
                        <el-input type="textarea" v-model="equNow.equDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="所属点位" prop="equLine">
                        <el-select v-model="equNow.equPoint" placeholder="请选择" style="width: 100%">
                            <el-option v-for="item in pointList" :label="item.pointName" :value="item.pointId">{{ item.pointName }}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备状态" prop="equStat">
                        <el-select v-model="equNow.equStat" placeholder="请选择" style="width: 100%">
                            <el-option label="启用" :value="0">启用</el-option>
                            <el-option label="禁用" :value="1">禁用</el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="创建人" prop="createBy">
                        <el-input v-model="equNow.createBy" :disabled="true"></el-input>
                    </el-form-item>
                     <el-form-item label="创建时间" prop="createTime">
                        <el-date-picker
                            v-model="equNow.createTime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="请选择日期时间"
                            default-time="12:00:00" :disabled="true" style="width: 100%">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="更新人" prop="updateBy">
                        <el-input v-model="equNow.updateBy" :disabled="true"></el-input>
                    </el-form-item>
                     <el-form-item label="更新时间" prop="updateTime">
                        <el-date-picker
                            v-model="equNow.updateTime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="请选择日期时间"
                            default-time="12:00:00" :disabled="true" style="width: 100%">
                        </el-date-picker>
                    </el-form-item> -->
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
                tableLoading: true,
                tableData:[],
                search_data: '',
                equShow: false, //是否显示新增或编辑的弹出框
                equNow: {},     //正在编辑的equ
                equNowBefore: null,   //编辑之前的partrol
                editequ: false,
                rules: {           //定义校检方案
                    equName: [
                        { required: true, message: '请输入设备名', trigger: 'change' }
                    ],
                    equPoint: [
                        { required: true, message: '请输选择设备所属点位', trigger: 'change' }
                    ],
                    equStat: [
                        { required: true, message: '请选择设备状态', trigger: 'change' }
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
                pointList: [],
                adminList: []
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
                this.equNow = {}
                this.equShow = true
                this.editequ = false
            },
            edit(row) {
                this.equNow = JSON.parse(JSON.stringify(row))
                this.equNowBefore = row
                this.equShow = true
                this.editequ = true
            },
            batchDelete() {
                if(this.chekcedData.length === 1) {
                    this.remove(this.chekcedData[0])
                    return 
                }
                var equs = []
                for(var equ  of this.chekcedData) {
                    equs.push(equ.equId)
                }
                this.$confirm('此操作将永久删除这些记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        method: 'post',
                        url:'/equ/delete',
                        data: equs
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
                        url:'/equ/delete/' + row.equId,
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
                this.equShow = false
            },
            ok() {
                this.$refs['form'].validate((valid) => {
                    if (valid) { 
                        this.loading = true
                        if(this.editequ) {
                            //编辑
                            axios({
                                method: 'post',
                                url:'/equ/update',
                                data: this.equNow
                            }).then(resp => {
                                this.loading = false
                                if(resp.code === 200) {
                                    this.getData()
                                    this.equShow = false
                                    this.$message.success("更新成功！");
                                }
                            }).catch(error => {
                                this.loading = false
                            })
                            this.equNowBefore = null
                        } else  {
                            //新增
                            axios({
                                method: 'post',
                                url:'/equ/save',
                                data: this.equNow
                            }).then(resp => {
                                if(resp.code === 200) {
                                    this.loading = false
                                    this.equShow = false
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
                    url:'/equ/save/batch',
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
        　　　　　　const tHeader = ['equId','equTime','equTask','equStatu','equStaff','equDeal'];
        　　　　　　const filterVal = ['equId', 'equTime', 'equTask', 'equStatu', 'equStaff', 'equDeal'];
        　　　　　　const list = this.chekcedData;
        　　　　　　const data = this.formatJson(filterVal, list);
        　　　　　　export_json_to_excel(tHeader, data, 'equ');
    　　　　    })
            },
            getData() {
               axios({
                    method: 'get',
                    url:'/equ/all/' + this.page.pageNow + '/' + this.page.pageSize
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
                    url:'/equ/search/' + this.search_data + '/' + this.page.pageNow +'/' + this.page.pageSize,
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
             getPointAll() {
                axios({
                    method: 'get',
                    url:'/point/all'
                }).then(resp => {
                    if(resp.code === 200) {
                        this.pointList = resp.data
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
            this.getPointAll()
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
    .searchequ{
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


