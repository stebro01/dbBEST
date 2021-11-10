<template>
  <q-page class="flex flex-center">
    <div class="column text-center">

      <div v-for="dbname in dbases" :key="dbname" class="col q-mt-md">
        <TABLE_LIST @refresh="queryDB(dbname)" :data="queryresult[dbname]" :datenow="datenow" :title="dbname"/>
        
      </div>

    </div>
    
  </q-page>
</template>

<script>
import TABLE_LIST from 'src/components/TableList.vue'

export default {
  name: 'Index',

  data() {
    return {
      queryresult: {},
      dbases: this.$store.getters.ENV.main_tables_list,
      datenow: Date.now(),
    }
  },

  components: { TABLE_LIST },

  computed: {
    MAIN_TABLES() {
      return this.$store.getters.ENV.main_tables
    }
  },

  methods: {
    closeDB() {
      this.$store.dispatch('closeDB')
      .then(res => this.$q.notify(res)) 
      .catch(err => this.$q.notify(err)) 
    },
    connectDB() {
      this.$store.dispatch('connectDB')
      .then(res => this.$q.notify(res)) 
      .catch(err => this.$q.notify(err)) 
    },
    queryDB(dbname) {
      console.log(dbname)
      this.$store.dispatch('queryDB', `SELECT * FROM ${dbname}`)
      .then(res => {
        this.queryresult[dbname] = res
        }) 
      .catch(err => {
        console.error(err)
        this.$q.notify('Anfrage war nicht erfolgreich.')
      }) 
    }
    
  }

}
</script>
