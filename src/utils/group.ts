export function groupBy (DATA: Array<any>, KEY: string) {
    return DATA.reduce(
        (PREV_DATA, NEXT_DATA) => {
            const EXISTING_DATA = PREV_DATA[ NEXT_DATA [KEY ] ]

            return {
                ...PREV_DATA,
                [ NEXT_DATA[ KEY ] ]: [
                    ...(EXISTING_DATA || []),
                    {
                        ...NEXT_DATA,
                        [ KEY ]: (EXISTING_DATA?.length > 0) ? '' : NEXT_DATA[ KEY ]
                    }
                ]
            }
        },
        {}
    )
}