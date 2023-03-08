import { Link } from 'react-router-dom'

export default function Header (): JSX.Element {
    return (
        <header className="py-4 border-b-[1px]">
            <div className="container">
                <Link
                    to="/"
                    className="text-3xl font-bold"
                >
                    Students Profile
                </Link>
            </div>
        </header>
    )
}