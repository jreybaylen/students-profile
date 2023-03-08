import { useState } from 'react'

import type { ChangeEvent } from 'react'
import { useStudentInformation } from '@hooks/index'
import { HOME_TABLE_HEADERS } from '@constants/index'
import type { HeaderProps } from '@shared/widgets/Table'
import type { StudentInformationprops } from '@hooks/useStudentsInformation'

import TableWidget from '@shared/widgets/Table'
import Header from '@shared/components/Header'

export default function HomePage (): JSX.Element {
    const [ SEARCH, setSearch ] = useState('')
    const [ SORTING, setSorting ] = useState<HeaderProps>()
    const { data, isLoading, updateStudents } = useStudentInformation()
    const [ CLONE_DATA, setCloneData ] = useState<Array<StudentInformationprops>>([])

    function handleSearchChange (EVENT: ChangeEvent<HTMLInputElement>) {
        const INPUT = EVENT.target.value
        const FILTERED_DATA = data.filter(
            (STUDENT: StudentInformationprops) => {
                const {
                    name,
                    phone,
                    email,
                    profile_major,
                    profile_status_eval,
                    courses_count
                } = STUDENT
                const STRING_TO_SEARCH = `${ name }${ phone }${ email }${ profile_major }${ profile_status_eval }${ courses_count }`

                return STRING_TO_SEARCH.match(INPUT)
            }
        )

        setSearch(INPUT)
        setCloneData(FILTERED_DATA)
    }

    function hanleSortTable (DATA: HeaderProps,
        SORT_TYPE: HeaderProps['sort']) {
        const UPDATED_SORTING = {
            ...DATA,
            sort: SORT_TYPE || 'None'
        }
        const IS_ASC = UPDATED_SORTING.sort === 'ASC'
        const PROP_SORT = UPDATED_SORTING.prop as keyof StudentInformationprops

        setSorting(UPDATED_SORTING)
        updateStudents(
            (PREV_STUDENTS: Array<StudentInformationprops>) => {
                const SORTED_STUDENTS = PREV_STUDENTS.sort(
                    (PREV_STUDENT: StudentInformationprops, NEXT_STUDENT: StudentInformationprops) => {
                        if (PREV_STUDENT[ PROP_SORT ] < NEXT_STUDENT[ PROP_SORT ]) {
                            return IS_ASC ? -1 : 1
                        }

                        if (PREV_STUDENT[ PROP_SORT ] > NEXT_STUDENT[ PROP_SORT ]) {
                            return IS_ASC ? 1 : -1
                        }

                        return 0
                    }
                )

                return SORTED_STUDENTS
            }
        )
    }

    return (
        <main>
            <Header />
            <section className="container mt-12 mb-4">
                <div className="w-5/12 mx-auto mb-6">
                    <input
                        type="text"
                        value={ SEARCH }
                        placeholder="Search"
                        onChange={ handleSearchChange }
                        className="w-full border-[1px] py-3 px-5 rounded-full font-light"
                    />
                </div>
                { isLoading
                    ? <div>Loading...</div>
                    : SEARCH ? (
                        <TableWidget
                            dataKey="email"
                            items={ CLONE_DATA }
                            activeSort={ SORTING }
                            onSort={ hanleSortTable }
                            header={ HOME_TABLE_HEADERS }
                        />
                    ) : (
                        <TableWidget
                            items={ data }
                            dataKey="email"
                            activeSort={ SORTING }
                            onSort={ hanleSortTable }
                            header={ HOME_TABLE_HEADERS }
                        />
                    )
                }
            </section>
        </main>
    )
}