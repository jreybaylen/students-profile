import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { groupBy } from '@utils/group'
import type { HeaderProps } from '@shared/widgets/Table'
import { SESSION_STORAGE_NAME, PROFILE_TABLE_HEADERS } from '@constants/index'
import type { StudentInformationprops, CourseProps } from '@hooks/useStudentsInformation'

import TableWidget from '@shared/widgets/Table'
import { Header, Information } from '@shared/components'

type ModifiedStudentInformationprops = {
    courses: Array<Array<CourseProps>>
} & Omit<StudentInformationprops, 'courses'>

export default function ProfilePage (): JSX.Element {
    const params = useParams()
    const navigate = useNavigate()
    const [ SORTING, setSorting ] = useState<HeaderProps>()
    const [ STUDENT, setStudent ] = useState<ModifiedStudentInformationprops>()
    
    function handleGoBack () {
        navigate(-1)
    }

    function handleTableSort (DATA: HeaderProps, SORT_TYPE: HeaderProps['sort']) {
        const UPDATED_SORTING = {
            ...DATA,
            sort: SORT_TYPE || 'None'
        }
        const IS_ASC = UPDATED_SORTING.sort === 'ASC'

        setSorting(UPDATED_SORTING)
        setStudent(
            (PREV_STUDENT: ModifiedStudentInformationprops | undefined) => ({
                ...(PREV_STUDENT as ModifiedStudentInformationprops),
                courses: (PREV_STUDENT as ModifiedStudentInformationprops).courses.sort(
                    (PREV_COURSE: Array<CourseProps>, NEXT_COURSE: Array<CourseProps>) => {
                        const PREV_DATA = PREV_COURSE[0][ DATA.prop as keyof CourseProps ]
                        const NEXT_DATA = NEXT_COURSE[0][ DATA.prop as keyof CourseProps ]

                        if (PREV_DATA < NEXT_DATA) {
                            return IS_ASC ? -1 : 1
                        }

                        if (PREV_DATA > NEXT_DATA) {
                            return IS_ASC ? 1 : -1
                        }

                        return 0
                    }
                )
            })
        )
    }

    useEffect(() => {
        const STUDENTS = sessionStorage.getItem(SESSION_STORAGE_NAME)

        if (!STUDENTS) {
            navigate('/', { replace: true })

            return
        }

        const STUDENTS_LIST = JSON.parse(STUDENTS) as Array<StudentInformationprops>
        const FIND_PROFILE = STUDENTS_LIST.find(
            (STUDENT: StudentInformationprops) => STUDENT.id === parseInt(params.id as string)
        )
        
        if (!FIND_PROFILE) {
            navigate('/', { replace: true })

            return
        }

        const MODIFIED_COURSES = Object.keys(FIND_PROFILE.courses_no_duplicates).map(
            (COURSE: string) => FIND_PROFILE.courses_no_duplicates[ COURSE ]
        )
        const GROUP_BY_SEM_CODE = groupBy(MODIFIED_COURSES, 'semester_code')

        setStudent({
            ...FIND_PROFILE,
            courses: Object.keys(GROUP_BY_SEM_CODE).map(
                (CODE: string) => GROUP_BY_SEM_CODE[ CODE ]
            )
        })
    }, [])

    return (
        <main>
            <Header />
            <section className="container">
                <div className="my-12">
                    <button
                        type="button"
                        onClick={ handleGoBack }
                        className="rounded-full py-3 min-w-[150px] border-2 text-sm hover:shadow-xl duration-150"
                    >
                        <span>&larr;</span>
                        <span className="ml-1">Students List</span>
                    </button>
                </div>
            </section>
            <section className="container flex flex-row">
                <aside className="profile-content w-3/12 h-max">
                    <div className="w-full mt-1 mb-8 flex flex-row items-center justify-center rounded-full overflow-hidden">
                        <img
                            alt="Profile Photo"
                            className="block w-full mx-auto"
                            src={ `/assets/${ STUDENT?.profile_img || 'default.jpg' }` }
                        />
                    </div>
                    <div className="profile-left pl-6">
                        <Information
                            category="Name: "
                            description={ `${ STUDENT?.name } ${ STUDENT?.nickname ? `(${ STUDENT.nickname })` : '' }` }
                        />
                        <Information
                            category="Major: "
                            description={ `${ STUDENT?.profile_major }` }
                        />
                        <Information
                            category="Year: "
                            description={ `${ STUDENT?.profile.year }` }
                        />
                        <Information
                            category="Status: "
                            description={ `${ STUDENT?.profile_status_eval }` }
                        />
                    </div>
                </aside>
                <div className="profile-content ml-3 w-9/12 h-max max-h-[700px] overflow-y-auto">
                    { STUDENT?.courses?.length ? (
                        <TableWidget
                            dataKey="course_name"
                            activeSort={ SORTING }
                            items={ STUDENT?.courses }
                            onSort={ handleTableSort }
                            header={ PROFILE_TABLE_HEADERS }
                        />
                    ) : (
                        <div className="flex mt-6 mb-8 justify-center">
                            <p className="text-xl py-3 px-12 border-2 rounded-xl">
                                No Data Found
                            </p>
                        </div>
                    ) }
                </div>
            </section>
        </main>
    )
}