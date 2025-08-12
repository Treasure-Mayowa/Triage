import Link from 'next/link'
//import { allEmergencies } from '../emergencies/data'
import 'ldrs/ring'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const API_URL = process.env.NEXT_PUBLIC_API_URL 

export default function RecentEmergencies() {

  const [loading, setLoading] = useState(true)
  const [emergencies, setEmergencies] = useState([])

  const priorityOrder = {
    Critical: 1,
    High: 2, 
    Medium: 3,
    Low: 4,
  }

  const socket = io('https://triage-pww1.onrender.com')
    // Set mounted flag to true after client has mounted
  
  useEffect(() => {
    
    // Fetch emergencies with retry logic
    (async () => {
      try {
        const result = await retryApiCall() // Call retry function logic with default parameter
        console.log("API call successful:", result)
      } catch (finalError) {
        console.log("API call failed after all retries:", finalError.message)
      }
    })()    

    socket.on('emergency-updated', (data) => {
      setEmergencies(data)
    })
  }, [])

  //API retry logic
  async function retryApiCall(maxRetries=3, delayMs=1000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetchEmergencies()
      // Check for successful response criteria (e.g., HTTP status code 200)
      if (response && response.ok) {
        return response.data // Return data on success
      } else {
        throw new Error(`API call failed with error: ${response.data}`)
      }
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error.message);
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs)) // Wait before retrying
      } else {
        console.error("All retry attempts exhausted")
        throw error // Re-throw error after exhausting retries
      }
    }
  }
}

  // Fetch emergencies from db
  const fetchEmergencies = async () => {
    try {
      const response = await fetch(`${API_URL}/api/emergencies`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      const result = data
        // Filter for active emergencies
        .filter(emergency => emergency.status === 'Active' )
        .sort((a, b) => {
        // Compare priorities
        const priorityDiff = (priorityOrder[a.priority] || Infinity) - (priorityOrder[b.priority] || Infinity);
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then sort by timestamp
        return new Date(b.timestamp) - new Date(a.timestamp);
      })
      .slice(0, 5) // Return only five 
    setEmergencies(result)
      return { ok: true, status: response.status, data: "Successful"}
    } catch (error) {
      console.error('Error fetching emergencies')
      throw new Error(`Error fetching emergencies: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // Format date in a client-side safe way
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Emergencies</h3>
          <p className="mt-1 text-sm text-gray-500">List of emergencies by priority</p>
        </div>
        <Link href="/emergencies" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          View all
        </Link>
      </div>
      {loading? <l-ring size="60" color="coral"></l-ring> : <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Emergency
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reported
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {emergencies.map((emergency) => (
              <tr key={emergency.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link href={`/emergencies/${emergency.id}`}>
                    {emergency.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {emergency.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    emergency.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                    emergency.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {emergency.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(emergency.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    emergency.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {emergency.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  )
}

