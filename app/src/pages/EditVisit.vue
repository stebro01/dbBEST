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
        <q-toolbar class="bg-grey-9 text-white shadow-2 my-list-item">
          <q-icon v-if="isProtected" name="lock" />
          <q-btn round flat @click="loadVisit()" icon="refresh"/>
          <q-toolbar-title>Aktive Visite <span class="text-caption">(erzeugt: {{queryresult_visits.created_time}})</span></q-toolbar-title>
          <q-btn v-if="show_visit_data" flat icon="minimize" @click="show_visit_data=!show_visit_data"/>
          <q-btn v-else flat icon="maximize" @click="show_visit_data=!show_visit_data"/>
        </q-toolbar>
        <div class="row q-mt-lg" v-show="show_visit_data">
            <div class="col-1 q-pa-xs"><q-input disable type="number" dense hint="VisitID" v-model.number=queryresult_visits.id /></div>
            <div class="col-8 q-pa-xs"><q-input :disable=isProtected dense hint="Label/Name" v-model=queryresult_visits.label @blur="data_changed=true" /></div>
            <div class="col-3 q-pa-xs"><q-select :disable=isProtected  v-model="queryresult_visits.study_ref_id" :options="options_study_ref" dense hint="zugeordnete Studie" @blur="data_changed=true" /></div> 
            <div class="col-5 q-pa-xs"><q-input :disable=isProtected  type="date" dense hint="Datum(Beginn)" v-model="queryresult_visits.date_start" @blur="data_changed=true" /></div>
            <div class="col-4 q-pa-xs"><q-input :disable=isProtected type="date" dense hint="Datum(Ende)" v-model="queryresult_visits.date_end" @blur="data_changed=true"/></div>
            <div class="col-3 q-pa-xs"><q-select :disable=isProtected  v-model="queryresult_visits.user_id" :options="options_user" dense hint="Untersucher" @blur="data_changed=true" /></div> 

            <div class="col-12 q-pa-xs"><q-input  :disable=isProtected  autogrow dense hint="Beschreibung" v-model=queryresult_visits.description @blur="data_changed=true"/></div>
        </div>

        <!-- HOVER BUTTON -->
          <q-page-sticky position="bottom-right" :offset="[18, 18]" class="z-max">
            <q-btn v-if="data_changed || data_changed_quest" :disable=isProtected  fab color="primary" icon="save" @click="saveVisit()"/>
          </q-page-sticky>

      </div>

      <!-- QUEST_LIST -->
      <div class="col q-mt-md">
        <QUEST_LIST :visit_id="visit_id" :isprotected="queryresult_visits.protected"
          :quest_list_must_save="quest_list_must_save"
          :data_changed_quest="data_changed_quest"
          @change="data_changed_quest = true"
          @saved="quest_list_must_save = false; data_changed_quest = false"
        />
      </div>

    </div>
    
  </q-page>
</template>

<script>
import myMixins from 'src/mixins/modes'
import QUEST_LIST from 'src/components/QuestList'

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
      data_changed_quest: false,
      quest_list_must_save: false,
      show_visit_data: true
    }
  },

  components: { QUEST_LIST },
  mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {
    this.visit_id = this.$route.params.id
    this.loadVisit()
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

      // UPDATE Untersucher und StudyRef
      this.loadRefs({table: 'study_ref', select: 'label, description, id', update_ref: true, tag_options: 'options_study_ref', tag_results: 'queryresult_visits', tag_id_ref: 'study_ref_id'})
      this.loadRefs({table: 'users', select: 'label, id', update_ref: true, tag_options: 'options_user', tag_results: 'queryresult_visits', tag_id_ref: 'user_id'})
    },

    saveVisit() {     
      if (this.data_changed){ //does the visit need saving?
        const values = JSON.parse(JSON.stringify(this.queryresult_visits))
        if (values.study_ref_id) values.study_ref_id = values.study_ref_id.id
        if (values.user_id) values.user_id = values.user_id.id
        this.saveEntry({table: 'visits', id: this.visit_id, values: values})
        this.data_changed = false
      }

      if (this.data_changed_quest) {//send a signal to the QUEST_LIST
        this.quest_list_must_save = true
        this.data_changed_quest = false
      } 

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
    }

  }

    

}
</script>
