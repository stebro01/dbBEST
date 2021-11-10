<template>
  <div>
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title>{{title}}</q-toolbar-title>
      <q-btn v-if="this.data" flat @click="toogleShrink" :icon="shrink_icon"/>
      <q-btn v-if="this.data" flat @click="this.$emit('addItem')" icon="add"/>
      <q-btn flat @click="this.$emit('refresh')" icon="refresh"/>
    </q-toolbar>

    <q-list v-if="data && shrink" bordered>
    <!-- START Q_ITEM -->
     <div v-for="(item, ind) in data" :key="ind + datenow">
      <q-item v-if="item.hide !== 1 || show_hidden" class="q-my-sm my-list-item">
       
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            {{ item.id }}
          </q-avatar>
        </q-item-section>

        <!-- contains field table -->
        <q-item-section v-if="item.table">
          <q-item-label>{{ item.table }}</q-item-label>
          <q-item-label caption lines="1">system: {{ item.system }}</q-item-label>
          <q-item-label caption lines="1">coding:
            <span v-for="(cc,indc) in JSON.parse(item.coding)" :key="indc+'coding'">
              {{cc.label}}({{cc.type}}),
            </span>
          </q-item-label>
        </q-item-section>
        <!-- else -->
        <q-item-section v-else>
          <q-item-label caption>{{ item }}</q-item-label>
        </q-item-section>

        <!-- side -->
        <q-item-section side>
          <div>
            <q-btn v-if="!item.protected" @click="this.$emit('deleteItem', {id: item.id, index: ind})" flat icon="delete"/>
            <q-btn @click="this.$emit('editItem', {id: item.id, index: ind})" flat icon="edit"/>
          </div>
        </q-item-section>


    <!-- END Q_ITEM -->
      </q-item>
     </div>
    </q-list>
  </div>
</template>

<script>
export default {
    name: 'TABLE_LIST',

    props: ['data', 'datenow', 'title', 'show_hidden'],

    data() {
    return {
      shrink: true
    }
  },

    computed: {
        shrink_icon() {
            if (this.shrink) return 'close_fullscreen'
            return 'fullscreen'
        }
    },

    methods: {
        toogleShrink() {
            this.shrink = !this.shrink
        }
    }
}
</script>

<style>

</style>