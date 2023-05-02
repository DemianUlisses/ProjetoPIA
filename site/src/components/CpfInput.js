import React from 'react';
import NumberFormat from 'react-number-format';

export const CpfInput = ({ defaultValue, onChange, onBlur }) => {
	return (
		<NumberFormat
			className='form-control'
			format='###.###.###-##'
			defaultValue={defaultValue}
			onValueChange={onChange}
			onBlur={onBlur}
		></NumberFormat>
	);
};
