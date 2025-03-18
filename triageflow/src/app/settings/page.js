'use client'
import { useState } from 'react'
import Head from 'next/head'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account')
  
  return (
    <div>
      <Head>
        <title>Settings - Emergency Triage</title>
      </Head>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['account', 'notifications', 'security', 'integrations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mx-6 ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'account' && <AccountSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'integrations' && <IntegrationSettings />}
        </div>
      </div>
    </div>
  )
}

function AccountSettings() {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900">Profile</h3>
      <p className="mt-1 text-sm text-gray-600">Update your profile details.</p>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
      <p className="mt-1 text-sm text-gray-600">Manage your notification preferences.</p>
    </div>
  )
}

function SecuritySettings() {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900">Security</h3>
      <p className="mt-1 text-sm text-gray-600">Update your security settings.</p>
    </div>
  )
}

function IntegrationSettings() {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900">Integrations</h3>
      <p className="mt-1 text-sm text-gray-600">Manage third-party integrations.</p>
    </div>
  )
}
