<template>
  <q-page class="flex flex-center">
    <div class="column">
      <div class="col">
        Datenbank verbinden
        <q-btn @click="connectDB">connect</q-btn>
        <q-btn @click="closeDB">close</q-btn>
      </div>

      <div v-for="dbname in dbases" :key="dbname" class="col q-mt-md">
        DB: {{dbname}} abfragen
        <q-btn @click="queryDB(dbname)">query</q-btn>
        <div>
          <div v-for="(item, ind) in queryresult[dbname]" :key="item+ind+dbname">
            {{item}}
          </div>
        </div>
      </div>

    </div>
    
  </q-page>
</template>

<script>

export default {
  name: 'Index',

  data() {
    return {
      queryresult: {},
      dbases: ['patients', 'user', 'visits']
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
