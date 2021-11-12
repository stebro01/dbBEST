<template>
  <q-page class="flex flex-center">
    <div class="column text-center">

      <div class="col q-mb-xl">May the force be with you.</div>

      <div class="col q-gutter-xl">
        <q-btn color="primary" no-caps @click="$router.push({name: 'Patients'})">Patienten suchen und eine Viste planen</q-btn>
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
      datenow: Date.now(),
    }
  },

  components: {  },

  computed: {

  },

  methods: {
    commingSoon() {
      this.$q.notify('Comming soon ...')
    }
  }

}
</script>
