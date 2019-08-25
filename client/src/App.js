import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import {Layout, message, Modal, Typography} from 'antd';

import Breadcrumbs from "./views/breadcrumbs";
import Documents from "./views/documents";
import Index from "./views/index";
import NotFound from "./views/notFound";
import SideMenu from "./views/sideMenu";
import {TAG_COLOURS} from "./views/documents/annotation";


import './App.css';

const {Sider, Header, Content} = Layout;

class App extends Component {

    state = {
        documents: [],
        sections: [],
        annotations: {},
        loadedSections: [],
        loadedAnnotations: {},
        currentDocument: -1,
        loading: false,
        dirty: false
    };
    numRequests = 0;

    componentDidMount() {
        this.fetchDocuments()
    }

    fetchFrom = (url, cb) => {
        this.setState({loading: true});
        this.numRequests++;

        fetch(url)
            .then(res => {
                if (res.status !== 200) throw Error(`${res.status}: ${res.statusText}`);

                return res.json();
            })
            .then(res => {
                cb(res);
            })
            .catch(err => {
                console.log(err);
                Modal.error({
                    title: 'Error: Could not load data!',
                    content: `Request to '${url}' failed. Reason: '${err.message}'.`,
                });
            }).finally(() => {
            this.numRequests--;

                if (this.numRequests === 0) {
                    this.setState({loading: false});
                }
            }
        );
    };

    fetchDocuments = () => {
        this.fetchFrom('/api/documents/', (res) => {
            const state = {
                ...this.state,
                documents: res.documents
            };

            this.setState(state);
        });
    };

    selectDocument = (documentId, cb) => {
        this.setState({
            ...this.state,
            currentDocument: parseInt(documentId)
        }, cb);
    };

    fetchSectionsAndAnnotations = () => {
        const documentId = this.state.currentDocument;

        this.fetchFrom(`/api/documents/${documentId}/sections`, (res) => {
            const sections = res.sections;

            this.fetchFrom(`/api/documents/${documentId}/annotations`, (res) => {
                const annotations = this.groupBy(res.annotations, 'section_number');

                // Make sure each section has an entry in the annotations dictionary.
                sections.forEach(section => {
                    annotations[section.section_number] = annotations[section.section_number] || [];

                    // Restore the annotation colour.
                    annotations[section.section_number].forEach(annotation => {
                        annotation.color = TAG_COLOURS[annotation.tag];
                    });
                });

                const annotationsCopy = {...annotations};

                sections.forEach(section => {
                    const sectionNumber = section.section_number;
                    annotationsCopy[sectionNumber] = annotations[sectionNumber].map(annotation => ({...annotation}));
                });

                const state = {
                    ...this.state,
                    sections: sections,
                    annotations: annotations,
                    loadedSections: sections.map(section => ({...section})),
                    loadedAnnotations: annotationsCopy,
                    dirty: false
                };

                this.setState(state);
            });
        });
    };

    addSection = () => {
        const nextId = this.state.sections.length + 1;

        const section = {
            document_id: this.state.currentDocument,
            section_number: nextId,
            title: 'title',
            text: 'text'
        };

        const state = {
            ...this.state,
            sections: [
                ...this.state.sections,
                section
            ],
            annotations: {
                ...this.state.annotations,
                [nextId]: []
            },
            dirty: true
        };

        this.setState(state);
    };

    // TODO: Remove invalid annotations (ones that reference tokens that are no longer in the section.
    updateSection = section => {
        const tokens = section.text.split(' ');

        const state = {
            ...this.state,
            sections: this.state.sections.map(theSection => {
                return theSection.section_number === section.section_number ? section : theSection;
            }),
            annotations: {
                ...this.state.annotations,
                [section.section_number]: this.state.annotations[section.section_number].filter(annotation => {
                    return annotation.end < tokens.length;
                })
            },
            dirty: true
        };

        this.setState(state);
    };

