import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import {Layout, Modal, Typography} from 'antd';

import Breadcrumbs from "./components/breadcrumbs";
import Documents from "./components/documents";
import Index from "./components/index";
import NotFound from "./components/notFound";
import SideMenu from "./components/sideMenu";

import './App.css';

const {Sider, Header, Content} = Layout;

class App extends Component {

    state = {
        documents: [],
        loading: false
    };

    componentDidMount() {
        this.fetchDocuments()
    }

    fetchDocuments = () => {
        this.setState({loading: true});
        const url = '/api/documents/';

        fetch(url)
            .then(res => {
                if (res.status !== 200) throw Error(`${res.status}: ${res.statusText}`);

                return res.json();
            })
            .then(res => {
                this.setState({documents: res.documents});
            })
            .catch(err => {
                console.log(err);
                Modal.error({
                    title: 'Error: Could not load data!',
                    content: `Request to '${url}' failed. Reason: '${err.message}'.`,
                });
            }).finally(() => this.setState({loading: false}));
    };

    render() {
        return (
            <Layout>
                <Sider
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                    }}
                >
                    <div className="logo"/>
                    <SideMenu/>
                </Sider>

                <Layout style={{marginLeft: 200}}>
                    <Header style={{background: '#fff', padding: '24px 16px', minHeight: 120}}>
                        <Typography>
                            <Typography.Title>COSC480 Document Annotator</Typography.Title>
                            <Breadcrumbs/>
                        </Typography>
                    </Header>
                    <Content style={{margin: '24px 16px 0'}}>
                        <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                            <Switch>
                                <Route exact path="/" component={Index}/>
                                <Route path="/documents" render={() =>
                                    <Documents
                                        documents={this.state.documents}
                                        loading={this.state.loading}
                                        refresh={this.fetchDocuments}
                                    />}
                                />
                                <Route component={NotFound}/>
                            </Switch>
                        </div>
                    </Content>
                    {/*<Layout.Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Layout.Footer>*/}
                </Layout>
            </Layout>
        )
            ;
    }
}

export default App;
