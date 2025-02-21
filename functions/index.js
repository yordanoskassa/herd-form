/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const mongoose = require("mongoose");

// Initialize Firebase Admin
initializeApp();

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri);

// MongoDB Schema
const AmbassadorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  rareDisease: String,
  comments: String,
  timestamp: { type: Date, default: Date.now }
});

const Ambassador = mongoose.model('Ambassador', AmbassadorSchema);

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Cloud Function
exports.submitForm = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const data = req.body;
    
    // Save to Firestore
    const db = getFirestore();
    await db.collection('ambassadors').add({
      ...data,
      timestamp: new Date()
    });

    // Save to MongoDB
    const ambassador = new Ambassador(data);
    await ambassador.save();

    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});
