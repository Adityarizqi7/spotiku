import PropTypes from 'prop-types';
import LightGallery from 'lightgallery/react'
import lgZoom from 'lightgallery/plugins/zoom'
import lgFullscreen from 'lightgallery/plugins/fullscreen'

export default function LightImage({ path, caption, children }) {
    return (
        <LightGallery
            speed={500}
            mode='lg-fade'
            licenseKey='56549465-4A3149A7-990E00EB-B1C3BEB1'
            plugins={[lgZoom, lgFullscreen]}
        >
            <div
                data-src={`${
                    path
                }`}
                data-sub-html={caption}
            >
                {children}
            </div>
        </LightGallery>
    )
}

LightImage.propTypes= {
    caption: PropTypes.string,
    path: PropTypes.string,
    children: PropTypes.any,
}