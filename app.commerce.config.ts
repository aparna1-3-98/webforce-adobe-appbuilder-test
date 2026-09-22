import { defineConfig } from '@adobe/aio-commerce-lib-app/config';

export default defineConfig({
  metadata: {
    id: 'customer-save-logger',
    displayName: 'Customer Save Logger',
    description: 'Processes Adobe Commerce customer_save_commit_after events and logs the processed customer details for verification.',
    version: '1.0.0',
  },
  eventing: {
    commerce: [
      {
        provider: {
          label: 'Commerce Customer Events',
          description: 'Processes customer save events after the transaction is committed.',
        },
        events: [
          {
            name: 'observer.customer_save_commit_after',
            label: 'Customer Save Commit After',
            description: 'Triggered after a customer create or update is committed in Adobe Commerce.',
            fields: [
              { name: 'id' },
              { name: 'email' },
              { name: 'firstname' },
              { name: 'lastname' },
            ],
            runtimeActions: ['customer-processor/process-customer-event'],
          },
        ],
      },
    ],
  },
});
