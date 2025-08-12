import { useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL 

export default function EmergencyPopup({ popup }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [priority, setPriority] = useState('critical')
    const [location, setLocation] = useState('')
    const [transcript, setTranscript] = useState('')
    const [loading, setLoading] = useState(false)
    
    const addEmergency = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
          const response = await fetch(`${API_URL}/api/emergencies`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber, 
                location: location, 
                callSid: null, 
                title: title, 
                description: description, 
                priority: priority,  
                source: "Dashboard Add", 
                transcript: transcript, 
                assignedTo: null
            })
        })
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        console.log('Emergency created successfully:', result)

        // Reset form
        setTitle('')
        setDescription('')
        setPhoneNumber('')
        setPriority('critical')
        setLocation('')
        setTranscript('')
    } catch (error) {
      console.error(`Error fetching emergencies: ${error}`)
    } finally {
      setLoading(false)
      popup()
    }
        
    }
    return (
        <div 
            className={`fixed inset-0 flex items-center justify-center backdrop-blur-sm`}>
            <div 
                className="w-[50%] bg-white p-6 rounded-lg shadow-lg cursor-pointer">
                <div className="flex justify-between items-center">
                    <h3 className="text-left font-medium">New Emergency</h3>
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={popup}>
                        <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
                    </svg>
                </div>
                <form className="mt-4" onSubmit={addEmergency}>
                <fieldset disabled={loading}>
                    <input type="text" placeholder="Title" className="w-full p-2 border border-gray-300 rounded-lg" value={title} onChange={(e)=> setTitle(e.target.value)} required />
                    <input type="text" placeholder="Location" className="w-full p-2 border border-gray-300 rounded-lg mt-4" value={location} onChange={(e)=> setLocation(e.target.value)}  required />
                    <input type="number" placeholder="Phone Number" className="w-full p-2 border border-gray-300 rounded-lg mt-4" value={phoneNumber} onChange={(e)=> setPhoneNumber(e.target.value)}  required />    
                    <input type="text" placeholder="Description" className="w-full p-2 border border-gray-300 rounded-lg mt-4" value={description} onChange={(e)=> setDescription(e.target.value)}  required />
                    <span>
                        <select 
                            className={`px-4 py-2 mt-4 inline-flex text-xs leading-5 font-semibold rounded-full ${priority === 'critical'? 'bg-red-100 text-red-800': priority === 'high'? 'bg-orange-100 text-orange-800': 'bg-yellow-100 text-yellow-800'}`}
                            value={priority}
                            onChange={(e)=> setPriority(e.target.value)} required>
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </span>
                    <textarea placeholder="Call Transcript/Details (Optional)" className="w-full p-2 border border-gray-300 rounded-lg mt-4" value={transcript} onChange={(e)=> setTranscript(e.target.value)} />
                    <button className="px-4 py-2 mt-4 bg-red-500 text-white rounded-lg" type="submit">{loading? ("Adding...") : ("Create Emergency")} </button>
                </fieldset>
                </form>    
            </div>
        </div>
    )
}