import { reactive, ref, readonly } from 'vue';
import { default as API_Controller } from "./API";



export default function (ROOT_EMIT) {
    const MODULE_ID = 'llzD4Kj0m8hw6X69nMvw';
    const DATASET_ID = ref('');
    const STORE = reactive({});

    const set = {
        /** @param {string} dataset_id */
        datasetId(dataset_id) {
            DATASET_ID.value = dataset_id;
        }
    };

    const get = {};

    const actions = {
        /**
         * @param {'error' | 'warn' | 'info' | 'success'} severity_type
         * @param {string} message 
         */
        showToast(severity_type, message) {
            ROOT_EMIT('show-toast', { severity_type, message });
        }
    };

    function API() {
        if (DATASET_ID.value === '' || DATASET_ID.value === undefined) {
            return null;
        }
        return new API_Controller(MODULE_ID, DATASET_ID.value);
    };

    return {
        MODULE_ID,
        DATASET_ID: readonly(DATASET_ID),
        API,
        set,
        get,
        actions
    };
}
