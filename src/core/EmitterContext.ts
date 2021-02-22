import React from "react";
import {createEmitter, IEmitter} from "./Emitter";

export const EmitterContext = React.createContext({
    emitter: createEmitter(),
} as {emitter: IEmitter});
