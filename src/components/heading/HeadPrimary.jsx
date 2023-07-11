import PropTypes from 'prop-types';

const HeadPrimary = ({ classFunc, classHeading, title, children }) => {
    return (
        <h1 className={`${classFunc} ${classHeading}`}>
            {title || children}
        </h1>
    )
}

HeadPrimary.propTypes= {
    title: PropTypes.string.isRequired,
    children: PropTypes.any,
    classFunc: PropTypes.string,
    classHeading: PropTypes.string,
}

export default HeadPrimary