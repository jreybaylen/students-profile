import { Information } from '@shared/components'

type DataProps = {
    category: string
    description: string
}
type ProfileProps = {
    photo: string
    data: Array<DataProps>
}

export default function Profile (PROPS: ProfileProps): JSX.Element {
    return (
        <aside className="profile-content w-3/12 h-max">
            <div className="w-full mt-1 mb-8 flex flex-row items-center justify-center rounded-full overflow-hidden">
                <img
                    alt="Profile Photo"
                    className="block w-full mx-auto"
                    src={ PROPS.photo || 'default.jpg' }
                />
            </div>
            <div className="profile-left pl-6">
                { PROPS.data.map(
                    (INFORMATION: DataProps) => (
                        <Information
                            category={ INFORMATION.category }
                            key={ `${ INFORMATION.category }-${ INFORMATION.description }` }
                            description={ INFORMATION.description }
                        />
                    )
                ) }
            </div>
        </aside>
    )
}