'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import EmergencyPopup from '../components/EmergencyPopup'
import { io } from 'socket.io-client'
//import { allEmergencies } from './data'

const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low']
const STATUSES = ['All', 'Active', 'In Progress', 'Resolved']

const priorityOrder = {
  Critical: 1,
  High: 2,
  Medium: 3,
  Low: 4,
}

let allEmergencies


export default function Emergencies() {
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCards, setExpandedCards] = useState([])
  const [mounted, setMounted] = useState(false)
  const [popup, setPopup] = useState(false)
  const [emergencies, setEmergencies] = useState([])

  const togglePopup = () => {
    setPopup(!popup)
  }

  const socket = io('https://triage-pww1.onrender.com')
  // Set mounted flag to true after client has mounted
  useEffect(() => {
    //Fetch emergencies
    fecthEmergencies()
    socket.on('emergency-updated', (data) => {
      setEmergencies(data)
    })
    setMounted(true)
  }, [])

  // Fetch emergencies from db
  const fecthEmergencies = async () => {
    const response = await fetch('/api/emergencies')
    allEmergencies = await response.json()
    setEmergencies(allEmergencies)
  }

  //Change emergency status
  const changeStatus = async (newStatus, id) => {
    const response = await fetch(`/api/emergencies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })

  }

  // Filter and sort emergencies
  const filteredEmergencies = emergencies? emergencies
    .filter((emergency) => {
      return (
        (priorityFilter === 'All' || emergency.priority === priorityFilter) &&
        (statusFilter === 'All' || emergency.status === statusFilter) &&
        (searchQuery === '' ||
          emergency.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emergency.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emergency.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })
    .sort((a, b) =>  new Date(b.timestamp) - new Date(a.timestamp))
    .sort((a, b) => (priorityOrder[a.priority] || Infinity) - (priorityOrder[b.priority] || Infinity))
    : emergencies

  const toggleCard = (id) => {
    setExpandedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    )
  }

  // Use a client-side safe formatting function
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div>
      <Head>
        <title>Emergencies - Triageflow</title>
      </Head>
      {popup? <EmergencyPopup popup={togglePopup} /> : null}
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Emergencies</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => togglePopup()}
          >
            New Emergency
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center">
        <div className="w-full sm:w-auto sm:mr-4 mb-4 sm:mb-0">
          <input
            id="search"
            name="search"
            type="search"
            placeholder="Search emergencies"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="w-full sm:w-auto sm:mr-4 mb-4 sm:mb-0">
          <select
            id="priority"
            name="priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority} Priority
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <select
            id="status"
            name="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status} Status
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredEmergencies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmergencies.map((emergency) => (
            <div
              key={emergency.id}
              className="rounded-xl shadow-sm hover:shadow-lg transition duration-200 cursor-pointer"
              onClick={() => toggleCard(emergency._id)}
            >
              <div className="p-4 bg-gray-50">
                <h2 className="text-xl font-semibold text-indigo-600">
                  <Link href={`/emergencies/${emergency._id}`}>
                    {emergency.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-gray-600">{emergency.location}</p>
                <div className="mt-2"> 
                  <span className="text-sm font-medium text-gray-700">Caller: {emergency.name}</span>
                  <span className="text-sm text-gray-900 italic">({emergency.phoneNumber})</span>
                </div>
                <div className="mt-1">
                  <span className="text-sm font-medium text-gray-700">Status: </span>
                  <select 
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${emergency.status === 'Active' ? 'bg-red-100 text-red-800' : emergency.status === 'In Progress'? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-800'}`}
                    value={emergency.status}
                    onChange={(e) => changeStatus(e.target.value, emergency._id)}>
                    {STATUSES.map((status) => 
                      <option key={status} value={status}>
                      {status}
                    </option>
                    )}
                  </select>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {/* Only render the date on the client */}
                  {mounted ? formatDate(emergency.timestamp) : null}
                </div>
              </div>
              {expandedCards.includes(emergency._id) && (
                <div className="p-4 border-t border-gray-200 bg-white">
                  <p className="text-sm text-gray-700">{emergency.description}</p>
                  <div className="mt-2 text-sm text-gray-700">
                    <span className="font-medium">Transcript:</span> {emergency.transcript.replace(/\\n/g, '\n')}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Source:</span> {emergency.source}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No emergencies match your search.</p>
      )}
    </div>
  )
}
