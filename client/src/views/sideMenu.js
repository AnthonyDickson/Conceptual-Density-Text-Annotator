import {Icon, Layout, Menu} from 'antd';
import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import PropTypes from "prop-types";

const defaultStyle = {
    height: '100vh',
    position: 'fixed',
    left: 0,
    zIndex: 999
};

class SideMenu extends Component {
    static propTypes = {
        sideMenuCollapsed: PropTypes.bool.isRequired,
        onCollapse: PropTypes.func.isRequired,
    };

    state = {
        style: {...defaultStyle}
    };

    render() {
        let style;

        if (this.props.sideMenuCollapsed) {
            style = {
                ...defaultStyle,
                overflow: 'initial',
                zIndex: 999
            };
        } else {
            style = {...defaultStyle};
        }

        return (
            <Layout.Sider
                collapsedWidth="0"
                collapsible={true}
                defaultCollapsed={true}
                style={style}
                onCollapse={(collapsed) => this.props.onCollapse(collapsed)}
            >
                <div className="logo"/>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['/']}
                    selectedKeys={[`/${this.props.location.pathname.split('/')[1]}`]}
                >
                    <Menu.Item key="/">
                        <Icon type="home"/>
                        <span className="nav-text">Home</span>
                        <Link to="/"/>
                    </Menu.Item>
                    <Menu.Item key="/documents">
                        <Icon type="file"/>
                        <span className="nav-text">Documents</span>
                        <Link to="/documents"/>
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
        );
    }
}

export default withRouter(SideMenu);
