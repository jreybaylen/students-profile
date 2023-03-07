import { useStudentInformation } from '@hooks/index'

import HeaderWidget from '@shared/widgets/Header'

export default function HomePage (): JSX.Element {
    const { data } = useStudentInformation()

    return (
        <main>
            <HeaderWidget />
            <div className="container py-4">
                <pre>
                    { JSON.stringify(data, null, 2) }
                </pre>
            </div>
        </main>
    )
}