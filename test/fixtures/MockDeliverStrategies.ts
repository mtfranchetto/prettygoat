import {DeliverAuthorization, DeliverContext, DeliverResult, IDeliverStrategy} from "../../scripts/projections/Deliver";

export class ContentDeliverStrategy implements IDeliverStrategy<any> {

    deliver(state: any, context: DeliverContext): DeliverResult<any> {
        state.count++;
        return [state, DeliverAuthorization.CONTENT];
    }

}

export class AsyncContentDeliverStrategy implements IDeliverStrategy<any> {

    deliver(state: any, context: DeliverContext): Promise<DeliverResult<any>> {
        return Promise.resolve(<DeliverResult<any>>[state, DeliverAuthorization.CONTENT]);
    }

}

export class ForbiddenDeliverStrategy implements IDeliverStrategy<any> {

    deliver(state: any, context: DeliverContext): DeliverResult<any> {
        return [state, DeliverAuthorization.FORBIDDEN];
    }

}

export class UnauthorizedDeliverStrategy implements IDeliverStrategy<any> {

    deliver(state: any, context: DeliverContext): DeliverResult<any> {
        return [state, DeliverAuthorization.UNAUTHORIZED];
    }

}

export class DependenciesDeliverStrategy implements IDeliverStrategy<any> {

    deliver(state: any, context: DeliverContext, readModels: { a: string, b: number }): DeliverResult<any> {
        return [readModels, DeliverAuthorization.CONTENT];
    }

}

export class ThrowDeliverStrategy implements IDeliverStrategy<any> {

    deliver(state: any, context: DeliverContext, readModels: { a: string, b: number }): DeliverResult<any> {
        throw new Error();
    }

}
