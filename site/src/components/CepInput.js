import React from 'react';
import NumberFormat from 'react-number-format';

export const CepInput = ({defaultValue, onChange}) => {
    return (
        <NumberFormat className="form-control"
            format="#####-###"
            defaultValue={(defaultValue)}
            onValueChange={onChange}>
        </NumberFormat>
    )
}