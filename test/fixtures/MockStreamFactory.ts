import {IStreamFactory} from "../../scripts/streams/IStreamFactory";
import {Observable} from "rx";

export class MockStreamFactory implements IStreamFactory {

    constructor(private observable?:Observable<any>) {

    }

    from(lastEvent:string):Observable<any> {
        return this.observable;
    }
}
