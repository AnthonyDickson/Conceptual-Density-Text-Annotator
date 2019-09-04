import React, {Component} from "react";
import {Link, Route, Switch} from "react-router-dom";

import PropTypes from "prop-types";
import TimeAgo from "react-timeago";


import {Button, Icon, List, Skeleton, Spin, Tooltip} from "antd";
import NotFound from "../notFound";
import DocumentView from "./documentView/";

import './index.css';
import {EditDocumentModal} from "./editDocumentModal";
import {CreateDocumentModal} from "./createDocumentModal";
import {DeleteDocumentModal} from "./deleteDocumentModal";

class Documents extends Component {
    static propTypes = {
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
        loading: PropTypes.bool.isRequired,
        dirty: PropTypes.bool.isRequired,
        saving: PropTypes.bool.isRequired,
    };

    getDocumentView = () => {
        return (
            <DocumentView
                loading={this.props.loading}
                dirty={this.props.dirty}
                saving={this.props.saving}
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
                                <Tooltip title="Download">
                                    <Button>
                                        <Link to={`/api/documents/${item.id}/xml`} target="_blank"
                                              download={`${item.title}.xml`}>
                                            <Icon type="download"/>
                                        </Link>
                                    </Button>
                                </Tooltip>,
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


export default Documents;
