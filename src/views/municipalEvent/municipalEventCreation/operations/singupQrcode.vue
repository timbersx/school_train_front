<!--  -->
<template>
  <div>
    <el-dialog
      :visible="visible"
      :title="$t('trainEventInfo.QRCode')"
      @close="handleReturn"
    >
      <el-divider />

      <div v-loading="loading">
        <el-main class="form-container">
          <el-row :gutter="20">
            <el-col :span="8" :offset="8" style="text-align: center">
              <img :src="'data:image/jpeg;base64,' + qrcodeurl" alt="" style="width: 100%">
            </el-col>
          </el-row>
          <p style="text-align: center;line-height: 30px">每隔 {{ overdueTime }} 秒自动刷新，<span :class="{ redtime: leftTime<=5 }"> {{ leftTime }} </span>秒后刷新</p>

        </el-main>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top: 20px">
        <el-button @click="handleReturn">{{
          this.$t("button.cancel")
        }}</el-button>
        <el-button
          :loading="loading"
          style="margin-left: 10px"
          type="primary"
          @click="handleSubmitForm"
        >{{ this.$t("button.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getQrcode
} from "@/api/municipalEvent/municipalEventCreation"
import { getDataDictItemList } from '@/api/systemmanage/dataDictItem'

export default {
  name: 'SetSignupDate',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editDetailId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      loading: false, // 是否显示loading
      list: null,
      qrcodeurl: '',
      overdueTime: 0,
      timer: '',
      leftTime: 0,
      wholeTime: 0
    }
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        this.init(newValue)
      } else {
        clearInterval(this.timer)
        clearInterval(this.leftTimer)
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    clearInterval(this.leftTimer)
  },
  methods: {
    init() {
      clearInterval(this.timer)
      this.getQrcodeData()
      getDataDictItemList({ type_code: 'EWMGQSJ' }).then(res => {
        this.overdueTime = Number(res.data[0].remark)
        this.leftTime = this.overdueTime
        this.timer = setInterval(() => {
          this.getQrcodeData()
          this.leftTime = this.overdueTime + 1
        }, parseInt(res.data[0].remark + '000'))
        this.leftTimer = setInterval(() => {
          if (this.leftTime > 0) this.leftTime -= 1
        }, 1000)
      })
    },
    getQrcodeData() {
      getQrcode(this.editDetailId).then(res => {
        let binary = ''
        const bytes = new Uint8Array(res)
        const len = bytes.byteLength
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        this.qrcodeurl = window.btoa(binary)
      })
    },
    handleReturn() {
      clearInterval(this.timer)
      this.$emit('update:visible', false)
    },
    handleSubmitForm() {
      clearInterval(this.timer)
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang='scss' scoped>
.redtime {
  color: red;
  font-size: 18px;
  font-weight: 800;
}
</style>
