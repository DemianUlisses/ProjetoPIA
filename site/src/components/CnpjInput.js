import React from 'react';
import NumberFormat from 'react-number-format';

export const CnpjInput = ({ defaultValue, onChange, onBlur }) => {
	return (
		<NumberFormat
			className='form-control'
			format='##.###.###/####-##'
			defaultValue={defaultValue}
			onValueChange={onChange}
			onBlur={onBlur}
		></NumberFormat>
	);
};
