<template>
  <div>
    <kr-paging
      async
      :selected-data="value"
      :get-page-data="getPageData"
      :get-search-data="getSearchData"
      :page-size="10"
      :filterable="true"
      :is-highlight="true"
      :box-title="['待选', '已选']"
      @onChange="onPagingChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    getPageData: {
      type: Function,
      default: null
    },
    getSearchData: {
      type: Function,
      default: null
    },
    defaultSelectedData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      value: []
    }
  },
  watch: {
    defaultSelectedData(val) {
      this.value = val
    }
  },
  methods: {
    onPagingChange(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
