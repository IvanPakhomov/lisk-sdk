/*
 * Copyright © 2018 Lisk Foundation
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
 */

'use strict';

const fs = require('fs');
const QueriesHelper = require('../common/integration/sql/queriesHelper.js');
const StorageSandbox = require('../common/storage_sandbox').StorageSandbox;

describe('Dependency versions', () => {
	describe('node version', () => {
		it('should be the same as the one inside .nvmrc file', () => {
			const nvmrc = fs.readFileSync('.nvmrc', 'utf8').trim();
			return expect(process.version).to.contain(nvmrc);
		});
	});

	describe('postgresql version', () => {
		let storageSandbox;

		it('should be 10.x', async () => {
			storageSandbox = new StorageSandbox(
				__testContext.config.db,
				'postgresql-version'
			);
			await storageSandbox.bootstrap();
			const Queries = new QueriesHelper(null, storageSandbox);

			Queries.getPostgresVersion().then(data => {
				try {
					return expect(data[0].version).to.contain('PostgreSQL 10.');
				} catch (getPostgresVersionErr) {
					return getPostgresVersionErr;
				}
			});
		});
	});
});
