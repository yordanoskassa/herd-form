import { useState } from "react";
import logo from "./assets/logo.png";

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
      const response = await fetch("http://127.0.0.1:8000/submit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          rare_disease: formData.rareDisease,
          message: formData.comments,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const data = await response.json();
      console.log("Form submitted successfully:", data);

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
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h2 className="text-xl font-semibold text-center mb-4 font-comfortaa">
          Join Our Ambassador Program
        </h2>
        {isSubmitted ? (
          <div className="text-center">
            <p className="text-lg font-jost">We will be in touch soon</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-jost">
            <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
            <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
            <InputField label="Rare Disease" name="rareDisease" value={formData.rareDisease} onChange={handleChange} />
            <TextAreaField label="Your Story" name="comments" value={formData.comments} onChange={handleChange} />
            <button type="submit" className="w-full bg-[#00bce4] text-white py-2 rounded-md hover:bg-blue-600">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#00bce4]"
      required
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#00bce4]"
      required
    />
  </div>
);
