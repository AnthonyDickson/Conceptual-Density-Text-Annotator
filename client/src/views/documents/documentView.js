import React, {Component} from "react";

import PropTypes from "prop-types";

import {Affix, Card, Checkbox, Form, List, Radio, Skeleton, Typography} from "antd";
import NotFound from "../notFound";
import {A_PRIORI_CONCEPT, Annotation, BACKWARD_REFERENCE, EMERGING_CONCEPT, FORWARD_REFERENCE} from "./annotation";


const plainOptions = [A_PRIORI_CONCEPT, EMERGING_CONCEPT, FORWARD_REFERENCE, BACKWARD_REFERENCE];
const defaultCheckedList = [A_PRIORI_CONCEPT, EMERGING_CONCEPT];

class DocumentView extends Component {
    static propTypes = {
        loading: PropTypes.bool.isRequired,
        documentId: PropTypes.number.isRequired,
        documents: PropTypes.arrayOf(PropTypes.object).isRequired,
        sections: PropTypes.arrayOf(PropTypes.object).isRequired,
        annotations: PropTypes.objectOf(PropTypes.array).isRequired,
        fetchSectionsAndAnnotations: PropTypes.func.isRequired,
        updateAnnotations: PropTypes.func.isRequired,
    };

    state = {
        tag: A_PRIORI_CONCEPT,
        checkedList: defaultCheckedList,
        indeterminate: true,
        checkAll: false,
    };

    handleTagChange = e => {
        const tag = e.target.value;

        let newState = {
            tag: tag
        };

        if (!this.state.checkedList.includes(tag)) {
            newState.checkedList = [...this.state.checkedList];
            newState.checkedList.push(tag);
        }

        this.setState(newState);
    };

    onCheckChange = checkedList => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            checkAll: checkedList.length === plainOptions.length,
        });
    };

    onCheckAllChange = e => {
        this.setState({
            checkedList: e.target.checked ? plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    componentDidMount() {
        const {fetchSectionsAndAnnotations, documentId} = this.props;

        fetchSectionsAndAnnotations(documentId);
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
            const {tag, checkedList} = this.state;
            const {annotations, updateAnnotations} = this.props;

            return (
                <div>
                    {this.annotationsForm()}

                    <List
                        bordered
                        dataSource={sections}
                        renderItem={item => (
                            <List.Item>
                                <Typography>
                                    <Typography.Title>{item.title}</Typography.Title>
                                    <Annotation
                                        text={item.text}
                                        tag={tag}
                                        enabledTags={checkedList}
                                        sectionId={item.id}
                                        annotations={annotations[item.id]}
                                        updateAnnotations={updateAnnotations}
                                    />
                                </Typography>
                            </List.Item>
                        )}
                    />
                </div>
            );
        } else {
            return NotFound();
        }
    }

    annotationsForm() {
        const formLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 14},
        };

        return (
            <Affix>
                <Card>
                    <Form>
                        <Form.Item label="Filter Tags" {...formLayout}>
                            <div style={{borderBottom: '1px solid #E9E9E9'}}>
                                <Checkbox
                                    indeterminate={this.state.indeterminate}
                                    onChange={this.onCheckAllChange}
                                    checked={this.state.checkAll}
                                >
                                    Toggle all
                                </Checkbox>
                            </div>
                            <Checkbox.Group
                                options={plainOptions}
                                value={this.state.checkedList}
                                onChange={this.onCheckChange}
                            />
                        </Form.Item>
                        <Form.Item label="Annotation Type" {...formLayout}>
                            <Radio.Group
                                onChange={this.handleTagChange}
                                defaultValue={A_PRIORI_CONCEPT}
                                value={this.state.tag}>
                                <Radio.Button value={A_PRIORI_CONCEPT}>A PRIORI</Radio.Button>
                                <Radio.Button value={EMERGING_CONCEPT}>EMERGING</Radio.Button>
                                <Radio.Button value={FORWARD_REFERENCE}>FORWARD</Radio.Button>
                                <Radio.Button value={BACKWARD_REFERENCE}>BACKWARD</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Card>
            </Affix>
        );
    }
}

export default DocumentView;
