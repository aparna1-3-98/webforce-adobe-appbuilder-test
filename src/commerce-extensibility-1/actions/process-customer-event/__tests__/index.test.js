import assert from 'node:assert/strict';
import test from 'node:test';
import { main } from '../index.js';

test('main logs the processed customer details and returns the derived payload', async () => {
  const logs = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => logs.push(args.join(' '));
  console.error = (...args) => logs.push(args.join(' '));

  try {
    const result = await main({
      data: {
        value: {
          id: 100245,
          email: 'john.doe@example.com',
          firstname: 'John',
          lastname: 'Doe',
        },
      },
    });

    assert.equal(result.statusCode, 200);
    assert.deepEqual(result.body, {
      customerId: 100245,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      customerType: 'new-commerce-customer',
      processed: true,
    });
    assert.deepEqual(logs, [
      'Commerce customer event received',
      'Customer ID: 100245',
      'Full Name: John Doe',
      'Email: john.doe@example.com',
      'Customer Type: new-commerce-customer',
      'Processed: true',
    ]);
    assert.equal(logs.some((line) => line.includes('firstname')), false);
    assert.equal(logs.some((line) => line.includes('lastname')), false);
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
});

test('main returns a validation failure when required fields are missing', async () => {
  const logs = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => logs.push(args.join(' '));
  console.error = (...args) => logs.push(args.join(' '));

  try {
    const result = await main({
      data: {
        value: {
          id: 100246,
          email: '',
          firstname: 'Jane',
          lastname: '',
        },
      },
    });

    assert.equal(result.statusCode, 400);
    assert.deepEqual(result.body, {
      customerId: 100246,
      processed: false,
      errors: ['email', 'lastname'],
    });
    assert.deepEqual(logs, [
      'Commerce customer event received',
      'Customer ID: 100246',
      'Validation Failed: email, lastname',
      'Processed: false',
    ]);
    assert.equal(logs.some((line) => line.includes('john.doe@example.com')), false);
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
});
