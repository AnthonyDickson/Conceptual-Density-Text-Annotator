import React from "react";
import {connect} from "react-redux";

const mapStateToProps = state => {
    return {documents: state.documents};
};

const ConnectedList = ({documents}) => (
    <ul className="list-group list-group-flush">
        {documents.map(el => (
            <li className="list-group-item" key={el.id}>
                {el.title}
            </li>
        ))}
    </ul>
);
const List = connect(mapStateToProps)(ConnectedList);

export default List;