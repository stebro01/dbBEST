<template>
  <div v-if="QUEST" class="row">
      <div v-for="(key, ind) in Object.keys(QUEST)" :key="ind+'questrender'" class="row" >
          <div v-if="key !== 'id' && key !== 'visit_id' && key !== 'protected' && key !== 'created_time'" class="q-px-md">
                <span v-if="coding && coding[key]">

                    <q-input v-if="coding[key].type === 'string' && coding[key].options === 0" class="col-5" 
                        v-model="QUEST[key]" :disable="disable" autogrow dense :hint="coding[key].label" @blur="$emit('changed')"
                    />
                    <q-select v-else-if="coding[key].type === 'string' && coding[key].options === 1" class="col-5" 
                        v-model="QUEST[key]" :options="coding[key].options_text" dense :disable="disable" :hint="coding[key].label" @blur="$emit('changed')"
                    />
                    <q-input v-else-if="coding[key].type === 'number' && coding[key].range === 0" class="col-5" 
                        v-model.number="QUEST[key]" type="number" :disable="disable" dense :hint="coding[key].label" @blur="$emit('changed')"
                    />

                    <q-input v-else-if="coding[key].type === 'number' && coding[key].range === 1" class="col-5" 
                        v-model.number="QUEST[key]" type="number" :disable="disable" dense :hint="`${coding[key].label} [${coding[key].range_min}..${coding[key].range_max}]`" @blur="$emit('changed')"
                        :rules="[ val => (val >=  coding[key].range_min) && (val <=  coding[key].range_max)|| `Range ${ coding[key].range_min} - ${ coding[key].range_max}` ]"
                    />

                    <q-input v-else-if="coding[key].type === 'date'" class="col-6" 
                        v-model="QUEST[key]" type="date" :disable="disable" dense :hint="coding[key].label" @blur="$emit('changed')"
                    />

                    <q-checkbox v-else-if="coding[key].type === 'boolean'" class="col-6" 
                        v-model="QUEST[key]" :disable="disable" :label="coding[key].label" @blur="$emit('changed')"
                    />

                    <q-input v-else class="col-6" 
                        v-model="QUEST[key]" :disable="disable" dense :hint="coding[key].label" @blur="$emit('changed')"
                    />
                </span>
                <q-input v-else v-model="QUEST[key]" class="col-6" :disable="disable" autogrow dense :hint="key" @blur="$emit('changed')"/>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name: 'RENDER_QUEST',

    props: ['quest', 'disable', 'label'],

    data() {
      return {
        coding: undefined
      }
    },

    computed: {
        QUEST:{
            get() {
                return this.quest
            },
            set(val) {
                //
            }
        }
        
    },

    mounted() {
        console.log('Render: ', this.label)
        if (this.label) {
            const sqlquery = `SELECT coding FROM list_quests WHERE label='${this.label}'`;
            this.$store.dispatch('runQueryDB', sqlquery).then(res => {
                if(res.length > 0) {
                    this.coding = {}
                    JSON.parse(res[0].coding).forEach(c => {
                        this.coding[c.tag] = c
                        if (c.definition_id) {
                            let query = `SELECT tag, label, type, range, range_min, range_max, options, default_value, options_text FROM definitions WHERE id=${c.definition_id}`
                            const promise = [];
                            promise.push(this.$store.dispatch('runQueryDB', query))

                            Promise.all(promise).then(res => {
                                let def = res[0][0]
                                this.coding[def.tag] = def
                                // if (def.default_value) console.log(def.default_value) //muss sich mal machen
                                if (def.options) this.coding[def.tag].options_text = JSON.parse(def.options_text)
                            })
                            
                           
                        }
                        
                    })
                }
            })
        }
    },

    methods: {
        CODING(key) {
            if (!this.coding) return undefined
            var result = this.coding.find(obj => {
                return obj.tag === key
            }) 
            return result
        }
    }


}
</script>

<style>

</style>