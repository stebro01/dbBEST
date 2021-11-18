<template>
    <q-dialog v-model="prompt" persistent>
      <q-card class="my-list-item">
        <q-card-section class="row items-center q-pb-none" >
          <div class="text-h6"><q-icon v-if="PROTECTED" name="lock"/>Eintrag ändern <span class="text-caption">(ID: {{local_data.id}})</span></div>

        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
                  
        </q-card-section>


        <!-- RENDER ENTRIES -->
        <q-card-section class="q-pt-none">
            <div v-for="(item, ind) in FIELDS" :key="ind+item">
                
                <span v-if="item === 'coding'">
                    <EDIT_CODING  :definitions="definitions" :PROTECTED="PROTECTED" :coding="local_data[item]" @updateEntry="updateCodingEntry(item, $event)"/>
                </span>
                <span v-else-if="item !== 'id'">

                    <q-input v-if="item !== 'protected'" dense :label="item" v-model="local_data[item]" 
                        :disable="PROTECTED" 
                    />
                    <div v-else>
                        <q-btn flat v-if="PROTECTED" disable icon="lock"></q-btn>
                        <q-btn flat v-else icon="lock_open" @click="local_data[item] = 1"></q-btn>
                    </div>
                    
                </span>
            </div>
            <span v-if="PROTECTED" class="text-caption text-grey-5">Geschützte Einträge können nur direkt über ein SQLITE Tool gelöscht werden</span>
          
        </q-card-section>

        <!-- SAVE AND CLOSE -->
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn v-if="!PROTECTED" flat label="Speichern" @click="saveChanges" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
import EDIT_CODING from 'src/components/EditCoding.vue'


export default {
    name: 'EditEntry',
    props: ['active', 'edit_content', 'definitions'],

    components: { EDIT_CODING },

    data() {
        return {
        address: undefined,
        local_data: undefined
        }
    },

    watch: {
        edit_content(val) { //register changes of the input data
            if (!val) this.local_data = undefined
            else this.local_data = JSON.parse(JSON.stringify(val))
        }
    },

    computed: {
        prompt: {
            get() {
                return this.active
            },
            set(val) {
                this.$emit('close')
            },
        },
        FIELDS() {
            if (!this.local_data) return undefined
            return Object.keys(this.local_data)
        },
        PROTECTED() {
            if (!this.local_data) return true
            return (this.local_data.protected === 1)
        }
    },

    methods: {
        saveChanges() {
            this.$emit('save', this.local_data)
        },
        updateCodingEntry(item, val) {
            this.local_data[item] = val
        }
    }

}
</script>

<style>

</style>