import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Sidebar from "../shared/SideBar";
import Swal from "sweetalert2";

const AddCreditsPage = () => {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const paymentMethods = [
    {
      id: 1,
      name: "bKash",
      icon: "https://logos-world.net/wp-content/uploads/2024/10/Bkash-Logo.jpg",
    },
    {
      id: 2,
      name: "Nagad",
      icon: "https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png",
    },
    {
      id: 3,
      name: "Rocket",
      icon: "https://images.seeklogo.com/logo-png/31/1/dutch-bangla-rocket-logo-png_seeklogo-317692.png",
    },
  ];

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/users/addCredit/${userId}`,
        {
          amount: parseFloat(amount),
          paymentMethod: selectedMethod,
          phoneNumber,
          pin,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // ✅ Show success message with SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Successfully added ${amount} credits.`,
      });

     

      // Reset fields and close modal
      setAmount("");
      setPhoneNumber("");
      setPin("");
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error.response?.data?.message || "Something went wrong.",
      });
    }
  };

  const openPaymentModal = (method) => {
    setSelectedMethod(method);
    setIsModalOpen(true);
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-12">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Add Credits</h2>
              <p className="mt-2 text-gray-600">
                Choose your preferred payment method to add credits to your
                account
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Amount (BDT)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                min="10"
                required
              />
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Select Payment Method
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => openPaymentModal(method.name)}
                    disabled={!amount}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
                      !amount
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-blue-500 hover:shadow-md"
                    }`}
                  >
                    <img
                      src={method.icon}
                      alt={method.name}
                      className="h-12 w-12 object-contain mb-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {method.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Pay with {selectedMethod}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit}>
                <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    Amount: {amount} BDT
                  </p>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {selectedMethod} Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`01XXXXXXXXX`}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="pin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    PIN
                  </label>
                  <input
                    type="password"
                    id="pin"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your PIN"
                    required
                    minLength={4}
                    maxLength={6}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Confirm Payment
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddCreditsPage;
