import { Link } from 'react-router-dom'

import type { HeaderProps } from './Table' 

type TableItemsProps = {
    item: any
    dataKey: string
    references: Array<HeaderProps>
}

export default function TableItems (PROPS: TableItemsProps): JSX.Element {
    return (
        <div
            className="hover:shadow-2xl rounded-md duration-300 p-6 flex flex-row items-center justify-around"
        >
            { PROPS.references.map(
                (ITEM: HeaderProps, INDEX: number) => (
                    <div
                        className="cursor-default text-left font-light w-full"
                        key={ `inner-${ INDEX + 3 }-${ PROPS.item[ PROPS.dataKey ] }` }
                    >
                        { ITEM.is_img ? (
                            <img
                                alt="Profile Photo"
                                className="block rounded-full max-w-[150px] shadow-xl border-2"
                                src={ `/assets/${ PROPS.item[ ITEM.prop ] || 'default.jpg' }` }
                            />
                        ) : ITEM.linkProp ? (
                            <Link
                                to={ `/profile/${ PROPS.item[ ITEM.linkProp ] }` }
                                className="hover:underline text-cyan-600 font-semibold"
                            >
                                { PROPS.item[ ITEM.prop ] } { PROPS.item.nickname ? `(${ PROPS.item.nickname })` : '' }
                            </Link>
                        ) : PROPS.item[ ITEM.prop ] }
                    </div>
                )
            ) }
        </div>
    )
}