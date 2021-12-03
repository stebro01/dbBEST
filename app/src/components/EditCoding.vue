<template>
  <div class="">
      coding: 
      <q-btn :disable="PROTECTED" round icon="add" @click="addEntry"/>
      <q-btn @click="exportCoding" flat no-caps>Export</q-btn>
      <q-scroll-area style="height: 250px; width: 100%">
      <q-list v-if="local_data">
          <q-item v-for="(item, ind) in local_data" :key="ind + 'coding'">
              <div class="row">
                    <div class="col-11">
                        <div class="row">
                            <q-input class="col-3"  dense v-model="item.tag" hint="tag" @blur="updateEntry()" />
                            <q-input class="col-3 q-pl-xs" dense v-model="item.label" hint="label" @blur="updateEntry()" />
                            <q-select  class="col-2 q-pl-xs" :disable="item.definition_id !== null" dense v-model="item.type" :options="type_types" hint="type" @blur="updateEntry()" />

                            <!-- DEFINTIONS -->
                            <div class=" q-pl-md col-4">
                                <q-input readonly dense v-model.number="item.definition_id" hint="definition" @blur="updateEntry()">
                                    <template v-slot:prepend>
                                    <q-btn flat  icon="search" @click="active_entry = ind; prompt_def = true"/>
                                    </template>
                                    <template v-slot:append>
                                    <q-icon name="close" @click="item.definition_id = null" class="cursor-pointer" />
                                    </template>     
                                </q-input>
                            </div>

                        </div>
                    </div>

                    <!-- DELETE BUTTON -->
                    <div class="col-1">
                        <q-btn flat icon="delete" @click="deleteEntry(ind)"/>
                    </div>
              </div>
          </q-item>
      </q-list>
      </q-scroll-area>

      <!-- MODAL LIST DEFINITIONS -->
      <q-dialog v-model="prompt_def" persistent>
            <q-card class="my-list-item">

                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6"> <q-icon v-if="PROTECTED" name="lock"/> Definition hinzufügen</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section>
                    <div class="row">
                        <div class="col-2">Filter: </div>
                        <q-input class="col-3" dense type="number" v-model.number="filter.id" hint="id"/>
                        <q-input class="col-4 q-pl-xs" dense v-model="filter.name" hint="name/tag"/>
                        <q-btn class="col-3" dense flat rounded icon="close" @click="filter.id = null; filter.name = null" />
                    </div>
                </q-card-section>

                <q-card-section>
                    <q-list bordered >
                        <q-item v-for="(def, inddef) in DEFINITIONS" :key="inddef + datenow" 
                            clickable v-ripple
                            @click="selectDefinition(def)"
                        >
                            <q-item-section avatar>
                                <q-item-label >{{def.label}}</q-item-label>
                                <q-item-label caption>ID: {{def.id}}</q-item-label>
                            </q-item-section>
                            <q-item-section >
                                <q-item-label lines="1">tag: {{def.tag}} / type: {{def.type}}</q-item-label>
                                <q-item-label  lines="1" caption>{{def.system}}: {{def.code}}</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-item-label v-if="def.range === 1">
                                    range: {{def.range_min}} .. {{def.range_max}}
                                </q-item-label>
                                <q-item-label v-if="def.options === 1">
                                    options: {{def.options_text}}
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>


            </q-card>
      </q-dialog>
        
      
  </div>
</template>

<script>
export default {
    name: 'EditCoding',
    props: ['coding', 'PROTECTED', 'definitions'],

    data() {
        return {
        local_data: [],
        datenow: Date.now(),
        type_types: this.$store.getters.ENV.types_fields,
        system_types: this.$store.getters.ENV.types_system,
        prompt_def: false,
        active_entry: null,
        filter: {
            id: null,
            name: null
        }
        }
    },

    mounted() {
        if (this.coding && this.coding !== '{}') this.local_data = JSON.parse(this.coding)
        else this.local_data = []
    },

    computed: {
        DEFINITIONS() {
            if (!this.definitions) return []
            if (this.filter.id === null && this.filter.name === null) return this.definitions
            if (this.filter.id) {
                const result = [];
                result.push(this.definitions.find(obj => {
                    return obj.id === this.filter.id
                }))
                return result
            }
            if (this.filter.name) {
                const result = [];
                this.definitions.forEach(def => {
                    let label = def.label.toLowerCase()
                    let tag = def.tag.toLowerCase()
                    let filter = this.filter.name.toLowerCase();
                    if (label.includes(filter) || tag.includes(filter)) result.push(def)
                })
                return result
            }
            return this.definitions
        }
    },

    methods: {
        addEntry() {
            const entry = {
                tag: null,
                label: null,
                type: "number",
                definition_id: null
            }
            this.local_data.push(entry)
            this.$emit('updateEntry', JSON.stringify(this.local_data))
        },
        deleteEntry(ind) {
            this.local_data.splice(ind,1)
            this.$emit('updateEntry', JSON.stringify(this.local_data))
        },
        updateEntry() {
            this.$emit('updateEntry', JSON.stringify(this.local_data))
        },
        exportCoding() {
            this.$q.dialog({
                title: 'Exportiere `coding` des aktuellen Tables',
                message: JSON.stringify(this.local_data),
                cancel: true,
                persistent: true
            })
        },
        editRange(ind) {
            if (this.edit_range[ind]) this.local_data[ind].range = [0, 1]
            else this.local_data[ind].range = null;
            return
        },

        selectDefinition(def) {
            this.prompt_def = false
            if (this.active_entry !== null) {
                if (!this.local_data[this.active_entry].tag) this.local_data[this.active_entry].tag = def.tag;
                if (!this.local_data[this.active_entry].label) this.local_data[this.active_entry].label = def.label;
                this.local_data[this.active_entry].type = def.type;
                this.local_data[this.active_entry].definition_id = def.id;
                this.updateEntry()
            }


            // fertig
            this.active_entry = null;
        }
    }
}


</script>
