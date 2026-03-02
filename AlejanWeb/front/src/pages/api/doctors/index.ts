import type { NextApiRequest, NextApiResponse } from 'next';

import type { Doctor } from '../../../models/doctor';

let doctors: Doctor[] = [
  // Sample data
  { id: 1, name: 'Dr. John Doe', specialty: 'Cardiology', contact: '123-456-7890', bio: 'Experienced cardiologist.' },
];

// API handler for managing doctors
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(doctors);
  } 
  else if (req.method === 'POST') {
      
    const newDoctor: Doctor = { ...req.body, id: Date.now() };
    
    doctors.push(newDoctor);
    
    res.status(201).json(newDoctor);
  } 
  else if (req.method === 'PUT') {
    const { id } = req.body;

    // Update doctor
    doctors = doctors.map(doctor => (doctor.id === id ? req.body : doctor));
    res.status(200).json(req.body);
  } 
  else if (req.method === 'DELETE') {
    const { id } = req.body;

    // Delete doctor
    doctors = doctors.filter(doctor => doctor.id !== id);
    res.status(200).json({ message: 'Doctor deleted' });
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
