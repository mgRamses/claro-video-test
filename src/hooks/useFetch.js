import React, { useState, useEffect } from 'react'

function useFetch(url, totalChannelsToDisplay) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(()=>{
        setLoading(true)

        const queryParams = {
            device_id: 'web',
            device_category: 'web',
            device_model: 'web',
            device_type: 'web',
            device_so: 'Chrome',
            format: 'json',
            device_manufacturer: 'generic',
            authpn: 'webclient',
            authpt: 'tfg1h3j4k6fd7',
            api_version: 'v5.93',
            region: 'mexico',
            HKS: 'web61144bb49d549',
            user_id: '54343080',
            date_from: '20221122000000',
            date_to: '20221122235959',
            quantity: totalChannelsToDisplay
        }

        const fetchData = async() => {
            const response = await fetch(url + new URLSearchParams(queryParams))
            const data = await response.json()
            setData(data)
            setLoading(false)
        }
        fetchData().catch(error => setError(error))
    }, [url])

    return {data, loading, error}
}

export default useFetch      