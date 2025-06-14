// File: test.js

import dotenv from 'dotenv';
dotenv.config();

import handler from './api/generateAgreement.js';

const mockReq = {
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  },
  body: {
    "party_one": "John Doe",
    "party_two": "Jane Doe",
    "agreement_summary": "John Doe agrees to rent his camera to Jane Doe starting today at 11:00 AM \nfor two hours at a rate of $150 per hour.\nThe camera must be returned by 1:00 PM today. \nA penalty of $30 will apply for every 15 minutes of delay.",
    "date": "2023-10-05"
  }
  
};

// fake res object to capture output
const mockRes = {
  status: (code) => ({
    json: (data) => {
      console.log('Status:', code);
      console.log('Response:', data);
    }
  })
};

console.log('ENV loaded:');
console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL);

handler(mockReq, mockRes);
