import React, {Component} from "react";

import PropTypes from "prop-types";

import {List, Skeleton, Typography} from "antd";
import NotFound from "./notFound";

class DocumentView extends Component {
    static propTypes = {
        loading: PropTypes.bool.isRequired,
        documentId: PropTypes.number.isRequired,
        documents: PropTypes.arrayOf(PropTypes.object).isRequired,
        sections: PropTypes.arrayOf(PropTypes.object).isRequired,
        fetchSections: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const {fetchSections, documentId} = this.props;

        fetchSections(documentId)
    }

    render() {
        const {documentId, documents, sections, loading} = this.props;

        const documentIndex = documents.findIndex(theDocument => theDocument.id === documentId);
        const documentExists = documentIndex !== -1;

        if (loading) {
            return (
                <List>
                    <List.Item>
                        <Skeleton active/>
                    </List.Item>
                </List>
            );
        } else if (documentExists) {
            return (
                <List
                    bordered
                    dataSource={sections}
                    renderItem={item => (
                        <List.Item>
                            <Typography>
                                <Typography.Title>{item.title}</Typography.Title>
                                <Typography.Paragraph>{item.text}</Typography.Paragraph>
                            </Typography>
                        </List.Item>
                    )}
                />
            );
        } else {
            return NotFound();
        }
    }
}

export default DocumentView;
