import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Form, Icon, Input, message, Modal} from "antd";

export class EditDocumentModal extends Component {
    static propTypes = {
        document: PropTypes.object.isRequired,
        updateDocument: PropTypes.func.isRequired,
        sideMenuCollapsed: PropTypes.bool.isRequired,
    };

    state = {
        text: this.props.document.title,
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

        const document = Object.assign({}, this.props.document, {title: this.state.text});
        this.props.updateDocument(document, (requestOk) => {
            if (requestOk) {
                message.success('Document Title Updated')
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
            text: this.props.document.title
        });
    };

    onChange = e => {
        this.setState({text: e.target.value})
    };

    render() {
        const {visible, confirmLoading} = this.state;

        return (
            <div>
                <Button
                    key="document-list-edit"
                    onClick={() => this.showModal()}
                    type="default"
                >
                    <Icon type="edit"/> {this.props.sideMenuCollapsed ? '' : 'Edit Title'}
                </Button>
                <Modal
                    title={<span><Icon type="edit"/> Editing Document Title</span>}
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
                                defaultValue={this.props.document.title}
                                autoFocus
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}