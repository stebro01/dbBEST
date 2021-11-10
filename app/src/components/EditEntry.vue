<template>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Eintrag ändern</div>
          <div class="text-caption" v-if="local_data">Table: {{table}} / ID: {{local_data.id}}</div>
        </q-card-section>

        <!-- RENDER ENTRIES -->
        <q-card-section class="q-pt-none">
            <div v-for="(item, ind) in FIELDS" :key="ind+item">
                <span v-if="item !== 'id'">
                    <q-input dense :label="item" v-model="local_data[item]" 
                        :disable="item === 'protected' && local_data[item]" 
                    />
                    <span v-if="item === 'protected' && local_data[item]" class="text-caption text-grey-5">Geschützte Einträge können nur direkt über ein SQLITE Tool gelöscht werden</span>
                </span>
            </div>
          
        </q-card-section>

        <!-- SAVE AND CLOSE -->
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Speichern" @click="saveChanges" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
export default {
    props: ['active', 'edit_content', 'table'],

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
        }
    },

    methods: {
        saveChanges() {
            this.$emit('save', this.local_data)
        }
    }

}
</script>

<style>

</style>