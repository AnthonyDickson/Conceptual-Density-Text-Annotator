import {CREATE_DOCUMENT, DELETE_DOCUMENT, UPDATE_DOCUMENT} from "../actionTypes";

export function createDocument(payload) {
    return {type: CREATE_DOCUMENT, payload}
}

export function deleteDocument(payload) {
    return {type: DELETE_DOCUMENT, payload}
}

export function updateDocument(payload) {
    return {type: UPDATE_DOCUMENT, payload}
}