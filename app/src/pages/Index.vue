<template>
  <q-page class="flex flex-center">
    <div class="column">
      <div class="col">
        Datenbank verbinden
        <q-btn @click="connectDB">connect</q-btn>
        <q-btn @click="closeDB">close</q-btn>
      </div>

      <div class="col q-mt-md">
        DB abfragen
        <q-btn @click="queryDB">query</q-btn>
        <div>{{queryresult}}</div>
      </div>

    </div>
    
  </q-page>
</template>

<script>

export default {
  name: 'Index',

  data() {
    return {
      queryresult: null
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
    queryDB() {
      this.$store.dispatch('queryDB', 'SELECT * FROM patients')
      .then(res => {
        this.queryresult = res
        }) 
      .catch(err => {
        console.error(err)
        this.$q.notify('Anfrage war nicht erfolgreich.')
      }) 
    }
    
  }

}
</script>
