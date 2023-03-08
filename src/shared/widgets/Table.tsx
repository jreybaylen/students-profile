import TableItems from './TableItems'

type OptionalHeaderProps = {
    is_img: boolean
    linkProp: string
    sort: 'ASC' | 'DESC' | 'None'
}
export type HeaderProps = {
    prop: string
    label: string
} & Partial<OptionalHeaderProps>
type OptionalTableProps = {
    activeSort: HeaderProps
    onSort(name: HeaderProps, param: OptionalHeaderProps['sort']): void
}
export type TableProps = {
    dataKey: string
    items: Array<any>
    header: Array<HeaderProps>
} & Partial<OptionalTableProps>

export default function Table (PROPS: TableProps): JSX.Element {
    const { header, activeSort, onSort, dataKey, items } = PROPS

    function setNewSort (ITEM_TO_SORT: HeaderProps) {
        return (ITEM_TO_SORT.sort === 'None')
                ? 'ASC'
                : ((ITEM_TO_SORT.sort === 'ASC') ? 'DESC' : 'ASC')
    }

    return (
        <div className="w-full table-widget">
            <div className="w-full px-6 rounded-md flex flex-row justify-around mb-6 bg-gray-200">
                { header.map(
                    (ITEM: HeaderProps, INDEX: number) => {
                        const handleSortTable = () => {
                            if (onSort && ITEM.sort) {
                                const NEW_SORT = setNewSort(
                                    (activeSort && (ITEM.prop === activeSort?.prop)) ? activeSort : ITEM
                                )

                                onSort(ITEM, NEW_SORT)
                            }
                        }
                        const DISPLAY_SORT = activeSort && (ITEM.prop === activeSort?.prop) && (activeSort?.sort !== 'None')

                        return (
                            <div
                                key={ `${ ITEM.label }-${ INDEX * 2 }` }
                                className="text-left w-full"
                            >
                                <button
                                    type="button"
                                    onClick={ handleSortTable }
                                    className={ `w-full text-left py-6 ${ Boolean(ITEM.sort) ? 'cursor-pointer' : 'cursor-default' }` }
                                >
                                    <span className="font-semibold mr-1">
                                        { ITEM.label }
                                    </span>
                                    { DISPLAY_SORT && (
                                        (activeSort?.sort === 'ASC')
                                            ? <span className="text-slate-500">&uarr;</span>
                                            : <span className="text-slate-500">&darr;</span>
                                    ) }
                                </button>
                            </div>
                        )
                    }
                ) }
            </div>
            <div className="w-full flex flex-col table-body">
                { items.length
                    ? items.map(
                        (ITEM: any, INDEX: number) => {
                            if (ITEM instanceof Array) {
                                return ITEM.map(
                                    (GROUP_ITEM) => (
                                        <TableItems
                                            item={ GROUP_ITEM }
                                            dataKey={ dataKey }
                                            references={ header }
                                            key={ `${ GROUP_ITEM[ dataKey ] }-${ INDEX * 4 }` }
                                        />
                                    )
                                )
                            }

                            return (
                                <TableItems
                                    item={ ITEM }
                                    dataKey={ dataKey }
                                    references={ header }
                                    key={ `${ ITEM[ dataKey ] }-${ INDEX * 4 }` }
                                />
                            )
                        }
                    ) : (
                        <div className="flex mt-6 mb-8 justify-center">
                            <p className="text-xl py-3 px-12 border-2 rounded-xl">
                                No Data Found
                            </p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}