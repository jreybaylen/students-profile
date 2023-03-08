import { useState } from 'react'

import { useStudentInformation } from '@hooks/index'
import { HOME_TABLE_HEADERS } from '@constants/index'
import type { HeaderProps } from '@shared/widgets/Table'

import TableWidget from '@shared/widgets/Table'
import Header from '@shared/components/Header'

export default function HomePage (): JSX.Element {
    const [ SORTING, setSorting ] = useState<HeaderProps>()
    const { data, toggleSorting } = useStudentInformation()

    function hanleSortTable (DATA: HeaderProps, SORT_TYPE: HeaderProps['sort']) {
        const UPDATED_SORTING = {
            ...DATA,
            sort: SORT_TYPE || 'None'
        }

        setSorting(UPDATED_SORTING)
        toggleSorting(UPDATED_SORTING)
    }

    return (
        <main>
            <Header />
            <section className="container mt-12 mb-4">
                <TableWidget
                    items={ data }
                    dataKey="email"
                    activeSort={ SORTING }
                    onSort={ hanleSortTable }
                    header={ HOME_TABLE_HEADERS }
                />
            </section>
        </main>
    )
}