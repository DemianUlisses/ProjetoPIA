import React from 'react';
import NumberFormat from 'react-number-format';

export const TelefoneFixoInput = ({defaultValue, onChange}) => {
    return (
        <NumberFormat className="form-control"
            format="(##)####-####"
            placeholder="(00)0000-0000"
            defaultValue={defaultValue}
            onValueChange={(value) => onChange(value.formattedValue)}>
        </NumberFormat>
    )
}