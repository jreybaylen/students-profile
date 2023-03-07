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
        <table className="w-full table-fixed table-component">
            <thead className="w-full table">
                <tr className="w-full rounded-t-md flex flex-row bg-gray-200 hover:bg-gray-300">
                    { PROPS.header.map(
                        (ITEM: HeaderProps) => (
                            <th
                                colSpan={ 1 }
                                key={ ITEM.label }
                                className="w-[14.30%] text-left"
                            >
                                { ITEM.label }
                            </th>
                        )
                    ) }
                </tr>
            </thead>
            <tbody className="table w-full">
                { PROPS.items.map(
                    (ITEM: any) => (
                        <tr
                            key={ ITEM[ PROPS.dataKey ] }
                            className="w-full hover:bg-gray-100"
                        >
                            { PROPS.header.map(
                                (ITEM_HEADER: HeaderProps, INDEX: number) => (
                                    <td
                                        colSpan={ 1 }
                                        className="p-5 cursor-default text-left w-[14.29%]"
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
                                                className="hover:underline text-cyan-600"
                                                to={ `/profile/${ ITEM[ ITEM_HEADER.linkProp ] }` }
                                            >
                                                { ITEM[ ITEM_HEADER.prop ] } { ITEM.nickname ? `(${ ITEM.nickname })` : '' }
                                            </Link>
                                        ) : ITEM[ ITEM_HEADER.prop ] }
                                    </td>
                                )
                            ) }
                        </tr>
                    )
                ) }
            </tbody>
        </table>
    )
}