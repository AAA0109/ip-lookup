import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ip = searchParams.get("ip")

  if (!ip) {
    return NextResponse.json({ error: "IP address is required" }, { status: 400 })
  }

  try {
    const apiKey = process.env.ABUSEIPDB_API_KEY
    if (!apiKey) {
      throw new Error(`ABUSEIPDB_API_KEY not found`)
    }

    const response = await fetch(
      `https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}&maxAgeInDays=90&verbose=true`,
      {
        headers: {
          Key: apiKey,
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching IP data:", error)
    throw new Error(`Error fetching IP data`)
  }
}
