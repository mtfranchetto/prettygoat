import {injectable, inject, interfaces} from "inversify";
import IObjectContainer from "./IObjectContainer";
import * as _ from "lodash";

@injectable()
export default class ObjectContainer implements IObjectContainer {

    constructor(@inject("Container") private container: interfaces.Container) {
    }

    get<T>(key: string, name?: string): T {
        return !name ? this.container.get<T>(key) : this.container.getNamed<T>(key, name);
    }

    set<T>(key: string, object: interfaces.Newable<T> | T, parent?: string) {
        let binding = _.isFunction(object)
            ? this.container.bind<T>(key).to(<interfaces.Newable<T>>object)
            : this.container.bind<T>(key).toConstantValue(<T>object);
        if (parent)
            binding.whenInjectedInto(parent);
    }

    resolve<T>(constructor: interfaces.Newable<T>) {
        return this.container.resolve(constructor);
    }

    contains(key: string): boolean {
        return this.container.isBound(key);
    }

    remove(key: string): void {
        this.container.unbind(key);
    }
}
