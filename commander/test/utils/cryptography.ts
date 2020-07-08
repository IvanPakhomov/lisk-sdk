/*
 * LiskHQ/lisk-commander
 * Copyright © 2019 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */
import * as sandbox from 'sinon';
import { expect } from 'chai';
import * as cryptographyModule from '@liskhq/lisk-cryptography';
import * as cryptography from '../../src/utils/cryptography';

describe('crypto utils', () => {
	describe('#encryptMessage', () => {
		const result = {
			result: 'result',
		};

		const recipientAddress = Buffer.from(
			'b56b53b205287d52ae63c688bf62e86ad81e8e1e5dd9aaef2e68711152b7a58a',
			'hex',
		);
		const input = {
			message: 'msg',
			passphrase: 'random-passphrase',
			recipient: recipientAddress.toString('hex'),
		};

		beforeEach(() => {
			sandbox.stub(cryptographyModule, 'encryptMessageWithPassphrase').returns(result as any);
		});

		it('should call encryptMessageWithPassphrase', () => {
			cryptography.encryptMessage(input);
			return expect(cryptographyModule.encryptMessageWithPassphrase).to.be.calledWithExactly(
				input.message,
				input.passphrase,
				recipientAddress,
			);
		});

		it('message should be equal to the result of encryptMessageWithPassphrase', () => {
			const encryptedMessage = cryptography.encryptMessage(input);
			return expect(encryptedMessage).to.equal(result);
		});
	});

	describe('#decryptMessage', () => {
		const result = 'message';
		const senderPublicKey = Buffer.from(
			'b56b53b205287d52ae63c688bf62e86ad81e8e1e5dd9aaef2e68711152b7a58a',
			'hex',
		);
		const input = {
			cipher: 'cipher',
			nonce: 'nonce',
			passphrase: 'random-passphrase',
			senderPublicKey: senderPublicKey.toString('hex'),
		};

		beforeEach(() => {
			sandbox.stub(cryptographyModule, 'decryptMessageWithPassphrase').returns(result);
		});

		it('should call decryptMessageWithPassphrase', () => {
			cryptography.decryptMessage(input);
			return expect(cryptographyModule.decryptMessageWithPassphrase).to.be.calledWithExactly(
				input.cipher,
				input.nonce,
				input.passphrase,
				senderPublicKey,
			);
		});

		it('message should be equal to the result of the decryptMessageWithPassphrase', () => {
			const decryptedMessage = cryptography.decryptMessage(input);
			return expect(decryptedMessage.message).to.equal(result);
		});
	});

	describe('#encryptPassphrase', () => {
		const result = 'encryptedPassphrase';
		const passphraseObject = {
			iterations: 1,
			cipherText: 'cipher',
			iv: 'iv',
			salt: 'salt',
			tag: 'tag',
			version: '1',
		};

		beforeEach(() => {
			sandbox.stub(cryptographyModule, 'encryptPassphraseWithPassword').returns(passphraseObject);
			return sandbox.stub(cryptographyModule, 'stringifyEncryptedPassphrase').returns(result);
		});

		it('encrypted passphrase should equal to the result of stringifyEncryptedPassphrase', () => {
			const input = {
				passphrase: 'random-passphrase',
				password: 'password',
			};
			const encryptedPassphrase = cryptography.encryptPassphrase(input);
			return expect(encryptedPassphrase.encryptedPassphrase).to.equal(result);
		});

		it('should call encryptPassphraseWithPassword', () => {
			const input = {
				passphrase: 'random-passphrase',
				password: 'password',
			};
			cryptography.encryptPassphrase(input);

			return expect(cryptographyModule.encryptPassphraseWithPassword).to.be.calledWithExactly(
				input.passphrase,
				input.password,
			);
		});

		it('should call stringifyEncryptedPassphrase', () => {
			const input = {
				passphrase: 'random-passphrase',
				password: 'password',
			};
			cryptography.encryptPassphrase(input);

			return expect(cryptographyModule.stringifyEncryptedPassphrase).to.be.calledWithExactly(
				passphraseObject,
			);
		});
	});

	describe('#decryptPassphrase', () => {
		const result = 'passphrase';
		const passphraseObject = {
			iterations: 1,
			cipherText: 'cipher',
			iv: 'iv',
			salt: 'salt',
			tag: 'tag',
			version: '1',
		};
		const input = {
			encryptedPassphrase: 'random-passphrase',
			password: 'password',
		};

		beforeEach(() => {
			sandbox.stub(cryptographyModule, 'parseEncryptedPassphrase').returns(passphraseObject);
			return sandbox.stub(cryptographyModule, 'decryptPassphraseWithPassword').returns(result);
		});

		it('passphrase should equal to the result of decryptPassphraseWithPassword', () => {
			const decryptedPassphrase = cryptography.decryptPassphrase(input);
			return expect(decryptedPassphrase.passphrase).to.equal(result);
		});

		it('should call parseEncryptedPassphrase', () => {
			cryptography.decryptPassphrase(input);
			return expect(cryptographyModule.parseEncryptedPassphrase).to.be.calledWithExactly(
				input.encryptedPassphrase,
			);
		});

		it('should call decryptPassphraseWithPassword', () => {
			cryptography.decryptPassphrase(input);
			return expect(cryptographyModule.decryptPassphraseWithPassword).to.be.calledWithExactly(
				passphraseObject,
				input.password,
			);
		});
	});

	describe('#getKeys', () => {
		it('should be a function', () => {
			return expect(cryptography.getKeys).to.be.a('function');
		});
	});

	describe('#getAddressFromPublicKey', () => {
		const result = '90215077294ac1c727b357978df9291b';
		const input = 'publicKey';

		beforeEach(() => {
			return sandbox
				.stub(cryptographyModule, 'getAddressFromPublicKey')
				.returns(Buffer.from(result, 'hex'));
		});

		it('address should equal to the result of getAddressFromPublicKey', () => {
			const addressObject = cryptography.getAddressFromPublicKey(input);
			return expect(addressObject.address).to.equal(result);
		});

		it('should call getAddressFromPublicKey', () => {
			cryptography.getAddressFromPublicKey(input);
			return expect(cryptographyModule.getAddressFromPublicKey).to.be.calledWithExactly(
				Buffer.from(input, 'hex'),
			);
		});
	});

	describe('#signMessage', () => {
		const result = 'signedMessage';
		const input = {
			message: 'message',
			passphrase: 'passphrase',
		};

		beforeEach(() => {
			return sandbox.stub(cryptographyModule, 'signMessageWithPassphrase').returns(result as any);
		});

		it('singed message should equal to the result of signMessageWithPassphrase', () => {
			const signedMessage = cryptography.signMessage(input);
			return expect(signedMessage).to.equal(result);
		});

		it('should call signMessageWithPassphrase', () => {
			cryptography.signMessage(input);
			return expect(cryptographyModule.signMessageWithPassphrase).to.be.calledWithExactly(
				input.message,
				input.passphrase,
			);
		});
	});

	describe('#verifyMessage', () => {
		const result = true;
		const input = {
			publicKey: '90215077294ac1c727b357978df9291b77a8a700e6e42545dc0e6e5ba9582f13',
			signature:
				'90215077294ac1c727b357978df9291b77a8a700e6e42545dc0e6e5ba9582f1390215077294ac1c727b357978df9291b77a8a700e6e42545dc0e6e5ba9582f13',
			message: 'message',
		};

		beforeEach(() => {
			return sandbox.stub(cryptographyModule, 'verifyMessageWithPublicKey').returns(result);
		});

		it('verified should equal to the result of verifyMessageWithPublicKey', () => {
			const verifiedResult = cryptography.verifyMessage(input);
			return expect(verifiedResult.verified).to.equal(result);
		});

		it('should call verifyMessageWithPublicKey', () => {
			cryptography.verifyMessage(input);
			return expect(cryptographyModule.verifyMessageWithPublicKey).to.be.calledWithExactly({
				message: input.message,
				signature: Buffer.from(input.signature, 'hex'),
				publicKey: Buffer.from(input.publicKey, 'hex'),
			});
		});
	});
});
