'use client'
import { useEffect, useState } from "react"

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState <string> ('')

  useEffect(() => {
    const getSbscribtions = async () => {    try {
      const resp = await fetch('/api/v1/subscriptions')
      const data = await resp.json()
      console.log(data);
      setSubscriptions(JSON.stringify(data))
      
    } catch (e) {
      console.log(e);
      setSubscriptions(JSON.stringify(e))
    }}

    getSbscribtions()
  }, [])

  return <p>{subscriptions}</p>
}

export default Subscriptions
