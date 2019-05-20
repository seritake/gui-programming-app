import React from "react";
import {OBJECT_TYPE} from "../constants/object-types";
import {CREATE_NODE} from "../constants/action-types";
import uuid from "uuid/v1";

const generateInitialGraph = () => {
    const uuid1 = uuid();
    const uuid2 = uuid();
    return {
        [uuid1]: {
            id: uuid1,
            type: OBJECT_TYPE.START,
            position: {
                x: 20,
                y: 10,
            },
            adjacent: {
                next: -1
            },
        },
        [uuid2]: {
            id: uuid2,
            type: OBJECT_TYPE.END,
            position: {
                x: -20,
                y: -10
            },
        }
    }
};

const createNode = (state, action) => {
    const type = action.payload.nodeType;
    const id = uuid();
    const adjacent = (type === OBJECT_TYPE.DISTANCE || type === OBJECT_TYPE.LINE) ? {
        positive: -1,
        negative: -1,
    } : {
        next: -1
    };
    return {
        ...state,
        [id]: {
            id,
            type,
            position: {
                x: 200,
                y: 200,
            },
            adjacent
        }
    }
};

const graph = (state = generateInitialGraph(), action) => {
    switch (action.type) {
        case CREATE_NODE :
            return createNode(state, action);
        default:
            return state;
    }
    return state;
};

export default graph;