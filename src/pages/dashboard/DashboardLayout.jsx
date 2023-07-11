import PropTypes from 'prop-types'
import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useCallback, useState, Fragment } from 'react'
import { ChevronDownIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import spotify, { getParamsFromUrl, getRefreshToken, getRequestToken, STATE } from '@/api/spotify'

import '../../styles/pages/dashboard/_dashboardlayout.scss'

import SpotikuDash from '@/layouts/SpotikuDash'
import DotWave from '@/components/loading/Dot'
import LeftBar from '@/components/navbar/LeftBar'
import { Menu, Transition } from '@headlessui/react'
import RippleBtn from '@/components/button/RippleBtn'
import LightImage from '@/components/image/LightImage'
import { BottomBar } from '@/components/navbar/BottomBar'
import { AvatarProfileFree, AvatarProfilePremium } from '@/components/profile/Avatar'

const DashboardLayout =({
    title = 'Spotiku — Explore and Discover Your Personal Spotify Statistics.',
    kw = 'spotiku, spotiku beranda, spotiku beranda id, spotiku beranda indonesia',
    desc = 'Spotiku | Tempat untuk melihat lebih jauh statistik spotify personalmu',
    page_name,
    children 
}) => {

    const navigate = useNavigate()
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
                setCurrentUser(res.data)
            })
            .catch(e => {
                setLoading(false)
                throw new Error(e)
            })
    }, [])
    
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
            
            navigate('/signin');
        }
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const isSignin = localStorage.getItem('client_code_spotify')
        !isSignin && navigate('/signin')
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        getCurrentUser()
    }, [getCurrentUser])

    const handleGoBack = () => {    
       history.length > 1 && navigate(-1)
    };

    const handleSignoutSpotiku = () => {
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
      
    return (
        <SpotikuDash
            title={title}
            kw={kw}
            desc={desc}
        >
            <article className="dashboard-component">
                <section id="container_dashboard">
                    <div className="wrapper-dashboard flex w-full">
                        <LeftBar />
                        <section className="content-component w-[80%] px-10 2xs:px-5">
                            <div className="breadcumbs-profile-wrapper py-8 2xs:py-5 md:flex hidden justify-between">
                                <div className="breadcumbs flex items-center gap-5">
                                    <RippleBtn 
                                        onClick={handleGoBack}
                                        className={`${history.length < 1 && 'cursor-not-allowed opacity-50'} breadcumbs__prev-button bg-green-base/30 p-[10px] rounded-[12px] focus:outline-none hover:bg-green-base/40 transition-colors`}>
                                            <ChevronLeftIcon className='w-6 h-6 text-green-base' />
                                    </RippleBtn>
                                    <div aria-current="page">
                                        <h3 className="text-[14px] font-semibold text-slate-500 manrope">{page_name}</h3>
                                    </div>
                                </div>
                                <div className="profile flex items-center gap-4 3xs:gap-2 relative">
                                    <>
                                    {
                                        loading ?
                                        <DotWave /> :
                                        currentUser?.product === 'free' ?
                                        <LightImage
                                            path={currentUser?.images?.[1]?.url}
                                            alt={currentUser?.display_name}
                                        >
                                            <AvatarProfileFree 
                                                className='w-[50px] h-[50px]'
                                                alt={currentUser?.display_name}
                                                name={currentUser?.display_name}
                                                textBelow={currentUser?.product}
                                                path={currentUser?.images?.[0]?.url}
                                                textAbove={currentUser?.display_name}
                                            /> 
                                        </LightImage> : 
                                        currentUser?.product === 'premium' && 
                                        <LightImage
                                            path={currentUser?.images?.[1]?.url}
                                        >
                                            <AvatarProfilePremium 
                                                className='w-[50px] h-[50px]'
                                                alt={currentUser?.display_name}
                                                textBelow={currentUser?.product}
                                                path={currentUser?.images?.[0]?.url}
                                                textAbove={currentUser?.display_name}
                                            />
                                        </LightImage>
                                    }
                                    </>
                                    <Menu as={'div'}>
                                        <Menu.Button>
                                            <ChevronDownIcon className='w-7 h-7 hover:bg-slate-100 p-1 rounded-full transition-colors duration-300 ui-open:bg-slate-100 ui-open:p-1 ui-open:rounded-full' />
                                        </Menu.Button>
                                        <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className='absolute right-0 z-[2] mt-6 w-56 5xs:w-[7rem] divide-y divide-gray-100 rounded-md bg-white shadow-own manrope text-slate-800'>
                                                <div className='px-1 py-1'>
                                                    <Menu.Item>
                                                        <NavLink className='hover:bg-green-base/40 hover:text-slate-900 w-full px-2 py-2 rounded-md block' to="/">
                                                            Profile
                                                        </NavLink>
                                                    </Menu.Item>    
                                                </div>
                                                <div className='px-1 py-1'>
                                                    <Menu.Item>
                                                        <button
                                                        onClick={handleSignoutSpotiku}
                                                        className='w-full px-2 py-2 text-left text-pink-base hover:bg-pink-base/40 hover:text-slate-100 rounded-md'
                                                        >Signout</button>
                                                    </Menu.Item>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                            {children}
                        </section>
                        <BottomBar />
                    </div>
                </section>
            </article> 
        </SpotikuDash>
    )
}

DashboardLayout.propTypes= {
    title: PropTypes.string.isRequired,
    kw: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    page_name: PropTypes.string.isRequired,
    children: PropTypes.any,
}

export default DashboardLayout;