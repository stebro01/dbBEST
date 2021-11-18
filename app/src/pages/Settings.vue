<template>
  <q-page class="flex flex-center">
    <div class="column text-center my-list-item">
      <div class="col text-h6">
        Einstellungen
      </div>

      <div class="col q-mt-md">
        <q-list bordered class="my-list-item">
          <q-item class="bg-grey-2">
            <q-item-section>
              Einstellungen
            </q-item-section>
            <q-item-section>
               <q-btn flat @click="clearSettings">clear</q-btn>
            </q-item-section>
          </q-item>

          <q-separator spaced inset />

          <q-item>
            <q-item-section>User</q-item-section>
            <q-item-section>
              <q-item-label>{{$store.getters.SETTINGS.user}}</q-item-label>
              <q-item-label caption>Level: {{$store.getters.SETTINGS.user_type}}</q-item-label>
            </q-item-section>
          </q-item>

           <q-separator spaced inset />
          
          <q-item>
            <q-item-section>DB</q-item-section>
            <q-item-section class="overflow-hidden">
              <q-item-label caption >{{$store.getters.SETTINGS.filename}}</q-item-label>
            </q-item-section>
          </q-item>

        </q-list>
       
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
      this.$store.dispatch('clearSettings').then(res => {
        this.$store.dispatch('closeDB')
        this.$q.notify(res)
      })
      this.$router.push({name: 'selectDB'})
    }
    
  }

}
</script>
