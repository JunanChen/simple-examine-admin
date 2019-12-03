<template>
    <div class="fillcontain">
        <div class="search_container searchArea">
            <el-form 
                :inline="true" 
                class="demo-form-inline search-form">
                <el-form-item label="搜索">
                    <el-input v-model="search_data" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size ="mini" icon="search" @click="searchBtn">筛选</el-button>
                </el-form-item>

                <el-form-item class="btnRight">
                    <el-button type="warning" size ="mini" icon="view" @click="lookAll" >全部标记已读</el-button>
                    <el-button type="primary" @click="batchDelete" :disabled="batchDeleteBtnState == false" size ="mini" icon="view">批量删除</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table v-loading="tableLoading"
                :data="tableData"
                style="width: 100%"
                align='center'
                 @selection-change="handleSelectionChange"
                >
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
                    prop="messName"
                    label="留言人"
                    align='center'>
                </el-table-column>
                <el-table-column
                    prop="messDesc"
                    label="留言"
                    align='center'>
                </el-table-column>
                <el-table-column
                    prop="messTime"
                    label="留言时间"
                    align='center'>
                     <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.messTime}}</span>
                    </template>
                </el-table-column>
                  <el-table-column
                    prop="messStat"
                    label="状态"
                    align='center'>
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.messStat === 0" type="warning">未读</el-tag>
                        <el-tag v-if="scope.row.messStat === 1" type="success">已读</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="operation"
                    align='center'
                    label="操作"
                    width="180">
                    <template slot-scope='scope'>
                        <el-button 
                            type="warning" 
                            icon='edit' 
                            size="mini"
                            @click="look(scope.row)"
                        >查看</el-button>
                        <el-button 
                            type="danger" 
                            icon='delete' 
                            size="mini"
                            @click="deleteMessage(scope.row)"
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
            <el-dialog
                title="留言信息"
                :visible.sync="messShow"
                width="30%">
                <el-form :model="messNow" label-width="80px">
                    <el-form-item label="留言id" prop="pointId">
                        {{ messNow.messId }}
                    </el-form-item>
                    <el-form-item label="留言人" prop="pointId">
                        {{ messNow.messName }}
                    </el-form-item>
                    <el-form-item label="留言信息" prop="pointId">
                        {{ messNow.messDesc }}
                    </el-form-item>
                    <el-form-item label="留言时间" prop="pointId">
                        {{ messNow.messTime }}
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="ok">确 定</el-button>
                </span>
            </el-dialog>
       </div> 
    </div>
</template>

<script>
import axios from '@/utils/axios'

    export default {
        data(){
            return {
                tableLoading: true,
                tableData:[],
                page: {
                    pageNow: 1,
                    totalCount: 1,
                    pageSize: 10,
                    pageCount: 1
                },
                search_data: '',
                messNow:{},
                messShow: false,
                checkedData: [],
                batchDeleteBtnState:false
            }
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
            handleSelectionChange(val) {
                this.checkedData = val
                if(this.checkedData.length > 0) {
                    this.batchDeleteBtnState = true
                } else  {
                    this.batchDeleteBtnState = false
                }
            },
            getSearchData() {
                axios({
                    method: 'get',
                    url:'/message/search/' + this.search_data + '/' + this.page.pageNow +'/' + this.page.pageSize,
                }).then(resp => {
                    if(resp.code === 200) {
                        this.tableData = resp.data.list
                        this.page = resp.data
                    }
                })
            },
            getData() {
               axios({
                    method: 'get',
                    url:'/message/all/' + this.page.pageNow + '/' + this.page.pageSize
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
            look(row) {
                this.messNow = row
                this.messShow = true
                axios({
                    method: 'post',
                    url:'/message/look/' + row.messId,
                }).then(resp => { })
                row.messStat = 1
            },
            //全部标记已读
            lookAll() {
                axios({
                    method: 'post',
                    url:'/message/look/all',
                }).then(resp => {
                    if(resp.code === 200) {
                        this.getData()
                        this.$message.success("操作成功！")
                    } else {
                        this.$message.error("操作失败！")
                    }
                })
            },
            batchDelete() {
                if(this.checkedData.length === 1) {
                    this.deleteMessage(this.checkedData[0])
                    return 
                }
                var messages = []
                for(var message  of this.checkedData) {
                    messages.push(message.messId)
                }
                this.$confirm('此操作将永久删除这些记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        method: 'post',
                        url:'/message/delete',
                        data: messages
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
            deleteMessage(row) {
                 this.$confirm('此操作将永久删除这行记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        method: 'post',
                        url:'/message/delete/' + row.messId,
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
            ok() {
                this.messShow = false
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
        },
        created() {
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
    .searchArea{
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


