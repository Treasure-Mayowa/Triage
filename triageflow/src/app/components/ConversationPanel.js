import { useState } from 'react'

// Mock conversation data
const messageHistory = {
  1: [
    { id: 1, sender: 'Team Alpha', content: 'We\'ve arrived at the scene of the accident.', timestamp: '2025-03-18T10:15:00', isMe: false },
    { id: 2, sender: 'You', content: 'How many vehicles are involved?', timestamp: '2025-03-18T10:16:00', isMe: true },
    { id: 3, sender: 'Team Alpha', content: 'Three vehicles. Two with significant damage. Potential injuries in at least one.', timestamp: '2025-03-18T10:17:00', isMe: false },
    { id: 4, sender: 'You', content: 'Any need for additional units?', timestamp: '2025-03-18T10:18:00', isMe: true },
    { id: 5, sender: 'Team Alpha', content: 'Yes, requesting medical support. Traffic is backed up and we may need assistance.', timestamp: '2025-03-18T10:19:00', isMe: false },
    { id: 6, sender: 'You', content: 'Dispatching Team Delta for traffic control and ambulance is en route.', timestamp: '2025-03-18T10:20:00', isMe: true },
    { id: 7, sender: 'Team Alpha', content: 'Arrived at the scene, assessing situation', timestamp: '2025-03-18T10:25:00', isMe: false },
  ],
  2: [
    { id: 1, sender: 'Team Bravo', content: 'Fire is spreading to the second floor.', timestamp: '2025-03-18T09:45:00', isMe: false },
    { id: 2, sender: 'You', content: 'Is the building evacuated?', timestamp: '2025-03-18T09:46:00', isMe: true },
    { id: 3, sender: 'Team Bravo', content: 'Yes, all occupants are out. Need additional resources at the fire site.', timestamp: '2025-03-18T09:50:00', isMe: false },
  ],
  3: [
    { id: 1, sender: 'John Doe', content: 'My mother is having trouble breathing. We\'re at 25 Main St, Apt 2B.', timestamp: '2025-03-18T09:20:00', isMe: false },
    { id: 2, sender: 'You', content: 'Emergency services are on the way. Is she conscious?', timestamp: '2025-03-18T09:21:00', isMe: true },
    { id: 3, sender: 'John Doe', content: 'Yes, but she\'s having severe chest pain too.', timestamp: '2025-03-18T09:22:00', isMe: false },
    { id: 4, sender: 'You', content: 'Can you put her in a comfortable position, slightly upright? Try to keep her calm.', timestamp: '2025-03-18T09:23:00', isMe: true },
    { id: 5, sender: 'John Doe', content: 'Is ambulance on the way? My mother is having trouble breathing', timestamp: '2025-03-18T09:30:00', isMe: false },
    { id: 6, sender: 'You', content: 'Yes, ETA is approximately 5 minutes. Please stay on the line.', timestamp: '2025-03-18T09:31:00', isMe: true },
  ],
  4: [
    { id: 1, sender: 'City Services', content: 'Received reports of gas smell at 789 Pine Avenue.', timestamp: '2025-03-18T08:45:00', isMe: false },
    { id: 2, sender: 'You', content: 'We\'ve dispatched emergency team. Have residents been evacuated?', timestamp: '2025-03-18T08:47:00', isMe: true },
    { id: 3, sender: 'City Services', content: 'Yes, evacuation in progress. Gas company has been notified.', timestamp: '2025-03-18T08:50:00', isMe: false },
    { id: 4, sender: 'City Services', content: 'Gas company dispatched technician, ETA 15 minutes', timestamp: '2025-03-18T09:00:00', isMe: false },
  ],
  5: [
    { id: 1, sender: 'Hospital Dispatch', content: 'How many victims should we expect from the highway incident?', timestamp: '2025-03-18T08:00:00', isMe: false },
    { id: 2, sender: 'You', content: 'Initial report indicates 3 injuries, 1 critical. Will update as more info comes in.', timestamp: '2025-03-18T08:02:00', isMe: true },
    { id: 3, sender: 'Hospital Dispatch', content: 'Preparing emergency room for incoming patients', timestamp: '2025-03-18T08:05:00', isMe: false },
  ],
}

export default function ConversationPanel({ conversation, onBack }) {
  const [newMessage, setNewMessage] = useState('')
  const messages = messageHistory[conversation.id] || []

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim() === '') return
    
    // In a real app, you would send the message to the server here
    console.log('Sending message:', newMessage)
    setNewMessage('')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center">
        <button 
          className="md:hidden mr-2 text-gray-500"
          onClick={onBack}
        >
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {conversation.avatar ? (
          <img
            src={conversation.avatar}
            alt=""
            className="h-10 w-10 rounded-full"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
            {conversation.name.charAt(0)}
          </div>
        )}
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">
            {conversation.name}
            {conversation.type === 'internal' && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Internal
              </span>
            )}
            {conversation.type === 'external' && (
              <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                External
              </span>
            )}
          </p>
          {conversation.emergency && (
            <p className="text-xs text-indigo-600">
              RE: {conversation.emergency}
            </p>
          )}
        </div>
        <div className="ml-auto flex">
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="ml-3 text-gray-500 hover:text-gray-700">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                  message.isMe 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <div className="flex justify-between items-baseline">
                  <span className={`font-medium text-xs ${message.isMe ? 'text-indigo-200' : 'text-gray-600'}`}>
                    {message.isMe ? 'You' : message.sender}
                  </span>
                  <span className={`text-xs ml-2 ${message.isMe ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="mt-1">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage}>
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-10 w-10 text-gray-500 hover:text-gray-600"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-1 border border-gray-300 rounded-full py-2 px-4 mx-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
