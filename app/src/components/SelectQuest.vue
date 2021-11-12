<template>
  <q-dialog v-model="isactive">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title>Füge einen Fragebogen hinizu</q-toolbar-title>
            <q-btn flat @click="$emit('close')" round dense icon="close" />
          </q-toolbar>
        </q-header>

        <q-footer class="q-mb-md bg-white text-center q-gutter-x-xl">
            <q-btn v-if="showAddButton" color="primary" @click="addQuest()">Hinzufügen</q-btn>
        </q-footer>

        <q-page-container>
          <q-page padding>
              <div class="column">
                  <!-- PRESET & SURVEYBEST -->
                  <div class="col text-center q-mb-lg">
                      <div class="q-gutter-md">
                        <!-- PRESTES -->
                            <q-btn-dropdown color="primary" label="Presets / Zusammenstellungen">
                                <q-list v-if="presets">
                                    <q-item v-for="(pre, indpre) in presets" :key="indpre+pre.label" clickable v-close-popup @click="onPresetClick(pre)">
                                    <q-item-section>
                                        <q-item-label>{{pre.description}}</q-item-label>
                                        <q-item-label caption>{{pre.label}}</q-item-label>
                                    </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-btn-dropdown>
                            <!-- SURVEYBEST -->
                            <q-btn dense no-caps label="surveyBEST (neu)" @click="$emit('surveBEST')"><q-tooltip>Füge einen / oder mehrer surveyBEST Fragebögen zur aktuellen Visite hinzu</q-tooltip></q-btn>

                        </div>
                  </div>
                  <!-- LIST OF QUESTS -->
                  <div class="col">
                    <q-list class="text-center" bordered separator>
                        <q-item v-for="(item, ind) in quest_list" :key="ind + 'questlist'" clickable v-ripple 
                            @click="selected_index[ind] = !selected_index[ind]"
                            :class="{'bg-grey-4': selected_index[ind]}"
                        >
                            <q-item-section>
                                <q-item-label>{{item.description}}</q-item-label>
                                <q-item-label caption>{{item.label}}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                  </div>
              </div>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
</template>

<script>
export default {
    name: 'SELECT_QUEST',

    props: ['active', 'quest_list'],

    data() {
        return {
            selected_index: [],
            presets: []
        }
    },

    mounted() {
        this.presets = this.$store.getters.QUESTS_PRESETS
        if (this.presets) return
        //else
        const sqlquest = `SELECT label, description, quest_ids FROM preset_quest`
        this.$store.dispatch('queryDB', sqlquest)
        .then(res => {
            this.presets = res
            this.$store.commit('QUESTS_PRESETS_SET', res)
        })
    },

    watch:{
        quest_list(val){
            if (val) {
                this.selected_index = []
                this.quest_list.forEach(q => {this.selected_index.push(false)})
            }
        }
    },

    computed: {
        isactive: {
            get() {
                return this.active
            },
            set(val){
                //
            }
        },

        showAddButton() {
            var show = false
            this.selected_index.forEach(s => {if (s) {show = true; return}})
            return show
        }
    },

    methods: {
        addQuest() {
            const quests_toadd = []; let i=0
            this.selected_index.forEach(s => {
                if (s) quests_toadd.push(this.quest_list[i])
                i++
            })
            this.$emit('addQuest', quests_toadd)
        },
        onPresetClick(val) {
            const ids = JSON.parse(val.quest_ids)
            ids.forEach(id => {
                let result = this.quest_list.findIndex(item => item.id === id)
                if (result) this.selected_index[result] = true
            })
        }
    }

}
</script>

<style>

</style>