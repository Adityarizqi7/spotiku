import { useEffect } from 'react'
import Spotiku from '@/layouts/Spotiku'
import { useNavigate } from 'react-router-dom'
import { CheckIcon } from '@heroicons/react/24/outline'
import { getParamsFromUrl, getRequestToken, LOGIN_URL, STATE } from '@/api/spotify'

import '../styles/pages/_home.scss'
import RippleBtn from '@/components/button/RippleBtn'
import HeadPrimary from '@/components/heading/HeadPrimary'

export default function Home() {

    const navigate = useNavigate()

    const loginSpotifyHandle = () => {
        window.location = LOGIN_URL
    }

    useEffect(() => {
        const { state, code } = getParamsFromUrl();
        
        if (state && code) {
            const location = window.location.toString();
            window.history.replaceState(
                {},
                document.title,
                location.substring(0, location.indexOf('?'))
            );
            
            localStorage.setItem('client_code_spotify', code);
            getRequestToken(code);
        }

        if (window.location.search && state !== STATE) {
            const location = window.location.toString();
            window.history.replaceState(
                {},
                document.title,
                location.substring(0, location.indexOf('?'))
            );
            
            navigate('/');
        }
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Spotiku
            title='Spotiku — Explore and Discover Your Personal Spotify Statistics.'
            kw='spotiku, spotiku beranda, spotiku id spotifyku, spotiku indonesia'
            desc='Spotiku | Tempat untuk melihat lebih jauh statistik spotify personalmu'
        >
            <main
                className={`home-component`}
            >
                <section id='container_home'>
                {
                    <article className='headline-container-home'>
                        <div className='grid content-center h-screen'>
                            <HeadPrimary
                                title='SPOTIKU'
                                classFunc={'text-neutral-900'}
                                classHeading='montserrat text-[2.5rem] 4xs:text-[8vw] font-bold text-center'
                            />
                            <p
                                className={`text-gray-900 max-w-[750px] mt-2 montserrat text-center mx-auto 5xs:text-[5vw]`}
                            >
                                Hey everyone, let&apos;s dive into your Spotify stats! We&apos;ll explore your <strong>top tracks</strong>, <strong>favorite artists</strong>, and <strong>recently played songs</strong> based on the timestamp. Additionally, you&apos;ll be able to see what track you&apos;re currently jamming to on Spotify. But first, go ahead and sign in with your Spotify account. Sit back, relax, and let&apos;s discover your musical journey!
                            </p>
                            <RippleBtn className='mt-7 montserrat bg-[#1DB954] hover:bg-[#00b840] text-white mx-auto transition-colors'>
                                <button className='flex items-center gap-2 py-[10px] px-5 5xs:px-1 rounded-[5px]' onClick={loginSpotifyHandle}>
                                    <i className='bx bxl-spotify text-[1.25rem]'></i>
                                    <span className='5xs:text-[5vw]'>SIGNIN WITH SPOTIFY</span>
                                </button>
                            </RippleBtn>
                            <div className="flex flex-wrap mt-8 items-center justify-center gap-1">
                                <CheckIcon className='w-4 h-4 text-white bg-blue-500 rounded-full p-[2px] 3xs:hidden' />
                                <p
                                    className={` text-gray-900 text-[0.85rem] montserrat text-center 5xs:text-[4vw]`}
                                >
                                    <span className='hidden 3xs:inline'>&#10003;</span> By logging in, you agree with all applicable terms.
                                </p>
                            </div>
                        </div>
                    </article>
                }
                </section>
            </main>
        </Spotiku>
    )
}