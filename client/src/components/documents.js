import React, {Component} from "react";
import PropTypes from "prop-types";

import {Button, Icon, List, Skeleton, Tooltip} from "antd";
import {Link, Route, Switch} from "react-router-dom";
import TimeAgo from "timeago-react";
import NotFound from "./notFound";

class Documents extends Component {
    static propTypes = {
        loading: PropTypes.bool.isRequired,
        documents: PropTypes.arrayOf(PropTypes.object).isRequired,
        refresh: PropTypes.func.isRequired,
    };

    handleRefresh = this.props.refresh;

    render() {
        return (
            <Switch>
                <Route exact path="/documents" render={this.DocumentsList}/>
                <Route component={NotFound}/>
            </Switch>
        )
    }

    DocumentsList = () => {
        const {documents, loading} = this.props;

        return (
            <div>
                <Button onClick={this.handleRefresh} disabled={loading} style={{margin: '5px 0'}}><Icon
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
