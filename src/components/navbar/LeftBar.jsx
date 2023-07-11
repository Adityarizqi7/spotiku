import { NavLink } from "react-router-dom";
import { AlbumIcon, FavoriteIcon, HomeIcon, PlaylistIcon } from "../icon/IconList";

export default function LeftBar() {
    return (
        <section className="side-leftbar-component bg-slate-50 md:inline hidden basis-[20%] h-screen">
            <div className="leftbar__title py-8">
                <h1 className='text-slate-800 font-semibold text-[1.5rem] pl-9 montserrat'>S</h1>
            </div>
            <div className="leftbar__menu-list">
                <ul className='menu-list__wrapper manrope'>
                    <li className='menu-list__item-menu'>
                        <NavLink 
                            to={'/'}
                            end
                        >
                            {({ isActive }) => (
                                <div className={`${isActive && 'bg-gradient-to-r from-white via-white to-slate-100 after:content[attr(after)] after:rounded-l-[3px] after:bg-[#1DB954] after:w-[7px] after:absolute after:right-0 after:h-full hover:to-white hover:after:w-[3px]'} relative flex items-center gap-3 pl-9 pr-2 py-4 text-slate-800 hover:bg-white transition-colors`}>
                                    <HomeIcon fill='#1F2937' />
                                    <h2>Home</h2>
                                </div>
                            )}
                        </NavLink>
                    </li>
                    <li className='menu-list__item-menu'>
                        <NavLink 
                            to={'/recently-played'}
                            end
                        >
                            {({ isActive }) => (
                                <div className={`${isActive && 'bg-gradient-to-r from-white via-white to-slate-100 after:content[attr(after)] after:rounded-l-[3px] after:bg-[#1DB954] after:w-[7px] after:absolute after:right-0 after:h-full hover:to-white hover:after:w-[3px]'} relative flex items-center gap-3 pl-9 pr-2 py-4 text-slate-800 hover:bg-white transition-colors`}>
                                    <PlaylistIcon fill='#f9004d' />
                                    <h2>Recently Played</h2>
                                </div>
                            )}
                        </NavLink>
                    </li>
                    <li className='menu-list__item-menu'>
                        <NavLink 
                            to={'/favorite-artists'}
                            end
                        >
                            {({ isActive }) => (
                                <div className={`${isActive && 'bg-gradient-to-r from-white via-white to-slate-100 after:content[attr(after)] after:rounded-l-[3px] after:bg-[#1DB954] after:w-[7px] after:absolute after:right-0 after:h-full hover:to-white hover:after:w-[3px]'} relative flex items-center gap-3 pl-9 pr-2 py-4 text-slate-800 hover:bg-white transition-colors`}>
                                    <FavoriteIcon fill='#4154be' />
                                    <h2>Favorite Artists</h2>
                                </div>
                            )}
                        </NavLink>
                    </li>
                    <li className='menu-list__item-menu'>
                        <NavLink 
                            to={'/favorite-songs'}
                            end
                        >
                            {({ isActive }) => (
                                <div className={`${isActive && 'bg-gradient-to-r from-white via-white to-slate-100 after:content[attr(after)] after:rounded-l-[3px] after:bg-[#1DB954] after:w-[7px] after:absolute after:right-0 after:h-full hover:to-white hover:after:w-[3px]'} relative flex items-center gap-3 pl-9 pr-2 py-4 text-slate-800 hover:bg-white transition-colors`}>
                                    <AlbumIcon fill='#1DB954' />
                                    <h2>Favorite Songs</h2>
                                </div>
                            )}
                        </NavLink>
                    </li>
                </ul>
            </div>
        </section>
    )
}