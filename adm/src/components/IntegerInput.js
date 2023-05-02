import React from 'react';
import NumberFormat from 'react-number-format';

export const IntegerInput = ({defaultValue, onChange, customRef, thousandSeparator, ...props}) => {
    return (
        <NumberFormat className="form-control"
            decimalSeparator=","
            thousandSeparator={thousandSeparator ? thousandSeparator : "."}
            defaultValue={defaultValue}
            onValueChange={onChange}
            style={{textAlign: "right"}}
            {...props}
            ref={customRef}
            >
        </NumberFormat>
    )
}