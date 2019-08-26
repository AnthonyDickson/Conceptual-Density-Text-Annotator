import {CREATE_DOCUMENT, DELETE_DOCUMENT, SET_DIRTY, UPDATE_DOCUMENT} from "../actionTypes";

export function createDocument(payload) {
    return {type: CREATE_DOCUMENT, payload}
}

export function deleteDocument(payload) {
    return {type: DELETE_DOCUMENT, payload}
}

export function updateDocument(payload) {
    return {type: UPDATE_DOCUMENT, payload}
}

// TODO: Set dirty flag through actions that change state (e.g. add annotation).
export function setDirty(payload) {
    return {type: SET_DIRTY, payload}
}