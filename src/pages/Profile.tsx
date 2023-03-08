import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { groupBy } from '@utils/group'
import type { AxiosError } from 'axios'
import useCurrencies from '@hooks/useCurrencies'
import type { HeaderProps } from '@shared/widgets/Table'
import type { StudentInformationprops, CourseProps } from '@hooks/useStudentsInformation'
import { SESSION_STUDENTS_PROFILE, PROFILE_TABLE_HEADERS, CONVERSION_API } from '@constants/index'

import { Header } from '@shared/components'
import { Table, Profile, Notification, MenuList } from '@shared/widgets'

type ModifiedStudentInformationprops = {
    courses: Array<Array<CourseProps>>
} & Omit<StudentInformationprops, 'courses'>
type ConversionProps = {
    conversion_rate: number
}
type ConversionErrorProps = {
    'error-type': string
}

export default function ProfilePage (): JSX.Element {
    const params = useParams()
    const navigate = useNavigate()
    const { data } = useCurrencies()
    const [ CURRENCY, setCurrency ] = useState({
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
        decimal_digits: 2
    })
    const [ LOADING, toggleLoading ] = useState(false)
    const [ DROP_DOWN, toggleDropdown ] = useState(false)
    const [ SORTING, setSorting ] = useState<HeaderProps>()
    const [ EXCHANGE_ERROR, setExchangeError ] = useState('')
    const [ CONVERSION, setConversion ] = useState<ConversionProps>()
    const [ STUDENT, setStudent ] = useState<ModifiedStudentInformationprops>()
    const initProfile = useCallback(() => {
        const STUDENTS = sessionStorage.getItem(SESSION_STUDENTS_PROFILE)

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
        const STUDENT_INFO = {
            ...FIND_PROFILE,
            courses: Object.keys(GROUP_BY_SEM_CODE).map(
                (CODE: string) => {
                    const COURSES_INFO = GROUP_BY_SEM_CODE[ CODE ] as Array<CourseProps>
                    const INFO_WITH_CURRENCY = COURSES_INFO.map(
                        (COURSE_INFO: CourseProps) => {
                            const CONVERTED_RATE = parseFloat(COURSE_INFO.course_fee) * parseFloat(`${ CONVERSION?.conversion_rate || 1 }`)

                            return {
                                ...COURSE_INFO,
                                course_fee: `${ CURRENCY.symbol } ${ CONVERTED_RATE.toFixed(CURRENCY.decimal_digits) }`
                            }
                        }
                    )

                    return INFO_WITH_CURRENCY
                }
            )
        }

        setStudent(STUDENT_INFO)
    }, [ CURRENCY.symbol ])
    
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

    function handleToggleDropDown () {
        toggleDropdown(
            (PREV_STATUS: boolean) => !PREV_STATUS
        )
    }

    function handleDismissError () {
        setExchangeError('')
    }
    
    async function handleUpdateCurrency (ITEM: string) {
        toggleLoading(true)

        try {
            const CURRENCY_ITEM = data[ ITEM ]
            const { data: CONVERSION_DATA } = await axios.get(
                `${ CONVERSION_API }/6906296d8b41e56e64718190/pair/USD/${ CURRENCY_ITEM.code }`
            )

            setConversion(CONVERSION_DATA)
            setCurrency(CURRENCY_ITEM)
        } catch (ERROR: unknown) {
            setExchangeError(
                (ERROR as AxiosError<ConversionErrorProps>).response?.data['error-type']!
            )
        } finally {
            toggleDropdown(false)
            toggleLoading(false)
        }
    }

    useEffect(() => {
        initProfile()
    }, [ initProfile ])

    return (
        <main>
            <Header />
            <section className="container my-12">
                <Notification
                    message={ EXCHANGE_ERROR }
                    onDismiss={ handleDismissError }
                    isOpen={ Boolean(EXCHANGE_ERROR) }
                />
                <div className="flex flex-row justify-between relative">
                    <button
                        type="button"
                        onClick={ handleGoBack }
                        className="rounded-full py-3 min-w-[150px] border-2 text-sm hover:shadow-xl duration-150"
                    >
                        <span>&larr;</span>
                        <span className="ml-1">Students List</span>
                    </button>
                    <button
                        onClick={ handleToggleDropDown }
                        className="p-3 border-2 rounded-full min-w-[150px] font-semibold hover:shadow-xl"
                    >
                        ({ CURRENCY.symbol }) { CURRENCY.code }
                    </button>
                    { DROP_DOWN && (
                        <MenuList
                            data={ Object.keys(data) }
                            onItemClick={ handleUpdateCurrency }
                        />
                    ) }
                </div>
            </section>
            <section className="container flex flex-row">
                <Profile
                    photo={ `/assets/${ STUDENT?.profile_img }` }
                    data={ [
                        {
                            category: 'Name: ',
                            description: `${ STUDENT?.name } ${ STUDENT?.nickname ? `(${ STUDENT.nickname })` : '' }`
                        },
                        {
                            category: 'Major: ',
                            description: STUDENT?.profile_major || ''
                        },
                        {
                            category: 'Year: ',
                            description: STUDENT?.profile.year || ''
                        },
                        {
                            category: 'Status: ',
                            description: STUDENT?.profile_status_eval || ''
                        }
                    ] }
                />
                <div className="profile-content ml-3 w-9/12 h-max max-h-[700px] overflow-y-auto">
                    <Table
                        dataKey="course_name"
                        activeSort={ SORTING }
                        onSort={ handleTableSort }
                        items={ STUDENT?.courses || [] }
                        header={ PROFILE_TABLE_HEADERS }
                    />
                </div>
            </section>
        </main>
    )
}