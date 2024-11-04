import React, { useState, useMemo, useCallback, useEffect } from 'react';
import './ProductreportList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/formateDate';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
const ProductList = ({
    productTransaction,
    selectedLocation,
    setSelectedLocation,
    dateRange,
    setDateRange,
}) => {
    // Helper function to format date for input fields (YYYY-MM-DD)
    const formatDateForInput = (date) => {
        if (date instanceof Date && !isNaN(date)) {
            return date.toISOString().slice(0, 10);
        }
        return '';
    };

    const [searchTerm, setSearchTerm] = useState('');
    // Default sort by 'last_transaction_date' in descending order
    const [sortConfig, setSortConfig] = useState({
        key: 'last_transaction_date',
        direction: 'desc',
    });

    const { locations } = useSelector((state) => state.location);
	const [currentPage, setCurrentPage] = useState(1);
	const productsPerPage = 10;
	const filteredLocations = locations.filter((location) => location.isActive);

    // Extract unique locations for dropdown
    const uniqueLocations = useMemo(
        () => ['All', ...new Set(filteredLocations.map((location) => location.name))],
        [filteredLocations]
    );

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

    const handleSearchChange = useCallback(
        (e) => {
            setSearchTerm(e.target.value);
        },
        [setSearchTerm]
    );

    // Handle sorting logic
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Sort and filter product transactions
    const filteredTransaction = useMemo(() => {
        const sortedData = productTransaction.filter((transaction) => {
            const productName = transaction?.product?.name?.toLowerCase() || '';
            const matchesSearchQuery = productName.includes(searchTerm.toLowerCase());
            const matchesLocation =
                selectedLocation === 'All' ||
                transaction.location?.name === selectedLocation;

            return matchesSearchQuery && matchesLocation;
        });

        // Sorting logic
        if (sortConfig.key) {
            sortedData.sort((a, b) => {
                const aValue = a[sortConfig.key] || a.product[sortConfig.key] || '';
                const bValue = b[sortConfig.key] || b.product[sortConfig.key] || '';

                // Handle date sorting specifically
                if (sortConfig.key === 'last_transaction_date') {
                    const dateA = new Date(aValue);
                    const dateB = new Date(bValue);
                    return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
                }

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
    }, [productTransaction, searchTerm, selectedLocation, sortConfig]);

    const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = filteredTransaction.slice(
		indexOfFirstProduct,
		indexOfLastProduct
	);
	const totalPages = Math.ceil(filteredTransaction.length / productsPerPage);

	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePrevPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

    useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, selectedLocation]);

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

    // Download CSV
    const handleDownloadCSV = () => {
        const headers = [
            'Product Name',
            'Location',
            'Total Value',
            'Total Sold',
            'Date',
        ];
        const csvRows = [
            headers.join(','), // header row
            ...filteredTransaction.map((data) =>
                [
                    data.product.name,
                    data.location?.name || 'N/A',
                    `£${data.total_price.toFixed(2)}`, // Format total value with currency
                    data.total_sold,
                    formatDate(data.last_transaction_date),
                ].join(',')
            ),
        ].join('\n');

        // Correctly handle UTF-8 with BOM for Excel compatibility
        const csvContent = '\uFEFF' + csvRows; // Adding BOM to handle UTF-8 properly
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'product-purchase.csv');
    };

    // Download PDF with proper formatting and gridlines
    const handleDownloadPDF = () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 40;
        const rowHeight = 20;
        let currentY = margin + 30;

        const colWidths = [160, 120, 100, 70, 90];

        // Set title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('Product Purchase Report', pageWidth / 2, margin, {
            align: 'center',
        });

        // Table headers
        const headers = [
            'Product Name',
            'Location',
            'Total Value',
            'Total Sold',
            'Date',
        ];
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        drawTableRow(doc, headers, currentY, colWidths);
        currentY += rowHeight;

        doc.setFont('helvetica', 'normal');

        // Loop through filtered transactions and add each row
        filteredTransaction.forEach((transaction) => {
            const row = [
                transaction.product?.name,
                transaction.location?.name || 'N/A',
                `£${transaction.total_price.toFixed(2)}`,
                transaction.total_sold.toString(),
                formatDate(transaction.last_transaction_date),
            ];

            if (currentY + rowHeight > pageHeight - margin) {
                doc.addPage();
                currentY = margin + 30;
                doc.setFont('helvetica', 'bold');
                drawTableRow(doc, headers, currentY, colWidths);
                currentY += rowHeight;
                doc.setFont('helvetica', 'normal');
            }

            drawTableRow(doc, row, currentY, colWidths);
            currentY += rowHeight;
        });

        doc.save('product-purchase.pdf');
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

    return (
        <div className='productreportlist-container'>
            <div className='Filter-product'>
                <div className='productreportlist-search-container'>
                    <input
                        type='text'
                        placeholder='Search'
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className='date-range-inputs'>
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
                <div className='productlocation-select'>
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
                <div className='productreportlist-files'>
                    <div
                        className='productreportlist-download'
                        onClick={handleDownloadCSV}
                    >
                        <FaFileCsv size={35} style={{ color: '#28a745' }} />
                    </div>
                    <div
                        className='productreportlist-download'
                        onClick={handleDownloadPDF}
                    >
                        <FaFilePdf size={35} style={{ color: '#dc3545' }} />
                    </div>
                </div>
            </div>

            <div className='productreportlist-table'>
                <div className='productreportlist-table-header'>
                    <span onClick={() => handleSort('last_transaction_date')}>
                        Date{' '}
                        <i
                            className={`fa fa-caret-${
                                sortConfig.key === 'last_transaction_date' &&
                                sortConfig.direction === 'asc'
                                    ? 'up'
                                    : 'down'
                            }`}
                        ></i>
                    </span>
                    <span onClick={() => handleSort('name')}>
                        Product Name{' '}
                        <i
                            className={`fa fa-caret-${
                                sortConfig.key === 'name' && sortConfig.direction === 'asc'
                                    ? 'up'
                                    : 'down'
                            }`}
                        ></i>
                    </span>
                    <span onClick={() => handleSort('location')}>
                        Location{' '}
                        <i
                            className={`fa fa-caret-${
                                sortConfig.key === 'location' && sortConfig.direction === 'asc'
                                    ? 'up'
                                    : 'down'
                            }`}
                        ></i>
                    </span>
                    <span onClick={() => handleSort('total_price')}>
                        Total Value{' '}
                        <i
                            className={`fa fa-caret-${
                                sortConfig.key === 'total_price' &&
                                sortConfig.direction === 'asc'
                                    ? 'up'
                                    : 'down'
                            }`}
                        ></i>
                    </span>
                    <span onClick={() => handleSort('total_sold')}>
                        Total Sold{' '}
                        <i
                            className={`fa fa-caret-${
                                sortConfig.key === 'total_sold' &&
                                sortConfig.direction === 'asc'
                                    ? 'up'
                                    : 'down'
                            }`}
                        ></i>
                    </span>
                </div>

                {currentProducts.length > 0 ? (
                    currentProducts.map((transaction, i) => (
                        <div key={i} className='productreportlist-table-row'>
                            <span
                                style={{ whiteSpace: 'nowrap' }}
                                data-label='Date'
                            >
                                {formatDate(transaction.last_transaction_date)}
                            </span>
                            <span data-label='Product Name'>{transaction.product.name}</span>
                            <span data-label='Location'>{transaction.location.name}</span>
                            <span
                                data-label='Total Value'
                                className='productvalu2'
                            >
                                £{transaction.total_price.toFixed(2)}
                            </span>
                            <span
                                data-label='Total Sold'
                                className='productvalu'
                            >
                                {transaction.total_sold}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className='productreportlist-no-data'>
                        No product transactions found.
                    </div>
                )}
            </div>
            {totalPages > 1 && <PaginationControls />}
        </div>
    );
};

export default ProductList;
