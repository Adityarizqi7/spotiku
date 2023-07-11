import PropTypes from 'prop-types'
import ProgressiveImage from 'react-progressive-graceful-image';

import 'lightgallery/scss/lightgallery-bundle.scss'

import Tooltip from '../tooltip/Tooltip';
import { CrownIcon } from '../icon/IconList';
import LightImage from '../image/LightImage';
import { getFirstLetter, limitString } from '@/utils/Text';


export function AvatarProfilePremium({path, alt, textAbove, textBelow, name, className}) {
    return (
        <div className='flex items-center space-x-3 manrope'>
        {
            path ?
                <ProgressiveImage src={path} placeholder={path} >
                    {(src, loading) => {
                        return (
                            <div className='rounded-full overflow-hidden relative'>
                                <img 
                                    style={{
                                        opacity:
                                            loading
                                                ? 0.5
                                                : 1,
                                    }}
                                    className={"progressive-image object-cover cursor-pointer hover:scale-[1.5] transition-transform " + className} src={src} alt={alt}
                                />
                                <noscript>
                                    <img 
                                        style={{
                                            opacity:
                                                loading
                                                    ? 0.5
                                                    : 1,
                                        }}
                                        className="progressive-image no-script" src={src} alt={alt} 
                                    />
                                </noscript>
                            </div>
                        );
                    }}
                </ProgressiveImage>

            :
                <div className='image-profile rounded-full w-[2rem] h-[2rem] text-slate-100 bg-slate-900 text-center flex flex-wrap items-center justify-center'>
                    <h1>
                        {getFirstLetter(name)}
                    </h1>
                </div>
        }
            <div className='5xs:hidden'>
                <div className='font-semibold text-[16px] text-slate-800'>{textAbove}</div>
                <div className='font-normal text-[12px] text-slate-500 capitalize flex gap-1 mt-1'>
                    <span>{textBelow}</span> 
                    <span>•</span>
                    <CrownIcon /> 
                </div>
            </div>
        </div>
    )
}

export function AvatarProfileFree({path, alt, textAbove, textBelow, name, className}) {
    return (
        <div className='flex items-center space-x-3 manrope'>
        {
            path ?
                <ProgressiveImage src={path} placeholder={path} >
                    {(src, loading) => {
                        return (
                            <div className='overflow-hidden relative rounded-full'>
                                <img 
                                    style={{
                                        opacity:
                                            loading
                                                ? 0.5
                                                : 1,
                                    }}
                                    className={"progressive-image object-cover cursor-pointer hover:scale-[1.5] transition-transform " + className} src={src} alt={alt}
                                />
                                <noscript>
                                    <img 
                                        style={{
                                            opacity:
                                                loading
                                                    ? 0.5
                                                    : 1,
                                        }}
                                        className="progressive-image no-script" src={src} alt={alt} 
                                    />
                                </noscript>
                            </div>
                        );
                    }}
                </ProgressiveImage>
            :
                <div className='image-profile rounded-full w-[2rem] h-[2rem] text-slate-100 bg-slate-900 text-center flex flex-wrap items-center justify-center'>
                    <h1>
                        {getFirstLetter(name)}
                    </h1>
                </div>
        }
            <div className='3xs:hidden'>
                <div className='font-semibold text-[16px] text-slate-800'>{textAbove}</div>
                <div className='font-normal text-[12px] text-slate-500 capitalize flex gap-1 mt-1'>
                    <span>{textBelow}</span> 
                    <span>•</span>
                    <a href="https://www.spotify.com/id-id/premium/?ref=desktop_loggedin_upgrade_menu" target="_blank" rel="noopener noreferrer">
                        <CrownIcon firstColor='#CBD5E1' secondColor='#CBD5C6' /> 
                    </a>
                </div>
            </div>
        </div>
    )
}

export function AvatarTrack({path, alt, text, className, classWrapper}) {
    return (
        <div className={'flex items-center space-x-4 manrope ' + classWrapper}>
        {
            path ?
                <ProgressiveImage src={path} placeholder={path}>
                    {(src, loading) => {
                        return (
                            <div className='relative overflow-hidden rounded-[12px]'>
                                <img 
                                    style={{
                                        opacity:
                                            loading
                                                ? 0.5
                                                : 1,
                                    }}
                                    className={"progressive-image object-cover cursor-pointer hover:scale-[1.5] transition-transform " + className} src={src} alt={alt}
                                />
                                <noscript>
                                    <img 
                                        style={{
                                            opacity:
                                                loading
                                                    ? 0.5
                                                    : 1,
                                        }}
                                        className="progressive-image no-script" src={src} alt={alt} 
                                    />
                                </noscript>
                            </div>
                        );
                    }}
                </ProgressiveImage>
            :
                null
        }
            <h1 className='font-bold text-[16px] text-slate-800 line-clamp-1'>{text}</h1>
        </div>
    )
}

export function AvatarTrackSquare({path, alt, path_light, caption_light, textAbove, textBelow, link, className}) {
    return (
        <div className='manrope'>
        {
            path ?
                <LightImage
                    path={path_light}
                    caption={caption_light}
                >
                    <ProgressiveImage src={path} placeholder={path} >
                        {(src, loading) => {
                            return (
                                <div className='relative overflow-hidden rounded-[3px]'>
                                    <img 
                                        style={{
                                            opacity:
                                                loading
                                                    ? 0.5
                                                    : 1,
                                        }}
                                        className={"progressive-image object-cover cursor-pointer hover:scale-[1.5] transition-transform " + className} src={src} alt={alt}
                                    />
                                    <noscript>
                                        <img 
                                            style={{
                                                opacity:
                                                    loading
                                                        ? 0.5
                                                        : 1,
                                            }}
                                            className="progressive-image no-script" src={src} alt={alt} 
                                        />
                                    </noscript>
                                </div>
                            );
                        }}
                    </ProgressiveImage>
                </LightImage>
            :
                null //BG NULL Nantinya
        }
            <a href={link} target="_blank" rel="noopener noreferrer">
                <Tooltip
                    text={textAbove}
                >
                    <h1 className='font-semibold text-[16px] text-slate-800 hover:text-green-base mt-2 line-clamp-1'>{limitString(textAbove, 17)}</h1>
                </Tooltip>
            </a>
            <h2 className='font-medium text-[12px] text-slate-500 mt-1'>{textBelow}</h2>
        </div>
    )
}

AvatarProfilePremium.propTypes= {
    alt: PropTypes.string,
    path: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    textAbove: PropTypes.any,
    textBelow: PropTypes.any,
}

AvatarProfileFree.propTypes= {
    alt: PropTypes.string,
    path: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    textAbove: PropTypes.any,
    textBelow: PropTypes.any,
}

AvatarTrack.propTypes= {
    alt: PropTypes.string,
    path: PropTypes.string,
    className: PropTypes.string,
    classWrapper: PropTypes.string,
    text: PropTypes.any,
}

AvatarTrackSquare.propTypes= {
    alt: PropTypes.string,
    link: PropTypes.string,
    path: PropTypes.string,
    className: PropTypes.string,
    path_light: PropTypes.string,
    caption_light: PropTypes.string,
    textAbove: PropTypes.any,
    textBelow: PropTypes.any,
}