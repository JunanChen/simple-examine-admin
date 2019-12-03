<template>
    <div class="fillcontain">
        <div class="search_container searchadmin">
            <el-form 
                :inline="true" 
                class="demo-form-inline search-form" :model="adminNow"> 
                <el-form-item label="搜索">
                    <el-input v-model="search_data" placeholder="角色名" ></el-input>
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
                    prop="adminName"
                    label="登录名"
                    align='center'
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="realName"
                    label="真实姓名"
                    align='center'
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="img"
                    label="头像地址"
                    align='center'
                    width="250">
                </el-table-column>
                <el-table-column
                    prop="adminDesc"
                    label="描述"
                    align='center'
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="adminStatu"
                    label="状态"
                     width="120"
                    align='center'>
                     <template slot-scope="scope">
                        <el-tag v-if="scope.row.adminStatu === 0" type="success">启用</el-tag>
                        <el-tag v-if="scope.row.adminStatu === 1" type="danger">禁用</el-tag>
                     </template>
                </el-table-column>
                <el-table-column
                    prop="lastLoginTime"
                    label="最后登录时间"
                    align='center'
                    width="200"
                    sortable>
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.lastLoginTime}}</span>
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
                title="用户信息"
                :visible.sync="adminShow"
                width="40%">
                <el-divider content-position="left">基本信息</el-divider>
                <el-form ref="form" :model="adminNow" :rules="rules">
                    <el-form-item class="form-inline">
                        <el-col :span="2">登录名</el-col>
                        <el-col :span="9">
                            <el-form-item prop="adminName">
                                <el-input v-model="adminNow.adminName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :offset="1" :span="3" style="text-align: center">真实姓名</el-col>
                        <el-col :span="9">
                            <el-form-item prop="realName">
                                <el-input v-model="adminNow.realName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item class="form-inline">
                        <el-col :span="2">性别</el-col>
                        <el-col :span="9">
                            <el-form-item prop="sex">
                                <el-radio-group v-model="adminNow.sex">
                                    <el-radio-button label=0>男</el-radio-button>
                                    <el-radio-button label=1>女</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :offset="1" :span="3" style="text-align: center">联系方式</el-col>
                        <el-col :span="9">
                            <el-form-item prop="tele">
                                <el-input v-model="adminNow.tele" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="2">描述</el-col>
                        <el-col :span="22">
                            <el-form-item prop="adminDesc">
                                <el-input v-model="adminNow.adminDesc" type="textarea"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="2">头像</el-col>
                        <el-col :span="22">
                            <el-form-item prop="img">
                                <el-input v-model="adminNow.img" type="text"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item class="form-inline">
                        <el-col :span="2">状态</el-col>
                        <el-col :span="9">
                            <el-form-item prop="adminStatu">
                                <el-select style="width: 100%" v-model="adminNow.adminStatu" placeholder="请选择">
                                    <el-option label="启用" :value=0>启用</el-option>
                                    <el-option label="禁用" :value=1>禁用</el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :offset="1" :span="3" style="text-align: center">最后登录</el-col>
                        <el-col :span="9">
                            <el-date-picker
                                v-model="adminNow.lastLoginTime"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                placeholder="请选择日期时间"
                                default-time="12:00:00" :disabled="true">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-form>
                <el-divider content-position="left">拥有角色</el-divider>
                <el-checkbox-group v-model="checkedRoleData" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="role in roleData" :label="role.roleId">{{role.roleName}}</el-checkbox>
                </el-checkbox-group>
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
                tableLoading: true,
                tableData:[],
                search_data: '',
                adminShow: false, //是否显示新增或编辑的弹出框
                adminNow: {},     //正在编辑的admin
                adminNowBefore: null,   //编辑之前的partrol
                editadmin: false,
                rules: {           //定义校检方案
                    adminName: [
                        { required: true, message: '请输入角色名', trigger: 'change' }
                    ],
                    adminCode: [
                        { required: true, message: '请输入角色编码', trigger: 'change' }
                    ],
                    adminDesc: [
                        { required: true, message: '请输入角色描述', trigger: 'change' }
                    ],
                    adminOrder: [
                        { required: true, message: '请输入排序号', trigger: 'change' }
                    ],
                    adminStatu: [
                        { required: true, message: '请选择角色状态', trigger: 'change' }
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
                roleData: [],
                checkedRoleData: []
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
                    this.$message.error("未输入角色名！");
                }
            },
            emptySearch() {
                this.search_data = '',
                this.getData()
            },
            add() {
                this.adminNow = {}
                this.adminShow = true
                this.editadmin = false
            },
            edit(row) {
                this.adminNowBefore = row
                this.adminShow = true
                this.editadmin = true
                this.adminNow = JSON.parse(JSON.stringify(row))
                this.checkedRoleData = []
                for(var  role of this.adminNow.rolesList) {
                    this.checkedRoleData.push(role.roleId)
                }
            },
            remove(row) {
                this.$confirm('此操作将永久删除这行记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        method: 'delete',
                        url:'/admin/delete/' + row.adminId,
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
                this.adminShow = false
            },
            ok() {
                this.$refs['form'].validate((valid) => {
                    if (valid) { 
                        this.loading = true
                        if(this.checkedRoleData.length > 0) {
                            this.adminNow.roles
                        }
                        if(this.editadmin) {
                            //编辑
                            axios({
                                method: 'post',
                                url:'/admin/update',
                                data: this.adminNow
                            }).then(resp => {
                                this.loading = false
                                if(resp.code === 200) {
                                    this.getData()
                                    this.adminShow = false
                                    this.$message.success("更新成功！");
                                }
                            }).catch(error => {
                                this.loading = false
                            })
                            this.adminNowBefore = null
                        } else  {
                            新增
                            axios({
                                method: 'post',
                                url:'/admin/save',
                                data: this.adminNow
                            }).then(resp => {
                                if(resp.code === 200) {
                                    this.loading = false
                                    this.adminShow = false
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
                this.page.pageNow = pageNow
                if(this.search_data.length > 0) {
                    this.getSearchData()
                } else {
                    this.getData()    
                }
            },
            getData() {
                axios({
                    method: 'get',
                    url:'/admin/' + this.page.current + '/' + this.page.size
                }).then(resp => {
                    if(resp.code === 200) {
                        this.tableData = resp.data.records
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
                    url:'/admin/' + this.page.current +'/' + this.page.size + '/' + this.search_data,
                }).then(resp => {
                    if(resp.code === 200) {
                        this.tableData = resp.data.records
                        this.page = resp.data
                    }
                })
            },
            getRoles() {
               axios({
                    method: 'get',
                    url:'/roles/all'
                }).then(resp => {
                    if(resp.code === 200) {
                        this.roleData = resp.data
                    }
                })
            },
        },
        created: function() {
            this.getData()
            this.getRoles()
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
    .searchadmin{
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


