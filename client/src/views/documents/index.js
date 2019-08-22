import React, {Component} from "react";
import {Link, Route, Switch, withRouter} from "react-router-dom";

import PropTypes from "prop-types";

import {Button, Icon, List, Skeleton, Tooltip} from "antd";
import TimeAgo from "timeago-react";
import NotFound from "../notFound";
import DocumentView from "./documentView";

class Documents extends Component {
    static propTypes = {
        loading: PropTypes.bool.isRequired,
        documents: PropTypes.arrayOf(PropTypes.object).isRequired,
        sections: PropTypes.arrayOf(PropTypes.object).isRequired,
        annotations: PropTypes.objectOf(PropTypes.array).isRequired,
        fetchDocuments: PropTypes.func.isRequired,
        fetchSectionsAndAnnotations: PropTypes.func.isRequired,
        updateAnnotations: PropTypes.func.isRequired,
    };

    getDocumentView = withRouter(({match}) => {
        const documentId = parseInt(match.params.documentId);

        return (
            <DocumentView
                loading={this.props.loading}
                documentId={documentId}
                documents={this.props.documents}
                sections={this.props.sections}
                annotations={this.props.annotations}
                fetchSectionsAndAnnotations={this.props.fetchSectionsAndAnnotations}
                updateAnnotations={this.props.updateAnnotations}
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

        return (
            <div>
                <Button onClick={fetchDocuments} disabled={loading} style={{margin: '5px 0'}}><Icon
                    type="sync"/> Refresh</Button>
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
                            <List.Item>
                                <Link to={`/documents/${item.id}`}>{item.title}</Link>
                                {' - Created: '}
                                <Tooltip title={new Date(item.date_created).toLocaleString()}>
                                    <TimeAgo datetime={item.date_created}/>
                                </Tooltip>
                                {' - Edited: '}
                                <Tooltip title={new Date(item.date_edited).toLocaleString()}>
                                    <TimeAgo datetime={item.date_edited}/>
                                </Tooltip>
                            </List.Item>
                        )}
                    />
                }
            </div>
        )
    }
}

export default Documents;
