<template>
  <q-page class="flex flex-center">
    <div class="colum text-center">
      <div class="col">
        Tables verwalten

      </div>

      <div class="col">
        <TABLE_LIST 
          @refresh="queryDB()" 
          @deleteItem="deleteItem($event)"
          @editItem="editItem($event)"
          @addItem="addItem()"
          :data="queryresult" :datenow="datenow" :title="'Tables'"
          :show_hidden="show_hiden"
        />
        
      </div>
      <div class="col text-right q-mt-xl text-grey-7">
        <q-toggle v-model="show_hiden" label="zeige versteckte an" @click="toggle_show_hidden" />
      </div>
    </div>

    <!-- THE MODAL TO EDIT ENTRIES -->
    <EDIT_ENTRY 
      :active="edit_is_active"
      :edit_content="edit_content" :table="table"
      @close="closeEdit()"
      @save="saveEdit($event)"
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
      datenow: Date.now(),
      table: 'coding',
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
    this.queryDB()
  },

  methods: {
    queryDB() {
      this.$store.dispatch('queryDB', `SELECT * FROM ${this.table}`)
      .then(res => {
        this.queryresult = res
        }) 
      .catch(err => {
        console.error(err)
        this.$q.notify('Anfrage war nicht erfolgreich.')
      }) 
    },

    addItem() {
      this.$store.dispatch('addDBEntry', {table: this.table})
      .then(res => {
        this.$q.notify(res)
        this.queryDB()
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

    saveEdit(payload) {
      this.$store.dispatch('updateDBEntry', {table: this.table, values: payload, id: payload.id})
      .then(res => {
        this.$q.notify(res)
        this.queryDB()
        }) 
      .catch(err => this.$q.notify(err)) 
      this.closeEdit()
    },

    toggle_show_hidden() {
      this.$store.commit('SETTINGS_SET', {label: 'show_hidden', value: this.show_hiden})
    }
  }

}
</script>
