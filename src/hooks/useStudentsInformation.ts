import axios from 'axios'
import { useEffect, useState } from 'react'

import { getStatus } from '@utils/status'
import { SESSION_STORAGE_NAME } from '@constants/index'
import type { HeaderProps } from '@shared/widgets/Table'

type StudentProps = {
    id: number
    name: string
    phone: string
    email: string
    nickname: string
}
type ProfileProps = {
    id: number
    major: string
    status: Array<{
        date: string
        type: number
    }>
    year: string
    user_id: string
    user_img: string
}
export type CourseProps = {
    id: number
    user_id: string
    course_fee: string
    course_name: string
    semester_code: string
    course_selection: string
}
type CourseKeyProps = {
    [ key: string ]: CourseProps
}
export type StudentInformationprops = {
    profile_img: string
    courses_count: number
    profile: ProfileProps
    profile_major: string
    profile_status_eval: string
    courses: Array<CourseProps>
    courses_no_duplicates: CourseKeyProps
} & StudentProps

export default function useStudentInformation () {
    const [ ERROR, setError ] = useState()
    const [ LOADING, toggleLoading ] = useState(false)
    const [ STUDENTS, setStudents ] = useState<Array<StudentInformationprops>>([])
    
    function toggleSorting (DATA: HeaderProps) {
        const IS_ASC = DATA.sort === 'ASC'
        const PROP_SORT = DATA.prop as keyof StudentInformationprops
        
        setStudents(
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

    function isIncluded (FROM: string, ID: number) {
        return FROM === `user_${ ID }`
    }

    useEffect(() => {
        const CACHE_STUDENTS = sessionStorage.getItem(SESSION_STORAGE_NAME)

        if (CACHE_STUDENTS) {
            setStudents(JSON.parse(CACHE_STUDENTS))

            return
        }

        async function getStudents () {
            toggleLoading(true)

            try {
                const { data: PROFILE_DATA } = await axios.get('/214aef9d-b18a-4188-b55f-a25046408a7e')
                const { data: COURSES_DATA } = await axios.get('/34bdbb5f-70c0-41ce-aa0c-2bf46befa477')
                const { data: STUDENTS_DATA } = await axios.get('/79ebd782-efd6-469b-8dd5-663cf03406ad')
                const MERGE_DATA = (STUDENTS_DATA as Array<StudentProps>).map(
                    (STUDENT: StudentProps) => {
                        let coursesNoDuplicates: CourseKeyProps = { }
                        const PROFILE = (PROFILE_DATA as Array<ProfileProps>).find(
                            (PROFILE: ProfileProps) => isIncluded(PROFILE.user_id, STUDENT.id)
                        )
                        const COURSES = (COURSES_DATA as Array<CourseProps>).filter(
                            (COURSE: CourseProps) => {
                                const IS_INCLUDED = isIncluded(COURSE.user_id, STUDENT.id)

                                if (IS_INCLUDED) {
                                    coursesNoDuplicates[ `${ COURSE.course_selection }-${ COURSE.semester_code }` ] = COURSE
                                }

                                return IS_INCLUDED
                            }
                        )

                        return {
                            ...STUDENT,
                            profile: PROFILE,
                            courses: COURSES,
                            profile_major: PROFILE?.major,
                            profile_img: PROFILE?.user_img,
                            courses_no_duplicates: coursesNoDuplicates,
                            courses_count: Object.keys(coursesNoDuplicates).length,
                            profile_status_eval: getStatus(PROFILE?.status[0]?.type || 0)
                        }
                    }
                )

                sessionStorage.setItem(SESSION_STORAGE_NAME, JSON.stringify(MERGE_DATA))
                setStudents(MERGE_DATA as Array<StudentInformationprops>)
            } catch (ERROR: any) {
                setError(ERROR)
            } finally {
                toggleLoading(false)
            }
        }

        getStudents()
    }, [])

    return {
        error: ERROR,
        toggleSorting,
        data: STUDENTS,
        isLoading: LOADING
    }
}