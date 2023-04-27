import React from 'react';
import NumberFormat from 'react-number-format';

export const IntegerInput = ({defaultValue, onChange, customRef, ...props}) => {
    return (
        <NumberFormat className="form-control"
            decimalSeparator=","
            thousandSeparator="."
            defaultValue={defaultValue}
            onValueChange={onChange}
            style={{textAlign: "right"}}
            {...props}
            ref={customRef}
            >
        </NumberFormat>
    )
}