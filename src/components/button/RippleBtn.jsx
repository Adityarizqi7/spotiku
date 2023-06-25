import { useState } from 'react';
import PropTypes from 'prop-types';

import '../../styles/components/button/_ripplebtn.scss';

const RippleBtn = ({children, className}) => {

	const [ripple, setRipple] = useState(null);

	const handleClick = (event) => {
		
		const { offsetX, offsetY } = event.nativeEvent;

		setRipple({ rippleX: offsetX, rippleY: offsetY });

		setTimeout(() => {
			setRipple(null);
		}, 600);
	};

	return (
		<div className={`ripple-button cursor-pointer ${className}`} onClick={handleClick}>
			{children}
			{ripple && (
			<span
				className="ripple-effect"
				style={{ top: ripple.rippleY, left: ripple.rippleX }}
			></span>
			)}
		</div>
	);
};

RippleBtn.propTypes= {
    children: PropTypes.any,
    className: PropTypes.string,
}

export default RippleBtn;