<template>
  <q-page class="flex flex-center">
    <div class="column text-center ">
      <div class="col text-h6">
        Einstellungen
      </div>

      <div class="col q-mt-md">
        Settings Clear
        <q-btn @click="clearSettings">clear</q-btn>
      </div>
    </div>
    
  </q-page>
</template>

<script>

export default {
  name: 'Settings',

  data() {
    return {
      queryresult: null
    }
  },

  methods: {
    clearSettings() {
      this.$store.dispatch('clearSettings').then(res => this.$q.notify(res)) 
      this.$router.push({name: 'selectDB'})
    }
    
  }

}
</script>
