<template>
  <q-page class="flex flex-center">
    <div class="column text-center my-list-item">

      <div class="col q-mb-xl text-h6">Visite bearbeiten</div>

      <div class="col">
        <div class="row">
                <div class="col-12 bg-grey-3">Aktiver Patient</div>
                <div class="col-1 q-pa-xs"><q-input disable type="number" dense hint="Pat.ID" v-model.number=queryresult_patient.id /></div>
                <div class="col-3 q-pa-xs"><q-input disable dense hint="Nachname" v-model="queryresult_patient.name" /></div>
                <div class="col-2 q-pa-xs"><q-input disable dense hint="Vorname" v-model="queryresult_patient.first_name" /></div>
                <div class="col-1 q-pa-xs"><q-input disable dense hint="Gender" v-model="queryresult_patient.gender" /></div>
                <div class="col-3 q-pa-xs"><q-input disable dense hint="Geb.Datum" v-model="queryresult_patient.birthdate" /></div>
                <div class="col-2 q-pa-xs"><q-btn no-caps @click="goBack()">zurück ...</q-btn></div>
         </div>
      </div>

      <!-- VISITS -->
      <div class="col">
        <div class="row q-mt-lg">
          <div class="col-12 bg-grey-3"><q-icon v-if="isProtected" name="lock" /> Aktive Visite <span class="text-caption">(erzeugt: {{queryresult_visits.created_time}})</span></div>
            <div class="col-1 q-pa-xs"><q-input disable type="number" dense hint="VisitID" v-model.number=queryresult_visits.id /></div>
            <div class="col-8 q-pa-xs"><q-input :disable=isProtected dense hint="Label/Name" v-model=queryresult_visits.label @blur="data_changed=true" /></div>
            <div class="col-3 q-pa-xs"><q-select :disable=isProtected  v-model="queryresult_visits.study_ref_id" :options="options_study_ref" dense hint="zugeordnete Studie" @blur="data_changed=true" /></div> 
            <div class="col-5 q-pa-xs"><q-input :disable=isProtected  type="date" dense hint="Datum(Beginn)" v-model="queryresult_visits.date_start" @blur="data_changed=true" /></div>
            <div class="col-4 q-pa-xs"><q-input :disable=isProtected type="date" dense hint="Datum(Ende)" v-model="queryresult_visits.date_end" @blur="data_changed=true"/></div>
            <div class="col-3 q-pa-xs"><q-select :disable=isProtected  v-model="queryresult_visits.user_id" :options="options_user" dense hint="Untersucher" @blur="data_changed=true" /></div> 

            <div class="col-12 q-pa-xs"><q-input  :disable=isProtected  autogrow dense hint="Beschreibung" v-model=queryresult_visits.description @blur="data_changed=true"/></div>
        </div>

        <!-- HOVER BUTTON -->
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn v-if="data_changed" :disable=isProtected  fab color="primary" icon="save" @click="saveVisit()"/>
          </q-page-sticky>

      </div>

      Untersuchungen & Quests     

      <q-btn @click="loadQuests()">LOAD QUESTS</q-btn> 
      <q-btn @click="newQuest()">ADD QUESTS</q-btn> 
      
      Quest-list{{quest_list}}
      Quests: {{quests}}
    </div>
    
  </q-page>
</template>

<script>
import myMixins from 'src/mixins/modes'
import {get_date_from_timeStamp} from 'src/classes/sqltools.js'

export default {
  name: 'EditVisit',

  data() {
    return {
      queryresult_visits: [],
      queryresult_patient: [],
      options_study_ref: [],
      options_user: [],
      datenow: Date.now(),
      visit_id: undefined,
      data_changed: false,
      quest_list: undefined,
      quests: []
    }
  },

  components: { },
  mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {
    this.visit_id = this.$route.params.id
    this.loadVisit()
    this.loadRefs({table: 'study_ref', select: 'label, description, id', update_ref: true, tag_options: 'options_study_ref', tag_results: 'queryresult_visits', tag_id_ref: 'study_ref_id'})
    this.loadRefs({table: 'users', select: 'label, id', update_ref: true, tag_options: 'options_user', tag_results: 'queryresult_visits', tag_id_ref: 'user_id'})
  },

  computed: {
    isProtected() {
      if (this.queryresult_visits.protected) return true
      return false
    }
  },

  methods: {
    loadVisit() {
      if (!this.visit_id) return this.$q.notify(this.$store.getters.ENV.text.alerts.no_patient_loaded)
      this.searchSQL({id: this.visit_id}, 'visits', '')
      .then(res => {
        if (res.length > 0) this.queryresult_visits = res[0]  
        // now load the Patient
        this.searchSQL({id: this.queryresult_visits.patient_id}, 'patients', '')
        .then(res => {
          if (res.length > 0) this.queryresult_patient = res[0]  
          this.$q.notify(this.$store.getters.ENV.text.alerts.visits_loaded)
        })
      })
    },

    saveVisit() {
      const values = JSON.parse(JSON.stringify(this.queryresult_visits))
      if (values.study_ref_id) values.study_ref_id = values.study_ref_id.id
      if (values.user_id) values.user_id = values.user_id.id
      this.saveEntry({table: 'visits', id: this.visit_id, values: values})
      this.data_changed = false
    },

    goBack() {
      if (!this.data_changed) this.$router.go(-1)
      // else
      this.$q.dialog({
          title: 'Ungespeicherte Änderungen',
          message: `Sie haben Änderungen nicht gespeichert, wirklich fortfahren?`,
          color: 'negative',
          ok: `Ja`,
          cancel: true,
          default: 'cancel'   // <<<<
      }).onOk(() => this.$router.go(-1))
    },

    loadQuests() { //query 1: list of all quests and then 2: query all lists
      const visit_id = this.visit_id
      //first get a list of all quests
      this.$store.dispatch('queryDB', 'SELECT id, label FROM list_quests')
      .then(res => {
        this.quest_list = res
        const promises = []
        const list_label = []
        res.forEach(r => {
          let sqlquery = `SELECT * FROM ${r.label} WHERE visit_id=${visit_id}`
          list_label.push(r.label)
          promises.push(this.$store.dispatch('runQueryDB', sqlquery))
        })
        //collect promises of all queries, PROMISES MUSST finish in correct ORDER!
        let i = -1
        this.quests = []
        Promise.all(promises).then(val => {
          i++
          if (val.length > 0) this.quests.push({label: list_label[i], value: val})
        }).then(res => {
          this.$q.notify(`${this.quests.length} Item(s) gefunden.`)
        })

      })
    },

    newQuest() {
      this.$q.notify('comming soon')
    }

  }

    

}
</script>
