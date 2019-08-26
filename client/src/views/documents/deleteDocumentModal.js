import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Icon, message, Modal, Tooltip, Typography} from "antd";

export class DeleteDocumentModal extends Component {
    static propTypes = {
        document: PropTypes.object.isRequired,
        deleteDocument: PropTypes.func.isRequired,
        sideMenuCollapsed: PropTypes.bool.isRequired,
    };

    state = {
        visible: false,
        confirmLoading: false,
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
        this.setState({
            confirmLoading: true,
        });

        this.props.deleteDocument(this.props.document, (requestOk) => {
            if (requestOk) {
                message.success('Document Deleted')
            }
            // TODO: Fix error that sometimes happens when deleting documents.
            this.setState({
                confirmLoading: false,
                visible: false
            });
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const {visible, confirmLoading} = this.state;

        return (
            <>
                <Tooltip title="Delete">
                    <Button
                        key={`document-list-delete-${this.props.document.id}`}
                        onClick={() => this.showModal()}
                        type="danger"
                    >
                        <Icon type="delete"/>
                    </Button>
                </Tooltip>
                <Modal
                    title={<span><Icon type="delete"/> Delete Document</span>}
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    okText="Delete"
                    okType="danger"
                    cancelText="Cancel"
                    destroyOnClose={true}
                >
                    <Typography.Paragraph>
                        Are you sure you want to delete this document? This action cannot be undone.
                    </Typography.Paragraph>
                </Modal>
            </>
        );
    }
}