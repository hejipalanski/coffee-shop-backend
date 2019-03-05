'use-strict'

const hasNonNumeral = (param) => {
	if(typeof param !== 'string') return false;
	const pattern = /\D+/g;
	const result = param.match(pattern);
	try {
		if(result.length > 0) return true;
	}
	catch(err) {
		return false;
	}
};

const isUUID = (id) => {
	if(typeof id === 'string') {
		if(id.length == 36) {
			const uuidFormat = /[:0-9a-f:]{8}-[:0-9a-f:]{4}-[:0-9a-f:]{4}-[:0-9a-f:]{4}-[:0-9a-f:]{12}/g;
			return id.match(uuidFormat) ? true : false;
		}
		return false;
	}
	return false;
};

const sendResponse = (res, data, code = 200) => {
	let send_data = {};
	if(code >= 400 && code <= 451) {
		send_data.success = false;
		send_data.error = true;
	}
	else if(code >= 200 && code <= 226) {
		send_data.success = true;
		send_data.error = false;
	}
	if (typeof data === 'object') {
		send_data = Object.assign(send_data, data);
	}
	res.statusCode = code;
	return res.send(send_data);
};

const getOptionsFromQuery = (model, paramsObj) => {
	let modelProps = Object.keys(model);
	let i, length = modelProps.length, option = Object.assign({}, model);
	for(i = 0; i < length; i++) {
		if(!paramsObj.hasOwnProperty(modelProps[i])) {
			delete option[modelProps[i]];
		}
		else {
			option[modelProps[i]] = paramsObj[modelProps[i]];
		}
	}
	model = null;
	modelProps =  null;
	paramsObj = null;
	return option;
};

const getMissingRequiredParams = (refParams = [], paramsToCheck = {}) => {
	let missingParams = [];
	let ptoCheck = Object.keys(paramsToCheck);
	let prop;
	for(prop of refParams) {
		if(!ptoCheck.includes(prop)) {
			missingParams.push(prop);
		}
	}
	return missingParams;
};

const getErrorsFrom = (errorList) => {
	let errors = [];
	let i, length = errorList.length;
	for(i = 0; i < length; i++) {
		errors.push({
			msg: errorList[i].message,
			field: `${errorList[i].path}: ${errorList[i].value}`
		});
	}
	return errors;
};

module.exports = {
	hasNonNumeral,
	sendResponse,
	getOptionsFromQuery,
	isUUID,
	getMissingRequiredParams,
	getErrorsFrom
};