'use client'
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import MessagesList from '../components/MessagesList'
import ConversationPanel from '../components/ConversationPanel'

export default function Messages() {
  const [activeConversation, setActiveConversation] = useState(null)
  const [viewType, setViewType] = useState('all') // 'all', 'internal', 'external'
  
  return (
    <div>
      <Head>
        <title>Messages - Emergency Triage</title>
      </Head>
      
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <div className="mt-3 flex sm:mt-0">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setViewType('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                viewType === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setViewType('internal')}
              className={`px-4 py-2 text-sm font-medium ${
                viewType === 'internal' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300`}
            >
              Internal
            </button>
            <button
              type="button"
              onClick={() => setViewType('external')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                viewType === 'external' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              External
            </button>
          </div>
          <button
            type="button"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            New Message
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="flex h-screen-minus-header">
          <div className={`w-1/3 border-r ${activeConversation ? 'hidden md:block' : 'block'}`}>
            <MessagesList 
              viewType={viewType} 
              activeConversation={activeConversation} 
              setActiveConversation={setActiveConversation} 
            />
          </div>
          <div className={`${activeConversation ? 'block w-full md:w-2/3' : 'hidden md:block md:w-2/3'} bg-gray-50`}>
            {activeConversation ? (
              <ConversationPanel 
                conversation={activeConversation} 
                onBack={() => setActiveConversation(null)} 
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a conversation from the list to view messages.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}