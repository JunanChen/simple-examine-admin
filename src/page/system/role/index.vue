<template>
    <div class="fillcontain">
        <div class="search_container searchrole">
            <el-form 
                :inline="true" 
                class="demo-form-inline search-form" :model="roleNow"> 
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
                    prop="roleName"
                    label="角色名称"
                    align='center'
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="roleCode"
                    label="角色编码"
                    align='center'
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="roleDesc"
                    label="角色描述"
                    align='center'>
                </el-table-column>
                <el-table-column
                    prop="roleOrder"
                    label="排序号"
                    align='center'
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="roleStatu"
                    label="状态"
                     width="120"
                    align='center'>
                     <template slot-scope="scope">
                        <el-tag v-if="scope.row.roleStatu === 0" type="success">启用</el-tag>
                        <el-tag v-if="scope.row.roleStatu === 1" type="danger">禁用</el-tag>
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
                title="角色信息"
                :visible.sync="roleShow"
                width="40%">
                <el-divider content-position="left">基本信息</el-divider>
                <el-form ref="form" :model="roleNow" :rules="rules">
                    <el-form-item class="form-inline">
                        <el-col :span="2">角色名</el-col>
                        <el-col :span="9">
                            <el-form-item prop="roleName">
                                <el-input v-model="roleNow.roleName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :offset="1" :span="3" style="text-align: center">角色编码</el-col>
                        <el-col :span="9">
                            <el-form-item prop="roleCode">
                                <el-input v-model="roleNow.roleCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="2">描述</el-col>
                        <el-col :span="22">
                            <el-form-item prop="roleDesc">
                                <el-input v-model="roleNow.roleDesc" type="textarea"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="2">排序号</el-col>
                        <el-col :span="22">
                            <el-form-item prop="roleOrder">
                                <el-input v-model="roleNow.roleOrder" type="number"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item class="form-inline">
                        <el-col :span="2">状态</el-col>
                        <el-col :span="9">
                            <el-form-item prop="roleStatu">
                                <el-select style="width: 100%" v-model="roleNow.roleStatu" placeholder="请选择">
                                    <el-option label="启用" :value=0>启用</el-option>
                                    <el-option label="禁用" :value=1>禁用</el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :offset="1" :span="3" style="text-align: center">更新时间</el-col>
                        <el-col :span="9">
                            <el-date-picker
                                v-model="roleNow.updateTime"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                placeholder="请选择日期时间"
                                default-time="12:00:00" :disabled="true">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-form>
                <el-divider content-position="left">系统权限</el-divider>
                <el-tree
                    :data="permissionTreeData"
                    show-checkbox
                    node-key="label"
                    ref="tree"
                    highlight-current
                    :current-node-key="treeDatas"
                    :props="treeProps"
                    :default-expanded-keys="roleNow.permissions"
                    :default-checked-keys="roleNow.permissions">
                </el-tree>
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
                tableData:[
                    {
                       roleCode: 'HD3890',
                       roleName: 'asdfoijsdf',
                       roleOrder: 1,
                       roleDesc: 'asdfoijsdf',
                       roleStatu: 0,
                       updateTime: '1997-06-20 10:20:30',
                    }
                ],
                search_data: '',
                roleShow: false, //是否显示新增或编辑的弹出框
                roleNow: {},     //正在编辑的role
                roleNowBefore: null,   //编辑之前的partrol
                editrole: false,
                rules: {           //定义校检方案
                    roleName: [
                        { required: true, message: '请输入角色名', trigger: 'change' }
                    ],
                    roleCode: [
                        { required: true, message: '请输入角色编码', trigger: 'change' }
                    ],
                    roleDesc: [
                        { required: true, message: '请输入角色描述', trigger: 'change' }
                    ],
                    roleOrder: [
                        { required: true, message: '请输入排序号', trigger: 'change' }
                    ],
                    roleStatu: [
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
                permissionTreeData: [],
                treeProps: {
                    children: 'childrens',
                    label: 'value',
                    value: 'label'
                },
                treeDatas: []
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
                this.roleNow = {}
                this.roleShow = true
                this.editrole = false
            },
            edit(row) {
                this.roleNowBefore = row
                this.roleShow = true
                this.editrole = true
                this.roleNow = JSON.parse(JSON.stringify(row))
                this.$refs.tree.setCheckedKeys([])
            },
            remove(row) {
                this.$confirm('此操作将永久删除这行记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        method: 'delete',
                        url:'/roles/' + row.roleId,
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
                this.roleShow = false
            },
            ok() {
                this.$refs['form'].validate((valid) => {
                    if (valid) { 
                        this.loading = true
                        var checkedPermissions = []
                        for(var permission of this.$refs.tree.getCheckedKeys()) {
                            if(permission !== undefined) {
                                checkedPermissions.push(permission)
                            }
                        }
                        if(checkedPermissions.length > 0) {
                            this.roleNow.permissions = checkedPermissions
                        }
                        if(this.editrole) {
                            //编辑
                            axios({
                                method: 'post',
                                url:'/roles/update',
                                data: this.roleNow
                            }).then(resp => {
                                this.loading = false
                                if(resp.code === 200) {
                                    this.getData()
                                    this.roleShow = false
                                    this.$message.success("更新成功！");
                                }
                            }).catch(error => {
                                this.loading = false
                            })
                            this.roleNowBefore = null
                        } else  {
                            新增
                            axios({
                                method: 'post',
                                url:'/roles',
                                data: this.roleNow
                            }).then(resp => {
                                if(resp.code === 200) {
                                    this.loading = false
                                    this.roleShow = false
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
            formatJson(filterVal, jsonData) {  //此方法配合exportExcel一起使用
        　　　　return jsonData.map(v => filterVal.map(j => v[j]))
        　　},
            exportExcel() {
                require.ensure([], () => {
        　　　　　　const { export_json_to_excel } = require('../../../vendor/Export2Excel');
        　　　　　　const tHeader = ['roleId','roleStaff','createTime','createBy','updateTime','updateBy'];
        　　　　　　const filterVal = ['roleId', 'roleStaff', 'createTime', 'createBy', 'updateTime', 'updateBy'];
        　　　　　　const list = this.chekcedData;
        　　　　　　const data = this.formatJson(filterVal, list);
        　　　　　　export_json_to_excel(tHeader, data, 'role');
    　　　　    })
            },
            getData() {
                axios({
                    method: 'get',
                    url:'/roles/' + this.page.current + '/' + this.page.size
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
                    url:'/roles/' + this.page.current +'/' + this.page.size + '/' + this.search_data,
                }).then(resp => {
                    if(resp.code === 200) {
                        this.tableData = resp.data.records
                        this.page = resp.data
                    }
                })
            },
            getpermissions() {
               axios({
                    method: 'get',
                    url:'/permission/all/tree'
                }).then(resp => {
                    if(resp.code === 200) {
                        this.permissionTreeData = JSON.parse(JSON.stringify(resp.data).replace(/permissions/g,"childrens").replace(/moduleName/g, "value").replace(/permissionId/g, "label").replace(/permissionName/g, "value"))
                    }
                })
            },
        },
        created: function() {
            this.getData()
            this.getpermissions()
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
    .searchrole{
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


