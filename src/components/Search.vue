<template>
  <form @submit.prevent="search">
    <label>
      Username:
      <input type="text" v-model="username" />
    </label>
    <button type="submit">Search</button>
  </form>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      username: ''
    }
  },
  methods: {
    search () {
      this.$router.push({ path: `/${this.username}` })
    }
  }
}
</script>
