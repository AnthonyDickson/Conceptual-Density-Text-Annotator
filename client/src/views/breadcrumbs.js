import {Breadcrumb} from 'antd';
import React from 'react';
import {Link, withRouter} from 'react-router-dom';

const Breadcrumbs = ({location}) => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;

        return (
            <Breadcrumb.Item key={url}>
                <Link to={url} style={{textTransform: 'capitalize'}}>{pathSnippets[index]}</Link>
            </Breadcrumb.Item>
        );
    });

    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            <Link to="/">Home</Link>
        </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems);

    return <Breadcrumb>{breadcrumbItems}</Breadcrumb>
};

export default withRouter(Breadcrumbs);