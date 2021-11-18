<template>
  <q-page class="flex flex-center">
    <div class="colum text-center">
      <div class="col">
        <div class="text-h6">Fragebögen & Definitionen verwalten</div>
          <div class="text-right">
         <q-toggle v-model="show_hiden" label="zeige geschützte an" @click="toggle_show_hidden" />
        </div>

      </div>

      <div class="col">
        <TABLE_LIST 
          @refresh="queryDB(table_list_quests, 'queryresult')" 
          @deleteItem="deleteItem($event)"
          @editItem="editItem($event)"
          @addItem="addItem(table_list_quests)"
          :mode="'list_quests'"
          :data="queryresult" :datenow="datenow" :title="'quests_*'"
          :show_hidden="show_hiden"
        />
        
      </div>
      <div class="col q-mt-xl">
          <TABLE_LIST 
          @refresh="queryDB(table_def, 'query_definitions')" 
          :data="query_definitions" 
          :datenow="datenow" :title="'Definitions'"
          :mode="'definitions'"
          :show_lock="true"
          :show_hidden="show_hiden"
          :view_only="true"
          :no_add="true"
          @setProtected="setProtected($event, table_def)"
        />
       
      </div>
    </div>

    <!-- THE MODAL TO EDIT ENTRIES -->
    <EDIT_ENTRY 
      :active="edit_is_active"
      :edit_content="edit_content"
      :definitions="query_definitions"
      @close="closeEdit()"
      @save="saveEdit($event, table_list_quests)"
    />
    
  </q-page>
</template>

<script>

/**
 * @description Verwalten von Tables:
 * - in der DB sollte es einen Table geben: coding
 */

import TABLE_LIST from 'src/components/TableList.vue'
import EDIT_ENTRY from 'src/components/EditEntry.vue'

export default {
  name: 'Tables',

  data() {
    return {
      queryresult: undefined,
      query_definitions: undefined,
      datenow: Date.now(),
      table_list_quests: 'list_quests',
      table_def: 'definitions',
      edit_is_active: false,
      edit_content: undefined,
      show_hiden: this.$store.getters.SETTINGS.show_hidden
    }
  },

  components: { TABLE_LIST, EDIT_ENTRY },

  computed: {
    MAIN_TABLES() {
      return this.$store.getters.ENV.main_tables
    }
  },

  mounted() {
    this.queryDB(this.table_list_quests, 'queryresult')
    this.queryDB(this.table_def, 'query_definitions')
  },

  methods: {
    queryDB(table, fieldstr) {
      this.$store.dispatch('queryDB', `SELECT * FROM ${table}`)
      .then(res => {
        this[fieldstr] = res
        }) 
      .catch(err => {
        console.error(err)
        this.$q.notify('Anfrage war nicht erfolgreich.')
      }) 
    },

    addItem(table) {
      this.$store.dispatch('addDBEntry', {table: table})
      .then(res => {
        this.$q.notify(res)
        this.queryDB(table, 'queryresult')
        }) 
      .catch(err => this.$q.notify(err)) 
    },

    deleteItem(payload) {
      this.$q.dialog({
          title: 'Wirklich Löschen?',
          message: `Wollen Sie den Eintrag mit der ID ${payload.id} wirklich löschen?`,
          color: 'negative',
          ok: `Ja`,
          cancel: true,
          default: 'cancel'   // <<<<
        }).onOk(() => {
          // first the action and then update data array
          this.$store.dispatch('deleteDBEntry', {table: this.table, id: payload.id})
          .then(res => {
            this.$q.notify(res)
            this.queryDB()
            }) 
          .catch(err => this.$q.notify(err)) 
        } )
    },

    editItem(payload) {
      this.edit_is_active = true
      this.edit_content = this.queryresult[payload.index]
    },

    closeEdit() {
      this.edit_is_active = false
      this.edit_content = undefined
    },

    saveEdit(payload, table) {
      this.$store.dispatch('updateDBEntry', {table: table, values: payload, id: payload.id})
      .then(res => {
        this.$q.notify(res)
        this.queryDB(table,'queryresult')
        }) 
      .catch(err => this.$q.notify(err)) 
      this.closeEdit()
    },

    setProtected(payload, table) {
      this.$store.dispatch('updateDBEntry', {table: table, values: {protected: 1}, id: payload.id})
      .then(res => {
        this.$q.notify(res)
        this.queryDB(table, 'query_definitions')
      }) 
    },

    toggle_show_hidden() {
      this.$store.commit('SETTINGS_SET', {label: 'show_hidden', value: this.show_hiden})
    }
  }

}
</script>
