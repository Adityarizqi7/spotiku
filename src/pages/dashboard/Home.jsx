import Carousel from 'nuka-carousel'
import { Link, NavLink } from 'react-router-dom'
import { useState, useCallback, useEffect } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

import '../../styles/pages/dashboard/_home.scss'

import { dayConvert } from '@/utils/Time'
import DashboardLayout from './DashboardLayout'
import Tooltip from '@/components/tooltip/Tooltip'
import RippleBtn from '@/components/button/RippleBtn'
import LightImage from '@/components/image/LightImage'
import spotify, {getRefreshToken} from '@/api/spotify'
import HeadPrimary from '@/components/heading/HeadPrimary'
import { convertMiliToMinute, limitString } from '@/utils/Text'
import { AlbumIcon, ClockIcon } from '@/components/icon/IconList'
import { AvatarTrack, AvatarTrackSquare } from '@/components/profile/Avatar'
import { SkeletonRectangle, SkeletonSquare } from '@/components/loading/Skeleton'

const Home = () => {

    const [loading, setLoading] = useState(false)

    const [newRelease, setNewRelease] = useState([])
    const [recentlyPlayed, setRecentlyPlayed] = useState([])
    const [topGlobalTrack, setTopGlobalTrack] = useState([])

    const genres = [
        {
            id: 1,
            name: 'Chill',
            link: 'https://open.spotify.com/genre/0JQ5DAqbMKFFzDl7qN9Apr'
        },
        {
            id: 2,
            name: 'Pop',
            link: 'https://open.spotify.com/genre/0JQ5DAqbMKFEC4WFtoNRpw'
        },
        {
            id: 3,
            name: 'Travel',
            link: 'https://open.spotify.com/genre/0JQ5DAqbMKFAQy4HL4XU2D'
        },
        {
            id: 4,
            name: 'Workout',
            link: 'https://open.spotify.com/genre/0JQ5DAqbMKFAXlCG6QvYQ4'
        },
        {
            id: 5,
            name: 'Dance',
            link: 'https://open.spotify.com/genre/0JQ5DAqbMKFHOzuVTgTizF'
        },
    ]

    const getTopGlobalTrack = useCallback( async () => {
        setLoading(true)
        await getRefreshToken(localStorage.getItem('client_refresh_token_spotify'))
        await spotify
            .get('playlists/37i9dQZEVXbMDoHDwVN2tF', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('client_token_spotify')}`,
                },
            })
            .then(res => {
                setLoading(false)
                res.status === 200 && 
                setTopGlobalTrack(res.data)
            })
            .catch(e => {
                setLoading(false)
                throw new Error(e)
            })
    }, [])

    const getNewRelease = useCallback( async () => {
        setLoading(true)
        await getRefreshToken(localStorage.getItem('client_refresh_token_spotify'))
        await spotify
            .get('browse/new-releases', {
                params: {
                    country: 'US'
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('client_token_spotify')}`,
                },
            })
            .then(res => {
                setLoading(false)
                res.status === 200 && 
                setNewRelease(res.data)
            })
            .catch(e => {
                setLoading(false)
                throw new Error(e)
            })
    }, [])

    const getRecentlyPlayed = useCallback( async () => {
        setLoading(true)
        await getRefreshToken(localStorage.getItem('client_refresh_token_spotify'))
        await spotify
            .get('me/player/recently-played', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('client_token_spotify')}`,
                },
            })
            .then(res => {
                setLoading(false)
                res.status === 200 && 
                setRecentlyPlayed(res.data)
            })
            .catch(e => {
                setLoading(false)
                throw new Error(e)
            })
    }, [])

    useEffect(() => {
        getNewRelease()
        getRecentlyPlayed()
        getTopGlobalTrack()
    }, [getTopGlobalTrack, getNewRelease, getRecentlyPlayed])

    return (
        <DashboardLayout
            title = 'Smufy — Explore and Discover Your Personal Spotify Statistics'
            kw = 'smufy home, smufy beranda id, smufy beranda indonesia'
            desc = 'Home | Halaman beranda untuk menampilkan highlight spotify mu'
            page_name='Home'
        >
            <section className={`home-component`}>
                <div className="greeting">
                    <HeadPrimary title={dayConvert()} classHeading={'manrope text-[30px] font-bold 7xs:text-[15vw]'} />
                </div>
                <div className="genre-recom mt-4">
                    <div className="genre-wrapper flex flex-wrap items-center gap-4">
                    {
                        genres?.map((ele, idx) => {
                            return (
                                <a key={idx+1} href={ele?.link} target="_blank" rel="noopener noreferrer" className='genre__box bg-slate-200/90 hover:bg-slate-300/80 px-4 py-2 rounded-[8px]'>
                                    <h1 className='manrope text-semibold text-slate-800 text-[14px]'>{ele?.name}</h1>
                                </a>
                            )
                        })
                    }
                    </div>
                </div>
                <div className="new-release-track mt-10">
                    <HeadPrimary 
                        title='New Release'
                        classHeading='font-bold text-slate-900 manrope text-[20px]'
                    />
                    {
                        loading ?
                            <SkeletonSquare className='mt-6' />
                        :
                        <Carousel
                            dragging={true}
                            cellSpacing={25}
                            slideWidth={'171px'}
                            slidesToShow={6.5}
                            withoutControls={true}
                            className='mt-6 cursor-grab'
                        >
                        {
                            newRelease?.albums?.items?.slice(0, 15)?.map((ele, idx) => (
                                <div key={idx + 1} className="new-release__box-item manrope cursor-grab">
                                    <AvatarTrackSquare
                                        alt={ele?.name}
                                        textAbove={ele?.name}
                                        path={ele?.images?.[1]?.url}
                                        path_light={ele?.images?.[1]?.url}
                                        className='w-[300px] aspect-137'
                                        link={ele?.external_urls?.spotify}
                                        textBelow={ele?.artists?.[0]?.name}
                                        caption_light={`<h4 style='font-family: manrope;'>${ele?.name} from ${ele?.artists?.[0]?.name} - Smufy</h4>`}
                                    />
                                </div>
                            ))                           
                        }
                        </Carousel>
                    }
                </div>
                <div className="popular-global-track mt-10">
                    <HeadPrimary 
                        title='Popular Tracks'
                        classHeading='font-bold text-slate-900 manrope text-[20px]'
                    />
                    {
                        loading ?
                        <div className='skeleton-wrapper space-y-3'>
                            <SkeletonRectangle className='mt-6' />
                            <SkeletonRectangle />
                        </div>
                        :
                        topGlobalTrack?.tracks?.items?.length > 0 &&
                        <div className="popular-global-track__wrapper-box flex flex-col gap-y-4 mt-6">
                        {
                            topGlobalTrack?.tracks?.items?.slice(0, 5)?.map((ele, idx) => {
                                return (
                                    <div key={idx+1} className="popular-global-track__box-item manrope flex items-center w-full gap-x-8">
                                        <h1 className='nomor-track font-bold leading-normal text-center text-slate-800 7xs:hidden'>{idx+1}</h1>
                                        <div className="detail-track border-b border-[#d6d6d6c2] grid grid-cols-6 xxs:grid-cols-2 4xs:grid-cols-2 2xs:flex 2xs:items-center 2xs:justify-between 8xs:flex-col 8xs:justify-start w-full pb-4">
                                            <div className="name-image col-span-2 xxs:col-span-1">
                                                <LightImage
                                                    path={ele?.track?.album?.images?.[0]?.url}
                                                    caption={`<h4 style='font-family: manrope;'>${ele?.track?.name} from ${ele?.track?.artists?.[0]?.name} - Smufy</h4>`}
                                                >
                                                    <AvatarTrack 
                                                        className='w-[54px] h-[54px]'
                                                        path={ele?.track?.album?.images?.[2]?.url}
                                                        text={limitString(ele?.track?.name, 20)}
                                                        classWrapper='5xs:flex-col 5xs:items-start 5xs:space-x-0 5xs:space-y-2'
                                                    />
                                                </LightImage>
                                            </div>
                                            <div className="record grid grid-cols-3 place-content-center col-span-3 xxs:hidden w-full">
                                                <div className="record__artist xxs:hidden">
                                                    <Tooltip text={'artist'}>
                                                        <h1 className='line-clamp-1 hover:cursor-default'>
                                                            {limitString(ele?.track?.artists?.[0]?.name, 15)}
                                                        </h1>
                                                    </Tooltip>
                                                </div>
                                                <div className="record__album xxs:hidden">
                                                    <Tooltip text={'album'}>
                                                        <div className='flex items-center gap-2'>
                                                            <AlbumIcon fill='#9d9e9e' className='flex-1' />
                                                            <h1 className='hover:cursor-default line-clamp-1'>
                                                                {limitString(ele?.track?.album?.name, 15)}
                                                            </h1>
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                                <div className="record__time place-self-end">
                                                    <Tooltip text='duration'>
                                                        <div className='flex items-center gap-2 place-self-center'>
                                                            <ClockIcon fill='#9d9e9e' />
                                                            <h1 className='line-clamp-1 hover:cursor-default'>{convertMiliToMinute(ele?.track?.duration_ms)}</h1>
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            <div className="open_spotify flex py-4 4xs:py-0 justify-end gap-4 8xs:mt-2">
                                                <div className="record__time 4xs:!hidden hidden xxs:block">
                                                    <Tooltip text='duration'>
                                                        <div className='flex items-center gap-2'>
                                                            <ClockIcon fill='#9d9e9e' />
                                                            <h1 className='line-clamp-1 hover:cursor-default'>{convertMiliToMinute(ele?.track?.duration_ms)}</h1>
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                                <a href={ele?.track?.external_urls?.spotify} target="_blank" rel="noopener noreferrer">
                                                    <Tooltip text='open spotify'>
                                                        <PaperAirplaneIcon className='w-5 h-5 rotate-[325deg] hover:rotate-[685deg] transition-all duration-500' />
                                                    </Tooltip>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </div>
                    }
                </div>
                <div className="recently-played-track mt-10">
                    <div className='flex 5xs:block justify-between items-center'>
                        <HeadPrimary 
                            title='Recently Played'
                            classHeading='font-bold text-slate-900 manrope text-[20px]'
                        />
                        <Link to={'/recently-played'}>
                            <h2 className='manrope hover:text-green-base 5xs:hidden'>See all</h2>
                        </Link>
                    </div>
                    {
                        loading ?
                            <SkeletonSquare className='mt-6' />
                        :
                        recentlyPlayed?.items?.length < 1
                        ?
                            <h1 className='manrope font medium mt-4'>You haven&apos;t played any tracks recently.</h1>
                        :
                            <div className='grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 6xs:grid-cols-1 gap-y-7 gap-x-8 6xs:gap-x-0 mt-6'>
                            {
                                recentlyPlayed?.items?.slice(0, 10)?.map((ele, idx) => (
                                    <div key={idx + 1} className="recently-played__box-item manrope">
                                        <AvatarTrackSquare
                                            alt={ele?.track?.name}
                                            textAbove={ele?.track?.name}
                                            className='w-[300px] aspect-137'
                                            link={ele?.track?.external_urls?.spotify}
                                            textBelow={ele?.track?.artists?.[0]?.name}
                                            path={ele?.track?.album?.images?.[1]?.url}
                                            path_light={ele?.track?.album?.images?.[1]?.url}
                                            caption_light={`<h4 style='font-family: manrope;'>${ele?.track?.name} from ${ele?.track?.artists?.[0]?.name} - Smufy</h4>`}
                                        />
                                    </div>
                                ))                           
                            }
                            </div>
                    }
                    <NavLink to={'/recently-played'}>
                        <RippleBtn
                            className='more-button 5xs:block hidden mt-5 manrope text-center bg-slate-800/90 p-[10px] rounded-[5px] focus:outline-none hover:bg-slate-900 transition-colors'
                        >
                            <h3>See all</h3>
                        </RippleBtn>
                    </NavLink>
                </div>
            </section>
        </DashboardLayout>
    )
}

export default Home