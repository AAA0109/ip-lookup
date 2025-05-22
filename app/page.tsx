"use client"

import { useState } from "react"
import IPLookupGraph from "@/components/ip-lookup-graph"

export default function Home() {
  const [ipAddress, setIpAddress] = useState("38.114.121.200")
  const [isLoading, setIsLoading] = useState(false)
  const [ipData, setIpData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLookup = async () => {
    if (!ipAddress) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/lookup?ip=${ipAddress}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setIpData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-2xl font-bold mb-6">IP Address Security Lookup</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          placeholder="Enter IP address"
          className="px-4 py-2 border rounded-md flex-1"
        />
        <button
          onClick={handleLookup}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoading ? "Loading..." : "Lookup"}
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <div className="flex-1 w-full border rounded-md overflow-hidden">
        {ipData ? (
          <IPLookupGraph data={ipData} />
        ) : (
          <div className="flex items-center justify-center h-full min-h-[400px] text-gray-500">
            {isLoading ? "Loading data..." : "Enter an IP address and click Lookup to view the graph"}
          </div>
        )}
      </div>
    </main>
  )
}