    deleteSection = section => {
        const sections = this.state.sections.filter(theSection => theSection.section_number !== section.section_number);
        // Discard annotations for the given section.
        const {[section.section_number]: _, ...annotationsWithoutSection} = this.state.annotations;

        // 'Re-index' section numbers. For example, a document with sections [1, 2, 3] should reduce to [1, 2] after the
        // original section 2 was deleted, and the annotations from section 3 should have their section numbers
        // reassigned to 2.
        for (let sectionNumber = section.section_number; sectionNumber <= sections.length; sectionNumber++) {
            annotationsWithoutSection[sectionNumber] = annotationsWithoutSection[sectionNumber + 1];
            annotationsWithoutSection[sectionNumber].forEach(annotation => {
                annotation.section_number = sectionNumber;
            });

            sections[sectionNumber - 1].section_number = sectionNumber;
        }

        // Need to get rid of 'dangling' annotation key.
        delete annotationsWithoutSection[this.state.sections.length];

        const state = {
            ...this.state,
            sections: sections,
            annotations: annotationsWithoutSection,
            dirty: true
        };

        this.setState(state);
    };

    createDocument = (document, cb) => {
        const url = `/api/documents`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({document: document})
        })
            .then(res => {
                if (res.status !== 200) throw Error(`${res.status}: ${res.statusText}`);

                return res.json();
            })
            .then(res => {
                const state = {
                    ...this.state,
                    documents: [
                        ...this.state.documents,
                        res.document
                    ]
                };

                this.setState(state);

                if (cb !== undefined) cb(true);
            })
            .catch(err => {
                console.log(err);
                Modal.error({
                    title: 'Error: Could not process request!',
                    content: `Request to '${url}' failed. Reason: '${err.message}'.`,
                });
                if (cb !== undefined) cb(false);
            });
    };

    copyDocument = document => {
        console.log(document);
        const url = `/api/documents/${document.id}/copy`;

        const state = {
            ...this.state,
            documents: this.state.documents.map(theDocument => {
                return (theDocument.id === document.id) ? {...theDocument, isCopying: true} : theDocument;
            })
        };

        this.setState(state);

        fetch(url, {method: 'POST'})
            .then(res => {
                if (res.status !== 200) throw Error(`${res.status}: ${res.statusText}`);

                return res.json();
            })
            .then(res => {
                const documents = this.state.documents.map(theDocument => {
                    return (theDocument.id === document.id) ? {...theDocument, isCopying: false} : theDocument;
                });

                documents.push(res.document);

                const state = {
                    ...this.state,
                    documents: documents
                };

                this.setState(state);

                message.success('Document Copied')
            })
            .catch(err => {
                console.log(err);
                Modal.error({
                    title: 'Error: Could not process request!',
                    content: `Request to '${url}' failed. Reason: '${err.message}'.`,
                });
            });
    };

    updateDocument = (document, cb) => {
        const url = `/api/documents/${document.id}`;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({document: document})
        })
            .then(res => {
                if (res.status !== 200) throw Error(`${res.status}: ${res.statusText}`);

                const state = {
                    ...this.state,
                    documents: this.state.documents.map(theDocument => {
                        return (theDocument.id === document.id) ? document : theDocument;
                    })
                };

                this.setState(state);

                if (cb !== undefined) cb(true);
            })
            .catch(err => {
                console.log(err);
                Modal.error({
                    title: 'Error: Could not process request!',
                    content: `Request to '${url}' failed. Reason: '${err.message}'.`,
                });
                if (cb !== undefined) cb(false);
            });
    };

    deleteDocument = (document, cb) => {
        const url = `/api/documents/${document.id}`;

        fetch(url, {method: 'DELETE'})
            .then(res => {
                if (res.status !== 200) throw Error(`${res.status}: ${res.statusText}`);

                const state = {
                    ...this.state,
                    documents: this.state.documents.filter(theDocument => theDocument.id !== document.id)
                };

                this.setState(state);

                if (cb !== undefined) cb(true);
            })
            .catch(err => {
                console.log(err);
                Modal.error({
                    title: 'Error: Could not process request!',
                    content: `Request to '${url}' failed. Reason: '${err.message}'.`,
                });
                if (cb !== undefined) cb(false);
            });
    };

    saveChanges = () => {
        const hideLoadingMessage = message.loading('Saving changes...', 0);

        const sections = this.state.sections;
        const annotations = this.state.annotations;

        let url = `/api/documents/${this.state.currentDocument}/sections`;

        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sections: sections})
        })
            .then(res => {
                if (res.status !== 200) throw Error(`${res.status}: ${res.statusText}`);

                let url = `/api/documents/${this.state.currentDocument}/annotations`;

                fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({annotations: annotations})
                })
                    .then(res => {
                        if (res.status !== 200) throw Error(`${res.status}: ${res.statusText}`);

                        const state = {
                            ...this.state,
                            dirty: false
                        };

                        this.setState(state);
                        message.success('Changes Saved')
                    })
            })
            .catch(err => {
                console.log(err);
                Modal.error({
                    title: 'Error: Could not process request!',
                    content: `Request to '${url}' failed. Reason: '${err.message}'.`,
                });
            }).finally(() => hideLoadingMessage());
    };

    discardChanges = () => {
        const sections = this.state.loadedSections.map(section => ({...section}));
        const annotations = {...this.state.loadedAnnotations};

        for (const sectionNumber in annotations) {
            annotations[sectionNumber] = annotations[sectionNumber].map(annotations => ({...annotations}))
        }

        const state = {
            ...this.state,
            sections: sections,
            annotations: annotations,
            dirty: false
        };

        this.setState(state);
    };


    // Create a dictionary by grouping elements in an array by a giving property.
    groupBy = (array, property) => {
        return array.reduce(function (dict, element) {
            (dict[element[property]] = dict[element[property]] || []).push(element);

            return dict;
        }, {});
    };

    updateAnnotations = (section, annotations) => {
        const state = {
            ...this.state,
            annotations: {
                ...this.state.annotations,
                [section.section_number]: annotations
            },
            dirty: true
        };

        this.setState(state);
    };

    render() {
        return (
            <Layout>
                <Sider
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                    }}
                >
                    <div className="logo"/>
                    <SideMenu/>
                </Sider>

                <Layout style={{marginLeft: 200}}>
                    <Header style={{background: '#fff', padding: '24px 16px', minHeight: 120}}>
                        <Typography>
                            <Typography.Title>COSC480 Document Annotator</Typography.Title>
                            <Breadcrumbs/>
                        </Typography>
                    </Header>
                    <Content style={{margin: '24px 16px 0'}}>
                        <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                            <Switch>
                                <Route exact path="/" component={Index}/>
                                <Route path="/documents" render={props =>
                                    <Documents
                                        {...props}
                                        documents={this.state.documents}
                                        sections={this.state.sections}
                                        annotations={this.state.annotations}
                                        currentDocument={this.state.currentDocument}
                                        loading={this.state.loading}
                                        dirty={this.state.dirty}
                                        selectDocument={this.selectDocument}
                                        fetchDocuments={this.fetchDocuments}
                                        createDocument={this.createDocument}
                                        copyDocument={this.copyDocument}
                                        deleteDocument={this.deleteDocument}
                                        updateDocument={this.updateDocument}
                                        fetchSectionsAndAnnotations={this.fetchSectionsAndAnnotations}
                                        addSection={this.addSection}
                                        updateSection={this.updateSection}
                                        deleteSection={this.deleteSection}
                                        updateAnnotations={this.updateAnnotations}
                                        saveChanges={this.saveChanges}
                                        discardChanges={this.discardChanges}
                                    />}
                                />
                                <Route component={NotFound}/>
                            </Switch>
                        </div>
                    </Content>
                    {/*<Layout.Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Layout.Footer>*/}
                </Layout>
            </Layout>
        )
            ;
    }
}

export default App;
