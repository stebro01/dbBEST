<template>
  <q-page class="flex flex-center">
    <q-btn @click="clickMe">HI</q-btn>
    
  </q-page>
</template>

<script>

export default {
  name: 'MainLayout',

  data() {
    return {
      //
    }
  },

  methods: {
    clickMe () {
      const status = window.electron.readFile('/Users/ste/MyProjects/dbBEST/app/public/env.json', 'utf8')
      console.log(status)

      let db = window.electron.sqlite3('/Users/ste/MyProjects/dbBEST/dbase/mydb.db')

      console.log(db)

    }
  }

}
</script>
