import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { numberToString } from '../scripts/Utils';

export class DecimalInput extends Component {
	constructor(props) {
		super(props);

		this.decimalPlaces = props.decimalPlaces ? props.decimalPlaces : 2;

		this.state = {
			defaultValue:
				props.defaultValue === null || props.defaultValue === undefined
					? null
					: props.defaultValue * this.getMultiplicador(this.decimalPlaces),
		};
	}

	getMultiplicador(decimalPlaces) {
		let multiplicador = parseInt('1' + ''.padEnd(decimalPlaces, '0'));
		return multiplicador;
	}

	render() {
		return (
			<NumberFormat
				className='form-control'
				decimalSeparator=','
				thousandSeparator='.'
				format={(value) => {
					let formated =
						value === null || value === undefined
							? null
							: numberToString(
									value / this.getMultiplicador(this.decimalPlaces),
									this.decimalPlaces,
									this.decimalPlaces
							  );
					return formated;
				}}
				defaultValue={this.state.defaultValue}
				onValueChange={(values) => {
					if (this.props.onChange) {
						let value =
							values.value === null || values.value === undefined
								? null
								: values.value / this.getMultiplicador(this.decimalPlaces);

						let formattedValue = value === null || value === undefined ? null : numberToString(value);
						this.props.onChange({
							value: value,
							floatValue: value,
							formattedValue: formattedValue,
						});
					}
				}}
				style={{ textAlign: 'right' }}
			/>
		);
	}
}
