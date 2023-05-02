import React from 'react';
import { FormCheck } from 'react-bootstrap';
import styled from 'styled-components';

const CheckBoxStyled = styled.div`
	display: flex;
	vertical-align: middle;

	.form-check-input {
		height: inherit;
		margin-top: auto;
		margin-bottom: auto;
	}

	.form-check-label {
		margin-bottom: auto;
		white-space: nowrap;
	}

	.form-check {
		height: 20px;
	}
`;

export const CheckBox = ({ defaultChecked, onChange, name, label, style, title }) => {
	return (
		<CheckBoxStyled style={style}>
			<FormCheck
				type='checkbox'
				label={label}
				id={name}
				defaultChecked={defaultChecked}
				title={title}
				onChange={(e) => {
					onChange(e.target.checked ? true : false);
				}}
				style={{ display: 'flex' }}
			/>
		</CheckBoxStyled>
	);
};
