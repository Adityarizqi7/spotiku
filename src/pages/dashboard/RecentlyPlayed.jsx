import { useRef } from 'react'
import html2canvas from 'html2canvas';
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import ProgressiveImage from 'react-progressive-graceful-image'
import { useCallback, useState, useEffect, Fragment } from 'react'
import { Card, Flex, Grid, LineChart, Metric, Text, Title } from '@tremor/react'

import '../../styles/pages/dashboard/_recentlyplayed.scss'

import { dayMDateY } from '@/utils/Time';
import DotWave from '@/components/loading/Dot'
import DashboardLayout from './DashboardLayout'
import bgNull from '@/assets/images/bg-null.webp'
import spotify, {getRefreshToken} from '@/api/spotify'
import LightImage from '@/components/image/LightImage'
import { SkeletonCircle, SkeletonSquare } from '@/components/loading/Skeleton'
import { AvatarTrackSquareStory, AvatarTrackSquareWithPlay, TrackSquare } from '@/components/profile/Avatar'
import { ChartIcon, ClockIcon, ImageIcon, MicIcon, MusicIcon, SpotifyIcon } from '@/components/icon/IconList'
import RippleBtn from '@/components/button/RippleBtn';

const RecentlyPlayed = () => {

    const chartRef = useRef(null);
    const imageShareRef = useRef(null);
    const chartButtonRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isOpenChart, setIsOpenCHart] = useState(false)
    
    const [trackPlays, setTrackPlays] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [totalDuration, setTotalDuration] = useState(0);
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [recentlyPlayedArtists, setRecentlyPlayedArtists] = useState([]);
    
    const storedTrackCount = sessionStorage.getItem('trackCount');
    const initialTrackCount = storedTrackCount ? JSON.parse(storedTrackCount) : 10;
    const [trackCount, setTrackCount] = useState(initialTrackCount);
    
    sessionStorage.setItem('trackCount', JSON.stringify(trackCount));

    const sortedTracks = trackPlays.sort((a, b) => b.plays - a.plays);
    const mostPlayedTrack = sortedTracks?.[0];

    const getRecentlyPlayed = useCallback(async () => {
        setLoading(true);
        await getRefreshToken(localStorage.getItem('client_refresh_token_spotify'));

        try {
            const response = await spotify.get('me/player/recently-played', {
                params: {
                    limit: 50
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('client_token_spotify')}`,
                },
            });

            setLoading(false);
            const recentlyPlayedItems = response.data.items;
            setRecentlyPlayed(recentlyPlayedItems);

            // Total durasi
            const totalDuration = recentlyPlayedItems.reduce((total, item) => {
                const durationMs = item.track.duration_ms;
                return total + durationMs;
            }, 0);
            setTotalDuration(Math.floor(totalDuration / 60000));

            // Total track diputar
            const trackPlaysMap = new Map();
            recentlyPlayedItems?.forEach((item) => {
                const trackName = item?.track?.name;
                if (trackPlaysMap.has(trackName)) {
                    trackPlaysMap.set(trackName, trackPlaysMap.get(trackName) + 1);
                } else {
                    trackPlaysMap.set(trackName, 1);
                }
            });
            const trackPlaysArray = Array.from(trackPlaysMap).map(([trackName, plays]) => ({
                trackName,
                plays,
            }));
      
            setTrackPlays(trackPlaysArray);
        } catch (error) {
            setLoading(false);
        }
    }, []);

    const getArtistData = useCallback( async (artistId) => {
        await getRefreshToken(localStorage.getItem('client_refresh_token_spotify'));
        try {
            const response = await spotify.get(`artists/${artistId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('client_token_spotify')}`,
                },
            });
            if (response.status === 200) {
                return response.data
            } else {
                throw new Error('Failed to fetch artist data');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    const getRecentlyPlayedArtists = useCallback(async () => {
        setLoading(true);
        await getRefreshToken(localStorage.getItem('client_refresh_token_spotify'));
        
        try {
            const response = await spotify.get('me/player/recently-played', {
                params: {
                    limit: 50,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('client_token_spotify')}`,
                },
            });
            
            if (response.status === 200) {
                const tracks = response.data.items;
              
                const uniqueArtists = [];
                const uniqueArtistIds = new Set();
              
                const artistPromises = [];
                const artistOrder = [];
              
                tracks.forEach((item, index) => {
                    const artists = item?.track?.artists?.map((artist) => ({
                        name: artist?.name,
                        id: artist?.id,
                        url: artist?.external_urls?.spotify,
                        image_small: '',
                        image_big: '',
                    }));
                      
                    const firstArtist = artists.shift(); // Mengambil artis pertama dari array artists
                      
                    if (!uniqueArtistIds.has(firstArtist?.id)) {
                        uniqueArtistIds.add(firstArtist?.id);
                      
                        const artistPromise = getArtistData(firstArtist?.id)
                          .then((artistData) => {
                            const updatedArtist = { ...firstArtist, image_small: artistData?.images[2]?.url, image_big: artistData?.images[0]?.url };
                            uniqueArtists.push(updatedArtist);
                            artistOrder[index] = updatedArtist;
                          })
                          .catch((error) => {
                            console.error(`Failed to fetch artist data for artist with id ${firstArtist?.id}`);
                            throw error;
                          });
                      
                        artistPromises.push(artistPromise);
                    }                      
                });
              
                Promise.all(artistPromises)
                .then(() => {
                    const sortedArtists = artistOrder.filter((artist) => artist); // Menghapus nilai undefined dari array artistOrder
                    setLoading(false);
                    setRecentlyPlayedArtists(sortedArtists);
                })
                .catch((error) => {
                    setLoading(false);
                    console.error('Error fetching artist data:', error);
                });
            } else {
                throw new Error('Failed to fetch recently played tracks');
            }              
        } catch (error) {
            setLoading(false);
        }
    }, [getArtistData]);

    function handleOpenChart() {
        setIsOpenCHart(!isOpenChart)
    }
    const getMoreTracks = () => {
        setLoadingMore(true);
        setTimeout(() => {
          setTrackCount(prevTrackCount => prevTrackCount + 5);
          setLoadingMore(false);
        }, 500);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
              chartRef.current && !chartRef.current.contains(event.target) &&
              chartButtonRef.current && !chartButtonRef.current.contains(event.target)
            ) {
              setIsOpenCHart(false);
            }
        }
        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        }
    }, []);

    useEffect(() => {
        getRecentlyPlayed();
        getRecentlyPlayedArtists()
    }, [getRecentlyPlayed, getRecentlyPlayedArtists]);

    const handleDownloadImage = useCallback(() => {
        if (imageShareRef.current === null) {
          return;
        }
      
        const elementToCapture = imageShareRef.current;
        const originalDisplay = elementToCapture.style.display;
        elementToCapture.style.display = 'block';

        const html2canvasOptions = {
            scale: 3,
            useCORS: true,
        };
        html2canvas(elementToCapture, html2canvasOptions)
        .then((canvas) => {
            const dataURL = canvas.toDataURL('image/jpg');
            const link = document.createElement('a');
            link.download = 'test.jpg';
            link.href = dataURL;
            link.click();
        })
        .catch((error) => {
            console.error('Error capturing element:', error);
        })
        .finally(() => {
            elementToCapture.style.display = originalDisplay;
        });
    }, [imageShareRef]);

    // const handleScroll = useCallback(() => {
    //     if (
    //         window.innerHeight + document.documentElement.scrollTop !==
    //         document.documentElement.offsetHeight ||
    //         loading ||
    //         trackCount >= 50
    //     ) {
    //         return;
    //     }
    //     setLoadingMore(true);
    //     setTimeout(() => {
    //         setTrackCount(prevTrackCount => prevTrackCount + 5);
    //         setLoadingMore(false);
    //     }, 1000);
    // }, [loading, trackCount]);

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll);

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll)
    //     }
    // }, [handleScroll]); 

    return (
        <DashboardLayout
            title = 'Recently Played - Smufy'
            kw = 'smufy recently played, smufy baru saja diputar id, smufy baru saja diputar indonesia'
            desc = 'Recently Played | Halaman untuk menampilkan apa saja yang telah kamu putar di Akun Spotify mu'
            page_name='Recently Played'
        >
            <section className={`recently-played-component relative ${trackCount > 10 && 'md:pb-10 pb-[5.5rem]'}`}>
                <div className="played_statistic mt-4 space-y-5">
                    <div className="announcement-grafik flex items-center justify-end gap-2">
                        <div className="icon icon-image cursor-pointer flex items-center gap-2 manrope py-3 px-7 rounded-full bg-yellow-400/40 hover:bg-yellow-500/50" ref={chartButtonRef} onClick={handleOpenChart}>
                            <ChartIcon stroke='#a16107' fill='#a16107' />
                            <span className='truncate font-medium text-yellow-700'>Your stats</span>
                        </div>
                        <div className='icon icon-image cursor-pointer flex items-center gap-2 manrope py-3 px-7 rounded-full bg-black hover:bg-slate-900' onClick={handleDownloadImage}>
                            <ImageIcon fill='#ffffff' stroke='#ffffff' />
                            <span className='truncate font-medium text-white'>Share</span>
                        </div>
                        <Transition appear show={isOpenChart} as={Fragment} ref={chartRef}>
                            <Dialog as="div" onClose={() => setIsOpenCHart(!isOpenChart)}>
                                <div className="fixed inset-0 overflow-y-auto">
                                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                                        </Transition.Child>
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 scale-95"
                                            enterTo="opacity-100 scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 scale-100"
                                            leaveTo="opacity-0 scale-95"
                                        >
                                            <Dialog.Panel className='w-full rounded-2xl bg-white p-6 shadow-own manrope overflow-y-auto'>
                                                <Card>
                                                    <Title>Discover the overall number of recently tracks you have played on Spotify</Title>
                                                    <LineChart
                                                        className="mt-6 line-clamp-1 overflow-y-scroll"
                                                        data={trackPlays}
                                                        index="trackName"
                                                        categories={["plays"]}
                                                        colors={["green"]}
                                                        valueFormatter={(value) => `${value} times`}
                                                        yAxisWidth={40}
                                                    />
                                                    <div className="most-played-track mt-5 space-y-2">
                                                        <Title className='font-semibold text-[20px] text-slate-800'>Most recently played tracks</Title>
                                                        <Text className='text-slate-800 text-[1rem]'>
                                                            That&apos;s impressive!
                                                            <span className='font-medium italic'>{`"${loading ? 'loading' :  mostPlayedTrack?.trackName}" `}</span>
                                                            has emerged as one of your top-played tracks on Spotify,
                                                            <span>  with a total of <span className='font-medium'>{`${loading ? 0 : mostPlayedTrack?.plays}`}</span> plays.`</span>
                                                        </Text>
                                                    </div>
                                                    <XMarkIcon className='w-6 h-6 absolute right-2 top-2 cursor-pointer hover:text-red-500' onClick={() => setIsOpenCHart(!isOpenChart)}/>
                                                </Card>                                        
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition>
                    </div>
                    <Grid numItemsMd={2} numItemsLg={3} className="gap-6 place-content-between">
                        <Card className="box manrope space-y-2 px-5 py-3 rounded-[3px]">
                            <Flex justifyContent="between" className="space-x-4">
                                <div className="truncate space-y-2">
                                    <Metric>{loading ? '0' : totalDuration}</Metric>
                                    <Text>Total Duration (Minute)</Text>
                                </div>
                                <div className='5xs:hidden'>
                                    <ClockIcon fill='#f9004d' size='33' />
                                </div>
                            </Flex>
                        </Card>
                        <Card className="box manrope space-y-2 px-5 py-3 rounded-[3px]">
                            <Flex justifyContent="between" className="space-x-4">
                                <div className="truncate space-y-2">
                                    <Metric>{loading ? '0' : trackCount}</Metric>
                                    <Text>Total Tracks of 50</Text>
                                </div>
                                <div className='5xs:hidden'>
                                    <MusicIcon size='33'/>
                                </div>
                            </Flex>
                        </Card>
                        <Card className="box manrope space-y-2 px-5 py-3 rounded-[3px]">
                            <Flex justifyContent="between" className="space-x-4">
                                <div className="truncate space-y-2">
                                    <Metric>{loading ? '0' : recentlyPlayedArtists?.length}</Metric>
                                    <Text>Artists</Text>
                                </div>
                                <div className='5xs:hidden'>
                                    <MicIcon fill='#FF6521' size='33'/>
                                </div>
                            </Flex>
                        </Card>
                    </Grid>
                </div>
                <div className="played__track-artists-wrapper mt-10 flex 3xs:flex-col gap-9">
                    <div className="played__artists 3xs:overflow-x-scroll">
                    {
                        loading ?
                            <SkeletonCircle className='mt-6' />
                        :
                        <div className='space-y-6 sticky top-7 h-screen 3xs:h-auto 3xs:static 3xs:flex 3xs:flex-items-center 3xs:space-y-0 3xs:gap-3 3xs:w-[30rem]'>
                        {
                            recentlyPlayedArtists?.slice(0, 5)?.map((ele, idx) => {
                                return (
                                    <LightImage
                                        key={idx}
                                        path={ele?.image_big ? ele?.image_big : bgNull}
                                        caption={`<h4 style='font-family: manrope;'>${ele?.name} - Smufy | <a className='text-green-base' href=${ele?.url} target="_blank" rel="noopener noreferrer">Open On Spotify</a></h4>`}
                                    >
                                        <ProgressiveImage 
                                            key={idx} 
                                            src={
                                                ele?.image_small ? ele?.image_small : bgNull
                                            } 
                                            placeholder={
                                                ele?.image_small ? ele?.image_small : bgNull
                                            }>
                                            {(src, loading) => {
                                                return (
                                                    <div className='relative overflow-hidden rounded-[100%] w-[84px] h-[84px]'>
                                                        <img 
                                                            style={{
                                                                opacity:
                                                                    loading
                                                                        ? 0.5
                                                                        : 1,
                                                            }}
                                                            className={"progressive-image object-cover cursor-pointer hover:scale-[1.5] transition-transform rounded-[100%] w-[84px] h-[84px]"} src={src} alt={ele?.name}
                                                        />
                                                        <noscript>
                                                            <img 
                                                                style={{
                                                                    opacity:
                                                                        loading
                                                                            ? 0.5
                                                                            : 1,
                                                                }}
                                                                className="progressive-image no-script object-cover cursor-pointer hover:scale-[1.5] transition-transform rounded-[100%] w-[84px] h-[84px]" src={src} alt={ele?.name} 
                                                            />
                                                        </noscript>
                                                    </div>
                                                );
                                            }}
                                        </ProgressiveImage>                                        
                                    </LightImage>
                                )
                            })
                        }
                        </div> 
                    }
                    </div>
                    <div className="played__track">
                    {
                        loading ?
                            <SkeletonSquare className='mt-6 3xs:mt-3' />
                        :
                        <>
                            <div className='grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 6xs:grid-cols-1 gap-y-7 gap-x-8 6xs:gap-x-0'>
                            {
                                recentlyPlayed?.slice(0, trackCount)?.map((ele, idx) => (
                                    <div key={idx + 1} className="new-release__box-item manrope">
                                        <AvatarTrackSquareWithPlay
                                            alt={ele?.track?.name}
                                            textAbove={ele?.track?.name}
                                            className='w-[300px] aspect-137'
                                            link={ele?.track?.external_urls?.spotify}
                                            textBelow={ele?.track?.artists?.[0]?.name}
                                            path={ele?.track?.album?.images?.[1]?.url}
                                            path_light={ele?.track?.album?.images?.[1]?.url}
                                            link_second={ele?.track?.external_urls?.spotify}
                                            caption_light={`<h4 style='font-family: manrope;'>${ele?.track?.name} from ${ele?.track?.artists?.[0]?.name} - Smufy</h4>`}
                                        />
                                    </div>
                                ))                           
                            }
                            </div>
                            <>
                            {
                                trackCount <= 50 &&
                                loadingMore ?
                                    <div className="mt-7 flex justify-center">
                                        <DotWave />
                                    </div>
                                :
                                    <button
                                        className='more-button w-full mt-5 manrope text-center bg-slate-800/90 p-[10px] rounded-[5px] focus:outline-none hover:bg-slate-900 transition-colors'
                                        onClick={getMoreTracks}
                                    >
                                        <RippleBtn>
                                            <h3>More track</h3>
                                        </RippleBtn>
                                    </button>
                            }
                            </>
                        </>
                    }
                    </div>
                </div>
                <div className="played__story manrope bg-[#0b1120]" ref={imageShareRef}>
                    <div className="story__content shadow-own w-full">
                        <div className="content__title-logo flex flex-col items-center justify-center mt-5 w-full">
                            <SpotifyIcon width={'200'} />
                            <div className='space-y-6'>
                                <h1 className='font-bold text-[6rem] text-gray-100 text-center'>Recently Played</h1>
                                <h3 className='text-slate-400 text-[2rem] font-semibold text-center'>{dayMDateY()}</h3>
                            </div>
                        </div>
                        <div className="content__artists flex justify-center w-full mt-[6rem]">
                        {
                            recentlyPlayedArtists?.slice(0, 3)?.map((ele, idx) => {
                                return (
                                    <div key={idx} className='rounded-[100%] w-[300px] h-[300px] even:mt-[10rem] bg-white p-2'>
                                        <img
                                            className={"progressive-image object-cover rounded-[100%] w-[300px] h-[300px]"} src={ele?.image_big ? ele?.image_big : bgNull} alt={ele?.name}
                                        />
                                        <noscript>
                                            <img 
                                                className="progressive-image object-cover rounded-[100%] w-[300px] h-[300px]" src={ele?.image_big ? ele?.image_big : bgNull} alt={ele?.name} 
                                            />
                                        </noscript>
                                    </div>
                                )
                            })
                        }
                        </div>
                        <div className="content__track mt-[6rem] flex items-center justify-center gap-14">
                        {
                            recentlyPlayed?.slice(0, 3)?.map((ele, idx) => {
                                return (
                                    <div key={idx + 1} className="track__box-item manrope p-3 rounded-[7px] w-[300px] bg-white/95">
                                        <AvatarTrackSquareStory
                                            alt={ele?.track?.name}
                                            textAbove={ele?.track?.name}
                                            className='w-[300px] rounded-[3px]'
                                            textBelow={ele?.track?.artists?.[0]?.name}
                                            path={ele?.track?.album?.images?.[1]?.url}
                                        />
                                    </div>
                                )
                            })
                        }
                        </div>
                        <div className="content__track gap-2 mt-[4.5rem] px-10">
                        {
                            recentlyPlayed?.slice(3, 6)?.map((ele, idx) => {
                                return (
                                    <div key={idx + 1} className="track__box-item manrope">
                                        <TrackSquare
                                            duration={ele?.track?.duration_ms}
                                            textAbove={ele?.track?.name}
                                            textBelow={ele?.track?.artists?.[0]?.name}
                                        />
                                    </div>
                                )
                            })
                        }
                        </div>
                        <div className="content__footer mt-[2.75rem]">
                            <h1 className='font-bold text-[2.5rem] text-gray-100 text-center'>Discover yours on <span className='text-green-base'>Smufy</span></h1>
                        </div>
                    </div>
                </div>
            </section>
        </DashboardLayout>
    )
}

export default RecentlyPlayed