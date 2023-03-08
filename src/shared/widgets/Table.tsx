import TableItems from './TableItems'

type OptionalHeaderProps = {
    is_img: boolean
    linkProp: string
}
export type HeaderProps = {
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
        <div className="w-full table-widget">
            <div className="w-full p-6 rounded-md flex flex-row justify-around mb-6 bg-gray-200 hover:bg-gray-300">
                { PROPS.header.map(
                    (ITEM: HeaderProps, INDEX: number) => (
                        <div
                            key={ `${ ITEM.label }-${ INDEX * 2 }` }
                            className="text-left w-full cursor-default"
                        >
                            <span className="font-semibold">
                                { ITEM.label }
                            </span>
                        </div>
                    )
                ) }
            </div>
            <div className="w-full flex flex-col table-body">
                { PROPS.items.map(
                    (ITEM: any, INDEX: number) => {
                        if (ITEM instanceof Array) {
                            return ITEM.map(
                                (GROUP_ITEM) => (
                                    <TableItems
                                        item={ GROUP_ITEM }
                                        dataKey={ PROPS.dataKey }
                                        references={ PROPS.header }
                                        key={ `${ GROUP_ITEM[ PROPS.dataKey ] }-${ INDEX * 4 }` }
                                    />
                                )
                            )
                        }

                        return (
                            <TableItems
                                item={ ITEM }
                                dataKey={ PROPS.dataKey }
                                references={ PROPS.header }
                                key={ `${ ITEM[ PROPS.dataKey ] }-${ INDEX * 4 }` }
                            />
                        )
                    }
                ) }
            </div>
        </div>
    )
}