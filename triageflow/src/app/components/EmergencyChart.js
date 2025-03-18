import { useState } from "react"

export default function EmergencyChart({ timeRange }) {
    const [trend, setTrend] = useState("priority")
    // In a real app, you woul
    // d fetch data based on the timeRange
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Emergency Trend</h3>
          <select className="mt-1 text-sm text-gray-500" value={trend} onChange={(e) => setTrend(e.target.value)}>
            <option value={"priority"}>Emergency cases by priority level</option>
            <option value={"states"}>Emergency cases by states</option>
          </select>

        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="h-36 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </div>
      </div>
    )
  }
  