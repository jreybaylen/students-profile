type InformationProps = {
    category: string
    description: string
}

export default function Information (PROPS: InformationProps): JSX.Element {
    return (
        <p className="w-full">
            <span className="mr-2">
                { PROPS.category }
            </span>
            <span className="font-semibold">
                { PROPS.description }
            </span>
        </p>
    )
}