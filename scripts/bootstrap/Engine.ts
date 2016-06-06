import "bluebird";
import "reflect-metadata";
import {Kernel} from "inversify";
import IModule from "./IModule";
import IProjectionRegistry from "../registry/IProjectionRegistry";
import * as _ from "lodash";
import PrettyGoatModule from "./PrettyGoatModule";
import {server, socket} from "./Socket";
import IProjectionEngine from "../projections/IProjectionEngine";
import IClientRegistry from "../push/IClientRegistry";
import IPushNotifier from "../push/IPushNotifier";
import IEndpointConfig from "../configs/IEndpointConfig";

class Engine {

    private kernel = new Kernel();
    private modules:IModule[] = [];

    constructor() {
        this.register(new PrettyGoatModule());
    }

    register(module:IModule) {
        this.kernel.load(module.modules);
        this.modules.push(module);
    }

    run(overrides?:any) {
        let registry = this.kernel.get<IProjectionRegistry>("IProjectionRegistry"),
            projectionEngine = this.kernel.get<IProjectionEngine>("IProjectionEngine"),
            clientRegistry = this.kernel.get<IClientRegistry>("IClientRegistry"),
            pushNotifier = this.kernel.get<IPushNotifier>("IPushNotifier"),
            config = this.kernel.get<IEndpointConfig>("IEndpointConfig");
        _.forEach(this.modules, (module:IModule) => module.register(registry, this.kernel, overrides));
        server.listen(config.port);
        socket.on('connection', client => {
            client.on('subscribe', context => {
                clientRegistry.add(client.id, context);
                pushNotifier.notify(context, client.id);
            });
            client.on('unsubscribe', message => clientRegistry.remove(client.id, message));
        });
        projectionEngine.run();
    }
}

export default Engine;
