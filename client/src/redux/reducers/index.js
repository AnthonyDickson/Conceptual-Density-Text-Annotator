import {ADD_DOCUMENT} from "../actionTypes";

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
        default:
            return state;
    }
}

export default rootReducer;