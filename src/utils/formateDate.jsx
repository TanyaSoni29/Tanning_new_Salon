/** @format */

export const formatDate = (date) => {
	const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
	return new Date(date).toLocaleDateString('en-GB', options); // 'en-GB' locale ensures DD/MM/YYYY format
};
