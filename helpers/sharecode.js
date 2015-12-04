'use strict';

var packJS = require('./pack.js');
var StringIO = require('./stringio.js');
var BigNumber = require('bignumber.js');
BigNumber.config({
	DECIMAL_PLACES: 43,
	EXPONENTIAL_AT: 50
});

class ByteReader {
	constructor(io) {
		this.io = io;
	}

	get read_int64() {
		var temp = this.io.read(8);
		var unpacked = packJS.unpack("C*", temp);
		var result = new BigNumber(0);
		Object.keys(unpacked).forEach(function(key) {
			var index = key - 1;
			var byte = unpacked[key];

			var a = new BigNumber(256).toPower(new BigNumber(index));
			var b = new BigNumber(byte).times(a);

			result = result.plus(b)
		});
		return result.toString();
	}

	get read_short() {
		var temp = this.io.read(2);
		var unpacked = packJS.unpack("S*", temp);
		return unpacked[''].toString();
	}
}

class SharecodeDecoder {
	constructor(code) {
		this.code = this.sanitize_code(code);
		this.originalCode = code;

		this.DICTIONARY = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789";
		this.DICTIONARY_LENGTH = this.DICTIONARY.length
	}

	decode() {
		var reader 		= new ByteReader(this.io);
		var matchId 	= reader.read_int64;
		var outcomeId	= reader.read_int64;
		var tokenId 	= reader.read_short;

		return {
			matchId: matchId,
			outcomeId: outcomeId,
			tokenId: tokenId
		};
	}

	sanitize_code(str) {
		return str.replace(/CSGO|\-/g, '');
	}

	get io() {
		return new StringIO.StringIO(packJS.pack("H*", this.decoded_code.toString(16)))
	}

	get decoded_code() {
		var self = this;
		var reversed = this.code.split('').reverse();
		var result = new BigNumber(0);
		reversed.forEach(function(char, index) {
			result = (result.times(new BigNumber(self.DICTIONARY_LENGTH))).plus(new BigNumber(self.DICTIONARY.indexOf(char)));
		});
		return result;
	}
}

exports.SharecodeDecoder = SharecodeDecoder;