import React from 'react';
import TimeField from 'react-simple-timefield';
import { FormControl } from 'react-bootstrap';

export class TimeInput extends React.Component {
	render () {
		return (
			<TimeField
				className='form-control'
				value={this.props.defaultValue ? this.props.defaultValue : '00:00'}
				readOnly={this.props.readOnly}
				onChange={(e, time) => {
					if (this.props.onChange) {
						this.props.onChange(time);
					}
				}}
				input={<FormControl type='text' />}
				style={{padding: 5}}
			></TimeField>
		);
	}
};