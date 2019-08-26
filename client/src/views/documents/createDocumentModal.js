import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Form, Icon, Input, message, Modal} from "antd";

export class CreateDocumentModal extends Component {
    static propTypes = {
        createDocument: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
    };

    state = {
        title: '',
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

        const document = {title: this.state.title};

        this.props.createDocument(document, (requestOk) => {
            if (requestOk) {
                message.success('Document Created');
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
            title: ''
        });
    };

    onChange = e => {
        this.setState({title: e.target.value})
    };

    render() {
        const {visible, confirmLoading, modalText} = this.state;
        const loading = this.props.loading;

        return (
            <span>
                <Button onClick={this.showModal} disabled={loading} type="dashed" style={{margin: '5px 0'}}>
                    <Icon type="plus"/> Create Document
                </Button>
                <Modal
                    title={<span><Icon type="form"/> Creating Document</span>}
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
                                defaultValue={modalText}
                                autoFocus
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </span>
        );
    }
}