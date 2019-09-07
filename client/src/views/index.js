import React from 'react';
import {Link} from "react-router-dom";


import {Typography} from 'antd';

const Index = () => {
    return <Typography>
        <Typography.Paragraph>
            This web app is intended for creating annotations of documents for my COSC480 project,
            "Quantifying Conceptual Density in Text". Documents can be found <Link to="/documents">here</Link>.
        </Typography.Paragraph>
    </Typography>
};

export default Index;
