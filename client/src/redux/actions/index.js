import {ADD_DOCUMENT, REMOVE_DOCUMENT} from "../actionTypes";

export function addDocument(payload) {
    return {type: ADD_DOCUMENT, payload}
}

export function removeDocument(payload) {
    return {type: REMOVE_DOCUMENT, payload}
}