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
    party_one: 'Alice',
    party_two: 'Bob',
    agreement_summary: 'Alice agrees to pay Bob $200 for logo design by June 10.',
    date: 'June 6, 2025',
    email_one: process.env.SENDER_EMAIL,
    email_two: 'kaustubhlohani25@gmail.com'
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
