import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import {Layout, Modal, Typography} from 'antd';

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
            this.setState({documents: res.documents});
        });
    };

    fetchSectionsAndAnnotations = (documentId) => {
        this.fetchFrom(`/api/documents/${documentId}/sections`, (res) => {
            const sections = res.sections;

            this.fetchFrom(`/api/documents/${documentId}/annotations`, (res) => {
                const annotations = this.groupBy(res.annotations, 'section_id');

                // Make sure each section has an entry in the annotations dictionary.
                sections.forEach(section => {
                    annotations[section.id] = annotations[section.id] || [];

                    // Restore the annotation colour.
                    annotations[section.id].forEach(annotation => {
                        annotation.color = TAG_COLOURS[annotation.tag];
                    });
                });

                this.setState({sections: sections, annotations: annotations, dirty: false});
            });
        });
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
                console.log(res);
                const documents = [...this.state.documents];

                documents.push(res.document);

                this.setState({documents: documents});

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

                const documents = [...this.state.documents];

                const documentIndex = documents.findIndex(theDocument => theDocument.id === document.id);

                if (documentIndex >= 0) {
                    documents[documentIndex] = document;
                }

                this.setState({documents: documents});
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

    deleteDocument = (documentId, cb) => {
        const url = `/api/documents/${documentId}`;

        fetch(url, {method: 'DELETE'})
            .then(res => {
                if (res.status !== 200) throw Error(`${res.status}: ${res.statusText}`);

                const documentIdInt = parseInt(documentId);

                this.setState({documents: this.state.documents.filter(document => document.id !== documentIdInt)});

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
        if (this.state.sections.length === 0) {
            return;
        }

        let documentId = this.state.sections[0].document_id;

        const url = `/api/documents/${documentId}/annotations`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({annotations: this.state.annotations})
        })
            .then(res => {
                if (res.status !== 200) throw Error(`${res.status}: ${res.statusText}`);

                this.setState({dirty: false});
            })
            .catch(err => {
                console.log(err);
                Modal.error({
                    title: 'Error: Could not process request!',
                    content: `Request to '${url}' failed. Reason: '${err.message}'.`,
                });
            });
    };

    // Create a dictionary by grouping elements in an array by a giving property.
    groupBy = (array, property) => {
        return array.reduce(function (dict, element) {
            (dict[element[property]] = dict[element[property]] || []).push(element);

            return dict;
        }, {});
    };

    updateAnnotations = (sectionId, annotations) => {
        let newAnnotations = Object.assign({}, this.state.annotations);

        newAnnotations[sectionId] = annotations;

        this.setState({annotations: newAnnotations, dirty: true});
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
                                        loading={this.state.loading}
                                        dirty={this.state.dirty}
                                        fetchDocuments={this.fetchDocuments}
                                        createDocument={this.createDocument}
                                        deleteDocument={this.deleteDocument}
                                        updateDocument={this.updateDocument}
                                        fetchSectionsAndAnnotations={this.fetchSectionsAndAnnotations}
                                        updateAnnotations={this.updateAnnotations}
                                        saveChanges={this.saveChanges}
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
