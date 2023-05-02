import React from 'react';
import Calendar from 'react-calendar';
import '../components/Calendar.css';
import { Dropdown, InputGroup, Form } from 'react-bootstrap';
import styled from 'styled-components';
import * as moment from 'moment';
import { showError } from '../scripts/Messages';
import { replaceAll } from '../scripts/Utils';

export class DateInput extends React.Component {
	constructor(props) {
		super(props);

		let date = new Date();
		if (props.defaultValue && moment(props.defaultValue).isValid()) {
			date = moment(props.defaultValue).toDate();
		}

		this.state = { date: date, dataDigitada: moment(date).format('DD/MM/YYYY'), mostrarCalendario: true };
		this.setDateFromCalendar = this.setDateFromCalendar.bind(this);
	}

	setDateFromCalendar(value) {
		let date = value;
		this.setState({ date: date });
		if (!date) {
			if (this.input) {
				this.input.value = null;
			}
			this.setState({ dataDigitada: null });
		} else {
			if (this.input) {
				this.input.value = moment(date).format('DD/MM/YYYY');
			}
			this.setState({ dataDigitada: moment(date).format('DD/MM/YYYY') });
		}
		if (this.props.onChange) {
			this.props.onChange(date);
		}
	}

	closeCalendar() {
		setTimeout(() => {
			this.menu.click();
		}, 100);
	}

	render() {
		let inputBackgroundColor = {
			backgroundColor: this.props.readOnly ? '#e9ecef' : null,
			paddingLeft: 6,
			paddingRight: 6,
		};
		return (
			<DateInputStyled style={{ display: 'flex' }}>
				<InputGroup style={{ backgroundColor: 'transparent', flexWrap: 'nowrap' }}>
					<Form.Control
						type='text'
						ref={(c) => (this.input = c)}
						defaultValue={this.props.defaultValue ? moment(this.state.date).format('DD/MM/YYYY') : null}
						style={{ ...this.props.style, ...inputBackgroundColor }}
						onChange={(e) => {
							this.setState({ dataDigitada: e.target.value });
						}}
						readOnly={this.props.readOnly}
						maxLength={10}
						onBlur={() => {
							if (this.state.dataDigitada) {
								var dataString = replaceAll(this.state.dataDigitada, '/', '');
								var dia = dataString.substr(0, 2);
								var mes = dataString.substr(2, 2);
								var ano = dataString.substr(4, 4);
								var d = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
								var d2 = moment(d);
								if (d2.isValid() && dataString === d2.format('DDMMYYYY')) {
									this.setState({ date: d2.toDate(), mostrarCalendario: false }, () =>
										this.setState({ mostrarCalendario: true })
									);
									if (this.props.onChange) {
										this.props.onChange(d2.toDate());
									}
									this.input.value = d2.format('DD/MM/YYYY');
								} else {
									showError(this.state.dataDigitada + ' não é uma data válida.');
									this.input.value = moment(this.state.date ? this.state.date : new Date()).format(
										'DD/MM/YYYY'
									);
								}
							} else {
								this.setState({ date: null, dataDigitada: null });
								if (this.props.onChange) {
									this.props.onChange(null);
								}
							}
						}}
					/>
					{!this.props.readOnly && (
						<InputGroup.Append>
							<InputGroup.Text
								style={{
									padding: '1px 6px 1px 6px',
									height: this.props.style && this.props.style.height ? this.props.style.height : 38,
									width: 40,
									justifyContent: 'center',
								}}
							>
								<Dropdown style={{ padding: 0 }}>
									<Dropdown.Toggle
										variant='transparent'
										id={'dateinput'}
										ref={(c) => (this.menu = c)}
										tabIndex={-1}
									></Dropdown.Toggle>
									<Dropdown.Menu style={{ outline: 0 }} alignRight={true} flip={true}>
										<div>
											{this.state.mostrarCalendario && (
												<Calendar
													onChange={this.setDateFromCalendar}
													value={this.state.date}
													onClickDay={() => {
														this.closeCalendar();
													}}
													prevLabel={'<'}
													nextLabel={'>'}
													prev2Label={null}
													next2Label={null}
													showFixedNumberOfWeeks={false}
													calendarType={'US'}
												/>
											)}
											<div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
												<div
													style={{
														textAlign: 'right',
														color: '#999',
														cursor: 'pointer',
														marginRight: 10,
														fontSize: 14,
														display: 'flex',
														justifyContent: 'flex-end',
													}}
													onClick={() => {
														this.setDateFromCalendar(new Date());
														this.closeCalendar();
													}}
												>
													<div
														style={{
															display: 'table-cell',
															paddingLeft: 10,
															paddingRight: 10,
														}}
													>
														<span>hoje</span>
													</div>
												</div>
												<div
													style={{
														textAlign: 'right',
														color: '#999',
														cursor: 'pointer',
														marginRight: 10,
														fontSize: 14,
														display: 'flex',
														justifyContent: 'flex-end',
													}}
													onClick={() => {
														this.setDateFromCalendar(null);
														this.closeCalendar();
													}}
												>
													<div
														style={{
															display: 'table-cell',
															paddingLeft: 10,
															paddingRight: 10,
														}}
													>
														<span>limpar</span>
													</div>
												</div>
											</div>
										</div>
									</Dropdown.Menu>
								</Dropdown>
							</InputGroup.Text>
						</InputGroup.Append>
					)}
				</InputGroup>
			</DateInputStyled>
		);
	}
}

const DateInputStyled = styled.div`
	.dropdown-toggle {
		box-shadow: none;
	}
`;
