import PropTypes from 'prop-types'

import '../../styles/components/loading/_skeleton.scss'

export function SkeletonSquare({className}) {
    return (
        <div className={"box-skeleton space-y-2 " + className}>
            <div className="box__inside-first w-[150px] h-[150px] rounded-[5px]"></div>
            <div className="box__inside-second w-[150px] h-[1.15rem] rounded-[5px]"></div>
            <div className="box__inside-third w-[150px] h-[1.15rem] rounded-[5px]"></div>
        </div>
    )
}

export function SkeletonRectangle({className}) {
    return (
        <div className={"box-skeleton flex flex-wrap items-center gap-2 " + className}>
            <div className="box__inside-first w-[15px] h-[54px] rounded-[5px]"></div>
            <div className="box__inside-second w-[54px] h-[54px] rounded-[5px]"></div>
            <div className="box__inside-third w-[84px] h-[0.85rem] rounded-[5px]"></div>
        </div>
    )
}

SkeletonSquare.propTypes= {
    className: PropTypes.string,
}
SkeletonRectangle.propTypes= {
    className: PropTypes.string,
}