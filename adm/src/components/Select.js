import React, { Component } from 'react';
import { FormControl, Modal, InputGroup } from 'react-bootstrap';
import { showError } from '../scripts/Messages';
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt } from '@fortawesome/free-regular-svg-icons';

export class Select extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inserindo: false,
			searchText: null,
			oneItemSelected: props.noDropDown && props.defaultValue ? props.defaultValue : null,
		};
		this.getOptions = this.getOptions.bind(this);
		this.getDefault = this.getDefault.bind(this);
		this.getSearchText = this.getSearchText.bind(this);
		this.aoSelecionar = this.aoSelecionar.bind(this);
		this.clear = this.clear.bind(this);
		this.showModal = this.showModal.bind(this);
	}

	getOptions() {
		let result = [];
		if (!this.props.options && !this.props.noDropDown) {
			showError('Opções não definidas para o componente ' + this.props.name + '.');
		} else {
			result = this.props.filter ? this.props.options.filter(this.props.filter) : this.props.options;
		}
		return result;
	}

	getDefault() {
		let result = this.props.defaultValue;
		if (!result && this.props.asws) {
			let options = this.props.filter ? this.props.options.filter(this.props.filter) : this.props.options;
			if (options && options.length === 1) {
				result = this.props.getKeyValue(options[0]);
			}
		}
		return result;
	}

	showModal() {
		this.setState({ inserindo: true });
	}

	componentDidMount() {
		let result = this.props.defaultValue;
		if (!result && this.props.asws) {
			if (this.props.options && this.props.options.length === 1 && this.props.onSelect) {
				this.props.onSelect(this.props.options[0]);
			}
		}
	}

	aoSelecionar(item, novo) {
		if (item) {
			if (novo && !this.props.noDropDown) {
				this.props.options.push(item);
			}
			if (this.props.onSelect) {
				this.props.onSelect(item);
			}
			if (!this.props.noDropDown) {
				this.props.updateOptions(this.props.options);
				this.select.value = this.props.getKeyValue(item);
			} else {
				if (this.props.getDescription && this.input) {
					this.input.value = this.props.getDescription(item);
				}
				this.setState({ oneItemSelected: item });
			}

			this.setState({
				inserindo: false,
			});
		}
	}

	aoCancelar() {
		this.setState({
			inserindo: false,
		});
	}

	getSearchText() {
		return this.state.searchText;
	}

	clear() {
		let f = () => {
			this.input.value = null;
			this.setState({
				oneItemSelected: null,
			});
			if (this.props.onSelect) {
				this.props.onSelect(null);
			}
		};

		if (this.props.beforeClear) {
			this.this.props.beforeClear().then(f);
		} else {
			f();
		}
	}

	render() {
		let defaultDescription = null;
		if (this.props.defaultValue && this.props.getDescription) {
			defaultDescription = this.props.getDescription(this.props.defaultValue);
		}
		let name = this.props.name ? this.props.name : 'selectName';
		return (
			<div id={'select_' + name}>
				<div style={{ width: this.props.width }}>
					<InputGroup style={{ flexWrap: 'nowrap' }}>
						{!this.props.noDropDown && (
							<FormControl
								as='select'
								ref={(c) => (this.select = c)}
								name={this.props.name ? this.props.name : 'selectName'}
								style={{
									height: this.props.height ? this.props.height : 38,
									padding: 1,
									backgroundColor: this.props.color,
									cursor: this.props.cursor ? this.props.cursor : 'default',
									outline: 'none',
									//boxShadow: 'none',
									borderColor: '#ced4da',
									fontSize: this.props.fontSize ? this.props.fontSize : null,
								}}
								defaultValue={this.getDefault()}
								onChange={(e) => {
									let option = this.props.options.filter((i) => {
										let value = this.props.getKeyValue(i);
										return value && value.toString() === e.target.value ? true : false;
									})[0];
									if (this.props.onSelect) {
										this.props.onSelect(option);
									}
								}}
								disabled={this.props.disabled}
								readOnly={this.props.readOnly}
							>
								{[
									(this.props.allowEmpty === undefined || this.props.allowEmpty === null) && (
										<option key={-1} value=''>
											{this.props.nullText !== null && this.props.nullText !== undefined
												? this.props.nullText
												: 'selecione...'}
										</option>
									),
									this.getOptions(this.props.options).map((item, index) => {
										return (
											<option key={index} value={this.props.getKeyValue(item)}>
												{this.props.getDescription(item)}
											</option>
										);
									}),
								]}
							</FormControl>
						)}

						{this.props.noDropDown && (
							<form
								onSubmit={(event) => {
									event.preventDefault();
									this.setState({
										inserindo: true,
									});
								}}
								action='/'
								name={'formSearchText_' + name}
								id={'formSearchText_' + name}
								style={{ width: '100%' }}
							>
								<FormControl
									type='text'
									ref={(c) => (this.input = c)}
									defaultValue={defaultDescription}
									onChange={(e) => {
										this.setState({ searchText: e.target.value });
									}}
									style={{
										backgroundColor:
											(this.props.readOnly || this.state.oneItemSelected) &&
											this.props.readOnlyColor
												? this.props.readOnlyColor
												: this.props.color,
										borderTopRightRadius: this.props.readOnly ? null : 0,
										borderBottomRightRadius: this.props.readOnly ? null : 0,
										outline: 'none',
										boxShadow: 'none',
										borderColor: '#ced4da',
										fontSize: this.props.fontSize ? this.props.fontSize : null,
									}}
									readOnly={this.props.readOnly || this.state.oneItemSelected ? true : false}
									placeholder={this.props.placeholder}
								></FormControl>
							</form>
						)}
						{this.props.formularioPadrao && !this.props.readOnly && (
							<InputGroup.Append>
								{!this.state.oneItemSelected && (
									<InputGroup.Text
										cursor='pointer'
										onClick={() => {
											this.setState({
												inserindo: true,
											});
										}}
									>
										<div>
											<FontAwesomeIcon
												title='cadastro'
												style={{
													fontSize: 20,
													paddingTop: 3,
												}}
												icon={this.props.noDropDown ? faSearch : faListAlt}
											/>
										</div>
									</InputGroup.Text>
								)}
								{this.state.oneItemSelected && (
									<InputGroup.Text cursor='pointer' onClick={this.clear}>
										<div>
											<FontAwesomeIcon
												title='limpar'
												style={{
													fontSize: 20,
													paddingTop: 3,
												}}
												icon={faTimesCircle}
											/>
										</div>
									</InputGroup.Text>
								)}
							</InputGroup.Append>
						)}
					</InputGroup>
				</div>

				{this.state.inserindo && (
					<Modal
						show={this.state.inserindo}
						scrollable={true}
						size={'lg'}
						onHide={() => {}}
						onKeyDown={(e) => {
							if (e.keyCode === 27) this.setState({ inserindo: false });
						}}
						dialogClassName='h-100'
					>
						<Modal.Body
							style={{
								overflow: 'hidden',
								display: 'flex',
								position: 'relative',
								fontSize: 13,
								padding: '0 0 0 0',
								maxHeight: '100%',
							}}
						>
							{this.props.formularioPadrao(this)}
						</Modal.Body>
					</Modal>
				)}
			</div>
		);
	}
}
