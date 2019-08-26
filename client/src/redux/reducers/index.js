import {ADD_DOCUMENT, REMOVE_DOCUMENT} from "../actionTypes";

const initialState = {
    documents: [],
    sections: [],
    annotations: {},
    loadedDocuments: [],
    loadedSections: [],
    loadedAnnotations: {},
    currentDocument: -1,
    loading: false,
    dirty: false,
    saving: false,
    sideMenuCollapsed: true,
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_DOCUMENT:
            return {
                ...state,
                documents: state.documents.concat(action.payload)
            };
        case REMOVE_DOCUMENT:
            return {
                ...state,
                documents: state.documents.filter(document => document.id !== action.payload.id)
            };
        default:
            return state;
    }
}

export default rootReducer;