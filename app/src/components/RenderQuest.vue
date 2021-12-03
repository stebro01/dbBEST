<template>
  <div v-if="QUEST" class="q-px-md row">
      <div v-for="(key, ind) in QUEST_KEYS" :key="ind+'questrender'" class="q-px-md col-4" 
      :class="{'col-12': coding && coding[key] && !coding[key].definition && coding[key].type === 'string', 'col-4': coding && coding[key] && coding[key].type === 'number'}">
                <div v-if="coding && coding[key]">
                    <q-input v-if="coding[key].type === 'string' && coding[key].options === 0"
                        v-model="QUEST[key]" :disable="disable" autogrow dense :label="coding[key].label" @blur="$emit('changed')"
                    />
                    <span v-else-if="coding[key].type === 'string' && coding[key].options === 1" class="no-wrap">
                        <q-input dense readonly v-model="QUEST[key]" :label="coding[key].label">
                            <template avatar v-slot:append>
                            <q-select  
                                v-model="options[key]" :options="coding[key].options_text" dense :disable="disable"  @blur="updateSelection(key)"
                            />
                            </template>
                            <q-tooltip>
                                {{coding[key].label}}
                            </q-tooltip>
                            
                        </q-input>
                        
                    </span>

                    
                    <q-input v-else-if="coding[key].type === 'number' && !coding[key].definition" 
                        v-model.number="QUEST[key]" type="number" :disable="disable" dense :label="coding[key].label" @blur="$emit('changed')"
                    />

                    <q-input v-else-if="coding[key].type === 'number' && coding[key].definition"  
                        v-model.number="QUEST[key]" type="number" :disable="disable" dense :label="`${coding[key].label} [${coding[key].definition.range_min}..${coding[key].definition.range_max}]`" @blur="$emit('changed')"
                        :rules="[ val => (val >=  coding[key].definition.range_min) && (val <=  coding[key].definition.range_max)|| `Range ${ coding[key].definition.range_min} - ${ coding[key].definition.range_max}` ]"
                    />

                    <q-input v-else-if="coding[key].type === 'date'" 
                        v-model="QUEST[key]" type="date" :disable="disable" dense :hint="coding[key].label" @blur="$emit('changed')"
                    />

                    <q-checkbox v-else-if="coding[key].type === 'boolean'"  
                        v-model="QUEST[key]" :disable="disable" :label="coding[key].label" @blur="$emit('changed')"
                    />

                    <q-input v-else  
                        v-model="QUEST[key]" :disable="disable"  :label="coding[key].label" @blur="$emit('changed')"
                    />

                </div>
                <q-input v-else v-model="QUEST[key]"  :disable="disable" autogrow dense :hint="key" @blur="$emit('changed')"/>
      </div>
  </div>
</template>

<script>
export default {
    name: 'RENDER_QUEST',

    props: ['quest', 'disable', 'label'],

    data() {
      return {
        coding: undefined,
        options: [],
        QUEST: undefined      }
    },

    computed: {
        QUEST_KEYS() {
            const KEYS = []
            Object.keys(this.QUEST).forEach(key => {
                if (key !== 'id' && key !== 'visit_id' && key !== 'protected' && key !== 'created_time') KEYS.push(key)
            })
            return KEYS
        }
        
    },

    mounted() {
        console.log('Render: ', this.label)
        this.QUEST = this.quest

        if (this.label) {
            const sqlquery = `SELECT coding FROM list_quests WHERE label='${this.label}'`;
            this.$store.dispatch('runQueryDB', sqlquery).then(res => {
                if(res.length > 0) {
                    this.coding = {}
                    JSON.parse(res[0].coding).forEach(c => {
                        const promise = [];
                        const tags = []
                        this.coding[c.tag] = c

                        if (c.definition_id) {
                            let query = `SELECT tag, label, type, range, range_min, range_max, options, default_value, options_text FROM definitions WHERE id=${c.definition_id}`
                            
                            promise.push(this.$store.dispatch('runQueryDB', query))
                            tags.push(c.tag)

                            Promise.all(promise).then(res => {
                                let tag = tags[0]
                                tags.splice(0,1)
                                let def = res[0][0]
                                this.coding[tag].definition = def
                                this.coding[tag].options = 1
                                // if (def.default_value) console.log(def.default_value) //muss sich mal machen
                                if (def.options) {
                                    this.coding[tag].options_text = JSON.parse(def.options_text)
                                }                                
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
        },

        updateSelection(key) {
            if (!this.options[key]) return
            this.QUEST[key] = this.options[key].value
            this.options[key] = null
            this.$emit('changed')
        }
    }


}
</script>

<style>

</style>