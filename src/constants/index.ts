export const SESSION_STORAGE_NAME = 'students-profile'

export const TABLE_HEADERS = [
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