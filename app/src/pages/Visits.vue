<template>
  <q-page class="flex flex-center">
    <div class="column text-center">

      <div class="col q-mb-xl text-h6">Visiten anzeigen und durchführen</div>

      <div class="col">
        Patient-ID: {{patient_id}}
      </div>

      <div class="col">
        Visits: 
      </div>

      <div class="col q-mt-lg">

        <q-btn @click="commingSoon()">lade ...</q-btn>
        <q-btn @click="$router.go(-1)">back ...</q-btn>

      </div>
      
    </div>
    
  </q-page>
</template>

<script>

export default {
  name: 'Visits',

  data() {
    return {
      queryresult: {},
      datenow: Date.now(),
      patient_id: undefined
    }
  },

  components: {  },

  mounted() {
    this.patient_id = this.$route.params.id
  },

  computed: {

  },

  methods: {
    commingSoon() {
      this.$q.notify('Comming soon ...')
    }
  }

}
</script>
