<template>
  <q-page class="flex flex-center">
    <div class="column">
      <div class="col">
        Datenbank verbinden
        <q-btn @click="connectDB">connect</q-btn>
      </div>

      <div class="col q-mt-md">
        DB abfragen
        <q-btn @click="queryDB">query</q-btn>
      </div>
    </div>
    
  </q-page>
</template>

<script>

export default {
  name: 'Index',

  data() {
    return {
      //
    }
  },

  methods: {
    connectDB() {
      console.log('connectDB')
    },
    queryDB() {
      console.log('queryDB')
    }
    
  }

}
</script>
