const Promise = require("bluebird");
const request = require('request');
const config  = require('./../config/app-config');
const log  = require('./../libs/log')(module);

const BadRequestError = require('../libs/error').BadRequestError;

const authy = require('authy')(config.get('AUTHY_API_KEY'));


function sendSms(phone) {
    authy.phones().verification_start(phone, '7', 'sms', function(err, res) {
	if (err) {
	    log.error("ERROR within authy: ", err);
	} else {
	    log.debug(res);		
	    log.info("SMS sent to phone: ", phone);
	}
    });
}

function* sendPhoneVerification(phone, code) {
    try {
	let authyPhones = authy.phones();
	Promise.promisifyAll(authyPhones, {suffix: "Promise"});

	res = yield authyPhones.verification_checkPromise(phone, '7', code)
	log.debug(res);		
	log.info("Successfully registered: ", phone);
    } catch (err) {
	log.error("Error while confirming SMS code: ", err);
	throw new BadRequestError('Sms code is wrong!');
    }
    return true;
}


module.exports = {
    sendSms,
    sendPhoneVerification
}
