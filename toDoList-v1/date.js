const today = new Date();

exports.getDate = () => {
	const options = { weekday: 'long', day: 'numeric', month: 'short' };
	return today.toLocaleDateString('en-US', options);
};

exports.getDay = () => {
	const options = { weekday: 'long' };
	return today.toLocaleDateString('en-US', options);
};
