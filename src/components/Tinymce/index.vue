<template>
  <!-- <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
  </div> -->
  <editor :id="tinymceId" :init="init" />
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
import { fileupload } from '@/api/utils'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
// const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
// import 'tinymce/icons/default';
import 'tinymce/themes/silver'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/directionality'
// import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/image'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/noneditable'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/print'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/spellchecker'
import 'tinymce/plugins/tabfocus'
import 'tinymce/plugins/table'
import 'tinymce/plugins/template'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'

export default {
  name: 'Tinymce',
  components: {
    Editor
  },
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN'
      },
      init: {
        selector: `#${this.tinymceId}`,
        language_url: '/lang/zh_CN.js',
        language: 'zh_CN', // 语言
        height: this.height, // 编辑器高度
        skin_url: '/skins/ui/oxide',
        branding: false,
        body_class: 'panel-body',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        external_plugins: {
          'powerpaste': '/powerpaste/plugin.min.js'
        },
        end_container_on_empty_block: true,
        powerpaste_word_import: 'merge',
        powerpaste_html_import: 'merge',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        powerpaste_allow_local_images: true,
        paste_data_images: true,
        link_title: false,
        nonbreaking_force_tab: true,
        powerpaste_keep_unsupported_src: true,
        // images_upload_handler: (blobInfo, success, failure) => {
        //   console.log(blobInfo);
        // },
        init_instance_callback: editor => {
          if (this.value) {
            editor.setContent(this.value)
          }
          this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            // this.hasChange = true
            this.$emit('input', editor.getContent())
          })
          editor.on('paste', (evt) => {
            this.onPaste(evt)
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            this.fullscreen = e.state
          })
        },
        convert_urls: false
      }
    }
  },
  computed: {
    // language() {
    //   return this.languageTypeList['zh']
    // },
    // containerWidth() {
    //   const width = this.width
    //   if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
    //     return `${width}px`
    //   }
    //   return width
    // }
  },
  watch: {
    value(val) {
      this.$nextTick(() => {
        if (!this.hasChange && this.hasInit) {
          this.hasChange = true
          tinymce.get(this.tinymceId).setContent(val || '')
        }
      })
    }
    // language() {
    //   this.destroyTinymce()
    //   this.$nextTick(() => this.initTinymce())
    // }
  },
  mounted() {
    // Initialize the app
    tinymce.init({ })
  },
  // activated() {
  //   if (window.tinymce) {
  //     this.initTinymce()
  //   }
  // },
  // deactivated() {
  //   this.destroyTinymce()
  // },
  // destroyed() {
  //   this.destroyTinymce()
  // },
  created() {
    // tinymce.init({

    // });
  },
  methods: {
    initTinymce() {
      // const _this = this
      // window.tinymce.init({
      //   language: this.language,
      //   branding: false,
      //   selector: `#${this.tinymceId}`,
      //   height: this.height,
      //   body_class: 'panel-body',
      //   object_resizing: false,
      //   toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
      //   menubar: this.menubar,
      //   plugins: plugins,
      //   end_container_on_empty_block: true,
      //   powerpaste_word_import: 'clean',
      //   code_dialog_height: 450,
      //   code_dialog_width: 1000,
      //   advlist_bullet_styles: 'square',
      //   advlist_number_styles: 'default',
      //   // imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
      //   default_link_target: '_blank',
      //   paste_data_images: false,
      //   link_title: false,
      //   nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
      //   init_instance_callback: editor => {
      //     if (_this.value) {
      //       editor.setContent(_this.value)
      //     }
      //     _this.hasInit = true
      //     editor.on('NodeChange Change KeyUp SetContent', () => {
      //       this.hasChange = true
      //       this.$emit('input', editor.getContent())
      //     })
      //     editor.on('paste', (evt) => {
      //       this.onPaste(evt)
      //     })
      //   },
      //   setup(editor) {
      //     editor.on('FullscreenStateChanged', (e) => {
      //       _this.fullscreen = e.state
      //     })
      //   },
      //   // it will try to keep these URLs intact
      //   // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
      //   // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
      //   convert_urls: false
      // })
    },
    onPaste(event) {
      const items = (event.clipboardData || window.clipboardData).items
      console.log(event)
      // if (items[0].type.indexOf('image') !== -1) {
      //   const file = items[0].getAsFile()
      //   const formData = new FormData()
      //   formData.append('file', file)
      //   // 上传图片
      //   fileupload(formData).then(res => {
      //     console.log(res)
      //       if (res.message === 'success') {
      //         window.tinymce.get(this.tinymceId).insertContent(`<img class="wscnph" src="${res.data.url}" >`)
      //       } else {
      //         this.$message.error('图片上传失败')
      //       }
      //   })
      // } else {
      //     console.log('粘贴的不是图片，不能上传')
      // }
    },
    destroyTinymce() {
      // const tinymce = window.tinymce.get(this.tinymceId)
      // if (this.fullscreen) {
      //   tinymce.execCommand('mceFullScreen')
      // }

      // if (tinymce) {
      //   tinymce.destroy()
      // }
    }
    // setContent(value) {
    //   window.tinymce.get(this.tinymceId).setContent(value)
    // },
    // getContent() {
    //   window.tinymce.get(this.tinymceId).getContent()
    // },
    // imageSuccessCBK(arr) {
    //   const _this = this
    //   arr.forEach(v => {
    //     window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
// .tinymce-container {
//   position: relative;
//   line-height: normal;
// }

// .tinymce-container {
//   ::v-deep {
//     .mce-fullscreen {
//       z-index: 10000;
//     }
//   }
// }

// .tinymce-textarea {
//   visibility: hidden;
//   z-index: -1;
// }

// .editor-upload-btn {
//   display: inline-block;
// }

</style>
