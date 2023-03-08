import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { SESSION_STORAGE_NAME } from '@constants/index'
import type { StudentInformationprops } from '@hooks/useStudentsInformation'

import HeaderWidget from '@shared/components/Header'

export default function ProfilePage (): JSX.Element {
    const params = useParams()
    const navigate = useNavigate()
    const [ PROFILE, setProfile ] = useState<StudentInformationprops>()

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

        setProfile(FIND_PROFILE)
    }, [])

    return (
        <main>
            <HeaderWidget />
            <pre>
                { JSON.stringify(PROFILE, null, 2) }
            </pre>
        </main>
    )
}