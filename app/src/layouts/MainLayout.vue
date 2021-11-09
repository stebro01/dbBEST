<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ $store.getters.ENV.app.title }}
        </q-toolbar-title>

        <div>{{ $store.getters.ENV.app.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Aktionen
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <!-- PAGE CONTAINER -->
    <q-page-container>

    <!-- INFO BADGE -->
    <q-badge v-if="this.$store.getters.SETTINGS" 
      class="absolute-top-right q-mt-xl  text-grey-8" 
      :class="{'bg-green-4': $store.getters.CONNECTED, 'bg-grey-3': !$store.getters.CONNECTED}">{{this.$store.getters.SETTINGS.filename}}</q-badge>

      <!-- ROUTER -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'DB auswählen',
    caption: 'wähle eine SQLITE DB im Dateisystem',
    icon: 'school',
    link: 'selectDB'
  },
  {
    title: 'Startseite',
    caption: 'Startseite',
    icon: 'code',
    link: 'start'
  },
  {
    title: 'Einstellungen',
    caption: 'DB, Nutzer etc.',
    icon: 'settings',
    link: 'Settings'
  },
    {
    title: 'Über diese App',
    caption: 'Infos und Disclaimer',
    icon: 'info',
    link: 'About'
  }
];


export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },

    data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksList
    }
  },

  mounted() {
    this.$store.dispatch('initSettings')
  },

  methods: {
      toggleLeftDrawer () {
        this.leftDrawerOpen = !this.leftDrawerOpen
      }

  }

}
</script>
