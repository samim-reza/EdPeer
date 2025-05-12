import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faBolt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function RequestHelpPage({ onSessionCreated }) {
  const [duration, setDuration] = useState(30);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Programming");
  const [senderWant, setSenderWant] = useState("teach"); // "teach" or "learn"
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("creditExchange"); // "creditExchange" or "knowledgeExchange"
  const [creditAmount, setCreditAmount] = useState(10);
  const [exchangeTopic, setExchangeTopic] = useState("");
  const [startTime, setStartTime] = useState("");

  const createSessionRequest = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) throw new Error("User not authenticated");

      // Prepare payload according to backend requirements
      const payload = {
        title,
        category,
        description,
        senderId: senderWant === "teach" ? user.id : null,
        receiverId: senderWant === "learn" ? user.id : null,
        tags: tags.join(","), // Convert array to comma-separated string
        duration,
        senderWant,
        creditExchange:
          paymentMethod === "creditExchange" ? creditAmount : null,
        startTime,
        topic: title,
        exchangeTopic:
          paymentMethod === "knowledgeExchange" ? exchangeTopic : null,
      };

      console.log("Payload for session creation:", payload);

      // Validate required fields
      if (
        !title ||
        !category ||
        !description ||
        tags.length === 0 ||
        !duration ||
        !startTime
      ) {
        throw new Error("Please fill all required fields");
      }

      const response = await axios.post(
        "http://localhost:5000/sessions/createSession",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if(response.status === 201){
        alert("Session created successfully!");
      }

      // Reset form on success
      setTitle("");
      setDescription("");
      setCategory("Programming");
      setSenderWant("teach");
      setTags([]);
      setDuration(30);
      setPaymentMethod("creditExchange");
      setCreditAmount(10);
      setExchangeTopic("");
      setStartTime("");

      // Call parent callback with the created session ID
      onSessionCreated(response.data.id);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create session"
      );
      console.error("Session creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTag = (e) => {
    if (e.key === "Enter" && newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">Create New Help Request</h2>
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        <form className="space-y-8" onSubmit={createSessionRequest}>
          <div className="space-y-4">
            <label className="block text-lg font-medium">Session Title*</label>
            <input
              type="text"
              placeholder="e.g., Help with JavaScript Promises"
              className="w-full p-4 border rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-lg font-medium">
                Subject Category*
              </label>
              <select
                className="w-full p-4 border rounded-lg"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="Programming">Programming</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="block text-lg font-medium">Session Type*</label>
              <select
                className="w-full p-4 border rounded-lg"
                value={senderWant}
                onChange={(e) => setSenderWant(e.target.value)}
                required
              >
                <option value="teach">I want to teach</option>
                <option value="learn">I want to learn</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-lg font-medium">
              Session Description*
            </label>
            <textarea
              className="w-full p-4 border rounded-lg h-32"
              placeholder="Describe the specific problem or concept you need help with."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <label className="block text-lg font-medium">Tags*</label>
            <div className="flex flex-wrap gap-2 p-4 border rounded-lg">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={addTag}
                placeholder="Add tag and press Enter"
                className="flex-1 p-1 outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-lg font-medium">
                Duration (minutes)*
              </label>
              <select
                className="w-full p-4 border rounded-lg"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                required
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="block text-lg font-medium">Start Time*</label>
              <input
                type="datetime-local"
                className="w-full p-4 border rounded-lg"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-lg font-medium">Payment Option*</label>
            <div className="grid gap-4">
              <div className="border rounded-lg p-4 relative">
                <input
                  type="radio"
                  id="pay-credits"
                  name="payment-option"
                  checked={paymentMethod === "creditExchange"}
                  onChange={() => setPaymentMethod("creditExchange")}
                  className="absolute top-5 left-4"
                />
                <div className="pl-8">
                  <label
                    htmlFor="pay-credits"
                    className="font-bold flex items-center"
                  >
                    <FontAwesomeIcon
                      icon={faCoins}
                      className="mr-2 text-yellow-500"
                    />
                    Pay with Credits
                  </label>
                  <p className="text-gray-600 mt-1">
                    Use credits to request this session
                  </p>
                  {paymentMethod === "creditExchange" && (
                    <div className="mt-3">
                      <input
                        type="number"
                        value={creditAmount}
                        onChange={(e) =>
                          setCreditAmount(parseInt(e.target.value))
                        }
                        className="w-full p-3 border rounded"
                        min="1"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4 relative">
                <input
                  type="radio"
                  id="exchange-knowledge"
                  name="payment-option"
                  checked={paymentMethod === "knowledgeExchange"}
                  onChange={() => setPaymentMethod("knowledgeExchange")}
                  className="absolute top-5 left-4"
                />
                <div className="pl-8">
                  <label
                    htmlFor="exchange-knowledge"
                    className="font-bold flex items-center"
                  >
                    <FontAwesomeIcon
                      icon={faBolt}
                      className="mr-2 text-blue-500"
                    />
                    Exchange Knowledge
                  </label>
                  <p className="text-gray-600 mt-1">
                    Offer to teach something in return
                  </p>
                  {paymentMethod === "knowledgeExchange" && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={exchangeTopic}
                        onChange={(e) => setExchangeTopic(e.target.value)}
                        placeholder="What can you teach in exchange?"
                        className="w-full p-3 border rounded"
                        required={paymentMethod === "knowledgeExchange"}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 transition disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Session...
                </span>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
