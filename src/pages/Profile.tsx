import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { SESSION_STORAGE_NAME } from '@constants/index'
import type { StudentInformationprops } from '@hooks/useStudentsInformation'

import Header from '@shared/components/Header'
import TableWidget from '@shared/widgets/Table'

export default function ProfilePage (): JSX.Element {
    const params = useParams()
    const navigate = useNavigate()
    const [ STUDENT, setStudent ] = useState<StudentInformationprops>()
    
    function handleGoBack () {
        navigate(-1)
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

        setStudent(FIND_PROFILE)
    }, [])

    return (
        <main>
            <Header />
            <section className="container">
                <div className="my-4">
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
                <aside className="profile-content w-3/12">
                    <div className="w-full mt-1 mb-8 flex flex-row items-center justify-center rounded-full overflow-hidden">
                        <img
                            alt="Profile Photo"
                            className="block w-full mx-auto"
                            src={ `/assets/${ STUDENT?.profile_img || 'default.jpg' }` }
                        />
                    </div>
                    <div className="profile-left pl-6">
                        <p className="w-full">
                            <span className="mr-2">Name: </span>
                            <span className="font-semibold">
                                { STUDENT?.name } { STUDENT?.nickname ? `(${ STUDENT.nickname })` : '' }
                            </span>
                        </p>
                        <p>
                            <span className="mr-2">Major: </span>
                            <span className="font-semibold">
                                { STUDENT?.profile_major }
                            </span>
                        </p>
                        <p>
                            <span className="mr-2">Year: </span>
                            <span className="font-semibold">
                                { STUDENT?.profile.year }
                            </span>    
                        </p>
                        <p>
                            <span className="mr-2">Status: </span>
                            <span className="font-semibold">
                                { STUDENT?.profile_status_eval }
                            </span>
                        </p>
                    </div>
                </aside>
                <div className="profile-content ml-3 w-9/12">

                </div>
            </section>
            <pre>
                { JSON.stringify(STUDENT, null, 2) }
            </pre>
        </main>
    )
}