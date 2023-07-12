import { Link } from 'react-router-dom'
import { useCallback, useState, useEffect } from 'react'

import '../../styles/pages/dashboard/_recentlyplayed.scss'

import DashboardLayout from './DashboardLayout'
import spotify, {getRefreshToken} from '@/api/spotify'
import HeadPrimary from '@/components/heading/HeadPrimary'
import { SkeletonSquare } from '@/components/loading/Skeleton'
import { AvatarTrackSquare } from '@/components/profile/Avatar'

const RecentlyPlayed = () => {

    const [loading, setLoading] = useState(false)
    const [recentlyPlayed, setRecentlyPlayed] = useState([])

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
        getRecentlyPlayed()
    }, [getRecentlyPlayed])


    return (
        <DashboardLayout
            title = 'Recently Played — Discover all the content you have played on your Spotify.'
            kw = 'smufy recently played, smufy baru saja diputar id, smufy baru saja diputar indonesia'
            desc = 'Recently Played | Halaman untuk menampilkan apa saja yang telah kamu putar di Akun Spotify mu'
            page_name='Recently Played'
        >
            <section className={`recently-played-component`}>
                <div className="recently-played-track mt-10">
                    {
                        loading ?
                            <SkeletonSquare className='mt-6' />
                        :
                        <div className='grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 6xs:grid-cols-1 gap-y-7 gap-x-8 6xs:gap-x-0 mt-6'>
                        {
                            recentlyPlayed?.items?.slice(0, 10)?.map((ele, idx) => (
                                <div key={idx + 1} className="new-release__box-item manrope">
                                    <AvatarTrackSquare
                                        alt={ele?.track?.name}
                                        textAbove={ele?.track?.name}
                                        className='w-[300px] aspect-137'
                                        link={ele?.track?.external_urls?.spotify}
                                        textBelow={ele?.track?.artists?.[0]?.name}
                                        path={ele?.track?.album?.images?.[1]?.url}
                                        path_light={ele?.track?.album?.images?.[1]?.url}
                                        caption_light={`<h4 style='font-family: manrope;'>${ele?.track?.name} from ${ele?.track?.artists?.[0]?.name} - Spotiku</h4>`}
                                    />
                                </div>
                            ))                           
                        }
                        </div>
                    }
                </div>
            </section>
        </DashboardLayout>
    )
}

export default RecentlyPlayed