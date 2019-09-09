import React, {Component} from "react";
import {Prompt, withRouter} from "react-router-dom";


import PropTypes from "prop-types";

import {Affix, Button, Card, Col, Collapse, Form, Icon, List, Radio, Row, Skeleton, Typography} from "antd";
import NotFound from "../../notFound";
import {
    A_PRIORI_CONCEPT,
    Annotation,
    BACKWARD_REFERENCE,
    EMERGING_CONCEPT,
    ENTITY,
    FORWARD_REFERENCE,
    RELATION
} from "./annotation";
import {EditSectionDrawer} from "./editSectionDrawer";
import {DeleteSectionModal} from "./deleteSectionModal";


const ANNOTATION_TYPES = [A_PRIORI_CONCEPT, EMERGING_CONCEPT, FORWARD_REFERENCE, BACKWARD_REFERENCE, ENTITY, RELATION];

const ALL = 'ALL';
const CONCEPTS = 'CONCEPTS';
const REFERENCES = 'REFERENCES';
const RELATIONS = 'RELATIONS';
const NONE = 'NONE';
const CATEGORIES = [ALL, CONCEPTS, REFERENCES, RELATIONS, NONE];

class DocumentView extends Component {
    static propTypes = {
        currentDocument: PropTypes.number.isRequired,
        documents: PropTypes.arrayOf(PropTypes.object).isRequired,
        sections: PropTypes.arrayOf(PropTypes.object).isRequired,
        annotations: PropTypes.objectOf(PropTypes.array).isRequired,
        fetchSectionsAndAnnotations: PropTypes.func.isRequired,
        selectDocument: PropTypes.func.isRequired,
        updateDocumentTitle: PropTypes.func.isRequired,
        addSection: PropTypes.func.isRequired,
        updateSection: PropTypes.func.isRequired,
        deleteSection: PropTypes.func.isRequired,
        updateAnnotations: PropTypes.func.isRequired,
        saveChanges: PropTypes.func.isRequired,
        discardChanges: PropTypes.func.isRequired,
        dirty: PropTypes.bool.isRequired,
        loading: PropTypes.bool.isRequired,
        saving: PropTypes.bool.isRequired,
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
            case NONE:
                nextState.checkedList = [];
                break;
            default:
                // Nothing needs to be done here.
                break;
        }

        nextState.tag = nextState.checkedList[0];
        this.setState(nextState)
    };

    componentDidMount() {
        const {selectDocument, match, fetchSectionsAndAnnotations} = this.props;

        selectDocument(match.params.documentId, fetchSectionsAndAnnotations);
    }

    updateDocumentTitle = title => {
        const {documents, currentDocument, updateDocumentTitle} = this.props;

        const documentIndex = documents.findIndex(theDocument => theDocument.id === currentDocument);

        if (documentIndex === -1) {
            return;
        }

        const document = {
            ...documents[documentIndex],
            title: title,
            date_edited: new Date().toISOString()
        };

        updateDocumentTitle(document);
    };

    render() {
        const {currentDocument, documents, sections, loading} = this.props;

        const documentIndex = documents.findIndex(theDocument => theDocument.id === currentDocument);
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
            const {annotations, updateAnnotations, updateSection, deleteSection} = this.props;
            const document = documents[documentIndex];

            return (
                <div>
                    {this.AnnotationsForm(currentDocument)}

                    <List
                        bordered
                        dataSource={sections}
                        header={
                            <Typography>
                                <Typography.Title editable={{onChange: this.updateDocumentTitle}}>
                                    {document.title}
                                </Typography.Title>
                            </Typography>
                        }
                        renderItem={item => (
                            this.Section(item,
                                updateSection, deleteSection,
                                tag, checkedList,
                                annotations, updateAnnotations)
                        )}
                        footer={
                            <Button onClick={this.props.addSection} type="dashed" style={{margin: '5px'}}>
                                <Icon type="plus"/> Add Section
                            </Button>
                        }
                    />
                </div>
            );
        } else {
            return NotFound();
        }
    }

    AnnotationsForm = () => {
        const formLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 20},
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
                        <Collapse accordion defaultActiveKey="1" bordered={false}>
                            <Collapse.Panel header="Annotation Controls" key="1" style={{borderBottom: 0}}>
                                <Form.Item label="View Annotation Types" {...formLayout}>
                                    <Radio.Group
                                        onChange={this.handleCategoryChange}
                                        defaultValue={ALL}
                                        value={this.state.category}
                                    >
                                        {categoryRadioButtons}
                                    </Radio.Group>
                                </Form.Item>
                                {this.state.category !== NONE ?
                                    (
                                        <Form.Item label="Select Annotation Type" {...formLayout}>
                                            <Radio.Group
                                                onChange={this.handleTagChange}
                                                defaultValue={A_PRIORI_CONCEPT}
                                                value={this.state.tag}>
                                                {annotationTypeRadioButtons}
                                            </Radio.Group>
                                        </Form.Item>
                                    ) : null
                                }
                            </Collapse.Panel>
                        </Collapse>
                        {this.props.dirty ?
                            <Form.Item>
                                <Row>
                                    <Col offset={4}>
                                        <Prompt
                                            message="You have unsaved changes which will be lost if you leave this page.
                                            Press 'Ok' if you are okay with this."
                                        />
                                        <Button
                                            onClick={this.props.saveChanges}
                                            loading={this.props.saving}
                                            type="primary"
                                            style={{marginRight: 10}}>
                                            Save Changes
                                        </Button>
                                        <Button
                                            onClick={this.props.discardChanges}
                                            disabled={this.props.saving}>
                                            Discard Changes
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                            : null}
                    </Form>
                </Card>
            </Affix>
        );
    };

    Section = (item, updateSection, deleteSection, tag, checkedList, annotations, updateAnnotations) => {
        return (
            <List.Item>
                <Typography style={{width: '100%'}}>
                    <Row>
                        <Col xs={{span: 24}} sm={{span: 16}} md={{span: 16}} lg={{span: 16}}>
                            <Typography.Title level={2}>
                                {item.title}
                            </Typography.Title>
                        </Col>
                        <Col xs={{span: 24}} sm={{offset: 4, span: 2}} md={{offset: 4, span: 2}}
                             lg={{offset: 6, span: 1}}>
                            <EditSectionDrawer section={item} updateSection={updateSection}/>
                        </Col>
                        <Col xs={{span: 24}} sm={{span: 2}} md={{span: 2}} lg={{span: 1}}>
                            <DeleteSectionModal section={item} deleteSection={deleteSection}/>
                        </Col>
                    </Row>
                    {
                        this.state.category !== NONE ? (
                            <Annotation
                                section={item}
                                tag={tag}
                                enabledTags={checkedList}
                                annotations={annotations[item.section_number]}
                                updateAnnotations={updateAnnotations}
                            />
                        ) : (
                            <Typography.Paragraph>
                                {item.text}
                            </Typography.Paragraph>
                        )
                    }
                </Typography>
            </List.Item>
        );
    }
}

export default withRouter(DocumentView);
