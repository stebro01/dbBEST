<template>
  <q-page class="flex flex-center">
    <div class="column text-center my-list-item">

        <div class="col q-mb-xl text-h6">Patienten suchen oder neu erstellen</div>

        <div class="col">
           
            <div class="row">
                <div class="col-12 bg-grey-3">
                    <span v-if="localmode === 'search'">suchen</span>
                    <span v-if="localmode === 'add'">neuen Patienten erstellen</span>
                </div>
                <div class="col-1 q-pa-xs"><q-input v-if="localmode === 'search'" type="number" dense hint="ID" v-model.number=search.id /></div>
                <div class="col-3 q-pa-xs"><q-input dense hint="Nachname" v-model="search.name" /></div>
                <div class="col-2 q-pa-xs"><q-input dense hint="Vorname" v-model="search.first_name" /></div>
                <div class="col-1 q-pa-xs"><q-select dense v-model="search.gender" :options="this.$store.getters.ENV.types_gender" hint="Gender" /></div>
                <div class="col-3 q-pa-xs"><q-input type="date" dense hint="Geb.Datum" v-model="search.birthdate" /></div>
                <div class="col-2 q-pa-xs">
                    <div v-if="localmode === 'search'">
                        <q-btn no-caps @click="searchPatient()" label="suchen"/>
                        <q-btn flat no-caps dense label="leeren" class="text-grey-5" @click="clearSearch()" />
                    </div>
                    <div v-if="localmode === 'add'">
                        <q-btn no-caps color="primary" @click="addPatient()">erstellen</q-btn>
                    </div>
                </div>
            </div>
        </div>

        <!-- PATIENT LIST -->
      <div class="col q-mt-md" v-if="localmode === 'search' && queryresult.length > 0">
        <TABLE_LIST @refresh="queryDB(dbname)" 
            :data="queryresult" :datenow="datenow" 
            :title="'Patienten'"
            :no_refresh="true"
            :no_add="true"
            :view_only="true"
            :mode="'patients'"
            @openItemVisits="openVisits($event)"
        />      
      </div>

      <div class="col q-mt-xl">
          <q-btn v-if="localmode === 'search'" @click="toogleMode('add')">Neuen Patienten erstellen</q-btn>
          <q-btn v-if="localmode === 'add'" @click="toogleMode('search')">abbrechen</q-btn>
      </div>
    </div>
    
  </q-page>
</template>

<script>
import TABLE_LIST from 'src/components/TableList.vue'
import myMixins from 'src/mixins/modes'

export default {
  name: 'Patients',

  data() {
    return {
      queryresult: {},
      datenow: Date.now(),
      dbname: 'patients',
      search: {},
      search_tmp: {},
      localmode: 'search'
    }
  },

  components: { TABLE_LIST },

    mixins: [myMixins], //imports: searchSQL

  mounted() {
      const presearch = this.$store.getters.SETTINGS.search
      if (presearch !== null && presearch !== undefined) this.search = presearch
  },

  computed: {

  },

  methods: {
        searchPatient() {
            //check the input
            if (this.search.gender === 'null') this.search.gender = null
            this.searchSQL(this.search, this.dbname, 'ORDER BY name')
            .then(res => {
                this.queryresult = res
                if (this.queryresult.length === 0) return this.$q.notify('Keinen Patienten gefunden.')
                this.$store.commit('SETTINGS_SET', {label: 'search', value: JSON.parse(JSON.stringify(this.search))})
            })
            .catch(err => this.$q.notify(err))
            
        },

        clearSearch() {
            this.queryresult = []
            Object.keys(this.search).forEach(key => {
                this.search[key] = null
            })
        },

        toogleMode(val) {
            switch(val) {
                case 'add': 
                    this.search_tmp = JSON.parse(JSON.stringify(this.search))
                    this.clearSearch()
                    break
                case 'search':
                    this.clearSearch()
                    this.search = JSON.parse(JSON.stringify(this.search_tmp))
                    break
            }
            this.localmode = val
        },

        addPatient() {
            const patient = JSON.parse(JSON.stringify(this.search))
            if (patient.gender === 'null') patient.gender = null
            if (!patient.name || !patient.first_name || !patient.birthdate || !patient.gender) return this.$q.notify('Bitte alle Daten angeben.')

            this.$q.dialog({
                title: 'Patienten hinzufügen?',
                message: `Wollen Sie ${JSON.stringify(patient)} wirklich hinzufuegen?`,
                color: 'negative',
                ok: `Ja`,
                cancel: true,
                default: 'ok'   // <<<<
            }).onOk(() => {
                this.$store.dispatch('addDBEntry', {table: 'patients', values: patient})
                .then(res => {
                    this.$q.notify(res)
                    this.toogleMode('search')
                    this.search = JSON.parse(JSON.stringify(patient))
                    this.searchPatient()
                }) 
                .catch(err => {
                    this.$q.notify('Anfrage war nicht erfolgreich.')
                }) 
            })
        },

        openVisits(val) {
            this.$router.push({name: 'Visits', params: {id: val.id}})
        }

  }

}
</script>
