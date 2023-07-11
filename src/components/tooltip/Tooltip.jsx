import PropTypes from 'prop-types';
import { useState } from 'react';

import '../../styles/components/tooltip/_tooltip.scss'

const Tooltip = ({ text, children }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    return (
        <div className="tooltip-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {children}
            {showTooltip && <div className="tooltip">{text}</div>}
            <div className="arrow"></div>
        </div>
    )
}

Tooltip.propTypes= {
    text: PropTypes.string.isRequired,
    children: PropTypes.any,
}

export default Tooltip;
