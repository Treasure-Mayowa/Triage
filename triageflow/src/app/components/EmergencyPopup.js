import { useState } from 'react'

export default function EmergencyPopup({ popup }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [priority, setPriority] = useState('critical')
    
    const addEmergency = (e) => {
        e.preventDefault()
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
                    <input type="text" placeholder="Title" className="w-full p-2 border border-gray-300 rounded-lg" />
                    <input type="text" placeholder="description" className="w-full p-2 border border-gray-300 rounded-lg mt-4" />
                    <input type="number" placeholder="Phone Number" className="w-full p-2 border border-gray-300 rounded-lg mt-4" />    
                    <span>
                        <select 
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priority === 'critical'? 'bg-red-100 text-red-800': priority === 'high'? 'bg-orange-100 text-orange-800': 'bg-yellow-100 text-yellow-800'}`}
                            value={priority}
                            onChange={(e)=> setPriority(e.target.value)}>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                        </select>
                    </span>
                    <button className="px-4 py-2 mt-4 bg-red-500 text-white rounded-lg" type="submit">Create Emergency</button>
                </form>    
            </div>
        </div>
    )
}