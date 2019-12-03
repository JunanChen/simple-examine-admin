<template>
    <div class="fillcontain">
        <div class="search_container searchpermission">
            <el-form 
                :inline="true" 
                class="demo-form-inline search-form" :model="permissionNow"> 
                <el-form-item label="搜索">
                    <el-input v-model="search_data" placeholder="权限代码" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size ="mini" icon="search" @click="searchBtn">筛选</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="info" size ="mini" icon="search" @click="emptySearch">清空</el-button>
                </el-form-item>

                <el-form-item class="btnRight">
                    <el-button type="primary" size ="mini" icon="view" @click="add">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table v-loading="tableLoading"
                :data="tableData"
                style="width: 100%"
                border
                align='center'
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    align='center'>
                </el-table-column>
                <el-table-column
                    type="index"
                    label="索引"
                    align='center'>
                </el-table-column>
                 <el-table-column
                    prop="permissionName"
                    label="权限代码"
                    align='center'>
                </el-table-column>
                <el-table-column
                    prop="permissionDesc"
                    label="描述"
                    align='center'>
                </el-table-column>
                <el-table-column
                    prop="permissionModule"
                    label="所属模块"
                    align='center'>
                    <template slot-scope="scope">
                        <span>{{ scope.row.module.moduleName }}</span>
                    </template>
                </el-table-column>
                 <el-table-column
                    prop="permissionStatu"
                    label="状态"
                    align='center'>
                     <template slot-scope="scope">
                        <el-tag v-if="scope.row.permissionStatu === 0" type="success">启用</el-tag>
                        <el-tag v-if="scope.row.permissionStatu === 1" type="danger">禁用</el-tag>
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
                layout="total, sizes, prev, pager, next" :page-count="page.pages" :current-page="page.current" 
                :page-sizes="[10, 20, 50, 100]" :page-size="page.size"
                :total="page.tatol" style="text-align: center" @size-change="pageSizeChange" @current-change="pageNowChange">
            </el-pagination>
            <br>
            </div>
            <!-- 新增和编辑 -->
            <el-dialog
                title="权限信息"
                :visible.sync="permissionShow"
                width="30%">
                <el-form ref="form" :model="permissionNow" :rules="rules" label-width="80px">
                    <el-form-item label="权限代码" prop="permissionName">
                        <el-input v-model="permissionNow.permissionName"></el-input>
                    </el-form-item>
                    <el-form-item label="部门描述" prop="permissionDesc">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" v-model="permissionNow.permissionDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="所属模块" prop="permissionModule">
                        <el-cascader style="width: 100%"
                            v-model="permissionNow.permissionModule"
                            :options="modules"
                            :props="mosuleProps"
                            @change="moduleChange">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="部门状态" prop="permissionStatu">
                        <el-select v-model="permissionNow.permissionStatu" placeholder="请选择" style="width: 100%">
                            <el-option label="启用" :value="0">启用</el-option>
                            <el-option label="禁用" :value="1">禁用</el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancle" >取 消</el-button>
                    <el-button type="primary" @click="ok" :loading="loading == true">确 定</el-button>
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
                tableLoading: false,
                tableData:[],
                search_data: '',
                permissionShow: false, //是否显示新增或编辑的弹出框
                permissionNow: {},     //正在编辑的permission
                permissionNowBefore: null,   //编辑之前的partrol
                editpermission: false,
                rules: {           //定义校检方案
                    permissionName: [
                        { required: true, message: '请输入权限代码', trigger: 'change' }
                    ],
                    permissionDesc: [
                        { required: true, message: '请输入权限描述', trigger: 'change' }
                    ],
                    permissionModule: [
                        { required: true, message: '请选择所属模块', trigger: 'change' }
                    ],
                    permissionStatu: [
                        { required: true, message: '请选择权限状态', trigger: 'change' }
                    ]
                },
                chekcedData:[],                       //被选中的数据项
                batchDeleteBtnState: false,           //批量删除按钮
                batchExportElcelBtnState: false,      //批量导出按钮
                fileData: null,                       //指向最新上传excel文件数据
                fileName: '',                         //文件名
                page: {
                    current: 1,
                    total: 1,
                    size: 10,
                    pages: 1
                },
                loading: false,          //编辑页确认按钮
                modules: [],
                mosuleProps: {
                    children: 'childrens',
                    label: 'moduleName',
                    value: 'moduleId'
                }
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
                this.permissionNow = {}
                this.permissionShow = true
                this.editpermission = false
            },
            edit(row) {
                this.permissionNow = JSON.parse(JSON.stringify(row))
                this.permissionNowBefore = row
                this.permissionShow = true
                this.editpermission = true
            },
            cancle() {
                this.permissionShow = false
            },
            ok() {
                this.$refs['form'].validate((valid) => {
                    if (valid) { 
                        this.loading = true
                        if(this.editpermission) {
                            //编辑
                            axios({
                                method: 'post',
                                url:'/permission/update',
                                data: this.permissionNow
                            }).then(resp => {
                                this.loading = false
                                if(resp.code === 200) {
                                    this.getData()
                                    this.permissionShow = false
                                    this.$message.success("更新成功！");
                                }
                            }).catch(error => {
                                this.loading = false
                            })
                            this.permissionNowBefore = null
                        } else  {
                            //新增
                            axios({
                                method: 'post',
                                url:'/permission/save',
                                data: this.permissionNow
                            }).then(resp => {
                                if(resp.code === 200) {
                                    this.loading = false
                                    this.permissionShow = false
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
            moduleChange() {
                this.permissionNow.permissionModule = this.permissionNow.permissionModule[1]
            },
            pageSizeChange(pageSize) {
                this.page.size = pageSize
                this.page.pageNow = 1
                if(this.search_data.length > 0) {
                    this.getSearchData()
                } else {
                    this.getData() 
                }
            },
            pageNowChange(pageNow) {
                this.page.current = pageNow
                if(this.search_data.length > 0) {
                    this.getSearchData()
                } else {
                    this.getData()    
                }
            },
            getData() {
               axios({
                    method: 'get',
                    url:'/permission/' + this.page.current + '/' + this.page.size
                }).then(resp => {
                    if(resp.code === 200) {
                        this.tableData = resp.data.records
                        this.page = resp.data,
                        this.tableLoading = false
                    }
                }).catch(error => {
                    this.tableLoading = false
                })
            },
            getSearchData() {
                axios({
                    method: 'get',
                    url:'/permission/' + this.page.current +'/' + this.page.size + '/' + this.search_data,
                }).then(resp => {
                    if(resp.code === 200) {
                        this.tableData = resp.data.records
                        this.page = resp.data
                    }
                })
            },
            getModules() {
               axios({
                    method: 'get',
                    url:'/module/all'
                }).then(resp => {
                    if(resp.code === 200) {
                        this.modules = resp.data
                    }
                }).catch(error => {
                    this.tableLoading = false
                })
            },
        },
        created: function() {
            this.getData()
            this.getModules()
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
    .searchpermission{
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


