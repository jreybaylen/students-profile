import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { groupBy } from '@utils/group'
import type { AxiosError } from 'axios'
import type { HeaderProps } from '@shared/widgets/Table'
import type { StudentInformationprops, CourseProps } from '@hooks/useStudentsInformation'
import { SESSION_STORAGE_NAME, PROFILE_TABLE_HEADERS, CURRENCY_API, CONVERSION_API } from '@constants/index'

import { Table, Notification } from '@shared/widgets'
import { Header, Information } from '@shared/components'

type ModifiedStudentInformationprops = {
    courses: Array<Array<CourseProps>>
} & Omit<StudentInformationprops, 'courses'>
type CurrencyItemProps = {
    symbol: string
    name: string
    symbol_native: string
    decimal_digits: number
    rounding: number
    code: string
    name_plural: string
}
type CurrencyProps = {
    [ key: string ]: CurrencyItemProps
}
type ConversionProps = {
    conversion_rate: number
}
type ConversionErrorProps = {
    'error-type': string
}

export default function ProfilePage (): JSX.Element {
    const params = useParams()
    const navigate = useNavigate()
    const [ CURRENCY, setCurrency ] = useState({
        symbol: '$',
        name: 'US Dollar',
        symbol_native: '$',
        decimal_digits: 2,
        rounding: 0,
        code: 'USD',
        name_plural: 'US dollars'
    })
    const [ LOADING, toggleLoading ] = useState(false)
    const [ DROP_DOWN, toggleDropdown ] = useState(false)
    const [ SORTING, setSorting ] = useState<HeaderProps>()
    const [ EXCHANGE_ERROR, setExchangeError ] = useState('')
    const [ CURRENCIES, setCurrencies ] = useState<CurrencyProps>({})
    const [ CONVERSION, setConversion ] = useState<ConversionProps>()
    const [ STUDENT, setStudent ] = useState<ModifiedStudentInformationprops>()
    const initProfile = useCallback(() => {
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
                                course_fee: `${ CURRENCY.symbol } ${ CONVERTED_RATE.toFixed(2) }`
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

    useEffect(() => {
        async function getCurrency () {
            try {
                const { data: CURRENCY_DATA } = await axios.get(CURRENCY_API)

                setCurrencies(CURRENCY_DATA)
            } catch (ERROR: any) {
                setCurrencies({})
            }
        }

        getCurrency()
    }, [])
    useEffect(() => {
        initProfile()
    }, [ initProfile ])

    console.log(EXCHANGE_ERROR)

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
                        <ul className="absolute max-h-[300px] overflow-y-auto top-[115%] min-w-[200px] right-0 bg-white border-2 rounded-xl shadow-xl overflow-hidden">
                            { Object.keys(CURRENCIES).map(
                                (ITEM: string) => {
                                    const CURRENCY_ITEM = CURRENCIES[ ITEM ]
                                    const handleUpdateCurrency = async () => {
                                        toggleLoading(true)

                                        try {
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

                                    return (
                                        <li
                                            key={ CURRENCY_ITEM.code }
                                            className="w-full border-b-[1px]"
                                        >
                                            <button
                                                onClick={ handleUpdateCurrency }
                                                className="py-4 px-6 w-full text-left hover:bg-gray-100"
                                            >
                                                ({ CURRENCY_ITEM.symbol }) { CURRENCY_ITEM.code }
                                            </button>
                                        </li>
                                    )
                                }
                            ) }
                        </ul>
                    ) }
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