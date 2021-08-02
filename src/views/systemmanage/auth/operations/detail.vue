<template>
    <div class="app-container" v-loading='loading'>
        <sticky :z-index="10" class-name="sub-navbar" style="    margin-bottom: 20px;">
            <el-button :loading="loading" type="primary" @click="handleReturn">{{this.$t('button.return')}}</el-button>
        </sticky>
        <el-container class='form-container'>
            <el-main>
                <el-form ref="dataForm" label-width="100px" :model="formData" label-suffix=":">
                    <el-col :span="12">
                        <el-form-item :label="$t('auth.username')" prop="username">{{formData.username}}</el-form-item>
                    </el-col> 
                    <el-col :span="12">
                        <el-form-item :label="$t('auth.mobile')" prop="mobile">{{formData.mobile}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('auth.nick_name')" prop="nick_name">
                            {{formData.nick_name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('auth.email')" prop="email">
                            {{formData.email}}
                        </el-form-item>
                    </el-col>
    
                    <el-col :span="12">
                        <el-form-item :label="$t('auth.user_role')" prop="user_role">
                            {{formData.user_role}}
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import Sticky from "@/components/Sticky"
import { filterUserTypeName } from '@/utils/userType'
import { readAuth, updateAuth } from "@/api/systemmanage/auth"
import { arry_user_type } from '@/utils/userType'
import { getSysconst } from '@/api/utils'
export default {
    components: {
        Sticky
    },
    data() {
        return {
            editId: 0,
            loading: false, //是否显示loading
            userTypeOptions: [],
            formData: {}
        };
    },
    created() {

        // this.userTypeOptions=getUserType()
        this.editId = this.$route.query.id;
        Promise.all([
            getSysconst('User_Type'),
            this.readData()
        ]).then(response => {
            this.userTypeOptions = response[0].data
        })
    },
    methods: {
        readData() {
            readAuth(this.editId).then(response => {
                this.formData = response.data
                // let userTypeName=''
                let userRoleName = '' 

                this.formData.user_role.forEach(element => {
                    userRoleName += ' ' + element.name
                })
                this.formData.user_role = userRoleName 
                this.formData.user_type = this.userTypeOptions.filter(item=>item.code===this.formData.user_type)[0].name //filterUserTypeName(response.data.user_type)
            })
        },
        handleReturn() {
            this.$router.go(-1);
        }
    }
};
</script>
