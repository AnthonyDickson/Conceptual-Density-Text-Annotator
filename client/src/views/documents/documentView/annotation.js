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
        section: PropTypes.object.isRequired,
        annotations: PropTypes.arrayOf(PropTypes.object).isRequired,
        updateAnnotations: PropTypes.func.isRequired,
        tag: PropTypes.string.isRequired,
        enabledTags: PropTypes.arrayOf(PropTypes.string).isRequired,
    };

    state = {
        filteredAnnotations: []
    };

    handleChange = annotations => {
        const {section, updateAnnotations} = this.props;

        const allAnnotations = annotations.concat(
            this.props.annotations.filter(annotation => !this.props.enabledTags.includes(annotation.tag))
        );

        updateAnnotations(section, allAnnotations);
    };

    render() {
        const {tag, section} = this.props;
        const {enabledTags, annotations} = this.props;
        const filteredAnnotations = annotations.filter(annotation => enabledTags.includes(annotation.tag));

        return (
            <div>
                <TokenAnnotator
                    style={{
                        lineHeight: 1.5,
                    }}
                    tokens={section.text.split(/[\s\n\t]/)}
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
