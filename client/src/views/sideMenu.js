import {Icon, Menu} from 'antd';
import React from 'react';
import {Link, withRouter} from 'react-router-dom';

const SideMenu = ({location}) => {
    return (
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['/']}
            selectedKeys={[`/${location.pathname.split('/')[1]}`]}
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
    )
};

export default withRouter(SideMenu);
