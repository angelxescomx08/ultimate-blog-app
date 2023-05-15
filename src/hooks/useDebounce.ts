import { useEffect, useState } from 'react'

const useDebounce = (query: string, delay_miliseconds: number) => {

    const [debouncedValue, setDebouncedValue] = useState(query)

    useEffect(() => {
        const id = setTimeout(() => {
            setDebouncedValue(query)
        }, delay_miliseconds)

        return () => {
            clearTimeout(id)
        }
    }, [delay_miliseconds, query])

    return debouncedValue
}

export default useDebounce