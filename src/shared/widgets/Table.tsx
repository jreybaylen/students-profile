import { Link } from 'react-router-dom'

type OptionalHeaderProps = {
    is_img: boolean
    linkProp: string
}
type HeaderProps = {
    prop: string
    label: string
} & Partial<OptionalHeaderProps>
type TableProps = {
    dataKey: string
    items: Array<any>
    header: Array<HeaderProps>
}

export default function Table (PROPS: TableProps): JSX.Element {
    return (
        <div className="w-full">
            <div className="w-full rounded-md flex flex-row gap-3 bg-gray-200 hover:bg-gray-300">
                { PROPS.header.map(
                    (ITEM: HeaderProps) => (
                        <div
                            key={ ITEM.label }
                            className="w-[14.30%] text-left py-4 cursor-default"
                        >
                            <span className="font-semibold">
                                { ITEM.label }
                            </span>
                        </div>
                    )
                ) }
            </div>
            <div className="w-full flex flex-col">
                { PROPS.items.map(
                    (ITEM: any) => (
                        <div
                            key={ ITEM[ PROPS.dataKey ] }
                            className="hover:shadow-2xl rounded-md duration-300 py-6 px-3 flex flex-row gap-3 items-center justify-center"
                        >
                            { PROPS.header.map(
                                (ITEM_HEADER: HeaderProps, INDEX: number) => (
                                    <div
                                        className="cursor-default text-left w-[14.29%]"
                                        key={ `inner-${ INDEX + 3 }-${ ITEM[ PROPS.dataKey ] }` }
                                    >
                                        { ITEM_HEADER.is_img ? (
                                            <img
                                                alt="Profile Photo"
                                                className="block rounded-full w-[100px] shadow-xl border-2"
                                                src={ `/assets/${ ITEM[ ITEM_HEADER.prop ] || 'default.jpg' }` }
                                            />
                                        ) : ITEM_HEADER.linkProp ? (
                                            <Link
                                                to={ `/profile/${ ITEM[ ITEM_HEADER.linkProp ] }` }
                                                className="hover:underline text-cyan-600 font-semibold"
                                            >
                                                { ITEM[ ITEM_HEADER.prop ] } { ITEM.nickname ? `(${ ITEM.nickname })` : '' }
                                            </Link>
                                        ) : ITEM[ ITEM_HEADER.prop ] }
                                    </div>
                                )
                            ) }
                        </div>
                    )
                ) }
            </div>
        </div>
    )
}