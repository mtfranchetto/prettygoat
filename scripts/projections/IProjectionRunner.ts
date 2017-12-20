import {Observable} from "rxjs";
import {ISubscription} from "rxjs/Subscription";
import {Snapshot} from "../snapshots/ISnapshotRepository";
import {Event} from "../events/Event";
import {ProjectionStats} from "./ProjectionRunner";
import Dictionary from "../common/Dictionary";

export interface IProjectionRunner<T = any> extends ISubscription {
    state: T;
    stats: ProjectionStats;
    run(snapshot?: Snapshot<T>): void;
    stop(): void;
    notifications(): Observable<NotificationTuple<T>>;
}

export type NotificationTuple<T = any> = [Event<T>, Dictionary<string[]>];
