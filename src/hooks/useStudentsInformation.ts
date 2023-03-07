import axios from 'axios'
import { useEffect, useState } from 'react'

import { getStatus } from '@utils/status'

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
type CourseProps = {
    id: number
    user_id: string
    course_fee: string
    course_name: string
    semester_code: string
    course_selection: string
}
type StudentInformationprops = {
    profile_img: string
    courses_count: number
    profile: ProfileProps
    profile_major: string
    profile_status_eval: string
    courses: Array<CourseProps>
} & StudentProps
type CourseKeyProps = {
    [ key: string ]: number
}

export default function useStudentInformation () {
    const [ ERROR, setError ] = useState()
    const [ LOADING, toggleLoading ] = useState(false)
    const [ STUDENTS, setStudents ] = useState<Array<StudentInformationprops>>([])

    function isIncluded (FROM: string, ID: number) {
        return FROM.includes(`_${ ID }`)
    }

    useEffect(() => {
        async function getStudents () {
            toggleLoading(true)

            try {
                const { data: PROFILE_DATA } = await axios.get('/214aef9d-b18a-4188-b55f-a25046408a7e')
                const { data: COURSES_DATA } = await axios.get('/34bdbb5f-70c0-41ce-aa0c-2bf46befa477')
                const { data: STUDENTS_DATA } = await axios.get('/79ebd782-efd6-469b-8dd5-663cf03406ad')
                console.log('COURSES_DATA: ', COURSES_DATA)
                const MERGE_DATA = (STUDENTS_DATA as Array<StudentProps>).map(
                    (STUDENT: StudentProps) => {
                        let coursesLength: CourseKeyProps = { }
                        const PROFILE = (PROFILE_DATA as Array<ProfileProps>).find(
                            (PROFILE: ProfileProps) => isIncluded(PROFILE.user_id, STUDENT.id)
                        )
                        const COURSES = (COURSES_DATA as Array<CourseProps>).filter(
                            (COURSE: CourseProps) => {
                                const IS_INCLUDED = isIncluded(COURSE.user_id, STUDENT.id)

                                if (IS_INCLUDED) {
                                    coursesLength[ `${ COURSE.course_selection }-${ COURSE.semester_code }` ] = 1
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
                            courses_count: Object.keys(coursesLength).length,
                            profile_status_eval: getStatus(PROFILE?.status[0]?.type || 0)
                        }
                    }
                )

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
        data: STUDENTS,
        isLoading: LOADING
    }
}