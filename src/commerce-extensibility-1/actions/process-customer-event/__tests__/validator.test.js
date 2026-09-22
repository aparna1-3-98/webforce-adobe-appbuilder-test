import assert from 'node:assert/strict';
import test from 'node:test';
import { main } from '../index.js';

test('main handles a missing params.data.value object with validation errors', async () => {
  const logs = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => logs.push(args.join(' '));
  console.error = (...args) => logs.push(args.join(' '));

  try {
    const result = await main({ data: {} });

    assert.equal(result.statusCode, 400);
    assert.deepEqual(result.body, {
      customerId: undefined,
      processed: false,
      errors: ['email', 'firstname', 'lastname'],
    });
    assert.deepEqual(logs, [
      'Commerce customer event received',
      'Customer ID: ',
      'Validation Failed: email, firstname, lastname',
      'Processed: false',
    ]);
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
});
