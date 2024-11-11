/* eslint-disable react/prop-types */

const DetailsModal = ({ visible, data, onClose }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Request Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Compact and Styled Information Sections */}
        <div className="space-y-6 text-base">
          <div className="grid grid-cols-2 gap-y-4">
            <div className="flex">
              <span className="font-bold text-gray-700">Full Name:&nbsp;</span>
              <span className="text-gray-900">{data?.fullName}</span>
            </div>
            <div className="flex">
              <span className="font-bold text-gray-700">Email:&nbsp;</span>
              <span className="text-gray-900">{data?.email}</span>
            </div>
            <div className="flex">
              <span className="font-bold text-gray-700">Mobile Number:&nbsp;</span>
              <span className="text-gray-900">{data?.mobileNumber}</span>
            </div>
            <div className="flex">
              <span className="font-bold text-gray-700">Number of Devices:&nbsp;</span>
              <span className="text-gray-900">{data?.noOfDevices}</span>
            </div>
            <div className="flex">
              <span className="font-bold text-gray-700">Device Type:&nbsp;</span>
              <span className="text-gray-900">{data?.deviceType.join(', ')}</span>
            </div>
            <div className="flex">
              <span className="font-bold text-gray-700">Whom to Meet:&nbsp;</span>
              <span className="text-gray-900">{data?.whomToMeet}</span>
            </div>
            <div className="flex">
              <span className="font-bold text-gray-700">Duration Hours:&nbsp;</span>
              <span className="text-gray-900">{data?.durationHours}</span>
            </div>
            <div className="flex">
              <span className="font-bold text-gray-700">Purpose:&nbsp;</span>
              <span className="text-gray-900">{data?.purpose.join(', ')}</span>
            </div>
            <div className="flex">
              <span className="font-bold text-gray-700">Requester Email:&nbsp;</span>
              <span className="text-gray-900">{data?.requesterEmail}</span>
            </div>
            <div className="flex">
              <span className="font-bold text-gray-700">Head Email:&nbsp;</span>
              <span className="text-gray-900">{data?.headEmail}</span>
            </div>
            <div className="flex">
              <span className="font-bold text-gray-700">Access Required:&nbsp;</span>
              <span className="text-gray-900">{data?.accessRequired}</span>
            </div>
            <div className="flex">
              <span className="font-bold text-gray-700">Date:&nbsp;</span>
              <span className="text-gray-900">{data?.date}</span>
            </div>
            <div className="flex">
              <span className="font-bold text-gray-700">Time:&nbsp;</span>
              <span className="text-gray-900">{data?.time}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
