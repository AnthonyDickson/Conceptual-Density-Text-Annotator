import React, {Component} from "react";
import PropTypes from "prop-types";
import {TokenAnnotator} from "react-text-annotate";

export const A_PRIORI_CONCEPT = 'A PRIORI';
export const EMERGING_CONCEPT = 'EMERGING';
export const FORWARD_REFERENCE = 'FORWARD';
export const BACKWARD_REFERENCE = 'BACKWARD';

const TAG_COLORS = {
    EMERGING: '#00ea00',
    'A PRIORI': '#dddddd',
    FORWARD: '#84d2ff',
    BACKWARD: '#ed0000'
};

export class Annotation extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        tag: PropTypes.string.isRequired,
        enabledTags: PropTypes.arrayOf(PropTypes.string).isRequired,
    };

    state = {
        annotations: []
    };

    handleChange = annotations => {
        this.setState({annotations: annotations})
    };

    render() {
        const {enabledTags, tag, text} = this.props;
        const filteredAnnotations = this.state.annotations.filter(annotation => enabledTags.includes(annotation.tag));

        return (
            <div>
                <TokenAnnotator
                    style={{
                        lineHeight: 2.5,
                    }}
                    tokens={text.split(' ')}
                    value={filteredAnnotations}
                    onChange={this.handleChange}
                    getSpan={span => ({
                        ...span,
                        tag: tag,
                        color: TAG_COLORS[tag],
                    })}
                />
            </div>
        );
    }
}
