import React, { Component } from 'react';
import { Modal, ModalManager, Effect } from 'react-dynamic-modal';
import { LayoutParams } from '../components/LayoutParams';

export default class Messages {
	showInfo = (text) => {
		return new Promise(function (resolve, reject) {
			ModalManager.open(<ModalInfo title='Informação' text={text} onRequestClose={() => resolve()} />);
		});
	};

	showError = (text) => {
		return new Promise(function (resolve, reject) {
			ModalManager.open(<ModalError title='Ops!' text={text} onRequestClose={() => resolve()} />);
		});
	};

	showConfirm = (text, onConfirm, onCancel) => {
		ModalManager.open(
			<ModalConfirm
				title='Confirmação'
				text={text}
				onRequestClose={() => true}
				onConfirm={onConfirm}
				onCancel={onCancel}
			/>
		);
	};
}

export const showInfo = (text) => {
	return new Promise(function (resolve, reject) {
		ModalManager.open(<ModalInfo title='Informação' text={text} onRequestClose={() => resolve()} />);
	});
};

export const showError = (text) => {
	return new Promise(function (resolve, reject) {
		ModalManager.open(<ModalError title='Ops!' text={text} onRequestClose={() => resolve()} />);
	});
};

export const showConfirm = (text, onConfirm, onCancel, confirmText, cancelText) => {
	ModalManager.open(
		<ModalConfirm
			title='Confirmação'
			text={text}
			onRequestClose={() => true}
			onConfirm={onConfirm}
			onCancel={onCancel}
			confirmText={confirmText}
			cancelText={cancelText}
		/>
	);
};

class ModalInfo extends Component {
	render() {
		const { title, text, onRequestClose } = this.props;
		return (
			<Modal
				onRequestClose={onRequestClose}
				effect={Effect.SlideFromBottom}
				style={{ content: { minWidth: '300px', maxWidth: '500px' } }}
			>
				<div className='modal-content' size='md' style={{ border: 0 }}>
					<div className='modal-header' style={{ backgroundColor: LayoutParams.colors.corDoTemaPrincipal }}>
						<div className='modal-title h4' style={{ color: LayoutParams.colors.corSecundaria }}>
							{title}
						</div>
					</div>
					<div className='modal-body'>
						<p>{text}</p>
					</div>
					<div className='modal-footer'>
						<button
							type='button'
							style={{ width: '130px' }}
							onClick={() => {
								ModalManager.close();
								onRequestClose();
							}}
							className='btn btn-secondary'
							ref={(c) => {
								if (c) c.focus();
							}}
						>
							OK
						</button>
					</div>
				</div>
			</Modal>
		);
	}
}

class ModalError extends Component {
	render() {
		const { title, text, onRequestClose } = this.props;
		return (
			<Modal
				onRequestClose={onRequestClose}
				effect={Effect.SlideFromBottom}
				style={{ content: { minWidth: '300px', maxWidth: '500px' } }}
			>
				<div className='modal-content' size='md' style={{ border: 0 }}>
					<div className='modal-header' style={{ backgroundColor: LayoutParams.colors.corDoTemaPrincipal }}>
						<div className='modal-title h4' style={{ color: LayoutParams.colors.corSecundaria }}>
							{title}
						</div>
					</div>
					<div className='modal-body' style={{ display: 'flex', overflow: 'auto', maxHeight: 400 }}>
						<p>{text}</p>
					</div>
					<div className='modal-footer'>
						<button
							type='button'
							style={{ width: '130px' }}
							onClick={() => {
								ModalManager.close();
								onRequestClose();
							}}
							className='btn btn-secondary'
							ref={(c) => {
								if (c) c.focus();
							}}
						>
							OK
						</button>
					</div>
				</div>
			</Modal>
		);
	}
}

class ModalConfirm extends Component {
	render() {
		const { title, text, onRequestClose } = this.props;
		return (
			<Modal
				onRequestClose={onRequestClose}
				effect={Effect.SlideFromBottom}
				style={{ content: { minWidth: '300px', maxWidth: '500px' } }}
			>
				<div className='modal-content' size='md' style={{ border: 0 }}>
					<div className='modal-header' style={{ backgroundColor: LayoutParams.colors.corDoTemaPrincipal }}>
						<div className='modal-title h4' style={{ color: LayoutParams.colors.corSecundaria }}>
							{title}
						</div>
					</div>
					<div className='modal-body'>{text}</div>
					<div className='modal-footer'>
						<button
							type='button'
							onClick={() => {
								if (this.props.onCancel) {
									this.props.onCancel();
								}
								ModalManager.close();
							}}
							className='btn btn-secondary'
							style={{ width: '130px' }}
						>
							{this.props.cancelText ? this.props.cancelText : 'Cancelar'}
						</button>
						<button
							type='button'
							onClick={() => {
								if (this.props.onConfirm !== undefined) {
									this.props.onConfirm();
								}
								ModalManager.close();
							}}
							style={{ width: '130px' }}
							className='btn btn-dark'
						>
							{this.props.confirmText ? this.props.confirmText : 'Confirmar'}
						</button>
					</div>
				</div>
			</Modal>
		);
	}
}
