import { useState } from "react";

export default function VehicleModal({
    onClose,
    onSave,
    vehicle,
}: {
    onClose: () => void;
    onSave: (data: any) => void;
    vehicle?: any;
}) {
    const [model, setModel] = useState(vehicle?.model || "");
    const [number, setNumber] = useState(vehicle?.number || "");
    const [image, setImage] = useState<File | null>(null);

    const isNotEditing = !!vehicle;

    const vehicleNumberRegex = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setImage(selectedFile);
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!model || !number) {
            alert("Model and number are required");
            return;
        }
        if (!vehicleNumberRegex.test(number.trim().toUpperCase())) {
            alert("Invalid vehicle registration number. Format: KA01AB1234");
            return;
        }
        if (!image && !isNotEditing) {
            alert("Image is required");
            return;
        }
        onSave({ model, number, image });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Add Vehicle Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Model</label>
                        <input
                            type="text"
                            className="mt-1 w-full border p-2 rounded-md"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Registration Number</label>
                        <input
                            type="text"
                            className="mt-1 w-full border p-2 rounded-md uppercase"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-1">Upload Image</label>
                        <input
                            required={!isNotEditing}
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-1.5 file:px-4 
                   file:rounded-full file:border-0 
                   file:text-sm file:font-semibold 
                   file:bg-blue-50 file:text-blue-900 
                   hover:file:bg-blue-100"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-1 text-sm rounded-md bg-gray-200">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-1 text-sm rounded-md bg-[#0b2345] text-white">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}