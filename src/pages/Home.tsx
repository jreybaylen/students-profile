import { useStudentInformation } from '@hooks/index'

import { HOME_TABLE_HEADERS } from '@constants/index'

import TableWidget from '@shared/widgets/Table'
import Header from '@shared/components/Header'

export default function HomePage (): JSX.Element {
    const { data } = useStudentInformation()

    return (
        <main>
            <Header />
            <section className="container mt-12 mb-4">
                <TableWidget
                    items={ data }
                    dataKey="email"
                    header={ HOME_TABLE_HEADERS }
                />
            </section>
        </main>
    )
}