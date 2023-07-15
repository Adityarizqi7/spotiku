import Smufy from "@/layouts/Smufy";
import { useNavigate } from "react-router-dom";

export default function NotFound() {

    const navigate = useNavigate()

    return(
        <Smufy
            title='404 | Halaman tidak ditemukan'
            kw='smufy site not found, smufy site halaman tidak ditemukan, smufy site, smufy site halaman tidak ditemukan'
            desc='404 | Halaman tidak ditemukan'
        >
            <div className='mx-auto px-2 py-20'>
                <div className='poppins flex flex-col items-center gap-y-4'>
                    <h1 className='text-9xl font-bold text-blue-600'>
                        404
                    </h1>
                    <h6
                        className={`text-slate-800 mb-2 text-center text-2xl font-bold md:text-3xl`}
                    >
                        OOps, Page Not Found
                    </h6>

                    <p className='mb-8 text-center text-gray-500 md:text-lg'>
                        The page you&#39;re looking for doesn&#39;t exist.
                    </p>

                    <button
                        onClick={() => navigate(-1)}
                        className='bg-blue-100 px-6 py-2 text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-700/30 hover:text-blue-800'
                    >
                        Go back
                    </button>
                </div>
            </div>
        </Smufy>
    )
}