export function getStatus (STATUS: number): string {
    const TYPES = [
        'Withdrawn',
        'Good',
        'Probation',
        'Inactive'
    ]

    return TYPES[ STATUS ]
}