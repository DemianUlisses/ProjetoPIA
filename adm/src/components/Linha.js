import React from 'react';

export const Linha = ({ marginTop, marginBottom, width, color }) => {
	return (
		<hr
			style={{
				marginLeft: 0,
				marginRight: 0,
				marginTop: marginTop ? marginTop : 0,
				marginBottom: marginBottom ? marginBottom : 0,
				borderColor: color,
				width: width,
			}}
		/>
	);
};
