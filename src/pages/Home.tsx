import { useStudentInformation } from '@hooks/index'

import Table from '@shared/widgets/Table'
import HeaderWidget from '@shared/components/Header'

const TABLE_HEADERS = [
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

export default function HomePage (): JSX.Element {
    const { data } = useStudentInformation()

    return (
        <main>
            <HeaderWidget />
            <div className="container mt-12 mb-4">
                <Table
                    items={ data }
                    dataKey="email"
                    header={ TABLE_HEADERS }
                />
            </div>
        </main>
    )
}