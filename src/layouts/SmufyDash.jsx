import PropTypes from 'prop-types';
import { Helmet, HelmetProvider } from 'react-helmet-async'

import BtnToTop from '@/components/button/BtnToTop'


const SpotikuDash = ({
        title = 'Home - Explore and Discover Your Personal Spotify Statistics ',
        kw = 'spotiku home, spotiku beranda id, spotiku beranda indonesia',
        desc = 'Beranda - Halaman beranda untuk menampilkan highlight spotify mu',
        ogUrl,
        ogType,
        ogTitle,
        ogDesc,
        twitTitle,
        children
    }) => {
    
    return (
        <HelmetProvider>
            <Helmet prioritizeSeoTags>
                <title>{title}</title>

                <meta name='keywords' value={kw} />
                <meta name='description' value={desc} />
                <meta property='og:url' content={ogUrl} />
                <meta property='og:type' content={ogType} />
                <meta property='og:title' content={ogTitle} />
                <meta property='og:description' content={ogDesc} />
                <meta name='twitter:title' value={twitTitle} />
                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link
                    rel='preconnect'
                    href='https://fonts.gstatic.com'
                    crossOrigin
                />
                <link
                    href='https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
                    rel='stylesheet'
                />
                <link
                    href='https://api.fontshare.com/css?f[]=general-sans@200,201,300,301,400,401,500,501,600,601,700,701,1,2&display=swap'
                    rel='stylesheet'
                ></link>
                <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet"></link>
            </Helmet>

            {children}

            <BtnToTop 
                className='md:bottom-4 bottom-16'
            />
        </HelmetProvider>
    )
}

SpotikuDash.propTypes= {
    title: PropTypes.string.isRequired,
    kw: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    ogUrl: PropTypes.string,
    ogType: PropTypes.string,
    ogTitle: PropTypes.string,
    ogDesc: PropTypes.string,
    twitTitle: PropTypes.string,
    children: PropTypes.any,
}

export default SpotikuDash