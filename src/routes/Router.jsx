import { Routes, Route } from 'react-router-dom'

import Signin from '@/pages/Signin'
import NotFound from '@/pages/NotFound'
import Home from '@/pages/dashboard/Home'
import RecentlyPlayed from '@/pages/dashboard/RecentlyPlayed'
import ScrollPage from '@/components/button/ScrollPageBtn'


export default function Router() {
    return (
        <ScrollPage>
            <Routes>
                <Route path='/signin' element={<Signin />} />
                <Route path='/' element={<Home />} />
                <Route path='/recently-played' element={<RecentlyPlayed />} />

                <Route path='*' element={<NotFound />} />
            </Routes>
        </ScrollPage>
    )
}