import React, { useState, useMemo } from 'react';
import './PurchasereportList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/formateDate';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
const ProductList = ({
    purchaseServiceTransaction,
    selectedLocation,
    setSelectedLocation,
    dateRange,
    setDateRange,
}) => {
    // Helper function to format date for input fields (YYYY-MM-DD)
    const formatDateForInput = (date) => {
        if (date instanceof Date && !isNaN(date)) {
            return date.toISOString().slice(0, 10); // Return YYYY-MM-DD format
        }
        return ''; // Return YYYY-MM-DD format
    };

    // State for search term
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
	const servicesPerPage = 10;
    // State for sorting configuration with default sorting by date in descending order
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

    const { locations } = useSelector((state) => state.location);

	const filteredLocations = locations.filter((location) => location.isActive);
    // Extract unique locations for dropdown
    const uniqueLocations = useMemo(
        () => ['All', ...new Set(filteredLocations.map((location) => location.name))],
        [filteredLocations]
    );

    // Handle Date Range Change
    const handleDateRangeChange = (e) => {
        const { name, value } = e.target;
        setDateRange((prevRange) => ({
            ...prevRange,
            [name]: value ? new Date(value) : null,
        }));
    };

    // Handle Location Change
    const handleLocationChange = (e) => {
        setSelectedLocation(e.target.value);
    };

    // Handle sorting logic
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Sort and filter transactions
    const filteredTransaction = useMemo(() => {
        const sortedData = purchaseServiceTransaction.filter((transaction) => {
            const serviceName = transaction?.serviceName?.toLowerCase() || '';
            const matchesSearchQuery = serviceName?.includes(
                searchTerm?.toLowerCase()
            );
            const matchesLocation =
                selectedLocation === 'All' ||
                transaction.location?.name === selectedLocation;

            return matchesSearchQuery && matchesLocation;
        });

        // Sorting logic
        if (sortConfig.key) {
            sortedData.sort((a, b) => {
                const aValue = a[sortConfig.key] || '';
                const bValue = b[sortConfig.key] || '';

                // Handle date sorting specifically
                if (sortConfig.key === 'date') {
                    const dateA = new Date(aValue);
                    const dateB = new Date(bValue);
                    return sortConfig.direction === 'asc'
                        ? dateA - dateB
                        : dateB - dateA;
                }

                // General sorting logic for other fields
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortedData;
    }, [purchaseServiceTransaction, searchTerm, selectedLocation, sortConfig]);

    // Download CSV
    const handleDownloadCSV = () => {
        const headers = [
            'Date',
            'Service Name',
            'Location',
            'Total Value',
            'Minutes Sold',
        ];
        const csvRows = [
            headers.join(','), // header row
            ...filteredTransaction.map((data) =>
                [
                    formatDate(data.date),
                    data.serviceName,
                    data.location?.name || 'N/A',
                    `£${data.total_price.toFixed(2)}`,
                    data.total_quantity,
                ].join(',')
            ),
        ].join('\n');

        // Add BOM for proper UTF-8 encoding
        const csvContent = '\uFEFF' + csvRows;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'service-purchase.csv');
    };

    // Download PDF with proper formatting and gridlines
    const handleDownloadPDF = () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 40;
        const rowHeight = 20;
        const headerHeight = 30;
        const cellPadding = 5;
        let currentY = margin + headerHeight;

        // Define column widths and positions
        const colWidths = [80, 140, 120, 100, 100];

        // Draw table headers
        const headers = [
            'Date',
            'Service Name',
            'Location',
            'Total Value',
            'Minutes Sold',
        ];

        // Set title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('Service Purchase Report', pageWidth / 2, margin, {
            align: 'center',
        });

        // Draw the table header row
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        drawTableRow(doc, headers, currentY, colWidths);
        currentY += rowHeight;

        // Reset font for table data
        doc.setFont('helvetica', 'normal');

        // Loop through filtered transactions and add each row
        filteredTransaction.forEach((transaction) => {
            const row = [
                formatDate(transaction.date),
                transaction.serviceName,
                transaction.location?.name || 'N/A',
                `£${transaction.total_price.toFixed(2)}`,
                transaction.total_quantity.toString(),
            ];

            if (currentY + rowHeight > pageHeight - margin) {
                doc.addPage();
                currentY = margin + headerHeight;
                doc.setFont('helvetica', 'bold');
                drawTableRow(doc, headers, currentY, colWidths);
                currentY += rowHeight;
                doc.setFont('helvetica', 'normal');
            }

            drawTableRow(doc, row, currentY, colWidths);
            currentY += rowHeight;
        });

        doc.save('service-purchase.pdf');
    };

    // Function to draw a single row with borders
    const drawTableRow = (doc, rowData, y, colWidths) => {
        const startX = 40;
        let currentX = startX;

        rowData.forEach((data, index) => {
            const colWidth = colWidths[index];
            const text = String(data);
            doc.rect(currentX, y, colWidth, 20);
            const textWidth = doc.getTextWidth(text);
            const textX = currentX + colWidth / 2 - textWidth / 2;
            const textY = y + 15;
            doc.text(text, textX, textY);
            currentX += colWidth;
        });
    };

    const indexOfLastServices = currentPage * servicesPerPage;
	const indexOfFirstServices = indexOfLastServices - servicesPerPage;
	const currentServices = filteredTransaction.slice(
		indexOfFirstServices,
		indexOfLastServices
	);
	const totalPages = Math.ceil(filteredTransaction.length / servicesPerPage);

	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePrevPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

	const PaginationControls = () => (
		<div className='pagination-controls'>
			<button onClick={handlePrevPage} disabled={currentPage === 1}>
				<IoIosArrowBack fontSize={18}/>
			</button>
			<button onClick={handleNextPage} disabled={currentPage === totalPages}>
				<IoIosArrowForward fontSize={18}/>
			</button>
			<span>
				Page {currentPage} of {totalPages}
			</span>
		</div>
	);


    return (
        <div className='purchasereportlist-container'>
            <div className='filter-purchase'>
                <div className='purchasereportlist-search-container'>
                    <input
                        type='text'
                        placeholder='Search'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='sedate-range'>
                    <input
                        type='date'
                        name='startDate'
                        value={formatDateForInput(dateRange.startDate)}
                        placeholder='Start Date'
                        onChange={handleDateRangeChange}
                    />
                    <input
                        type='date'
                        name='endDate'
                        value={formatDateForInput(dateRange.endDate)}
                        placeholder='End Date'
                        onChange={handleDateRangeChange}
                    />
                </div>
                <div className='purchaselocation-select'>
                    <select
                        value={selectedLocation}
                        onChange={handleLocationChange}
                    >
                        {uniqueLocations.map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='purchasereportlist-files'>
                    <div className='purchasereportlist-download' onClick={handleDownloadCSV}>
                        <FaFileCsv size={35} style={{ color: '#28a745' }} />
                    </div>
                    <div className='purchasereportlist-download' onClick={handleDownloadPDF}>
                        <FaFilePdf size={35} style={{ color: '#dc3545' }} />
                    </div>
                </div>
            </div>

            <div className='purchasereportlist-table'>
                <div className='purchasereportlist-table-header'>
                    <span onClick={() => handleSort('date')}>
                        Date{' '}
                        <i className={`fa fa-caret-${sortConfig.key === 'date' && sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                    </span>
                    <span onClick={() => handleSort('serviceName')}>
                        Service Name{' '}
                        <i className={`fa fa-caret-${sortConfig.key === 'serviceName' && sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                    </span>
                    <span onClick={() => handleSort('location')}>
                        Location{' '}
                        <i className={`fa fa-caret-${sortConfig.key === 'location' && sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                    </span>
                    <span onClick={() => handleSort('total_price')}>
                        Total Value{' '}
                        <i className={`fa fa-caret-${sortConfig.key === 'total_price' && sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                    </span>
                    <span onClick={() => handleSort('total_quantity')}>
                        Minutes Sold{' '}
                        <i className={`fa fa-caret-${sortConfig.key === 'total_quantity' && sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                    </span>
                </div>

                {currentServices.length > 0 ? (
                    currentServices.map((transaction, i) => (
                        <div key={i} className='purchasereportlist-table-row'>
                            <span data-label='Date' style={{ whiteSpace: 'nowrap' }}>
                                {formatDate(transaction.date)}
                            </span>
                            <span data-label='Service Name'>{transaction.serviceName}</span>
                            <span data-label='Location'>{transaction.location?.name}</span>
                            <span data-label='Total Value' className='purchasevalu'>
                                £{transaction.total_price.toFixed(2)}
                            </span>
                            <span data-label='Minutes Sold' className='purchasevalu'>
                                {transaction.total_quantity}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className='purchasereportlist-no-data'>
                        No transactions found.
                    </div>
                )}
            </div>
            {totalPages > 1 && <PaginationControls />}
        </div>
    );
};

export default ProductList;
