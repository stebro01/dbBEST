<template>
  <div>
    <q-toolbar class="bg-grey-9 text-white shadow-2 my-list-item">
      <q-btn round flat @click="loadQuests()" icon="refresh"/>
      <q-toolbar-title>Untersuchungen (quests)</q-toolbar-title>
      <q-btn v-if="quest_list && !isprotected" color="primary" @click="show_dialog=true" icon="add"><q-tooltip>Fragebögen / Quests hinzufügen</q-tooltip></q-btn> 
    </q-toolbar>

    <q-list bordered separator class="my-list-item">
      <div v-for="(item, ind) in quests" :key="ind + datenow">
        <!-- START ITEM -->
        <q-item class="q-my-sm">
          <q-item-section avatar>
            <q-btn flat @click="expand[ind] = !expand[ind]" :icon="expand_icon(expand[ind])"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{item.description}}</q-item-label>
            <q-item-label caption>{{item.label}} (id: {{item.value.id}})</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div v-if="!expand[ind]">
              <q-btn v-if="!item.value.protected" round flat size="sm"  icon="delete" @click="deleteItem(item, ind)" />
              <q-btn v-if="!item.value.protected" round flat size="sm" icon="lock_open" @click="lockItem(item, ind)" />
              <q-btn v-else disabled round flat size="sm" icon="lock"  />
            </div>
            <q-btn v-if="expand[ind] && !item.value.protected" icon="save" flat round @click="saveQuest(item, ind)" :color="modified[ind] ? 'primary' : ''" />
          </q-item-section>
        <!-- END ITEM -->
        </q-item>
        <div v-if="expand[ind]">
          <RENDER_QUEST :quest="item.value" :disable="item.value.protected===1" @change="questModified(ind)"/>
        </div>
        <q-separator />
      </div>
    </q-list>

      <!-- THE DIALOG FOR QUESTSELECT -->
      <SELECT_QUEST :active="show_dialog" :quest_list="quest_list" 
        @close="show_dialog = false" 
        @addQuest="addQuest($event)" 
        @surveBEST="addSurveBEST()"
      />

      <!-- DIALOG FOR SURVEYBEST -->
      <SURVEY_BEST :active="show_surveybest" :visit_id="visit_id"
        @close="show_surveybest = false" 
      />

  </div>
</template>

<script>
import SELECT_QUEST from 'src/components/SelectQuest.vue'
import SURVEY_BEST from 'src/components/ImportSurveyBEST.vue'
import RENDER_QUEST from 'src/components/RenderQuest.vue'

export default {
    name: 'QUEST_LIST',

    props: ['visit_id', 'isprotected', 'quest_list_must_save'],

    components: { SELECT_QUEST, RENDER_QUEST, SURVEY_BEST },

    data() {
      return {
        quest_list: undefined,
        datenow: Date.now(),
        quests: [],
        expand: [],
        modified: [],
        show_dialog: false,
        show_surveybest: false
      }
    },

    watch: {
      visit_id(val) {
        if (val) if (this.visit_id) this.loadQuests() //lade die Quests beim ersten Start
      },
      quest_list_must_save(val) { //waiting for a signal from the parent
        if (val) { //if true then save quest
          let i = 0
          this.modified.forEach(m => {
            if (m) {
              this.saveQuest(this.quests[i], i)
            }
            i++
          })
          this.$emit('saved')
        }
      }
    },

    computed: {

    },

    methods: {
      expand_icon(val) {
        if (val) return 'expand_more'
        else return 'expand_less'
      },

      loadQuests() { //query 1: list of all quests and then 2: query all lists
      const visit_id = this.visit_id
      //first get a list of all quests
      this.$store.dispatch('queryDB', 'SELECT id, label, description FROM list_quests')
      .then(res => {
        this.quest_list = res
        const promises = []
        res.forEach(r => {
          let sqlquery = `SELECT * FROM ${r.label} WHERE visit_id=${visit_id}`
          promises.push(this.$store.dispatch('runQueryDB', sqlquery))
        })
        //collect promises of all queries, PROMISES MUSST finish in correct ORDER!
        let i = -1
        this.quests = []
        this.expand = []
        Promise.all(promises).then(values => {
          values.forEach(val => {
            i++
            if (val.length > 0) {
              val.forEach(v => {
                this.quests.push({label: this.quest_list[i].label, description: this.quest_list[i].description, value: v})
                this.expand.push(false)
                this.modified.push(false)
              })
            }
          })
        }).then(res => {
          this.$q.notify(`${this.quests.length} Item(s) gefunden.`)
          this.$emit('saved')
        })

      })
    },

    addSurveBEST(payload) {
      if (!payload) {
        this.show_dialog = false
        this.show_surveybest = true
      }

    },

    addQuest(payload) {
      this.show_dialog = false
      var quest_exists = false
      this.quests.forEach(q => {
        payload.forEach(p => {
          if (q.label === p.label) {quest_exists = true; return}
        })
        if (quest_exists) return
      })
      if (quest_exists) {
        if (!confirm('Der Fragebogen ist schon vorhanden, dennoch hinzufügen?')) return
      }
      //fuege alle quests hinzu
      payload.forEach(p => {
        const sqlquery = `INSERT into ${p.label}(visit_id) VALUES (${this.visit_id})`
        this.$store.dispatch('runUpdateDB', sqlquery)
        .then(res => {
          this.$q.notify(res)
        }).catch(err => this.$q.notify(err))
      })

    },

    lockItem(item, ind) {
      if (!confirm('Wenn der Fragebogen geschützt ist, kann er nicht mehr bearbeitet/gelöscht werden; dennoch fortfahren?')) return
      const sqlquery = `UPDATE ${item.label} SET protected=true WHERE id=${item.value.id}`
      this.$store.dispatch('runUpdateDB', sqlquery)
      .then(res => {
        this.$q.notify(res)
        this.quests[ind].value.protected = 1
      }).catch(err => this.$q.notify(err))
    },

    deleteItem(item, ind) {
      if (!confirm('Wenn der Fragebogen gelöscht ist, kann er nicht mehr hergestellt werden; dennoch fortfahren?')) return
      this.$store.dispatch('deleteDBEntry', {table: item.label, id: item.value.id})
      .then(res => {
        this.$q.notify(res)
        this.quests.splice(ind, 1)
      }).catch(err => this.$q.notify(err))
    },

    questModified(ind) {
      this.modified[ind] = true
      this.$emit('change')
    },

    saveQuest(item, ind){
      const payload = {
        table: item.label,
        id: item.value.id,
        values: item.value
      }
      this.$store.dispatch('updateDBEntry', payload)
      .then(res=>{
        this.$q.notify(res)
        this.modified[ind] = false
        //if nothing else needs to be saved, send a message to the parent
        if (!this.modified.includes(true)) this.$emit('saved')
        })
      .catch(err=>this.$q.notify(err))
    }

  }
}
</script>