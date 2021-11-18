<template>
  <div>
    <q-toolbar class="bg-grey-9 text-white shadow-2 my-list-item">
      <q-btn v-if="!no_refresh" flat @click="this.$emit('refresh')" icon="refresh"/>
      <q-toolbar-title>{{title}}</q-toolbar-title>
      <q-btn v-if="data && !no_refresh" flat @click="toogleShrink" :icon="shrink_icon"/>
      <q-btn v-if="data && !no_add" flat @click="this.$emit('addItem')" icon="add"/>
      
    </q-toolbar>

    <q-list v-if="data && shrink" bordered>
    <!-- START Q_ITEM -->
     <div v-for="(item, ind) in data" :key="ind + datenow">
      <q-item v-if="item.protected !== 1 || show_hidden" class="q-my-sm my-list-item">
       
        <!-- FIRST COLUMN -->
        <q-item-section v-if="mode === 'visits'" avatar>
          {{item.date_start}}
        </q-item-section>
        <q-item-section v-else avatar>
          <q-avatar color="grey-7" text-color="white">
            {{ item.id }}
          </q-avatar>
        </q-item-section>

        <!-- SECOND COLUMN -->
        <!-- Case: TABLE -->
        <q-item-section v-if="mode==='list_quests'">
          <q-item-label>{{ item.label }}</q-item-label>
          <q-item-label caption>{{ item.description }}</q-item-label>
          <q-item-label caption lines="1">system: {{ item.system }}</q-item-label>
        </q-item-section>
        <!-- Case: PATIENTS MODE -->
        <q-item-section v-else-if="mode === 'patients'">
          <q-item-label>
            {{item.name}}, {{item.first_name}} / {{item.gender}} [id = {{item.id}}]
          </q-item-label>
          <q-item-label caption>geb. {{item.birthdate}}</q-item-label>
        </q-item-section>
        <!-- Case: VISITS MODE -->
        <q-item-section v-else-if="mode === 'visits'">
          <q-item-label>
            {{item.label}} [id {{item.id}}]
            
          </q-item-label>
          <q-item-label caption>
            {{item.description}}
          </q-item-label>
        </q-item-section>

        <!-- Case: VISITS MODE -->
        <q-item-section v-else-if="mode === 'definitions'">
          <q-item-label>
            <div class="row">
              <q-input class="col-3" disable dense hint="tag" v-model=item.tag />
              <q-input class="col-3 q-pl-xs" disable dense hint="label" v-model=item.label />
              <q-input class="col-2 q-pl-xs" disable dense hint="type" v-model=item.type />
              <q-input class="col-2 q-pl-xs" disable dense hint="system" v-model=item.system />
              <q-input class="col-2 q-pl-xs" disable dense hint="code" v-model=item.code />

            </div>
            
            
          </q-item-label>
   
        </q-item-section>
        <!-- else -->
        <q-item-section v-else>
          <q-item-label caption>{{ item }}</q-item-label>
        </q-item-section>

        <!-- side -->
        <q-item-section side>
          <div>
            <span v-if="!view_only">
              <div v-if="!item.protected">
                <q-btn  @click="this.$emit('deleteItem', {id: item.id, index: ind})" flat round size="sm"  icon="delete"/>
                <q-btn @click="this.$emit('editItem', {id: item.id, index: ind})" flat round size="sm"  icon="edit"/> 
              </div>
              <div v-else>
                <q-btn @click="this.$emit('editItem', {id: item.id, index: ind})" flat round size="sm"  icon="tour"/> 
              </div>
              
            </span>
            <span v-if="mode==='patients'">
              <q-btn round size="sm" @click="this.$emit('openItemVisits', {id: item.id, index: ind})" flat color="primary" icon="tour"><q-tooltip>Öffne Visiten des Patienten</q-tooltip> </q-btn>
            </span>
          </div>
          <span v-if="show_lock">
            <q-btn v-if="!item.protected" flat round size="sm" icon="lock_open" @click="this.$emit('setProtected', {ind: ind, id: item.id, protected: true})"/>
            <q-btn v-else flat disable round size="xs" icon="lock" @click="this.$emit('setProtected', {ind: ind, id: item.id, protected: false})"/>
          </span>
          
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

    props: ['data', 'datenow', 'title', 'show_hidden', 'no_refresh', 'no_add', 'view_only', 'mode', 'show_lock'],

    data() {
    return {
      shrink: true
    }
  },

    computed: {
        shrink_icon() {
            if (this.shrink) return 'minimize'
            return 'maximize'
        }
    },

    methods: {
        toogleShrink() {
            this.shrink = !this.shrink
        }
    }
}
</script>