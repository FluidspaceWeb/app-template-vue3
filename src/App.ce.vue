<template>
  <img src="@/assets/logo.png" width="40" height="40">
  <h1>Hello World</h1>
  <button @click.prevent="getUsers">Fetch users</button><br>
  <button @click.prevent="insertData">Insert Data</button><br>
  <button @click.prevent="getData">Get Data</button>
</template>

<script setup>
import { onMounted, provide, computed } from 'vue';
import Factory from '@/shared/Factory';

/* 
  DEFINITIONS
*/
defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  'viewSelect': String,
  'periodStart': String,
  'periodEnd': String
});

const emit = defineEmits([
  'register-app',
  'show-toast'
]);

const FACTORY = Factory(emit);
provide('FACTORY', FACTORY);



/*
  HOOKS
*/
onMounted(() => {
  emit('register-app', {
    id: FACTORY.MODULE_ID,
    namespace: 'namespace', // IMPORTANT
    mod_name: 'modulename', // IMPORTANT
    init: init,
    refresh: refresh
  });
});



/* 
  STATE VARS
*/
const viewPermSelect = computed(() => {
  if (props.viewSelect !== undefined) {
    let perm = parseInt(props.viewSelect, 10);
    if (!Number.isNaN(perm)) {
      return perm;
    }
  }
  return 0;
});



/* 
  METHODS
*/

/**
 * Initialise the module
 * @param {string} dataset_id - dataset id, use this when making API calls.
 * @param {Glue} Glue - contains properties and methods required by your module to glue with the environment
 */
function init(dataset_id, Glue) {
  FACTORY.set.datasetId(dataset_id);

  // Subscribe to realtime events and attach handlers
  Glue.subscribe.dataCreated(realtime_dataCreated);
  Glue.subscribe.dataUpdated(realtime_dataUpdated);
  Glue.subscribe.dataDeleted(realtime_dataDeleted);

  // ADD initial fetch function
}

function refresh() {
  // implement a refresh method to re-fetch and display the new data.
}

async function realtime_dataCreated(data) {
  if (data['insert_status'] === 1 && data['inserted_documents'] !== undefined && Array.isArray(data['inserted_documents'])) {
    // handle incoming realtime data create event
  }
}

function realtime_dataUpdated(data) {
  if (data['update_status'] === 1 && data['updated_document'] !== undefined) {
    // handle incoming realtime data update/change event
  }
}

function realtime_dataDeleted(data) {
  if (data['delete_status'] === 1 && data['deleted_ids'] !== undefined && data['deleted_ids'].length > 0) {
    // handle incoming realtime data delete event
  }
}



//
// EXAMPLE
//
function getUsers() {
  const API = FACTORY.API();
  API.getSpaceUsers()
    .then((resp) => {
      console.log(resp)
    });
}

function getData() {
  const API = FACTORY.API();
  API.get().then((resp) => {
    console.log(resp);
  });
}

function insertData() {
  const API = FACTORY.API();
  API.insert([{
    'current_time_ms': Date.now(),
    'type': 'dummy_data',
    'is_easy': (Math.random() < 0.5)
  }])
    .then((resp) => {
      console.log(resp);
    });
}

/**
 * Glue object to interface module with Fluidspace environment
 * @typedef {object} Glue
 * @prop {function} getProperties
 * @prop {function} getShadowRoot
 * @prop {GlueRTMethods} subscribe
 * @prop {GlueRTMethods} unsubscribe
 */

/**
 * Glue Realtime Methods
 * @typedef {object} GlueRTMethods
 * @prop {function} dataCreated
 * @prop {function} dataUpdated
 * @prop {function} dataDeleted
 */
</script>

<style type="text/css" src="@/assets/base.css" />
