import React, {Component} from "react";
import PropTypes from "prop-types";
import {TokenAnnotator} from "react-text-annotate";

export const A_PRIORI_CONCEPT = 'A PRIORI';
export const EMERGING_CONCEPT = 'EMERGING';
export const FORWARD_REFERENCE = 'FORWARD';
export const BACKWARD_REFERENCE = 'BACKWARD';
export const ENTITY = 'ENTITY';
export const RELATION = 'RELATION';

export const TAG_COLOURS = {
    EMERGING: '#00ea00',
    'A PRIORI': '#dddddd',
    FORWARD: '#84d2ff',
    BACKWARD: '#ed0000',
    ENTITY: '#fff980',
    RELATION: '#e5a0ed',
};

export class Annotation extends Component {
    static propTypes = {
        annotations: PropTypes.arrayOf(PropTypes.object).isRequired,
        updateAnnotations: PropTypes.func.isRequired,
        sectionId: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        tag: PropTypes.string.isRequired,
        enabledTags: PropTypes.arrayOf(PropTypes.string).isRequired,
    };

    state = {
        filteredAnnotations: []
    };

    handleChange = annotations => {
        const {sectionId, updateAnnotations} = this.props;
        updateAnnotations(sectionId, annotations);
    };

    render() {
        const {tag, text} = this.props;
        const {enabledTags, annotations} = this.props;
        const filteredAnnotations = annotations.filter(annotation => enabledTags.includes(annotation.tag));

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
                        color: TAG_COLOURS[tag],
                    })}
                />
            </div>
        );
    }
}
