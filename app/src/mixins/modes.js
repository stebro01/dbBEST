import {prepareSQLSearch} from 'src/classes/sqltools.js'

export default {
    computed: {
        
    },

    methods: {
        /** 
         * @description Mixin für das Suchen, verwendet u.a. in Patients.vue und Visits.vue
         * - ruft prepareSQLSsearch um einen String zu erzeugen
         * @param {object} search - Objekt mit Sucheigenschaften, z.B.: {id: 1, name: null, first_name: null, birthdate: null, gender: null}
         * @param {string} dbname - name der anzufragenden DB, z.B. 'patients'
         * @param {string} order_by_str - String zum Sortieren der Ergebnisse, ie: 'ORDER BY name'
         * @return Promise mit Ergebnis der Suche
         * @example //ie called in Patients.vue
         * this.searchSQL({id: 1, name: null, first_name: null, birthdate: null, gender: null}, 'patients', 'ORDER BY name')
         * .then(res => console.log(res)) //gibt Ergebnisse dann aus
                  */
        searchSQL(search, dbname, order_by_str) {
            //check the input
            return new Promise((resolve, rej) => {
                const where_string = prepareSQLSearch(search)
                if (!where_string) {
                    return rej('Suchanfrage ist leer')
                }
                //build the string
                const sqlquery = `SELECT * FROM ${dbname} WHERE ${where_string} ${order_by_str}`
                this.$store.dispatch('runQueryDB', sqlquery)
                .then(res => {
                    return resolve(res)
                    }) 
                .catch(err => {
                    console.error(err)
                    return rej('Anfrage war nicht erfolgreich.')
                }) 
            })
        },

        /**
         * 
         * @param {object} payload - {table(string): Name des Tables, id(integer): ID des zu löschenden Eintrages}  
         * @returns a Promise
         */
        deleteItem(payload) {
            return new Promise((resolve, reject) => {
                this.$q.dialog({
                    title: 'Wirklich Löschen?',
                    message: `Wollen Sie den Eintrag mit der ID ${payload.id} wirklich löschen? Auch damit verbundene Einträge (Childs) werden gelöscht!`,
                    color: 'negative',
                    ok: `Ja`,
                    cancel: true,
                    default: 'cancel'   // <<<<
                }).onOk(() => {
                    // first the action and then update data array
                    this.$store.dispatch('deleteDBEntry', {table: payload.table, id: payload.id})
                    .then(res => {
                      return resolve(res)
                      }) 
                    .catch(err => {return reject(err)}) 
                }).onCancel(() => {return reject('Aktion vom Nutzer abgebrochen')})
            })
        },

        /**
         * @description Updated einen Datenbank eintrag
         * @param {object} payload - {table: 'visits', id: this.visit_id, values: this.queryresult_visits}
         * @example this.saveEntry({table: 'visits', id: this.visit_id, values: this.queryresult_visits})
         * @returns Nichts
         */
        saveEntry(payload) {
           this.$store.dispatch('updateDBEntry', payload)
           .then(res => this.$q.notify(res))
           .catch(err => this.$q.notify(err))
        },

        /**
         * @description Multifunktionsfunktion, um:
         * - man fragt eine Referenz ab (z.B. study_ref oder users) <= table
         * - erhält eine Selection von columns <= select
         * - kann dann ein lokales Array füllen, this[options_list_str] <= tag_options
         * - und kann dann noch schauen, ob geladene IDs in der Liste enthalten sind
         * @params {object} - payload
         * @example //in EditVisit
         * this.loadStudyRefs({table: 'study_ref', select: 'label, description, id', update_ref: true, tag_options: 'options_study_ref', tag_results: 'queryresult_visits', tag_id_ref: 'study_ref_id'})
         * @returns Promise mit dem Array
         */
         loadRefs(payload) {
            const sqlquery = `SELECT ${payload.select} FROM ${payload.table}`
            this.$store.dispatch('runQueryDB', sqlquery)
            .then(res => {               
                if (payload.update_ref) {
                    this[payload.tag_options] = res;
                    if (this[payload.tag_results]) {
                        let ref_id = this[payload.tag_results][payload.tag_id_ref]
                        res.forEach(r => {
                            if (r.id === ref_id) this[payload.tag_results][payload.tag_id_ref] = r
                        })
                    }
                }
            })
            .catch(err => this.$q.notify(err))
        }
    }
}