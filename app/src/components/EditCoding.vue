<template>
  <div class="">
      coding
      <q-btn :disable="PROTECTED" round icon="add" @click="addEntry"/>
      <q-btn @click="exportCoding" flat no-caps>Export</q-btn>
      <q-list v-if="local_data">
          <q-item v-for="(item, ind) in local_data" :key="ind + 'coding'">
              <div class="row">
                  <div class="col-2"><q-input dense v-model="item.label" label="label" @blur="updateEntry()" /></div>
                  <div class="col-2">
                      <q-select dense v-model="item.type" :options="type_types" label="type" @blur="updateEntry()" />
                    </div>
                  <div class="col-2">
                      <q-select dense v-model="item.system" :options="system_types" label="system" @blur="updateEntry()" />
                    </div>
                  <div class="col-3"><q-input dense v-model="item.code" label="code" @blur="updateEntry()" /></div>
                  <div class="col-2"><q-input dense v-model="item.default" label="default" @blur="updateEntry()" /></div>
                  <div class="col-1"><q-btn flat icon="delete" @click="deleteEntry(ind)"/></div>
              </div>
          </q-item>
      </q-list>
        
      
  </div>
</template>

<script>
export default {
    name: 'EditCoding',
    props: ['coding', 'PROTECTED'],

    data() {
        return {
        local_data: [],
        type_types: this.$store.getters.ENV.types_fields,
        system_types: this.$store.getters.ENV.types_system,
        }
    },

    mounted() {
        if (this.coding && this.coding !== '{}') this.local_data = JSON.parse(this.coding)
        else this.local_data = []
    },

    methods: {
        addEntry() {
            const entry = {
                label: null,
                type: "number",
                system: "snomed",
                code: null,
                default: null
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
        }
    }
}


</script>
