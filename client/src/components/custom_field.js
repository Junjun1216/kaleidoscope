import React, {useState} from "react";
import PropTypes from 'prop-types';

const Custom_Field = ({id, locked, focused, value, error, label, onChange}) => {
    const [s_focused, setFocused] = useState((locked && focused) || false)
    const [s_value, setValue] = useState(value || '')
    const [s_error, setError] = useState(error || '')
    const [s_label, setLabel] = useState(label || '')


    return (
        <div className="field">

        </div>
    )
}

Custom_Field.propTypes = {
    id: PropTypes.string.isRequired,
    locked: PropTypes.string,
    focused: PropTypes.bool,
    value: PropTypes.string,
    error: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func
}

Custom_Field.defaultProps = {
    locked: false,
    focused: false,
    value: '',
    error: '',
    label: '',
    onChange: () => ''
}

export default Custom_Field;