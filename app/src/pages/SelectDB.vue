<template>
  <q-page class="flex flex-center">
    <div class="column text-center">

      <div class="col">
        <q-file v-model="filename" label="wähle DB aus" 
          accept=".db"
        />
      </div>

      <div v-if="filename" class="col">
        <q-btn @click="loadDB">lade DB</q-btn>
      </div>
    </div>
    
  </q-page>
</template>

<script>

import { Notify } from 'quasar'

export default {
  name: 'SelectDB',

  data() {
    return {
      filename: null
    }
  },

  methods: {
    loadDB () {

      if(!this.$q.platform.is.electron) {
        Notify.create('Achtung: Diese Funktion gibt es nur in Electron APPs')
        return
      }

      const fn = this.filename.path
      this.$store.dispatch('checkDB', {filename: fn})
      .then(res => {
        Notify.create('Die DB ist gültig!')
        this.$store.commit('SETTINGS_SET', {label: 'filename', value: fn})
        this.$router.push({name: 'start'})

      })
      .catch(err => {
        Notify.create(`Es ist ein Fehler aufgetreten: ${err}`)
      })

    }
  }

}
</script>
