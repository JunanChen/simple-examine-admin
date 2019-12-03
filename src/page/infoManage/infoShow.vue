<template>
     <div class="fillcontain" ref="fillcontain">
        <div class="info_container" ref="info_container">
            <el-card shadow="hover" style="padding-top: 10px" :v-loading="loading">
                <el-col :span="5" :offset="1">
                <el-image
                    style="width: 200px; height: 200px; border-radius:100px"
                    :src="form.img"
                    >
                </el-image>
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    :headers="header"
                    :on-change="avatarChange"
                    :action="imageUploadPath"
                    :before-upload="beforeAvatarUpload"
                    :auto-upload="false"
                    :on-success="uploadAvatarSuccess"
                    >
                    <el-button style="margin-left: 60px" slot="trigger" size="small" type="primary">点击选择</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                </el-upload>
                </el-col>
                <el-col :span="10">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="用户名">
                            <el-input v-model="form.adminName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="角色">
                            <el-input v-model="form.role" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="真实姓名">
                            <el-input v-model="form.realName" placeholder="请输入真实姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-radio v-model="form.sex" :label=0 :value=0>男</el-radio>
                            <el-radio v-model="form.sex" :label=1 :value=1>女</el-radio>
                        </el-form-item>
                        <el-form-item label="联系方式">
                            <el-input v-model="form.tele" ></el-input>
                        </el-form-item>
                        <el-form-item label="出生年月">
                            <el-date-picker type="date" placeholder="请选择出生年月" v-model="form.birthday" style="width: 100%;"  value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="家庭住址">
                            <el-col :span="7" >
                                <el-select v-model="form.province" placeholder="请选择省" @change="provinceChange">
                                    <el-option
                                    v-for="item in provinces"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="7" :offset="1">
                                <el-select v-model="form.city" placeholder="请选择市" @change="cityChange">
                                    <el-option
                                    v-for="item in citys"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="7" :offset="1">
                                <el-select v-model="form.county" placeholder="请选择县/区">
                                    <el-option
                                    v-for="item in countys"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input v-model="form.email" ></el-input>
                        </el-form-item>
                        <el-form-item label="描述">
                            <el-input type="textarea" v-model="form.adminDesc"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="updateInfo">立即修改</el-button>
                            <el-button>取消</el-button>
                        </el-form-item>
                        </el-form>
                </el-col>
            </el-card>
        </div>
    </div>
</template>

<script>
   import axios from '@/utils/axios'
   import areas from '../../assets/datas/area.json'
   import global from '../../globle'
   import { getToken } from '@/utils/auth'

    export default {
        data() {
            return {
                loading : true,
                form: {
                    adminName: '',
                    role: '',
                    realName: '',
                    sex: '',
                    tele: 126585,
                    birthday: '1998-06-20',
                    province: '',
                    city: '',
                    county: '',
                    email: '',
                    adminDesc: '',
                    img: ''
                },
                imageUploadPath: global.baseURL + "/upload/admin/avatar",
                provinces: [],
                citys: [],
                countys: [],
                header: {
                    'token' : getToken('Token')
                }
            }
        },
        methods: {
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg' || 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG & png 格式!');
                }
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            provinceChange(value) {
                this.form.county = ''
                this.countys = []
                for(var p of areas) {
                    if(p.value === value) {
                        this.form.city = ''
                        this.citys = p.children
                        return
                    }
                }
            },
            cityChange(value) {
                for(var c of this.citys) {
                    if(c.value === value) {
                        this.form.county = ''
                        this.countys = c.children
                        return
                    }
                }
            },
            avatarChange(file, fileList) {
                //this.form.img = URL.createObjectURL(file.raw);
            },
            updateInfo() {
                this.loading = true
                //首先上传头像
                this.$refs.upload.submit();
                //再提交表单
                this.uploadAvatarSuccess();
            },
            uploadAvatarSuccess(response, file, fileList) {
                if(file !== undefined && response !== undefined) {
                    this.form.img = global.baseURL + response.data
                    axios({
                        method: 'post',
                        url: '/admin/info/update',
                        data: this.form
                    }).then(resp => {
                        this.$notify.success("修改成功！");
                        this.getInfo()
                        this.loading = false
                    }).catch(error => {
                        this.loading = false
                    })
                } else {
                    axios({
                        method: 'post',
                        url: '/admin/info/update',
                        data: this.form
                    }).then(resp => {
                        this.$notify.success("修改成功！");
                        this.getInfo()
                        this.loading = false
                    }).catch(error => {
                        this.loading = false
                    })
                }
                fileList = []
            },
            getInfo() {
                this.loading = true
                axios({
                    method: 'get',
                    url: '/admin/info',
                }).then(resp => {
                    if(resp.data.province) {
                        this.provinceChange(resp.data.province);
                        if(resp.data.city != '') {
                            this.cityChange(resp.data.city)
                        }
                    } 
                    this.form = resp.data
                })
                this.loading = false
            }
        },
        created() {
            this.provinces = areas
            this.getInfo()
        },
    }

</script>

<style lang="less" scoped>
    .info_container{
       padding: 20px;
       background: #fff;
       box-sizing: border-box;
       overflow: auto;
    }

    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>





