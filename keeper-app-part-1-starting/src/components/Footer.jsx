import React from 'react';

function Header() {
	const year = new Date().getFullYear();
	return (
		<footer>
			<p>Copyright {year}</p>
		</footer>
	);
}

export default Header;
