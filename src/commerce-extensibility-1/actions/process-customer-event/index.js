function normalizeCustomerValue(params) {
  const value = params && params.data && params.data.value ? params.data.value : {};
  return value && typeof value === 'object' ? value : {};
}

function buildValidationErrors(customer) {
  const errors = [];
  if (!customer.email) errors.push('email');
  if (!customer.firstname) errors.push('firstname');
  if (!customer.lastname) errors.push('lastname');
  return errors;
}

function formatCustomerLog(customer) {
  const fullName = `${customer.firstname} ${customer.lastname}`.trim();
  return [
    'Commerce customer event received',
    `Customer ID: ${customer.id ?? ''}`,
    `Full Name: ${fullName}`,
    `Email: ${customer.email}`,
    'Customer Type: new-commerce-customer',
    'Processed: true',
  ];
}

function formatValidationFailureLog(customerId, errors) {
  return [
    'Commerce customer event received',
    `Customer ID: ${customerId ?? ''}`,
    `Validation Failed: ${errors.join(', ')}`,
    'Processed: false',
  ];
}

export async function main(params = {}) {
  try {
    const customer = normalizeCustomerValue(params);
    const errors = buildValidationErrors(customer);
    const customerId = customer.id;

    if (errors.length > 0) {
      const lines = formatValidationFailureLog(customerId, errors);
      for (const line of lines) {
        console.log(line);
      }

      return {
        statusCode: 400,
        body: {
          customerId,
          processed: false,
          errors,
        },
      };
    }

    const fullName = `${customer.firstname} ${customer.lastname}`;
    const lines = formatCustomerLog(customer);
    for (const line of lines) {
      console.log(line);
    }

    return {
      statusCode: 200,
      body: {
        customerId,
        fullName,
        email: customer.email,
        customerType: 'new-commerce-customer',
        processed: true,
      },
    };
  } catch (error) {
    console.error('Customer event processing failed', {
      customerId: params && params.data && params.data.value ? params.data.value.id : undefined,
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      statusCode: 500,
      body: {
        processed: false,
        error: 'Unexpected customer event processing failure',
      },
    };
  }
}
