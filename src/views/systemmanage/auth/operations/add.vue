<template>
  <div class="app-container">
    <sticky
      :z-index="10"
      class-name="sub-navbar"
      style="    margin-bottom: 20px;"
    >
      <el-button
        :loading="loading"
        style="margin-left: 10px;"
        type="primary"
        @click="handleSubmitForm"
      >
        {{this.$t('button.save')}}
      </el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleReturn"
      >
        {{this.$t('button.return')}}
      </el-button>
    </sticky>

    <el-container class='form-container'>
      <el-main>
        <el-form
          ref="dataForm"
          label-width="150px"
          :model="formData"
          :rules="rules"
          label-suffix=":"
        >
          <el-col :span="12">
            <el-form-item
              :label="$t('auth.username')"
              prop="username"
            >
              <el-input
                v-model="formData.username"
                class='items'
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('auth.password')"
              prop="password"
            >
              <el-input
                v-model="formData.password"
                class='items'
              ></el-input>
            </el-form-item>
          </el-col> 
          <el-col :span="12">
            <el-form-item
              :label="$t('auth.mobile')"
              prop="mobile"
            >
              <el-input
                v-model="formData.mobile"
                class='items'
                maxlength="11"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('auth.nick_name')"
              prop="nick_name"
            >
              <el-input
                v-model="formData.nick_name"
                class='items'
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('auth.email')"
              prop="email"
            >
              <el-input
                v-model="formData.email"
                class='items'
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('auth.user_role')"
              prop="user_role"
            >
              <el-select
                v-model="formData.user_role"
                multiple
                prop="user_role"
                class='items'
                :placeholder="$t('common.select')"
                filterable
              >
                <el-option
                  v-for="item in userRoleOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>

      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { getAuthGroupList, getSystemAuthGroupList } from "@/api/systemmanage/authGroup"
import { createAuth } from '@/api/systemmanage/auth' 
import {getSysconst} from '@/api/utils' 
export default {
    components: {
        Sticky
    },
    data() {
        return {
            loading: false,
            formData: {},
            userTypeOptions: [],
            userRoleOptions: [],
            rules: {
                username: [{
                    required: true,
                    message: this.$t('validate.required'),
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: this.$t('validate.required'),
                    trigger: 'blur'
                }], 
                mobile: [{
                    required: true,
                    message: this.$t('validate.required'),
                    trigger: 'blur'
                }], 
                user_role: [{
                    required: true,
                    message: this.$t('validate.required'),
                    trigger: 'blur'
                }],
                nick_name: [{
                    required: true,
                    message: this.$t('validate.required'),
                    trigger: 'blur'
                }]
            }
        }
    },
    created() {
      this.init() 
    },
    methods: {
        init() {
            Promise.all([
                getAuthGroupList({
                    limit: 100000000,
                    offset: 0
                }),
                getSysconst('User_Type') 
            ]).then(response=>{ 
              this.userRoleOptions = response[0].data
              this.userTypeOptions=response[1].data
            })
        },
        handleSubmitForm() {
            this.loading = true
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.loading = true
                    let submitData = Object.assign({},this.formData)
                    submitData.user_role = submitData.user_role
                 
                    
                    createAuth(submitData).then(response => {
                        this.$message.success(this.$t("message.saveSuccess"))
                        this.loading = false
                        this.$router.go(-1)
                    }).catch(() => {
                        this.loading = false
                    })
                } else {
                    this.loading = false
                    return false;
                }
            })
        },
        handleReturn() { this.$router.go(-1) }
    }
}
</script>
