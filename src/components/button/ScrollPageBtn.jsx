import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

export default function ScrollPageBtn(props) {
    const path = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)

        return () => {
            window.scrollTo(0, 0)
        }
    }, [path])

    return <>{props.children}</>
}

ScrollPageBtn.propTypes= {
    children: PropTypes.any,
}