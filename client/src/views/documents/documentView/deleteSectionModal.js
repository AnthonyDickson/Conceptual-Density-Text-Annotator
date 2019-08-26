import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Icon, Modal, Tooltip, Typography} from "antd";

export class DeleteSectionModal extends Component {
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
                <Tooltip title="Delete">
                    <Button
                        key={`section-list-delete-${this.props.section.section_number}`}
                        onClick={() => this.showModal()}
                        type="danger"
                    >
                        <Icon type="delete"/>
                    </Button>
                </Tooltip>
                <Modal
                    title={<span><Icon type="delete"/> Delete Section</span>}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="Delete"
                    okType="danger"
                    cancelText="Cancel"
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