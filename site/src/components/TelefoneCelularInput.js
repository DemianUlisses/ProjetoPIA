import React from 'react';
import NumberFormat from 'react-number-format';

export const TelefoneCelularInput = ({defaultValue, onChange, style}) => {
    return (
        <NumberFormat className="form-control"
            format="(##)#####-####"
            defaultValue={defaultValue}
            onValueChange={(value) => onChange(value.formattedValue)}
            style={style}
            >
        </NumberFormat>
    )
}