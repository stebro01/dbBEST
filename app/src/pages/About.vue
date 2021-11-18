<template>
  <q-page class="flex flex-center">
    <div class="column my-list-item">
      <div class="col text-h6">
        Über diese App
      </div>

      <div class="col">
        Diese App ist eine Standalone-App zum Verwalten einer SQLITE-DB im lokalen Dateisystem.
        <br>
        Es werden keinerlei Daten versendet, alle Einstellungen werden lokal gespeichert.
      </div>

      <div class="col">
        Verwendete Ressourcen:
        <ul>
          <li>quasar / electron</li>
          <li>sqlite3</li>
        </ul>
      </div>

    </div>
    
  </q-page>
</template>

<script>

export default {
  name: 'About',

  data() {
    return {
      //
    }
  },

  methods: {
    
  }

}
</script>
