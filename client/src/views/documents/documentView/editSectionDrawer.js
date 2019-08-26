import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Drawer, Form, Icon, Input, Tooltip} from "antd";

export class EditSectionDrawer extends Component {
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
                <Tooltip title="Edit">
                    <Button onClick={this.showDrawer}>
                        <Icon type="edit"/>
                    </Button>
                </Tooltip>
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