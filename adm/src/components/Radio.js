import React from 'react';
import { Form } from 'react-bootstrap';
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
		margin-top: auto;
		margin-bottom: auto;
	}

	.form-check {
		height: 20px;
	}

	span {
		padding-top: 3px;
	}
`;

export const Radio = ({ defaultChecked, onChange, name, label, style }) => {
	return (
		<CheckBoxStyled style={style}>
			<Form.Label
				style={{
					display: 'flex',
					textAlign: 'left',
					cursor: 'pointer',
					marginBottom: 0,
				}}
			>
				<Form.Check
					type='radio'					
					name={name}
					defaultChecked={defaultChecked}
					onChange={(e) => {
						onChange(e.target.checked ? true : false);
					}}
					style={{ display: 'flex' }}
				/>
				<span>{label}</span>
			</Form.Label>
		</CheckBoxStyled>
	);
};
