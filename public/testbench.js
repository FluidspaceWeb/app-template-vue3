(function () {
    //DEFINE THIS FOR ALL MODULES
    const appConfig = JSON.parse(document.getElementById('appConfig').text);
    const moduleConfig = appConfig.module;

    window.App = {
        'Bus': Bus(),
        'ModuleConfigs': {},
        'Modules': {},
        'Workspace': {
            'user': {
                "_id": "yAWWJyjabBT8EdWBg0lR",
                "fname": "John",
                "lname": "Doe",
                "email": "alltimejohndoe@domain.tld",
                "img": appConfig.serverUrl + '/images/user_default.jpg'
            }
        }
    };

    //REST IS FILLED WITH DUMMY DATA
    const mod_fullname = (moduleConfig.namespace + '_' + moduleConfig.name).toLowerCase();
    const tagName = 'module-' + mod_fullname;
    const modules = document.getElementsByTagName(tagName);

    for (let i = 0; i < modules.length; i++) {
        let mod = modules[i];
        mod.setAttribute('data-mid', moduleConfig.id);      // for dev purpose only
        mod.setAttribute('dsid', moduleConfig.dataset_id);  // for dev purpose only

        mod.addEventListener("register-app", (args) => {
            const detail = args["detail"][0];
            let dummy_config = {
                id: detail['id'],
                title: moduleConfig.displayName,
                namespace: moduleConfig.namespace,
                mod_name: moduleConfig.name,
                tag: tagName,
                // "app": "main-9a979adb.js",
                isVanillaJs: false,
                min_width: 3,
                min_height: 2,
            };

            const randomPageId = 'page_' + (i + 1);
            window.App['Modules'][randomPageId] = {};

            window.App['ModuleConfigs'][detail['id']] = dummy_config;
            window.App['Modules'][randomPageId][detail['id']] = detail;
            console.log('-> testbench conf loaded');

            console.log('-> invoking module init()');
            let dsid = mod.getAttribute('dsid');

            // INITIALISE THE MODULE
            detail.init(dsid, Module({
                'module_id': detail['id'],
                'page_id': randomPageId,
                'dataset_id': dsid,
                'permission_mode': 9
            }));
        });
        mod.addEventListener("show-toast", (args) => {
            args.stopPropagation();
            console.log("Event show-toast args: ", args['detail']);
            alert(`Toast [${args['detail'][0]['severity_type']}]\r\n\r\n${args['detail'][0]['message']}`);
        });
    }
})();
