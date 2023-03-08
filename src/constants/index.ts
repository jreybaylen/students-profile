import type { TableProps } from '@shared/widgets/Table'

export const SESSION_STORAGE_NAME = 'students-profile'

export const HOME_TABLE_HEADERS: TableProps['header'] = [
    {
        is_img: true,
        label: '',
        prop: 'profile_img'
    },
    {
        label: 'Name',
        prop: 'name',
        linkProp: 'id',
        sort: 'None'
    },
    {
        label: 'Phone Number',
        prop: 'phone'
    },
    {
        label: 'Email',
        prop: 'email'
    },
    {
        label: 'Major',
        prop: 'profile_major',
        sort: 'None'
    },
    {
        label: 'Status',
        prop: 'profile_status_eval',
        sort: 'None'
    },
    {
        label: 'Total Course',
        prop: 'courses_count'
    }
]

export const PROFILE_TABLE_HEADERS: TableProps['header'] = [
    {
        label: 'Semester Code',
        prop: 'semester_code',
        sort: 'None'
    },
    {
        label: 'Course Name',
        prop: 'course_name'
    },
    {
        label: 'Course Selection',
        prop: 'course_selection'
    },
    {
        label: 'Course Fee',
        prop: 'course_fee'
    }
]

export const CONVERSION_API = 'https://v6.exchangerate-api.com/v6'

export const CURRENCY_API = 'https://gist.githubusercontent.com/JCGonzaga01/9f93162c5fb799b7c084bb28fc69a2f1/raw/94c55f89dc4c1e2e7ca49de5658c3441a2b348af/Updated-Common-Currency.json'