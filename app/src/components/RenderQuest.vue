<template>
  <div v-if="QUEST" class="row">
      <div v-for="(key, ind) in Object.keys(QUEST)" :key="ind+'questrender'" class="col-12" >
          <div v-if="key !== 'id' && key !== 'visit_id' && key !== 'protected' && key !== 'created_time'" class="q-px-md">
            <q-input v-model="QUEST[key]" :disable="disable" autogrow dense :hint="key" @blur="$emit('changed')"/>

          </div>
      </div>
  </div>
</template>

<script>
export default {
    name: 'RENDER_QUEST',

    props: ['quest', 'disable'],

    computed: {
        QUEST:{
            get() {
                return this.quest
            },
            set(val) {
                //
            }
        }
    }
}
</script>

<style>

</style>