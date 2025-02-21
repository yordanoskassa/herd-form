import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "./firebase-config"; // You'll need to create this
import { collection, addDoc } from "firebase/firestore";
import logo from "./assets/logo.png"; // Import the logo

export default function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rareDisease: "",
    comments: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to Cloud Function
      const response = await fetch('https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/submitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setIsSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        rareDisease: "",
        comments: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      // You might want to show an error message to the user
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
      >
        {/* Updated logo section */}
        <div className="flex justify-center mb-6">
          <motion.img 
            src={logo} 
            alt="Ambassador Logo" 
            className="h-20 w-auto"
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Updated header section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-comfortaa font-bold text-gray-800 mb-2">
            Join Our Ambassador Program
          </h2>
          <p className="text-gray-500 font-jost">
            Share your story and make a difference
          </p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-8"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-comfortaa text-gray-800 mb-2">
              Thank you for joining!
            </h3>
            <p className="text-gray-600 font-jost">
              We'll be in touch shortly.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              icon="user"
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              icon="user"
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              icon="email"
            />
            <InputField
              label="Rare Disease"
              name="rareDisease"
              value={formData.rareDisease}
              onChange={handleChange}
              icon="medical"
            />
            <TextAreaField
              label="Your Story"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full rounded-xl bg-[#00bce4] px-6 py-4 text-white font-jost font-semibold shadow-lg hover:bg-[#009ec1] transition-all"
            >
              Become an Ambassador
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

const InputField = ({ label, name, type = "text", value, onChange, icon }) => {
  const icons = {
    user: (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    email: (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    medical: (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    )
  };

  return (
    <div className="relative">
      <div className="absolute top-4 left-3">{icons[icon]}</div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pt-6 pb-2 px-12 rounded-xl border border-gray-200 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100 transition-all peer"
        placeholder=" "
        required
      />
      <label className="absolute left-12 top-4 text-gray-500 font-jost transition-all 
        peer-placeholder-shown:text-base peer-placeholder-shown:top-4
        peer-focus:top-4 peer-focus:text-sm
        peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-sm">
        {label}
      </label>
    </div>
  );
};

const TextAreaField = ({ label, name, value, onChange }) => (
  <div className="relative">
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="w-full pt-6 pb-2 px-4 rounded-xl border border-gray-200 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100 h-32 peer"
      placeholder=" "
      required
    />
    <label className="absolute left-4 top-4 text-gray-500 font-jost transition-all
      peer-placeholder-shown:text-base peer-placeholder-shown:top-4
      peer-focus:top-4 peer-focus:text-sm
      peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-sm">
      {label}
    </label>
  </div>
);
