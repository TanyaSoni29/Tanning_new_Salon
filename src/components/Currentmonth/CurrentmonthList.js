import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./CurrentmonthList.css"; // Importing CSS
import { saveAs } from "file-saver"; // For saving files
import jsPDF from "jspdf"; // For generating PDFs
import { formatDate } from "../../utils/formateDate";
import { FaFileCsv, FaFilePdf } from "react-icons/fa"; // Icons for CSV and PDF

const CustomerList = () => {
  const { customers } = useSelector((state) => state.customer);
  const { locations } = useSelector((state) => state.location);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // Sorting state

  // Get the first day of the current month and today's date
  const getCurrentMonthStartDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 2); // First day of the current month
  };

  const getCurrentDate = () => {
    return new Date(); // Today's date
  };

  // Set default date range to current month start and today
  const [dateRange, setDateRange] = useState({
    startDate: getCurrentMonthStartDate(),
    endDate: getCurrentDate(),
  });

  // Update date inputs when component mounts
  useEffect(() => {
    setDateRange({
      startDate: getCurrentMonthStartDate(),
      endDate: getCurrentDate(),
    });
  }, []);

  const [selectedLocation, setSelectedLocation] = useState("All");
  const [isCurrentMonth, setIsCurrentMonth] = useState(false);
  const [isBySpend, setIsBySpend] = useState(false);
  const [isMinUsed, setIsMinUsed] = useState(false);
  const [isBySale, setIsBySale] = useState(false);

  const uniqueLocations = [
    "All",
    ...new Set(locations.map((location) => location.name)),
  ];

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prevRange) => ({
      ...prevRange,
      [name]: value ? new Date(value) : null,
    }));
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const isInCurrentMonth = (date) => {
    const now = new Date();
    const customerDate = new Date(date);
    return (
      now.getFullYear() === customerDate.getFullYear() &&
      now.getMonth() === customerDate.getMonth()
    );
  };

  const handleToggleChange = (toggle) => {
    if (toggle === "spend") {
      setIsBySpend(!isBySpend);
      if (!isBySpend) {
        setIsMinUsed(false);
        setIsBySale(false);
      }
    } else if (toggle === "minutes") {
      setIsMinUsed(!isMinUsed);
      if (!isMinUsed) {
        setIsBySpend(false);
        setIsBySale(false);
      }
    } else if (toggle === "sales") {
      setIsBySale(!isBySale);
      if (!isBySale) {
        setIsBySpend(false);
        setIsMinUsed(false);
      }
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortCustomers = (customers) => {
    // If all toggles are off, return the customers as is
    if (!isBySpend && !isMinUsed && !isBySale) {
      return customers;
    }

    // Sort based on toggles
    return customers.sort((a, b) => {
      if (isBySpend) {
        // Sort by total spend
        return (
          b.total_service_purchased_price - a.total_service_purchased_price
        );
      } else if (isMinUsed) {
        // Sort by total minutes used
        return b.total_used_minutes - a.total_used_minutes;
      } else if (isBySale) {
        // Sort by total sales
        return (
          b.total_product_purchased_price - a.total_product_purchased_price
        );
      }
      return 0;
    });
  };

  const filteredCustomers = customers.filter((data) => {
    const CustomerDate = new Date(data.user.created_at);
    const isInDateRange =
      dateRange.startDate && dateRange.endDate
        ? CustomerDate >= dateRange.startDate &&
          CustomerDate <= dateRange.endDate
        : true;

    const isInMonth = !isCurrentMonth || isInCurrentMonth(data.user.created_at);

    const firstName = data.profile?.firstName.toLowerCase() || "";
    const lastName = data?.profile?.lastName?.toLowerCase() || "";
    const phoneNumber = data.profile?.phone_number.toLowerCase() || "";

    const matchesSearchQuery =
      `${firstName} ${lastName}`.includes(searchTerm.toLowerCase()) ||
      phoneNumber.includes(searchTerm.toLowerCase());
    const preferredLocation = locations.find(
      (location) => location.id === data.profile?.preferred_location
    );
    const matchesLocation =
      selectedLocation === "All" ||
      (preferredLocation && preferredLocation.name === selectedLocation);

    return isInDateRange && matchesSearchQuery && matchesLocation && isInMonth;
  });

  const sortedCustomers = filteredCustomers.sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a.profile[sortConfig.key] || a[sortConfig.key] || "";
      const bValue = b.profile[sortConfig.key] || b[sortConfig.key] || "";

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    }
    return 0;
  });

  // Function to download CSV
  const handleDownloadCSV = () => {
    const headers = [
      "USER NAME",
      "LOCATION",
    //   "PHONE NUMBER",
      "MIN AVA",
      "TOTAL SPEND",
      "LAST PURCHASE",
    ];

    // Generating the CSV content
    const csvRows = [
      headers.join(","), // header row
      ...sortedCustomers.map((customer) => {
        const preferredLocation = locations.find(
          (location) => location.id === customer.profile?.preferred_location
        );
        const rowData = [
          `${customer.profile?.firstName || ""} ${
            customer.profile?.lastName || ""
          }`,
          preferredLocation ? preferredLocation.name : "N/A",
        //   customer.profile?.phone_number || "",
          customer.profile?.available_balance || "0",
          customer.total_used_minutes || "0",
          formatDate(customer.profile?.updated_at) || "N/A",
        ];
        return rowData.join(",");
      }),
    ].join("\n");

    // Creating a Blob and saving it as CSV
    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Customers.csv");
  };

  // Function to download PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width; // Get page width
    const pageHeight = doc.internal.pageSize.height; // Get page height
    const margin = 10; // Left and right margins
    const lineHeight = 10; // Adjust line height
    let row = 10; // Start y-position for the content

    // Adjust column positions for better spacing (adjusted widths to fit within the page)
    const columns = {
      userName: margin, // Start at the left margin
      location: margin + 35, // 35 units after the user name column
    //   phoneNumber: margin + 65, // 50 units after location
      minutesAvailable: margin + 95, // 50 units after phone number
      totalSpend: margin + 135, // 40 units after minutes available
      lastPurchase: margin + 165, // 40 units after total spend (adjust to fit the page)
    };

    // Title of the document
    doc.text("Customer List", margin, row);

    // Add headers for the table
    row += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Customer Name", columns.userName, row);
    doc.text("Location", columns.location, row);
    // doc.text("Phone", columns.phoneNumber, row);
    doc.text("Minutes Avl", columns.minutesAvailable, row);
    doc.text("Tot Spend", columns.totalSpend, row);
    doc.text("Last Purchase", columns.lastPurchase, row); // Last Purchase header added

    // Move to the next row
    row += lineHeight;

    doc.setFont("helvetica", "normal");
    sortedCustomers.forEach((customer) => {
      const preferredLocation = locations.find(
        (location) => location.id === customer.profile?.preferred_location
      );

      // Check if we need to add a new page
      if (row >= pageHeight - lineHeight) {
        doc.addPage(); // Add a new page
        row = margin; // Reset the row height for the new page

        // Re-add table headers to the new page
        doc.text("Customer Name", columns.userName, row);
        doc.text("Location", columns.location, row);
        // doc.text("Phone", columns.phoneNumber, row);
        doc.text("Minutes Avl", columns.minutesAvailable, row);
        doc.text("Tot Spend", columns.totalSpend, row);
        doc.text("Last Purchase", columns.lastPurchase, row);

        row += lineHeight;
      }

      // Add the customer data
      doc.text(
        `${customer.profile?.firstName || ""} ${
          customer.profile?.lastName || ""
        }`,
        columns.userName,
        row
      );
      doc.text(
        preferredLocation ? preferredLocation.name : "N/A",
        columns.location,
        row
      );
    //   doc.text(
    //     customer.profile?.phone_number || "N/A",
    //     columns.phoneNumber,
    //     row
    //   );
      doc.text(
        `${customer.profile?.available_balance || "0"}`,
        columns.minutesAvailable,
        row
      );
      doc.text(
        `${customer.total_used_minutes || "0"}`,
        columns.totalSpend,
        row
      );
      doc.text(
        formatDate(customer.profile?.updated_at) || "N/A",
        columns.lastPurchase,
        row
      ); // Last purchase data added

      // Move to the next row
      row += lineHeight;
    });

    doc.save("Customers.pdf");
  };

  return (
    <div className="currentmon-container">
      <div className="currentmon-filter-customer">
        <div className="currentmon-search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="currentmon-location-select">
          <select value={selectedLocation} onChange={handleLocationChange}>
            {uniqueLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div className="currentmon-date-range-inputs">
          <input
            type="date"
            name="startDate"
            value={
              dateRange.startDate
                ? dateRange.startDate.toISOString().split("T")[0]
                : ""
            }
            onChange={handleDateRangeChange}
          />
          <input
            type="date"
            name="endDate"
            value={
              dateRange.endDate
                ? dateRange.endDate.toISOString().split("T")[0]
                : ""
            }
            onChange={handleDateRangeChange}
          />
        </div>
        <div className="toggle-container">
          <label className="switch">
            <input
              type="checkbox"
              checked={isCurrentMonth}
              onChange={(e) => setIsCurrentMonth(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
          <span>Current Month</span>
        </div>
        <div className="toggle-container">
          <label className="switch">
            <input
              type="checkbox"
              checked={isMinUsed}
              onChange={() => handleToggleChange("minutes")}
            />
            <span className="slider round"></span>
          </label>
          <span>By Minutes Used</span>
        </div>
        <div className="toggle-container">
          <label className="switch">
            <input
              type="checkbox"
              checked={isBySpend}
              onChange={() => handleToggleChange("spend")}
            />
            <span className="slider round"></span>
          </label>
          <span>By Spend</span>
        </div>
        <div className="toggle-container">
          <label className="switch">
            <input
              type="checkbox"
              checked={isBySale}
              onChange={() => handleToggleChange("sales")}
            />
            <span className="slider round"></span>
          </label>
          <span>By Sales</span>
        </div>

        <div className="currentmon-files">
          <div className="currentmon-icon" onClick={handleDownloadCSV}>
            <FaFileCsv size={40} style={{ color: "#28a745" }} />{" "}
          </div>
          <div className="currentmon-icon" onClick={handleDownloadPDF}>
            <FaFilePdf size={40} style={{ color: "#dc3545" }} />{" "}
          </div>
        </div>
      </div>

      <div className="currentmon-table">
        <div className="currentmon-table-header">
          <span onClick={() => handleSort("firstName")}>
            Customers Name{" "}
            <i
              className={`fa fa-caret-${
                sortConfig.key === "firstName" && sortConfig.direction === "asc"
                  ? "up"
                  : "down"
              }`}
            ></i>
          </span>
          {/* <span onClick={() => handleSort("phone_number")}>
            Phone Number{" "}
            <i
              className={`fa fa-caret-${
                sortConfig.key === "phone_number" &&
                sortConfig.direction === "asc"
                  ? "up"
                  : "down"
              }`}
            ></i>
          </span> */}
          <span onClick={() => handleSort("preferred_location")}>
            Location{" "}
            <i
              className={`fa fa-caret-${
                sortConfig.key === "preferred_location" &&
                sortConfig.direction === "asc"
                  ? "up"
                  : "down"
              }`}
            ></i>
          </span>
          <span onClick={() => handleSort("available_balance")}>
            Min. Avail.{" "}
            <i
              className={`fa fa-caret-${
                sortConfig.key === "available_balance" &&
                sortConfig.direction === "asc"
                  ? "up"
                  : "down"
              }`}
            ></i>
          </span>
          <span onClick={() => handleSort("total_used_minutes")}>
            Total Min. Used{" "}
            <i
              className={`fa fa-caret-${
                sortConfig.key === "total_used_minutes" &&
                sortConfig.direction === "asc"
                  ? "up"
                  : "down"
              }`}
            ></i>
          </span>
          <span onClick={() => handleSort("total_service_purchased_price")}>
            Total Spent{" "}
            <i
              className={`fa fa-caret-${
                sortConfig.key === "total_service_purchased_price" &&
                sortConfig.direction === "asc"
                  ? "up"
                  : "down"
              }`}
            ></i>
          </span>
          <span onClick={() => handleSort("total_product_purchased_price")}>
            Total Sales{" "}
            <i
              className={`fa fa-caret-${
                sortConfig.key === "total_product_purchased_price" &&
                sortConfig.direction === "asc"
                  ? "up"
                  : "down"
              }`}
            ></i>
          </span>
        </div>

        {sortedCustomers.length > 0 ? (
          sortedCustomers.map((customer) => {
            const preferredLocation = locations.find(
              (location) => location.id === customer.profile?.preferred_location
            );
            return (
              <div key={customer.user.id} className="currentmon-table-row">
                <span data-label="Customer Name">
                  {customer.profile?.firstName} {customer.profile?.lastName}
                </span>
                {/* <span data-label="Phone Number">
                  {customer.profile?.phone_number}
                </span> */}
                <span data-label="Location">
                  {preferredLocation ? preferredLocation.name : "N/A"}
                </span>
                <span data-label="Min. Avail.">
                  {customer.profile?.available_balance}
                </span>
                <span data-label="Total Min. Used">
                  {customer.total_used_minutes?.toFixed(2)}
                </span>
                <span data-label="Total Spent">
                  £{customer.total_service_purchased_price?.toFixed(2)}
                </span>
                <span data-label="Total Sales">
                  £{customer.total_product_purchased_price?.toFixed(2)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="currentmon-no-data">No customers found.</div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
