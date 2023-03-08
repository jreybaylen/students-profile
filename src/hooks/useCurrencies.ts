import axios from 'axios'
import { useEffect, useState } from 'react'

import { CURRENCY_API, SESSION_CURRENCIES } from '@constants/index'

type CurrencyItemProps = {
    name: string
    code: string
    symbol: string
    decimal_digits: number
}
type CurrencyProps = {
    [ key: string ]: CurrencyItemProps
}

export default function useCurrencies () {
    const [ CURRENCIES, setCurrencies ] = useState<CurrencyProps>({})

    useEffect(() => {
        const CACHE_CURRENCIES = sessionStorage.getItem(SESSION_CURRENCIES)

        if (CACHE_CURRENCIES) {
            setCurrencies(JSON.parse(CACHE_CURRENCIES))

            return
        }

        async function getCurrency () {
            try {
                const { data: CURRENCY_DATA } = await axios.get(CURRENCY_API)

                sessionStorage.setItem(SESSION_CURRENCIES, JSON.stringify(CURRENCY_DATA))
                setCurrencies(CURRENCY_DATA)
            } catch (ERROR: any) {
                setCurrencies({})
            }
        }

        getCurrency()
    }, [])

    return {
        data: CURRENCIES
    }
}