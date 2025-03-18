'use client'

import { useState } from 'react'
import Head from 'next/head'
import StatCard from '../components/StatCard.js'
import EmergencyChart from '../components/EmergencyChart'
import RecentEmergencies from '../components/RecentEmergencies'

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('24h')
  
  return (
    <div>
      <Head>
        <title>Dashboard - Triageflow</title>
      </Head>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 p-4">Dashboard</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <select
            id="timeRange"
            name="timeRange"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Active Emergencies" 
          value="12" 
          change="+3" 
          trend="up" 
          description="from yesterday" 
        />
        <StatCard 
          title="Critical Cases" 
          value="5" 
          change="+2" 
          trend="up" 
          description="from yesterday" 
        />
        <StatCard 
          title="Avg. Response Time" 
          value="3.2 min" 
          change="-0.5 min" 
          trend="down" 
          description="from yesterday" 
        />
        <StatCard 
          title="Available Units" 
          value="8" 
          change="-2" 
          trend="down" 
          description="from yesterday" 
        />
      </div>

      <div className="mt-6">
        <EmergencyChart timeRange={timeRange} />
      </div>

      <div className="mt-6">
        <RecentEmergencies />
      </div>
    </div>
  )
}
