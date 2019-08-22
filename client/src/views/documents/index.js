import React, {Component} from "react";
import {Link, Route, Switch, withRouter} from "react-router-dom";

import PropTypes from "prop-types";
import TimeAgo from "react-timeago";


import {Button, Form, Icon, Input, List, message, Modal, Skeleton, Spin, Typography} from "antd";
import NotFound from "../notFound";
import DocumentView from "./documentView";

import './index.css';

class Documents extends Component {
    static propTypes = {
        loading: PropTypes.bool.isRequired,
        documents: PropTypes.arrayOf(PropTypes.object).isRequired,
        sections: PropTypes.arrayOf(PropTypes.object).isRequired,
        annotations: PropTypes.objectOf(PropTypes.array).isRequired,
        fetchDocuments: PropTypes.func.isRequired,
        createDocument: PropTypes.func.isRequired,
        copyDocument: PropTypes.func.isRequired,
        deleteDocument: PropTypes.func.isRequired,
        updateDocument: PropTypes.func.isRequired,
        fetchSectionsAndAnnotations: PropTypes.func.isRequired,
        updateAnnotations: PropTypes.func.isRequired,
        saveChanges: PropTypes.func.isRequired,
        dirty: PropTypes.bool.isRequired,
    };

    getDocumentView = withRouter(({match}) => {
        const documentId = parseInt(match.params.documentId);

        return (
            <DocumentView
                loading={this.props.loading}
                dirty={this.props.dirty}
                documentId={documentId}
                documents={this.props.documents}
                sections={this.props.sections}
                annotations={this.props.annotations}
                fetchSectionsAndAnnotations={this.props.fetchSectionsAndAnnotations}
                updateAnnotations={this.props.updateAnnotations}
                saveChanges={this.props.saveChanges}
            />
        )
    });

    render() {
        return (
            <Switch>
                <Route path="/documents/:documentId" component={this.getDocumentView}/>
                <Route path="/documents" render={this.DocumentsList}/>
                <Route component={NotFound}/>
            </Switch>
        )
    }

    DocumentsList = () => {
        const {documents, loading, fetchDocuments} = this.props;

        // TODO: Fix time display
        const dateConversion = (timeStamp) => {
            return new Date(timeStamp)
        };

        return (
            <div>
                <div>
                    <Button onClick={fetchDocuments} disabled={loading} style={{margin: '5px 0'}}>
                        <Icon type="sync"/> Refresh
                    </Button>
                    <CreateDocumentModal createDocument={this.props.createDocument} loading={this.props.loading}/>
                </div>
                {loading ?
                    <List bordered>
                        <List.Item>
                            <Skeleton active/>
                        </List.Item>
                    </List>
                    :
                    <List
                        bordered
                        dataSource={documents}
                        renderItem={item => (
                            <List.Item actions={[
                                <Spin spinning={item.isCopying === true}>
                                    <Button onClick={() => this.props.copyDocument(item.id)}>
                                        <Icon type="copy"/> Copy
                                    </Button>
                                </Spin>,
                                <EditDocumentModal document={item} updateDocument={this.props.updateDocument}/>,
                                <DeleteDocumentModal document={item} deleteDocument={this.props.deleteDocument}/>
                            ]}>
                                <List.Item.Meta
                                    title={
                                        <Link to={`/documents/${item.id}`}>{item.title}</Link>
                                    }
                                    description={
                                        <span>
                                                {' Created: '}
                                            <TimeAgo date={dateConversion(item.date_created)}/>
                                            {' - Edited: '}
                                            <TimeAgo date={dateConversion(item.date_edited)}/>
                                            </span>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                }
            </div>
        )
    }
}

class CreateDocumentModal extends Component {
    static propTypes = {
        createDocument: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
    };

    state = {
        modalText: '',
        visible: false,
        confirmLoading: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });

        const document = {title: this.state.modalText};

        this.props.createDocument(document, (requestOk) => {
            if (requestOk) {
                message.success('Document Created');
            }

            this.setState({
                visible: !requestOk,
                confirmLoading: false,
            });
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            modalText: ''
        });
    };

    onChange = e => {
        // TODO: Tidier way to do this?
        this.setState({modalText: this.state.modalText + e.nativeEvent.data})
    };

    render() {
        const {visible, confirmLoading, modalText} = this.state;
        const loading = this.props.loading;

        return (
            <span>
                <Button onClick={this.showModal} disabled={loading} type="dashed" style={{margin: '5px'}}>
                    <Icon type="plus"/> Create Document
                </Button>
                <Modal
                    title={<span><Icon type="form"/> Creating Document</span>}
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <Form.Item>
                            <Input
                                placeholder="Document Title"
                                onChange={this.onChange}
                                onPressEnter={this.handleOk}
                                value={modalText}
                                autoFocus
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </span>
        );
    }
}

class EditDocumentModal extends Component {
    static propTypes = {
        document: PropTypes.object.isRequired,
        updateDocument: PropTypes.func.isRequired,
    };

    state = {
        modalText: this.props.document.title,
        visible: false,
        confirmLoading: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });

        const document = Object.assign({}, this.props.document, {title: this.state.modalText});
        this.props.updateDocument(document, (requestOk) => {
            if (requestOk) {
                message.success('Document Title Updated')
            }

            this.setState({
                visible: !requestOk,
                confirmLoading: false,
            });
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            modalText: this.props.document.title
        });
    };

    onChange = e => {
        // TODO: Tidier way to do this?
        this.setState({modalText: this.state.modalText + e.nativeEvent.data})
    };

    render() {
        const {visible, confirmLoading, modalText} = this.state;

        return (
            <div>
                <Button
                    key="document-list-edit"
                    onClick={() => this.showModal()}
                    type="default"
                >
                    <Icon type="edit"/> Edit Title
                </Button>
                <Modal
                    title={<span><Icon type="edit"/> Editing Document Title</span>}
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <Form.Item>
                            <Input
                                placeholder="Document Title"
                                onChange={this.onChange}
                                onPressEnter={this.handleOk}
                                value={modalText}
                                autoFocus
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}


class DeleteDocumentModal extends Component {
    static propTypes = {
        document: PropTypes.object.isRequired,
        deleteDocument: PropTypes.func.isRequired,
    };

    state = {
        visible: false,
        confirmLoading: false,
    };


    componentWillUnmount() {
        this.setState({
            confirmLoading: false,
            visible: false
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });

        this.props.deleteDocument(this.props.document.id, (requestOk) => {
            if (requestOk) {
                message.success('Document Deleted')
            }

            this.setState({
                confirmLoading: false,
                visible: false
            });
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const {visible, confirmLoading} = this.state;

        return (
            <div>
                <Button
                    key={`document-list-delete-${this.props.document.id}`}
                    onClick={() => this.showModal()}
                    type="danger"
                >
                    <Icon type="delete"/> Delete
                </Button>
                <Modal
                    title={<span><Icon type="delete"/> Delete Document</span>}
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    okText="Yes"
                    okType="danger"
                    cancelText="No"
                >
                    <Typography.Paragraph>
                        Are you sure you want to delete this document? This action cannot be undone.
                    </Typography.Paragraph>
                </Modal>
            </div>
        );
    }
}

export default Documents;
