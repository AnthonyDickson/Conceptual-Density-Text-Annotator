import {CREATE_DOCUMENT, DELETE_DOCUMENT, UPDATE_DOCUMENT} from "../actionTypes";

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
        case CREATE_DOCUMENT:
            return {
                ...state,
                documents: state.documents.concat(action.payload)
            };
        case UPDATE_DOCUMENT:
            return {
                ...state,
                documents: state.documents.map(document => {
                    return (document.id === action.payload.id) ? {...action.payload} : document;
                })
            };
        case DELETE_DOCUMENT:
            return {
                ...state,
                documents: state.documents.filter(document => document.id !== action.payload.id)
            };
        default:
            return state;
    }
}

export default rootReducer;