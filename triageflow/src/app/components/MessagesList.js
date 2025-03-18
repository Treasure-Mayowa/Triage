import Image from 'next/image'

// Mock data
const conversations = [
  {
    id: 1,
    name: 'Team Alpha',
    avatar: null,
    latestMessage: 'Arrived at the scene, assessing situation',
    timestamp: '10 min ago',
    unread: 2,
    type: 'internal',
    emergency: 'Multi-car accident'
  },
  {
    id: 2,
    name: 'Team Bravo',
    avatar: null,
    latestMessage: 'Need additional resources at the fire site',
    timestamp: '25 min ago',
    unread: 0,
    type: 'internal',
    emergency: 'Building fire'
  },
  {
    id: 3,
    name: 'John Doe',
    avatar: null,
    latestMessage: 'Is ambulance on the way? My mother is having trouble breathing',
    timestamp: '45 min ago',
    unread: 3,
    type: 'external',
    emergency: 'Medical emergency'
  },
  {
    id: 4,
    name: 'City Services',
    avatar: null,
    latestMessage: 'Gas company dispatched technician, ETA 15 minutes',
    timestamp: '1 hour ago',
    unread: 0,
    type: 'external',
    emergency: 'Gas leak reported'
  },
  {
    id: 5,
    name: 'Hospital Dispatch',
    avatar: null,
    latestMessage: 'Preparing emergency room for incoming patients',
    timestamp: '2 hours ago',
    unread: 0,
    type: 'internal',
    emergency: null
  },
]

export default function MessagesList({ viewType, activeConversation, setActiveConversation }) {
  // Filter conversations based on viewType
  const filteredConversations = conversations.filter(conv => {
    if (viewType === 'all') return true
    return conv.type === viewType
  })

  return (
    <div>
      <div className="px-4 py-3 border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search messages"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <ul className="divide-y divide-gray-200 overflow-y-auto max-h-screen">
        {filteredConversations.map((conversation) => (
          <li 
            key={conversation.id}
            className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${
              activeConversation && activeConversation.id === conversation.id ? 'bg-gray-100' : ''
            }`}
            onClick={() => setActiveConversation(conversation)}
          >
            <div className="flex justify-between">
              <div className="flex items-center">
                {conversation.avatar ? (
                  <Image
                    src={conversation.avatar}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium flex-shrink-0">
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
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {conversation.latestMessage}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                {conversation.unread > 0 && (
                  <span className="mt-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-600 text-white">
                    {conversation.unread}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
