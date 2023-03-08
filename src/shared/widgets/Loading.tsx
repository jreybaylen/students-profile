export default function Loading (): JSX.Element {
    return (
        <div className="fixed bg-black bg-opacity-50 inset-0 flex items-center justify-center z-10">
            <div className="lds-roller">
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
            </div>
        </div>
    )
}