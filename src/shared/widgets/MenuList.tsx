type MenuListProps = {
    data: Array<any>
    onItemClick(param: string): void
}

export default function MenuList (PROPS: MenuListProps): JSX.Element {
    return (
        <ul className="absolute max-h-[300px] overflow-y-auto top-[115%] min-w-[200px] right-0 bg-white border-2 rounded-xl shadow-xl overflow-hidden">
            { PROPS.data.map(
                (ITEM: string) => {
                    const handleUpdateCurrency = () => {
                        PROPS.onItemClick(ITEM)
                    }

                    return (
                        <li
                            key={ ITEM }
                            className="w-full border-b-[1px]"
                        >
                            <button
                                onClick={ handleUpdateCurrency }
                                className="py-4 px-6 w-full text-left hover:bg-gray-100"
                            >
                                { ITEM }
                            </button>
                        </li>
                    )
                }
            ) }
        </ul>
    )
}