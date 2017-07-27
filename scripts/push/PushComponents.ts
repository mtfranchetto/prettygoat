import PushContext from "./PushContext";

export interface IPushNotifier {
    notify(context: PushContext, notificationKey?: string, clientId?: string): void;
}

export interface ISocketClient {
    join(room: string);
    leave(room: string);
}

export interface ISocketFactory {
    socketForPath(path?: string): SocketIO.Server;
}

export interface PushNotification {
    url: string;
    notificationKey: string;
}

export interface IClientRegistry {
    add(client: ISocketClient, context: PushContext): string;
    remove(client: ISocketClient, context: PushContext);
}

export interface IEventEmitter {
    broadcastTo(room: string, event: string, data: any);
    emitTo(clientId: string, event: string, data: any);
}