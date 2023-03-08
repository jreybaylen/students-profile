import { useStudentInformation } from '@hooks/index'

import { TABLE_HEADERS } from '@constants/index'

import Table from '@shared/widgets/Table'
import HeaderWidget from '@shared/components/Header'

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