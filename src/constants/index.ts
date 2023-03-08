export const SESSION_STORAGE_NAME = 'students-profile'

export const HOME_TABLE_HEADERS = [
    {
        is_img: true,
        label: '',
        prop: 'profile_img'
    },
    {
        label: 'Name',
        prop: 'name',
        linkProp: 'id'
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
        prop: 'profile_major'
    },
    {
        label: 'Status',
        prop: 'profile_status_eval'
    },
    {
        label: 'Total Course',
        prop: 'courses_count'
    }
]

export const PROFILE_TABLE_HEADERS = [
    {
        label: 'Semester Code',
        prop: 'semester_code'
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