<template>
  <div class="fillcontain">
    <div class="search_container searchstaff">
      <el-form :inline="true" class="demo-form-inline search-form" :model="staffNow">
        <el-form-item label="搜索">
          <el-input v-model="search_data" placeholder="输入姓名搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" icon="search" @click="searchBtn">筛选</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="info" size="mini" icon="search" @click="emptySearch">清空</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="warning" size="mini" icon @click="importData">导入数据</el-button>
        </el-form-item>

        <el-form-item class="btnRight">
          <el-button
            type="danger"
            size="mini"
            icon="view"
            :disabled="batchDeleteBtnState == false"
            @click="batchDelete"
          >批量删除</el-button>
          <el-button
            type="success"
            size="mini"
            icon="view"
            :disabled="batchExportElcelBtnState == false"
            @click="exportExcel"
          >导出Elcel</el-button>
          <el-button type="primary" size="mini" icon="view" @click="add">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%"
        border
        align="center"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column type="index" label="索引" align="center" width="50"></el-table-column>
        <el-table-column prop="staffName" label="姓名" align="center" width="100"></el-table-column>
        <el-table-column prop="staffDept" label="所属部门" align="center" width="180">
          <template slot-scope="scope">
            <span
              v-for="item in deptList"
              v-if="item.deptId === scope.row.staffDept"
            >{{item.deptName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="staffSex" label="性别" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.staffSex === 0">男</el-tag>
            <el-tag v-if="scope.row.staffSex === 1">女</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="staffTele" label="电话号码" align="center" width="180"></el-table-column>
        <el-table-column prop="staffIdNumber" label="身份证号" align="center" width="180"></el-table-column>
        <el-table-column prop="staffAddress" label="家庭地址" align="center" width="250"></el-table-column>
        <el-table-column prop="staffStat" label="状态" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.staffStat === 0" type="success">启用</el-tag>
            <el-tag v-if="scope.row.staffStat === 1" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建人" align="center">
          <template slot-scope="scope">
            <span
              v-for="item in adminList"
              v-if="item.adminId === scope.row.createBy"
            >{{item.adminName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="200" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateBy" label="更新人" align="center" width="100">
          <template slot-scope="scope">
            <span
              v-for="item in adminList"
              v-if="item.adminId === scope.row.createBy"
            >{{item.adminName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center" width="200" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.updateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" fixed="right" align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="warning" icon="edit" size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" icon="delete" size="mini" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <br />
      <br />
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :pager-count="5"
        :current-page="page.pageNow"
        :page-count="page.pageCount"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        :total="page.tatolCount"
        style="text-align: center"
        @size-change="pageSizeChange"
        @current-change="pageNowChange"
      ></el-pagination>
      <br />
    </div>
    <!-- 新增和编辑 -->
    <el-dialog title="巡检员信息" :visible.sync="staffShow" width="600px">
      <el-row>
        <el-col :span="16">
          <el-form ref="form1" :model="staffNow" :rules="rules" label-width="80px">
            <el-form-item label="编号" prop="staffId">
              <el-input v-model="staffNow.staffId" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="staffName">
              <el-input v-model="staffNow.staffName"></el-input>
            </el-form-item>
            <el-form-item label="所属部门">
              <el-col :span="10">
                <el-form-item prop="staffDept">
                  <el-select v-model="staffNow.staffDept" placeholder="请选择">
                    <el-option
                      v-for="item in deptList"
                      :label="item.deptName"
                      :value="item.deptId"
                    >{{ item.deptName }}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="text-align: center">性别</el-col>
              <el-col :span="10">
                <el-form-item prop="staffSex">
                  <el-radio-group v-model="staffNow.staffSex">
                    <el-radio-button label="0" :value="0">男</el-radio-button>
                    <el-radio-button label="1" :value="1">女</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8" style="text-align:center">
          <!-- <el-avatar shape="square" :size="125" :fit="fit" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar> -->
          <el-upload
            class="avatar-uploader"
            :action="imageUploadPath"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="beforeAvatarUpload"
            multiple
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>
      <el-form ref="form" :model="staffNow" :rules="rules" label-width="80px">
        <el-form-item label="联系电话" prop="staffTele">
          <el-input v-model="staffNow.staffTele"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="staffIdNumber">
          <el-input v-model="staffNow.staffIdNumber"></el-input>
        </el-form-item>
        <el-form-item label="家庭住址" prop="staffAddress">
          <el-input type="textarea" v-model="staffNow.staffAddress"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="staffStat">
          <el-select v-model="staffNow.staffStat" placeholder="请选择">
            <el-option label="启用" :value="0">启用</el-option>
            <el-option label="禁用" :value="1">禁用</el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="创建人">
                        <el-col :span="7">
                            <el-input v-model="staffNow.createBy" :disabled="true"></el-input>
                        </el-col>
                        <el-col :span="5" style="text-align: center">
                            创建时间
                        </el-col>
                        <el-col :span="5">
                            <el-date-picker
                                v-model="staffNow.createTime"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                placeholder="请选择日期时间"
                                default-time="12:00:00" :disabled="true">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="更新人">
                        <el-col :span="7">
                            <el-input v-model="staffNow.updateBy" :disabled="true"></el-input>
                        </el-col>
                        <el-col :span="5" style="text-align: center">
                            更新时间
                        </el-col>
                        <el-col :span="5">
                            <el-date-picker
                                v-model="staffNow.updateTime"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                placeholder="请选择日期时间"
                                default-time="12:00:00" :disabled="true">
                            </el-date-picker>
                        </el-col>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="ok" :loading="loading == true">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 导入数据dialog -->
    <el-dialog title="导入数据" :visible.sync="importDataShow" width="30%">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="/wm/upload/"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        drag
        :show-file-list="false"
        :on-change="readExcel"
        :auto-upload="false"
        style="width: 100%"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击选择excel文件</em>
        </div>
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
import axios from "@/utils/axios";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import global from "../../../globle";
import { getToken } from "@/utils/auth";

var token1 = getToken("Token"); // 要保证取到
export default {
  data() {
    return {
      tableLoading: true,
      headers: {
        token: token1
      },
      tableData: [],
      search_data: "",
      staffShow: false, //是否显示新增或编辑的弹出框
      imgUrl: "",
      staffNow: {}, //正在编辑的staff
      staffNowBefore: null, //编辑之前的partrol
      editstaff: false,
      imageUploadPath: global.baseURL + "/upload/staff/avatar",
      rules: {
        //定义校检方案
        staffName: [
          { required: true, message: "请输入姓名", trigger: "change" }
        ],
        staffTele: [
          { required: true, message: "请输入联系电话", trigger: "change" }
        ],
        staffAddress: [
          { required: true, message: "请输入家庭住址", trigger: "change" }
        ],
        staffIdNumber: [
          { required: true, message: "请输入身份证号", trigger: "change" }
        ],
        staffSex: [
          { required: true, message: "请输选择性别", trigger: "change" }
        ],
        staffDept: [
          { required: true, message: "请输选择所属部门", trigger: "change" }
        ],
        staffStat: [
          { required: true, message: "请选择状态", trigger: "change" }
        ]
      },
      chekcedData: [], //被选中的数据项
      batchDeleteBtnState: false, //批量删除按钮
      batchExportElcelBtnState: false, //批量导出按钮
      importDataShow: false, //导入数据面板
      fileData: null, //指向最新上传excel文件数据
      fileName: "", //文件名
      page: {
        pageNow: 1,
        totalCount: 1,
        pageSize: 10,
        pageCount: 1
      },
      loading: false, //编辑页确认按钮
      lineList: [],
      adminList: [],
      imageUrl: "",
      deptList: []
    };
  },
  components: {},
  methods: {
    searchBtn() {
      if (this.search_data.length > 0) {
        this.page.pageNow = 1;
        this.getSearchData();
      } else {
        this.$message.error("未输入id！");
      }
    },
    emptySearch() {
      (this.search_data = ""), this.getData();
    },
    add() {
      this.staffNow = {};
      this.staffShow = true;
      this.editstaff = false;
      this.imgUrl = "";
    },
    edit(row) {
      this.staffNow = JSON.parse(JSON.stringify(row));
      this.staffNowBefore = row;
      this.staffShow = true;
      this.editstaff = true;
      this.imgUrl = this.staffNow.staffImg;
    },
    batchDelete() {
      if (this.chekcedData.length === 1) {
        this.remove(this.chekcedData[0]);
        return;
      }
      var staffs = [];
      for (var staff of this.chekcedData) {
        staffs.push(staff.staffId);
      }
      this.$confirm("此操作将永久删除这些记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            method: "post",
            url: "/staff/delete",
            data: staffs
          }).then(resp => {
            if (resp.code === 200) {
              this.$message.success("删除成功");
              this.getData();
            } else {
              this.$message.error(resp.message);
            }
          });
        })
        .catch(() => {});
    },
    remove(row) {
      this.$confirm("此操作将永久删除这行记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            method: "post",
            url: "/staff/delete/" + row.staffId
          }).then(resp => {
            if (resp.code === 200) {
              this.$message.success("删除成功");
              this.getData();
            } else {
              this.$message.error(resp.message);
            }
          });
        })
        .catch(() => {});
    },
    cancle() {
      this.staffShow = false;
    },
    ok() {
      this.$refs["form1"].validate(valid => {
        if (valid) {
          this.$refs["form"].validate(valid => {
            if (valid) {
              this.loading = true;
              if (this.editstaff) {
                //编辑
                axios({
                  method: "post",
                  url: "/staff/update",
                  data: this.staffNow
                })
                  .then(resp => {
                    this.loading = false;
                    if (resp.code === 200) {
                      this.getData();
                      this.staffShow = false;
                      this.$message.success("更新成功！");
                    }
                  })
                  .catch(error => {
                    this.loading = false;
                  });
                this.staffNowBefore = null;
              } else {
                //新增
                axios({
                  method: "post",
                  url: "/staff/save",
                  data: this.staffNow
                })
                  .then(resp => {
                    this.loading = false;
                    if (resp.code === 200) {
                      this.staffShow = false;
                      this.$message.success("新增成功！");
                      this.getData();
                    }
                  })
                  .catch(error => {
                    this.loading = false;
                  });
              }
            }
          });
        }
      });
    },
    handleSelectionChange(val) {
      this.chekcedData = val;
      if (this.chekcedData.length > 0) {
        this.batchDeleteBtnState = true;
        this.batchExportElcelBtnState = true;
      } else {
        this.batchDeleteBtnState = false;
        this.batchExportElcelBtnState = false;
      }
    },
    importData() {
      this.importDataShow = true;
    },
    cancleImport() {
      this.importDataShow = false;
      this.fileData = null;
    },
    importOk() {
      this.loading = true;
      axios({
        method: "post",
        url: "/staff/save/batch",
        data: this.fileData
      })
        .then(resp => {
          if (resp.code === 200) {
            this.$message.info("导入成功");
            this.loading = false;
            this.getData();
            this.fileData = null;
            this.importDataShow = false;
          } else {
            this.$message.error(resp.message);
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    readExcel(file) {
      this.fileName = file.name;
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          for (let sheet in workbook.Sheets) {
            this.fileData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            break;
          }
        } catch (e) {
          this.$message.warning("文件类型不正确！");
          return false;
        }
      };
      console.log(this.fileData);
      fileReader.readAsBinaryString(file.raw);
    },
    pageSizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.page.pageNow = 1;
      if (this.search_data.length > 0) {
        this.getSearchData();
      } else {
        this.getData();
      }
    },
    pageNowChange(pageNow) {
      this.page.pageNow = pageNow;
      if (this.search_data.length > 0) {
        this.getSearchData();
      } else {
        this.getData();
      }
    },
    formatJson(filterVal, jsonData) {
      //此方法配合exportExcel一起使用
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    exportExcel() {
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("../../../vendor/Export2Excel");
        const tHeader = [
          "编号",
          "姓名",
          "照片路径",
          "性别",
          "所属部门",
          "省份证号",
          "家庭住址",
          "联系电话",
          "状态",
          "创建人",
          "创建时间",
          "更新时间",
          "更新人"
        ];
        const filterVal = [
          "staffId",
          "staffName",
          "staffImg",
          "staffSex",
          "staffDept",
          "staffIdNumber",
          "staffAddress",
          "staffTele",
          "staffStat",
          "createBy",
          "createTime",
          "updateTime",
          "updateBy"
        ];
        const list = this.chekcedData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "巡检人员表");
      });
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        this.$message.success("头像上传成功！");
        this.staffNow.staffImg = global.baseURL + res.data;
        this.imgUrl = URL.createObjectURL(file.raw);
      } else {
        this.$message.error(res.message);
      }
    },
    handleAvatarError() {
      this.$message.error("头像上传失败！");
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    getData() {
      this.tableLoading = true
      axios({
        method: "get",
        url: "/staff/all/" + this.page.pageNow + "/" + this.page.pageSize
      })
        .then(resp => {
          if (resp.code === 200) {
            this.tableData = resp.data.list;
            this.page = resp.data;
            this.tableLoading = false;
          }
        })
        .catch(error => {
          this.tableLoading = false;
        });
    },
    getSearchData() {
      axios({
        method: "get",
        url:
          "/staff/search/" +
          this.search_data +
          "/" +
          this.page.pageNow +
          "/" +
          this.page.pageSize
      }).then(resp => {
        if (resp.code === 200) {
          this.tableData = resp.data.list;
          this.page = resp.data;
        }
      });
    },
    getLineAll() {
      axios({
        method: "get",
        url: "/line/all"
      }).then(resp => {
        if (resp.code === 200) {
          this.lineList = resp.data;
        }
      });
    },
    getAdminAll() {
      axios({
        method: "get",
        url: "/admin/info/all"
      }).then(resp => {
        if (resp.code === 200) {
          this.adminList = resp.data;
        }
      });
    },
    getDeptAll() {
      axios({
        method: "get",
        url: "/dept/all"
      }).then(resp => {
        if (resp.code === 200) {
          this.deptList = resp.data;
        }
      });
    }
  },
  created: function() {
    this.getData();
    this.getLineAll();
    this.getAdminAll();
    this.getDeptAll();
  }
};
</script>


<style lang="less" scoped>
.search_container {
  margin-bottom: 20px;
}
.btnRight {
  float: right;
  margin-right: 0px !important;
}
.searchstaff {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  padding: 18px 18px 0;
}
.table_container {
  padding: 10px;
  background: #fff;
  border-radius: 2px;
}
.el-dialog--small {
  width: 600px !important;
}
.pagination {
  text-align: left;
  margin-top: 10px;
}
</style>


<style>
.avatar-uploader .el-upload {
  margin-left: 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 125px;
  height: 125px;
  line-height: 125px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>

