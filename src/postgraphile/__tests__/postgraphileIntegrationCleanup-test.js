jest.unmock('postgraphile-core');

import pgPool, { poolConfig } from '../../__tests__/utils/pgPool';
import { postgraphile } from '..';

test('When the handler is created using a Pool object, it can be released without triggering an error', async () => {
  let handler = postgraphile(pgPool);
  await handler.release();
});

test('When the handler is created using Pool config, it releases the pool it creates', async () => {
  let handler = postgraphile(poolConfig);
  await handler.release();
});
