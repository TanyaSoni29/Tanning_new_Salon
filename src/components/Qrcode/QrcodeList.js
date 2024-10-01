import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './QrcodeList.css';

const QrcodeList = () => {
  const [locations] = useState([
    {
      locationName: 'Location 1',
    },
    {
      locationName: 'Location 2',
    },
    {
      locationName: 'Location 3',
    },
  ]);

  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationClick = (index) => {
    setSelectedLocation(locations[index]);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('print-area');
    const win = window.open('', '', 'height=500,width=800');
    win.document.write('<html><head><title>Print QR Code</title>');
    win.document.write('</head><body >');
    win.document.write(printContent.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  return (
    <div className="qrcode-container">
      <h2>Select Your Location</h2>
      <div className="location-circles">
        {locations.map((location, index) => (
          <div
            key={index}
            className="location-circle"
            onClick={() => handleLocationClick(index)}
          >
            <div className="icon">
              <i className="fa fa-laptop"></i>
            </div>
            <p>{location.locationName}</p>
          </div>
        ))}
      </div>

      {selectedLocation && (
        <div className="qr-code-display" id="print-area">
          <h3>{selectedLocation.locationName}</h3>
          {/* Dynamically generate a QR code with URL */}
          <QRCodeCanvas
            value={`https://backendcodersindia.com/${selectedLocation.locationName}`} // Encode a valid URL
            size={150} // QR code size
            className="qr-code-image"
          />
        </div>
      )}

      <button
        className="next-button"
        onClick={handlePrint}
        disabled={!selectedLocation}
      >
        Print QR
      </button>
    </div>
  );
};

export default QrcodeList;
