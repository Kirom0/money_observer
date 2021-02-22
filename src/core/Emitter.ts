export enum EmitterType {
    ALL,
    RECORDS_ORDER_CHANGES,
}

export interface IEmitter {
    subscribe: (etype:EmitterType, listener : IListener) => () => void,
    emit: (etype:EmitterType, ...args) => void,
}

type IListener = (...args:any[]) => void;

export function createEmitter() : IEmitter {
    const listeners : { [key: number]: Set<IListener> } = {};
    return {
        subscribe(etype, listener) {
            if (!listeners.hasOwnProperty(EmitterType.ALL)) {
                listeners[EmitterType.ALL] = new Set();
            }
            listeners[EmitterType.ALL].add(listener);
            if (listeners.hasOwnProperty(etype)) {
                listeners[etype].add(listener);
            } else {
                listeners[etype] = new Set([listener]);
            }
            return () => {
                listeners[etype].delete(listener);
            }
        },
        emit(etype, ...args) : void {
            for (let listener of listeners[EmitterType.ALL]) {
                listener();
            }
            for (let listener of listeners[etype]) {
                listener(...args);
            }
        }
    }
}
