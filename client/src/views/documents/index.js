import React, {Component} from "react";
import {Link, Route, Switch} from "react-router-dom";

import PropTypes from "prop-types";
import TimeAgo from "react-timeago";


import {Button, Form, Icon, Input, List, message, Modal, Skeleton, Spin, Tooltip, Typography} from "antd";
import NotFound from "../notFound";
import DocumentView from "./documentView";

import './index.css';
import {EditDocumentModal} from "./editDocumentModal";

class Documents extends Component {
    static propTypes = {
        loading: PropTypes.bool.isRequired,
        sideMenuCollapsed: PropTypes.bool.isRequired,
        documents: PropTypes.arrayOf(PropTypes.object).isRequired,
        sections: PropTypes.arrayOf(PropTypes.object).isRequired,
        annotations: PropTypes.objectOf(PropTypes.array).isRequired,
        currentDocument: PropTypes.number.isRequired,
        fetchDocuments: PropTypes.func.isRequired,
        selectDocument: PropTypes.func.isRequired,
        createDocument: PropTypes.func.isRequired,
        copyDocument: PropTypes.func.isRequired,
        deleteDocument: PropTypes.func.isRequired,
        updateDocument: PropTypes.func.isRequired,
        fetchSectionsAndAnnotations: PropTypes.func.isRequired,
        addSection: PropTypes.func.isRequired,
        updateSection: PropTypes.func.isRequired,
        deleteSection: PropTypes.func.isRequired,
        updateAnnotations: PropTypes.func.isRequired,
        saveChanges: PropTypes.func.isRequired,
        discardChanges: PropTypes.func.isRequired,
        dirty: PropTypes.bool.isRequired,
    };

    getDocumentView = () => {
        return (
            <DocumentView
                loading={this.props.loading}
                dirty={this.props.dirty}
                currentDocument={this.props.currentDocument}
                documents={this.props.documents}
                sections={this.props.sections}
                annotations={this.props.annotations}
                fetchSectionsAndAnnotations={this.props.fetchSectionsAndAnnotations}
                selectDocument={this.props.selectDocument}
                updateDocumentTitle={this.props.updateDocumentTitle}
                addSection={this.props.addSection}
                updateSection={this.props.updateSection}
                deleteSection={this.props.deleteSection}
                updateAnnotations={this.props.updateAnnotations}
                saveChanges={this.props.saveChanges}
                discardChanges={this.props.discardChanges}
            />
        )
    };

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

        const dateConversion = (timeStamp) => {
            return new Date(timeStamp)
        };

        return (
            <div>
                <div>
                    <Button onClick={fetchDocuments} disabled={loading} style={{margin: '5px 0', marginRight: 5}}>
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
                                    <Tooltip title="Copy">
                                        <Button onClick={() => this.props.copyDocument(item)}>
                                            <Icon type="copy"/>
                                        </Button>
                                    </Tooltip>
                                </Spin>,
                                <EditDocumentModal
                                    document={item}
                                    updateDocument={this.props.updateDocument}
                                    sideMenuCollapsed={this.props.sideMenuCollapsed}
                                />,
                                <DeleteDocumentModal
                                    document={item}
                                    deleteDocument={this.props.deleteDocument}
                                    sideMenuCollapsed={this.props.sideMenuCollapsed}
                                />
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
        title: '',
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

        const document = {title: this.state.title};

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
            title: ''
        });
    };

    onChange = e => {
        this.setState({title: e.target.value})
    };

    render() {
        const {visible, confirmLoading, modalText} = this.state;
        const loading = this.props.loading;

        return (
            <span>
                <Button onClick={this.showModal} disabled={loading} type="dashed" style={{margin: '5px 0'}}>
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
                                defaultValue={modalText}
                                autoFocus
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </span>
        );
    }
}


class DeleteDocumentModal extends Component {
    static propTypes = {
        document: PropTypes.object.isRequired,
        deleteDocument: PropTypes.func.isRequired,
        sideMenuCollapsed: PropTypes.bool.isRequired,
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

        this.props.deleteDocument(this.props.document, (requestOk) => {
            if (requestOk) {
                message.success('Document Deleted')
            }
            // TODO: Fix error that sometimes happens when deleting documents.
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
            <>
                <Tooltip title="Delete">
                    <Button
                        key={`document-list-delete-${this.props.document.id}`}
                        onClick={() => this.showModal()}
                        type="danger"
                    >
                        <Icon type="delete"/>
                    </Button>
                </Tooltip>
                <Modal
                    title={<span><Icon type="delete"/> Delete Document</span>}
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    okText="Delete"
                    okType="danger"
                    cancelText="Cancel"
                    destroyOnClose={true}
                >
                    <Typography.Paragraph>
                        Are you sure you want to delete this document? This action cannot be undone.
                    </Typography.Paragraph>
                </Modal>
            </>
        );
    }
}

export default Documents;
