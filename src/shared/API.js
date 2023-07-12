export default class API {
    constructor(MODULE_ID, DATASET_ID) {
        this.MODULE_ID = MODULE_ID;
        this.DATASET_ID = DATASET_ID;
        this.DataAPI = new ModuleDataAPI(MODULE_ID, DATASET_ID);
        this.PropsAPI = new ModulePropsAPI(MODULE_ID, DATASET_ID);
    }

    get(options = {}) {
        return this.DataAPI.fetch(options);
    }

    insert(documents) {
        return this.DataAPI.insert({ documents });
    }

    getCurrentUser() {
        return this.PropsAPI.getUser()
    }

    getSpaceUsers() {
        return this.PropsAPI.getWorkspaceUsers();
    }

    // add your functions to interact with ModuleDataAPI and ModulePropsAPI.
    // refer to the documentation for usage info.
}
