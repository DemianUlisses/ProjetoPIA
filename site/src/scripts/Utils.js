import * as moment from 'moment';

export const stringToDate = (stringDate) => {
	if (!stringDate) return null;
	let result = moment(
		stringDate.substr(6, 4) + '-' + stringDate.substr(3, 2) + '-' + stringDate.substr(0, 2)
	).toDate();
	return result;
};

export function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

export const mesPorExtenso = (data) => {
	var result = [
		'Janeiro',
		'Fevereiro',
		'Março',
		'Abril',
		'Maio',
		'Junho',
		'Julho',
		'Agosto',
		'Setembro',
		'Outubro',
		'Novembro',
		'Dezembro',
	][data.getMonth()];
	return result;
};

export const isNumeric = (num) => {
	return !isNaN(num);
};

export const isString = (value) => {
	return typeof value === 'string' || value instanceof String;
};

export const dateToString = (stringDate) => {
	if (!stringDate) return null;
	let date = new Date(stringDate);
	let result = moment(date).format('DD/MM/YYYY');
	return result;
};

export const dateTimeToString = (stringDate) => {
	if (!stringDate) return null;
	let date = new Date(stringDate);
	let result = moment(date).format('DD/MM/YYYY hh:mm:ss');
	return result;
};

export const dateToInt = (date) => {
	if (!date) return null;
	date = date.toString();
	let result = date.substr(8, 2) + '/' + date.substr(5, 2) + '/' + date.substr(0, 4);
	return result;
};

export const pad2 = (n) => {
	return (n < 10 ? '0' : '') + n;
};

export const pad = (number, length, char = '0') => {
	return number.toString().padStart(length, '0');
};

export const numberToCurrencyString = (number) => {
	if (number === null || number === undefined) return null;
	if (isNaN(number)) return null;
	let result = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
	return result;
};

export const create_UUID = () => {
	var dt = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		var r = (dt + Math.random() * 16) % 16 | 0;
		dt = Math.floor(dt / 16);
		// eslint-disable-next-line
		return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
	});
	return uuid;
};

export const numberToString = (number, minimumFractionDigits = 0, maximumFractionDigits = 6) => {
	if (number === null || number === undefined) return null;
	if (isNaN(number)) return null;
	let result = new Intl.NumberFormat('pt-BR', {
		minimumFractionDigits: minimumFractionDigits,
		maximumFractionDigits: maximumFractionDigits,
	}).format(number);
	return result;
};

export const numberToString2 = (number, minimumFractionDigits = 0) => {
	if (number === null || number === undefined) return null;
	if (isNaN(number)) return null;
	let result = new Intl.NumberFormat('pt-BR', {
		minimumFractionDigits: minimumFractionDigits,
	}).format(number);
	return result;
};

export const replaceAll = (string, search, replace) => {
	return string.split(search).join(replace);
};

export const removeMask = (text) => {
	if (!text) return text;
	let result = replaceAll(text, '.', '');
	result = replaceAll(result, '-', '');
	return result;
};

export const getEnderecoCompleto = (endereco) => {
	if (!endereco) return null;
	return replaceAll(
		[
			endereco.logradouro,
			endereco.numero,
			endereco.complemento,
			endereco.bairro,
			endereco.cep ? 'CEP ' + endereco.cep : '',
			endereco.cidade.nome + ' / ' + endereco.cidade.estado.uf,
		].join(', '),
		', , ',
		', '
	);
};

export const horaMaiorOuIgual = (a, b) => {
	let result = parseInt(a.replace(':', '')) >= parseInt(b.replace(':', ''));
	return result;
};

export const horaMenorOuIgual = (a, b) => {
	let result = parseInt(a.replace(':', '')) <= parseInt(b.replace(':', ''));
	return result;
};

export const calcularDiferencaEntreHorasEmMinutos = (horaInicial, horaFinal) => {
	let data = moment();
	let horaInicial1 = moment(data.format('YYYY-MM-DD ' + horaInicial));
	let horaFinal1 = moment(data.format('YYYY-MM-DD ' + horaFinal));
	let result = horaFinal1.diff(horaInicial1, 'minutes');
	return result;
};

export const converterHorasParaMinutos = (hora) => {
	let result = calcularDiferencaEntreHorasEmMinutos('00:00:00', hora);
	return result;
};

export const converterMinutosParaHora = (minutos) => {
	let data = moment();
	let dataBase = moment(data.format('YYYY-MM-DD'));
	dataBase.add(minutos, 'minutes');
	let result = dataBase.format('HH:mm');
	return result;
};

export const getNomeDoDiaDaSemana = (diaDaSemana) => {
	let nomes = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
	let result = nomes[diaDaSemana - 1];
	return result;
};

export const getTelefones = (item) => {
	let result = '';
	item.telefones.forEach((telefone) => {
		result += telefone.numeroComDDD + ', ';
	});
	if (result[result.length - 2] === ',') {
		result = result.substr(0, result.length - 2);
	}
	return result;
};

export const generatePassword = (numberOnly) => {
	var length = 6,
		charset = numberOnly ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' : '0123456789',
		retVal = '';
	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
};

export const retirarAcentos = (str) => {
	let com_acento = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ';

	let sem_acento = 'AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr';
	let novastr = '';
	for (let i = 0; i < str.length; i++) {
		let troca = false;
		for (let a = 0; a < com_acento.length; a++) {
			if (str.substr(i, 1) === com_acento.substr(a, 1)) {
				novastr += sem_acento.substr(a, 1);
				troca = true;
				break;
			}
		}
		if (troca === false) {
			novastr += str.substr(i, 1);
		}
	}
	return novastr;
};

export const inputToUpper = (e) => {
	var start = e.target.selectionStart;
	// var end = e.target.selectionEnd;
	e.target.value = ('' + e.target.value).toUpperCase();
	e.target.setSelectionRange(start  , start  );
	e.preventDefault();
}