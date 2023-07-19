import spotify, { getRefreshToken } from '@/api/spotify'
import { useEffect, useState, useCallback  } from 'react'

import '../../styles/pages/dashboard/_profile.scss'

import { countryList } from '@/utils/Text'
import DotWave from '@/components/loading/Dot'
import DashboardLayout from './DashboardLayout'
import HeadPrimary from '@/components/heading/HeadPrimary'
import { Card, Flex, Grid, Metric, Text } from '@tremor/react'
import { BubbleIcon, PeopleIcon, PlaylistIcon, SpotifyIcon } from '@/components/icon/IconList'
import { AvatarTrackSquareWithPlay } from '@/components/profile/Avatar'
import RippleBtn from '@/components/button/RippleBtn'


const Profile = () => {

    const [loading, setLoading] = useState(false)

    const [savedAlbum, setSavedAlbum] = useState([])
    const [currentUser, setCurrentUser] = useState([])
    const [playlistMaded, setPlaylistMaded] = useState([])
    const [playlistBlend, setPlaylistBlend] = useState([])

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

    const getPlaylistMaded = useCallback( async () => {
        setLoading(true)
        await getRefreshToken(localStorage.getItem('client_refresh_token_spotify'))
        await spotify
            .get('me/playlists', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('client_token_spotify')}`,
                },
                params: {
                    offset: 0
                }
            })
            .then(res => {
                setLoading(false)
                if(res.status === 200) {
                    setPlaylistMaded(
                        res.data.items.filter((playlist) => playlist.owner.id === currentUser?.id)
                    );
                    setPlaylistBlend(
                        res.data.items.filter(
                            playlist => playlist.owner.id !== currentUser?.id && playlist?.description.includes('blend')
                        )
                    )
                }
            })
            .catch(e => {
                setLoading(false)
                throw new Error(e)
            })
    }, [currentUser?.id])

    const getSavedAlbum = useCallback( async () => {
        setLoading(true)
        await getRefreshToken(localStorage.getItem('client_refresh_token_spotify'))
        await spotify
            .get('me/albums', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('client_token_spotify')}`,
                },
                params: {
                    offset: 0
                }
            })
            .then(res => {
                setLoading(false)
                if(res.status === 200) {
                    setSavedAlbum(res.data.items)
                }
            })
            .catch(e => {
                setLoading(false)
                throw new Error(e)
            })
    }, [])

    const handleSignoutSmufy = () => {
        const itemsToRemove = [
          'client_code_spotify',
          'client_token_spotify',
          'client_refresh_token_spotify',
        ];
      
        itemsToRemove.forEach((item) => {
          window.localStorage.removeItem(item);
        });
      
        window.location.reload();
    };

    useEffect(() => {
        getCurrentUser()
        getPlaylistMaded()
        getSavedAlbum()
    }, [getCurrentUser, getPlaylistMaded, getSavedAlbum])

    return (
        <DashboardLayout
            title = 'Profile - Smufy'
            kw = 'smufy profile, smufy profil id, smufy profil indonesia'
            desc = 'Profile | Halaman untuk menampilkan profil dari Akun Spotify mu'
            page_name='Profile'
        >
            <section className={`profile-component pb-[8rem]`}>
                <div className="profile__header">
                    <div className="header__name-isSubscribe manrope">
                        <HeadPrimary 
                            title={`Hello, ${
                                    loading ?
                                        'loading'
                                    :
                                        currentUser?.display_name !== null ? currentUser?.display_name + '!' : 'Smufy User!'
                                }`
                            } 
                            classHeading='text-[1.75rem] text-slate-800 font-bold' 
                        />
                    </div>
                    <div className="header__email-country manrope">
                        <h3 className='text-slate-500 mt-1'>Discover your Spotify statistics with Smufy.</h3>
                        {
                            loading ?
                                <div className="mt-6">
                                    <DotWave /> 
                                </div>
                            :
                                <h3 className='mt-6 flex 4xs:flex-col truncate 4xs:items-start items-center 4xs:space-x-0 space-x-2 text-slate-800'>
                                    <span>{currentUser?.email ? currentUser?.email : 'email'}</span>
                                    <span>•</span>
                                    <span>{countryList(String(currentUser?.country))}</span>
                                </h3>
                        }
                    </div>
                </div>
                <div className="profile_highlight">
                    <Grid numItemsMd={2} numItemsLg={3} className="gap-6 place-content-between mt-5">
                        <Card className="box manrope space-y-2 px-5 py-3 rounded-[3px]">
                            <Flex justifyContent="between" className="space-x-4">
                                <div className="truncate space-y-2">
                                    <Metric>
                                    {
                                        loading ? '0' :
                                        currentUser?.followers?.total !== null ? currentUser?.followers?.total : '-'
                                    }
                                    </Metric>
                                    <Text>Followers</Text>
                                </div>
                                <div className='5xs:hidden'>
                                    <PeopleIcon fill='#FFAA29' size='33' />
                                </div>
                            </Flex>
                        </Card>
                        <Card className="box manrope space-y-2 px-5 py-3 rounded-[3px]">
                            <Flex justifyContent="between" className="space-x-4">
                                <div className="truncate space-y-2">
                                    <Metric>{loading ? '0' : playlistMaded?.length < 0 || playlistMaded === null || playlistMaded === undefined ? '-' : playlistMaded?.length}</Metric>
                                    <Text>Playlists you have created</Text>
                                </div>
                                <div className='5xs:hidden'>
                                    <PlaylistIcon size='33'  fill='#f9004d'/>
                                </div>
                            </Flex>
                        </Card>
                        <Card className="box manrope space-y-2 px-5 py-3 rounded-[3px]">
                            <Flex justifyContent="between" className="space-x-4">
                                <div className="truncate space-y-2">
                                    <Metric>{loading ? '0' : playlistBlend?.length < 0 || playlistBlend === null || playlistBlend === undefined ? '-' : playlistBlend?.length}</Metric>
                                    <Text>&apos;Blend&apos; playlists you have</Text>
                                </div>
                                <div className='5xs:hidden'>
                                    <BubbleIcon size='33' fill='#f9004d'/>
                                </div>
                            </Flex>
                        </Card>
                    </Grid>
                </div>
                <div className="profile__content mt-10 manrope">
                    <div className="content__blend-playlist">
                        <div className="blend__header flex items-center justify-between w-full rounded-[5px] bg-gray-100 p-3">
                            <h1 className='font-semibold'>Blend Playlist</h1>
                            <a href={currentUser?.external_urls?.spotify} target="_blank" rel="noopener noreferrer">
                                <SpotifyIcon width={'80'} />
                            </a>
                        </div>
                    {
                        loading ?
                            <div className="mt-5">
                                <DotWave /> 
                            </div>
                        :
                        <div className="blend__content grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 6xs:grid-cols-1 gap-y-7 gap-x-8 6xs:gap-x-0 mt-5">
                        {
                            playlistBlend <= 0 || playlistBlend === undefined || playlistBlend === null ?
                            <>
                                <h1>Empty blend playlist.</h1>
                            </>
                            :
                            playlistBlend?.slice(0, 5)?.map((ele, idx) => {
                                return (
                                    <div key={idx + 1} className="content__box-item manrope">
                                        <AvatarTrackSquareWithPlay
                                            alt={ele?.name}
                                            textAbove={ele?.name}
                                            link={ele?.track?.external_urls?.spotify}
                                            textBelow={ele?.owner?.display_name}
                                            path={ele?.images?.[0]?.url}
                                            path_light={ele?.images?.[0]?.url}
                                            link_second={ele?.external_urls?.spotify}
                                            caption_light={`<h4 style='font-family: manrope;'>${ele?.track?.name} from ${ele?.track?.artists?.[0]?.name} - Smufy</h4>`}
                                        />
                                    </div>
                                )
                            })
                        }
                        </div>
                    }
                    </div>
                    <div className="content__own-playlist mt-8">
                        <div className="own__header flex items-center justify-between w-full rounded-[5px] bg-gray-100 p-3">
                            <h1 className='font-semibold'>Own Playlist</h1>
                            <a href={currentUser?.external_urls?.spotify} target="_blank" rel="noopener noreferrer">
                                <SpotifyIcon width={'80'} />
                            </a>
                        </div>
                    {
                        loading ?
                            <div className="mt-5">
                                <DotWave /> 
                            </div>
                        :
                        <div className="own__content grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 6xs:grid-cols-1 gap-y-7 gap-x-8 6xs:gap-x-0 mt-5">
                        {
                            playlistMaded <= 0 || playlistMaded === undefined || playlistMaded === null ?
                            <>
                                <h1>Empty own playlist.</h1>
                            </>
                            :
                            playlistMaded?.slice(0, 5)?.map((ele, idx) => {
                                return (
                                    <div key={idx + 1} className="content__box-item manrope">
                                        <AvatarTrackSquareWithPlay
                                            alt={ele?.name}
                                            textAbove={ele?.name}
                                            link={ele?.track?.external_urls?.spotify}
                                            textBelow={ele?.owner?.display_name}
                                            path={ele?.images?.[0]?.url}
                                            path_light={ele?.images?.[0]?.url}
                                            link_second={ele?.external_urls?.spotify}
                                            caption_light={`<h4 style='font-family: manrope;'>${ele?.name} from ${ele?.owner?.display_name} - Smufy</h4>`}
                                        />
                                    </div>
                                )
                            })
                        }
                        </div>
                    }
                    </div>
                    <div className="content__saved-album mt-8">
                        <div className="saved-album__header flex items-center justify-between w-full rounded-[5px] bg-gray-100 p-3">
                            <h1 className='font-semibold'>Saved Album Playlist</h1>
                            <a href={currentUser?.external_urls?.spotify} target="_blank" rel="noopener noreferrer">
                                <SpotifyIcon width={'80'} />
                            </a>
                        </div>
                    {
                        loading ?
                            <div className="mt-5">
                                <DotWave /> 
                            </div>
                        :
                        <div className="saved-album__content grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 6xs:grid-cols-1 gap-y-7 gap-x-8 6xs:gap-x-0 mt-5">
                        {
                            savedAlbum <= 0 || savedAlbum === undefined || savedAlbum === null ?
                            <>
                                <h1>Empty saved album.</h1>
                            </>
                            :
                            savedAlbum?.slice(0, 5)?.map((ele, idx) => {
                                return (
                                    <div key={idx + 1} className="content__box-item manrope">
                                        <AvatarTrackSquareWithPlay
                                            alt={ele?.album?.name}
                                            textAbove={ele?.album?.name}
                                            link={ele?.album?.track?.external_urls?.spotify}
                                            textBelow={ele?.album?.owner?.display_name}
                                            path={ele?.album?.images?.[0]?.url}
                                            path_light={ele?.album?.images?.[0]?.url}
                                            link_second={ele?.album?.external_urls?.spotify}
                                            caption_light={`<h4 style='font-family: manrope;'>${ele?.album?.name} from ${ele?.album?.artists?.[0]?.name} - Smufy</h4>`}
                                        />
                                    </div>
                                )
                            })
                        }
                        </div>
                    }
                    </div>
                </div>
                <div className="profile__signout mt-10 manrope">
                    <div className="signout__header  w-full rounded-[5px] bg-gray-100 p-3 truncate">
                        <h1 className='font-semibold'>Signout Account</h1>
                    </div>
                    <div className="mt-5">
                        <button
                            className='more-button w-sm max-w-full manrope text-center bg-green-base/90 p-[10px] rounded-[5px] focus:outline-none hover:bg-green-base transition-colors'
                            onClick={handleSignoutSmufy}
                        >
                            <RippleBtn>
                                <h3>Sign Out</h3>
                            </RippleBtn>
                        </button>
                    </div>
                </div>
            </section>
        </DashboardLayout>
    )
} 

export default Profile