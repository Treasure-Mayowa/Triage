export const allEmergencies = [
  {
    id: '1',
    title: 'Multi-car accident',
    phoneNumber: '+234806700917',
    name: 'Cynthia Rose',
    description: 'Three-car collision with possible injuries',
    location: 'Highway 101, Mile Marker 24',
    priority: 'Critical',
    timestamp: '2025-03-12T10:30:00',
    status: 'Active',
    transcript: `
        Operator: Triageflow, what's your emergency?\n
        Caller: I'm at the scene of a three-car collision on Highway 101.\n
        Operator: Okay, I understand. First, can you tell me your name and the exact location on Highway 101? I need the nearest cross street or mile marker. Are there any injuries you can see?\n
        Caller: My name is Cynthia Rose. The accident is at Mile Marker 24. I see a few people who look hurt.\n
        Operator: Thank you, Cynthia. Are any of the injured people conscious and able to talk?\n
        Caller: Yes, a few of them are conscious, but they seem to be in pain.\n
        Operator: Alright, help is on the way. Please stay with the injured and try to keep them calm. Do not move anyone unless they are in immediate danger.\n
        Caller: Okay, I will. Thank you.
    `,
    assignedTo: 'Team Alpha',
    source: 'Emergency Call',
  },
  {
    id: '2',
    title: 'House Fire',
    phoneNumber: '+234806700918',
    name: 'John Doe',
    description: 'Fire in a residential building',
    location: '123 Elm Street',
    priority: 'High',
    timestamp: '2025-03-15T14:45:00',
    status: 'In Progress',
    transcript: `
        Operator: Triageflow, what's your emergency?
        Caller: There's a fire in my house at 123 Elm Street.
        Operator: Okay, I understand. Can you tell me your name and if everyone is out of the house?
        Caller: My name is John Doe. I think everyone is out, but I'm not sure.
        Operator: Alright, John. Please stay outside and do not go back in. Help is on the way.
        Caller: Okay, thank you.
    `,
    assignedTo: 'Team Bravo',
    source: 'Emergency Call',
  },
  {
    id: '3',
    title: 'Medical Emergency',
    phoneNumber: '+234806700919',
    name: 'Jane Smith',
    description: 'Person having a heart attack',
    location: '456 Oak Avenue',
    priority: 'Critical',
    timestamp: '2025-03-17T09:30:00',
    status: 'Resolved',
    transcript: `
        Operator: Triageflow, what's your emergency?
        Caller: My husband is having a heart attack at 456 Oak Avenue.
        Operator: Okay, I understand. Can you tell me your name and if your husband is conscious?
        Caller: My name is Jane Smith. He's conscious but in a lot of pain.
        Operator: Alright, Jane. Help is on the way. Please stay with him and try to keep him calm. Do not give him anything to eat or drink.
        Caller: Okay, thank you.
    `,
    assignedTo: 'Team Charlie',
    source: 'Emergency Call',
  },
  {
    id: '4',
    title: 'Gas Leak',
    phoneNumber: '+234806700920',
    name: 'Michael Johnson',
    description: 'Smell of gas in the building',
    location: '789 Pine Street',
    priority: 'High',
    timestamp: '2025-03-18T11:20:00',
    status: 'Active',
    transcript: `
        Operator: Triageflow, what's your emergency?
        Caller: I smell gas in my building at 789 Pine Street.
        Operator: Okay, I understand. Can you tell me your name and if everyone is out of the building?
        Caller: My name is Michael Johnson. Yes, everyone is out.
        Operator: Alright, Michael. Please stay outside and do not go back in. Help is on the way.
        Caller: Okay, thank you.
    `,
    assignedTo: 'Team Delta',
    source: 'Emergency Call',
  },
  {
    id: '5',
    title: 'Robbery in Progress',
    phoneNumber: '+234806700921',
    name: 'Sarah Lee',
    description: 'Robbery at a convenience store',
    location: '101 Maple Road',
    priority: 'Critical',
    timestamp: '2025-03-19T20:15:00',
    status: 'Active',
    transcript: `
        Operator: Triageflow, what's your emergency?
        Caller: There's a robbery happening at the convenience store on 101 Maple Road.
        Operator: Okay, I understand. Can you tell me your name and if you are safe?
        Caller: My name is Sarah Lee. I'm hiding in the back room.
        Operator: Alright, Sarah. Stay hidden and do not confront the robbers. Help is on the way.
        Caller: Okay, thank you.
    `,
    assignedTo: 'Team Echo',
    source: 'Emergency Call',
  },
]