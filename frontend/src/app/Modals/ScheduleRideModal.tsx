"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import getFormattedDate from "../utils/dateHandler";

export default function ScheduleRideModal({ onClose, onSubmit }: any) {
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropLocation, setDropLocation] = useState("");
    const [rideDateTime, setRideDateTime] = useState("");
    const [availableSeats, setAvailableSeats] = useState(1);
    const [rideType, setRideType] = useState("departure");

    const handleSubmit = () => {
        if (!pickupLocation || !dropLocation || !rideDateTime || !availableSeats || !rideType) {
            alert("Please fill in all fields.");
            return;
        }
        onSubmit({ pickupLocation, dropLocation, rideDateTime, availableSeats, type: rideType });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-5 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl transition"
                    title="Close"
                >
                    <IoClose />
                </button>

                <h2 className="text-lg font-semibold text-gray-800 text-center">Schedule a Ride</h2>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                        <input
                            type="text"
                            placeholder="Enter pickup point"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Drop Location</label>
                        <input
                            type="text"
                            placeholder="Enter drop point"
                            value={dropLocation}
                            onChange={(e) => setDropLocation(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                        <input
                            type="datetime-local"
                            value={rideDateTime}
                            min={`${getFormattedDate()}T00:00`}
                            max={`${getFormattedDate(2)}T23:59`}
                            onChange={(e) => setRideDateTime(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
                        <input
                            type="number"
                            min={1}
                            max={5}
                            placeholder="Number of seats"
                            value={availableSeats}
                            onChange={(e) => setAvailableSeats(Number(e.target.value))}
                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            Ride Type
                            <span title="If you're leaving your hometown, choose 'Departure'. If you're returning to hometown, choose 'Return'.">
                                <FaInfoCircle className="text-gray-400 hover:text-blue-600 cursor-pointer text-sm" />
                            </span>
                        </label>
                        <select
                            value={rideType}
                            onChange={(e) => setRideType(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="departure">Departure</option>
                            <option value="return">Return</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-900 text-white py-2.5 rounded-md hover:bg-blue-800 transition font-medium"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
