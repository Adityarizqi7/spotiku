import { NavLink } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";

import DotWave from "../loading/Dot";
import spotify, { getRefreshToken } from '@/api/spotify'
import ProgressiveImage from "react-progressive-graceful-image";
import { AlbumIcon, FavoriteIcon, HomeIcon, PlaylistIcon } from "../icon/IconList";
import { getFirstLetter } from "@/utils/Text";

export function BottomBar() {

    const [loading, setLoading] = useState(false)

    const [currentUser, setCurrentUser] = useState([])

    const getCurrentUser = useCallback( async () => {
        setLoading(true)
        await getRefreshToken(localStorage.getItem('client_refresh_token_spotify'))
        await spotify
            .get('me', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('client_token_spotify')}`,
                },
            })
            .then(res => {
                setLoading(false)
                res.status === 200 && 
                setCurrentUser(res?.data)
            })
            .catch(e => {
                setLoading(false)
                throw new Error(e)
            })
    }, [])

    useEffect(() => {
        getCurrentUser()
    }, [getCurrentUser])

    return (
        <section className="bottombar-component md:hidden block fixed bottom-0 bg-white border-t border-[#DBDBDB] w-full overflow-x-auto whitespace-nowrap">
            <ul className="bottombar-menu__wrapper flex items-center w-full 6xs:w-[25rem]">
                <li className="bottombar-menu__item-menu w-full">
                    <NavLink 
                        to={'/'}
                        end
                    >
                        {({ isActive }) => (
                            <div className={`${isActive && 'border-b-2 border-green-base'} text-slate-800 py-[1rem] flex justify-center`}>
                                <HomeIcon fill='#1F2937' />
                            </div>
                        )}
                    </NavLink>
                </li>
                <li className="bottombar-menu__item-menu w-full">
                    <NavLink 
                        to={'/recently-played'}
                        end
                    >
                        {({ isActive }) => (
                            <div className={`${isActive && 'border-b-2 border-green-base'} text-slate-800 py-[1rem] flex justify-center`}>
                                <PlaylistIcon fill='#f9004d' />
                            </div>
                        )}
                    </NavLink>
                </li>
                <li className="bottombar-menu__item-menu w-full">
                    <NavLink 
                        to={'/favorite-artists'}
                        end
                    >
                        {({ isActive }) => (
                            <div className={`${isActive && 'border-b-2 border-green-base'} text-slate-800 py-[1rem] flex justify-center`}>
                                <FavoriteIcon fill='#4154be' />
                            </div>
                        )}
                    </NavLink>
                </li>
                <li className="bottombar-menu__item-menu w-full">
                    <NavLink 
                        to={'/favorite-songs'}
                        end
                    >
                        {({ isActive }) => (
                            <div className={`${isActive && 'border-b-2 border-green-base'} text-slate-800 py-[1rem] flex justify-center`}>
                                <AlbumIcon fill='#1DB954' />
                            </div>
                        )}
                    </NavLink>
                </li>
                <li className="bottombar-menu__item-menu w-full">
                    <NavLink 
                        to={'/profile'}
                        end
                    >
                        {({ isActive }) => (
                            <div className={`text-slate-800 py-[1rem] flex justify-center`}>
                            {
                                loading ?
                                <DotWave /> :
                                currentUser?.images?.[1]?.url
                                ?
                                <ProgressiveImage src={currentUser?.images?.[1]?.url} placeholder={currentUser?.images?.[1]?.url}>
                                    {(src, loading) => {
                                        return (
                                            <div className={`relative overflow-hidden rounded-full ' + ${isActive && ' outline outline-1 outline-offset-2 outline-black'}`}>
                                                <img 
                                                    style={{
                                                        opacity:
                                                            loading
                                                                ? 0.5
                                                                : 1,
                                                    }}
                                                    className={"progressive-image object-cover cursor-pointer w-[30px] h-[30px]"} src={src} alt={currentUser?.display_name}
                                                />
                                                <noscript>
                                                    <img 
                                                        style={{
                                                            opacity:
                                                                loading
                                                                    ? 0.5
                                                                    : 1,
                                                        }}
                                                        className="progressive-image object-cover cursor-pointer hover:scale-[1.5] transition-transform w-[30px] h-[30px] no-script" src={src} alt={currentUser?.display_name} 
                                                    />
                                                </noscript>
                                            </div>
                                        );
                                    }}
                                </ProgressiveImage>
                                :
                                <div className='image-profile rounded-full w-[2rem] h-[2rem] text-slate-100 bg-slate-900 text-center flex flex-wrap items-center justify-center manrope'>
                                    <h1>
                                        {getFirstLetter(String(currentUser?.display_name))}
                                    </h1>
                                </div>
                            }
                            </div>
                        )}
                    </NavLink>
                </li>
            </ul>
        </section>
    )
}