<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import { getCount } from './request/apis/common'
export default {
  data() {
    return {
      msg: '123'
    }
  },
  created() {
    ;(async function(vue) {
      const res = await getCount()
      vue.msg = res.data
    })(this)
  },
  methods: {}
}
</script>

<style scoped></style>
