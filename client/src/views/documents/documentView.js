import React, {Component} from "react";

import PropTypes from "prop-types";

import {Affix, Button, Card, Col, Form, List, Radio, Row, Skeleton, Typography} from "antd";
import NotFound from "../notFound";
import {
    A_PRIORI_CONCEPT,
    Annotation,
    BACKWARD_REFERENCE,
    EMERGING_CONCEPT,
    ENTITY,
    FORWARD_REFERENCE,
    RELATION
} from "./annotation";


const ANNOTATION_TYPES = [A_PRIORI_CONCEPT, EMERGING_CONCEPT, FORWARD_REFERENCE, BACKWARD_REFERENCE, ENTITY, RELATION];

const ALL = 'ALL';
const CONCEPTS = 'CONCEPTS';
const REFERENCES = 'REFERENCES';
const RELATIONS = 'RELATIONS';
const CATEGORIES = [ALL, CONCEPTS, REFERENCES, RELATIONS];

// Confirm navigation when there are unsaved changes.
class DocumentView extends Component {
    static propTypes = {
        loading: PropTypes.bool.isRequired,
        documentId: PropTypes.number.isRequired,
        documents: PropTypes.arrayOf(PropTypes.object).isRequired,
        sections: PropTypes.arrayOf(PropTypes.object).isRequired,
        annotations: PropTypes.objectOf(PropTypes.array).isRequired,
        fetchSectionsAndAnnotations: PropTypes.func.isRequired,
        updateAnnotations: PropTypes.func.isRequired,
        saveChanges: PropTypes.func.isRequired,
        dirty: PropTypes.bool.isRequired,
    };

    state = {
        tag: A_PRIORI_CONCEPT,
        category: ALL,
        checkedList: ANNOTATION_TYPES,
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

    handleCategoryChange = e => {
        const nextState = {};
        nextState.category = e.target.value;

        switch (nextState.category) {
            case ALL:
                nextState.checkedList = ANNOTATION_TYPES;
                break;
            case CONCEPTS:
                nextState.checkedList = [A_PRIORI_CONCEPT, EMERGING_CONCEPT];
                break;
            case REFERENCES:
                nextState.checkedList = [FORWARD_REFERENCE, BACKWARD_REFERENCE];
                break;
            case RELATIONS:
                nextState.checkedList = [ENTITY, RELATION];
                break;
            default:
                // Nothing needs to be done here.
                break;
        }

        nextState.tag = nextState.checkedList[0];
        this.setState(nextState)
    };

    componentDidMount() {
        this.loadData();
    }

    loadData() {
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

        const annotationTypeRadioButtons = this.state.checkedList.map(option => {
            return <Radio.Button key={option} value={option}>{option}</Radio.Button>
        });

        const categoryRadioButtons = CATEGORIES.map(option => {
            return <Radio.Button key={option} value={option}>{option}</Radio.Button>
        });

        return (
            <Affix>
                <Card>
                    <Form>
                        <Form.Item label="Filter Tags" {...formLayout}>
                            <Radio.Group
                                onChange={this.handleCategoryChange}
                                defaultValue={ALL}
                                value={this.state.category}
                            >
                                {categoryRadioButtons}
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="Annotation Type" {...formLayout}>
                            <Radio.Group
                                onChange={this.handleTagChange}
                                defaultValue={A_PRIORI_CONCEPT}
                                value={this.state.tag}>
                                {annotationTypeRadioButtons}
                            </Radio.Group>
                        </Form.Item>
                        {this.props.dirty ?
                            <Form.Item>
                                <Row>
                                    <Col offset={4}>
                                        <Button
                                            onClick={() => this.props.saveChanges()}
                                            type="primary"
                                            style={{marginRight: 10}}>
                                            Save Changes
                                        </Button>
                                        <Button onClick={() => this.loadData()}>Discard Changes</Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                            : null}
                    </Form>
                </Card>
            </Affix>
        );
    }
}

export default DocumentView;
