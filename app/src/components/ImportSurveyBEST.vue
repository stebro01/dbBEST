<template>
  <q-dialog v-model="isactive">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title>Füge einen surveyBEST Fragebogen hinzu</q-toolbar-title>
            <q-btn flat @click="close()" round dense icon="close" />
          </q-toolbar>
        </q-header>

        <!-- <q-footer class="q-mb-md bg-white text-center q-gutter-x-xl">
            <q-btn v-if="showAddButton" color="primary" @click="addQuest()">Hinzufügen</q-btn>
        </q-footer> -->

        <q-page-container class="flex flex-center">
          <q-page padding>
              <div class="column">
                  <div class="col">
                      <div class="text-h6">Wähle einen oder mehrere Fragebögen aus.</div>
                        <q-file v-model="html_files" label="(HTML Format)" multiple>
                            <template v-slot:prepend>
                                <q-icon name="attach_file" />
                            </template>
                            <template v-slot:append>
                                <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                            </template>
                        </q-file>
                  </div>

                  <div v-if="html_files.length > 0" class="col q-mt-lg text-center">
                      <q-btn @click="importFiles()" color="primary">Hinzufügen</q-btn>
                      <div class="text-caption">(Fragebögen werden der aktuellen Visite hinzugefügt)</div>
                  </div>
              </div>
                
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
</template>

<script>
export default {
    name: 'SURVEY_BEST',

    props: ['active', 'visit_id'],

    data() {
        return {
            html_files: []
        }
    },

    mounted() {

    },

    watch:{

    },

    computed: {
        isactive: {
            get() {
                return this.active
            },
            set(val){
                //
            }
        }
    },

    methods: {
        close(){
            this.html_files = []
            this.$emit('close')
        },

        importFiles() {
            this.html_files.forEach(file => {
                this.processFile(file)
            })
            this.$emit('close')
        },

        processFile(file) {
            //read the file using the electron interface
            const txt = window.electron.readFile(file.path, 'utf8')
            //create a html object from the txt
            var el = document.createElement( 'html' );
            el.innerHTML = txt;
            //extract body html to string
            const body_html = el.getElementsByTagName('BODY')[0].innerHTML
            //extract the script section
            const script_html = el.getElementsByTagName('SCRIPT')[0].innerHTML
            // check > 'CDA=' should be in the script html
            let pos = script_html.indexOf('CDA=')
            if (pos !== 1) {this.$q.notify('Dateiformat nicht korrekt!'); return}
            const cda_txt = script_html.substring(5, script_html.length)
            const cda_json = JSON.parse(cda_txt)
           
            // now prepare all data
            const p = {
                pid: cda_json.info.PID,
                date: cda_json.info.date,
                label: cda_json.info.label,
                title: cda_json.info.title,
                sum_score: this.extract_sum(cda_json),
                cda_content: cda_txt,
                summary_html: body_html,
                visit_id: this.visit_id,
                table: 'quest_surveyBEST',
            }
            const sqlquery = `INSERT into ${p.table}(visit_id, pid, label, title, sum_score, date, summary_html, cda_content) VALUES (${p.visit_id}, '${p.pid}', '${p.label}', '${p.title}', ${p.sum_score}, ${p.date}, '${p.summary_html}', '${p.cda_content}')`
            this.$store.dispatch('runUpdateDB', sqlquery)
            .then(res => this.$q.notify(res))
            .catch(err => this.$q.notify(err))
        },

        extract_sum(json) {
            try {
                var sum = json.cda.section[1].entry[0]
                if (sum.title === 'sum') return sum.value
                else return null
            } catch {
                return null
            }
        }
    }

}
</script>