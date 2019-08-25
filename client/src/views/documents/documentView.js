import React, {Component} from "react";
import {Prompt, withRouter} from "react-router-dom";


import PropTypes from "prop-types";

import {
    Affix,
    Button,
    Card,
    Col,
    Collapse,
    Drawer,
    Form,
    Icon,
    Input,
    List,
    Modal,
    Radio,
    Row,
    Skeleton,
    Typography
} from "antd";
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

class DocumentView extends Component {
    static propTypes = {
        loading: PropTypes.bool.isRequired,
        currentDocument: PropTypes.number.isRequired,
        documents: PropTypes.arrayOf(PropTypes.object).isRequired,
        sections: PropTypes.arrayOf(PropTypes.object).isRequired,
        annotations: PropTypes.objectOf(PropTypes.array).isRequired,
        fetchSectionsAndAnnotations: PropTypes.func.isRequired,
        selectDocument: PropTypes.func.isRequired,
        addSection: PropTypes.func.isRequired,
        updateSection: PropTypes.func.isRequired,
        deleteSection: PropTypes.func.isRequired,
        updateAnnotations: PropTypes.func.isRequired,
        saveChanges: PropTypes.func.isRequired,
        discardChanges: PropTypes.func.isRequired,
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

    annotationsForm = () => {
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
                            <Collapse.Panel header="Tagging" key="1" style={{borderBottom: 0}}>
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
                                            type="primary"
                                            style={{marginRight: 10}}>
                                            Save Changes
                                        </Button>
                                        <Button onClick={this.props.discardChanges}>Discard Changes</Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                            : null}
                    </Form>
                </Card>
            </Affix>
        );
    };

    componentDidMount() {
        const {selectDocument, match, fetchSectionsAndAnnotations} = this.props;

        selectDocument(match.params.documentId, fetchSectionsAndAnnotations);
    }

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

            return (
                <div>
                    {this.annotationsForm(currentDocument)}

                    <List
                        bordered
                        dataSource={sections}
                        renderItem={item => (
                            <List.Item>
                                <Typography>
                                            <span style={{
                                                margin: '5px',
                                                position: "absolute",
                                                right: 5,
                                                display: "inline"
                                            }}>
                                                <EditSectionDrawer section={item} updateSection={updateSection}/>
                                                <DeleteSectionModal section={item} deleteSection={deleteSection}/>
                                            </span>
                                    <Typography.Title>
                                            {item.title}
                                    </Typography.Title>
                                    <Annotation
                                        section={item}
                                        tag={tag}
                                        enabledTags={checkedList}
                                        annotations={annotations[item.section_number]}
                                        updateAnnotations={updateAnnotations}
                                    />
                                </Typography>
                            </List.Item>
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
}

class EditSectionDrawer extends Component {
    static propTypes = {
        section: PropTypes.object.isRequired,
        updateSection: PropTypes.func.isRequired,
    };

    state = {
        title: this.props.section.title,
        text: this.props.section.text,
        visible: false,
        confirmLoading: false,
    };

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });

        const {title, text} = this.state;
        const section = Object.assign({}, this.props.section, {title: title, text: text});

        this.props.updateSection(section);

        this.setState({
            visible: false,
            confirmLoading: false,
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            title: this.props.section.title,
            text: this.props.section.text
        });
    };

    render() {
        return (
            <div>
                <Button onClick={this.showDrawer}>
                    <Icon type="edit"/> Edit
                </Button>
                <Drawer
                    title={<span><Icon type="edit"/> Edit Section</span>}
                    width={720}
                    onClose={this.handleCancel}
                    visible={this.state.visible}
                >
                    <Form layout="vertical" hideRequiredMark>
                        <Form.Item>
                            <Input
                                placeholder="Section Title"
                                onChange={e => this.setState({title: e.target.value})}
                                defaultValue={this.props.section.title}
                                autoFocus
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input.TextArea
                                placeholder="Section Text"
                                onChange={e => this.setState({text: e.target.value})}
                                defaultValue={this.props.section.text}
                                autosize={{minRows: 6, maxRows: 24}}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={this.handleCancel} style={{marginRight: 5}}>Cancel</Button>
                            <Button onClick={this.handleOk} type="primary">Ok</Button>
                        </Form.Item>
                    </Form>
                </Drawer>
            </div>
        );
    }
}

class DeleteSectionModal extends Component {
    static propTypes = {
        section: PropTypes.object.isRequired,
        deleteSection: PropTypes.func.isRequired,
    };

    state = {
        visible: false,
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
        this.props.deleteSection(this.props.section);

        this.setState({visible: false})
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const {visible} = this.state;

        return (
            <div>
                <Button
                    key={`section-list-delete-${this.props.section.section_number}`}
                    onClick={() => this.showModal()}
                    type="danger"
                >
                    <Icon type="delete"/> Delete
                </Button>
                <Modal
                    title={<span><Icon type="delete"/> Delete Section</span>}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="Yes"
                    okType="danger"
                    cancelText="No"
                    destroyOnClose={true}
                >
                    <Typography.Paragraph>
                        Are you sure you want to delete this section?
                    </Typography.Paragraph>
                </Modal>
            </div>
        );
    }
}

export default withRouter(DocumentView);
