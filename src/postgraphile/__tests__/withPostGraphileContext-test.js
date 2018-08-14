// tslint:disable no-empty

import { $$pgClient } from '../../postgres/inventory/pgClientFromContext';
import withPostGraphileContext from '../withPostGraphileContext';

const jwt = require('jsonwebtoken');

/**
 * Expects an Http error. Passes if there is an error of the correct form,
 * fails if there is not.
 */
function expectHttpError(promise, statusCode, message) {
  return promise.then(
    () => {
      throw new Error('Expected a Http error.');
    },
    error => {
      expect(error.statusCode).toBe(statusCode);
      expect(error.message).toBe(message);
    },
  );
}

test('will be a noop for no token, secret, or default role', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await withPostGraphileContext({ pgPool }, () => {});
  expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']]);
});

test('will pass in a context object with the client', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await withPostGraphileContext({ pgPool }, client => {
    expect(client[$$pgClient]).toBe(pgClient);
  });
});

test('will record queries run inside the transaction', async () => {
  const query1 = Symbol();
  const query2 = Symbol();
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await withPostGraphileContext({ pgPool }, client => {
    client[$$pgClient].query(query1);
    client[$$pgClient].query(query2);
  });
  expect(pgClient.query.mock.calls).toEqual([['begin'], [query1], [query2], ['commit']]);
});

test('will return the value from the callback', async () => {
  const value = Symbol();
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  expect(await withPostGraphileContext({ pgPool }, () => value)).toBe(value);
});

test('will return the asynchronous value from the callback', async () => {
  const value = Symbol();
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  expect(await withPostGraphileContext({ pgPool }, () => Promise.resolve(value))).toBe(value);
});

test('will throw an error if there was a `jwtToken`, but no `jwtSecret`', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await expectHttpError(
    withPostGraphileContext({ pgPool, jwtToken: 'asd' }, () => {}),
    403,
    'Not allowed to provide a JWT token.',
  );
  // Never set up the transaction due to error
  expect(pgClient.query.mock.calls).toEqual([]);
});

test('will throw an error for a malformed `jwtToken`', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await expectHttpError(
    withPostGraphileContext({ pgPool, jwtToken: 'asd', jwtSecret: 'secret' }, () => {}),
    403,
    'jwt malformed',
  );
  // Never set up the transaction due to error
  expect(pgClient.query.mock.calls).toEqual([]);
});

test('will throw an error if the JWT token was signed with the wrong signature', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await expectHttpError(
    withPostGraphileContext(
      {
        pgPool,
        jwtToken: jwt.sign({ a: 1, b: 2, c: 3 }, 'wrong secret', {
          noTimestamp: true,
        }),
        jwtSecret: 'secret',
      },
      () => {},
    ),
    403,
    'invalid signature',
  );
  // Never set up the transaction due to error
  expect(pgClient.query.mock.calls).toEqual([]);
});

test('will throw an error if the JWT token does not have an audience', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await expectHttpError(
    withPostGraphileContext(
      {
        pgPool,
        jwtToken: jwt.sign({ a: 1, b: 2, c: 3 }, 'secret', {
          noTimestamp: true,
        }),
        jwtSecret: 'secret',
      },
      () => {},
    ),
    403,
    'jwt audience invalid. expected: postgraphile',
  );
  // Never set up the transaction due to error
  expect(pgClient.query.mock.calls).toEqual([]);
});

test('will throw an error if the JWT token does not have an appropriate audience', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await expectHttpError(
    withPostGraphileContext(
      {
        pgPool,
        jwtToken: jwt.sign({ a: 1, b: 2, c: 3, aud: 'postgrest' }, 'secret', {
          noTimestamp: true,
        }),
        jwtSecret: 'secret',
      },
      () => {},
    ),
    403,
    'jwt audience invalid. expected: postgraphile',
  );
  // Never set up the transaction due to error
  expect(pgClient.query.mock.calls).toEqual([]);
});

test('will succeed with all the correct things', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await withPostGraphileContext(
    {
      pgPool,
      jwtToken: jwt.sign({ aud: 'postgraphile' }, 'secret', {
        noTimestamp: true,
      }),
      jwtSecret: 'secret',
    },
    () => {},
  );
  expect(pgClient.query.mock.calls).toEqual([
    ['begin'],
    [
      {
        text: 'select set_config($1, $2, true)',
        values: ['jwt.claims.aud', 'postgraphile'],
      },
    ],
    ['commit'],
  ]);
});

test('will add extra claims as available', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await withPostGraphileContext(
    {
      pgPool,
      jwtToken: jwt.sign({ aud: 'postgraphile', a: 1, b: 2, c: 3 }, 'secret', {
        noTimestamp: true,
      }),
      jwtSecret: 'secret',
    },
    () => {},
  );
  expect(pgClient.query.mock.calls).toEqual([
    ['begin'],
    [
      {
        text:
          'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true)',
        values: [
          'jwt.claims.aud',
          'postgraphile',
          'jwt.claims.a',
          '1',
          'jwt.claims.b',
          '2',
          'jwt.claims.c',
          '3',
        ],
      },
    ],
    ['commit'],
  ]);
});

test('will include JWT claims as jwtClaims in context callback', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  const { jwtClaims } = await withPostGraphileContext(
    {
      pgPool,
      jwtToken: jwt.sign({ aud: 'postgraphile', a: 1, b: 2, c: 3 }, 'secret', {
        noTimestamp: true,
      }),
      jwtSecret: 'secret',
    },
    context => context,
  );
  expect(jwtClaims).toEqual({ aud: 'postgraphile', a: 1, b: 2, c: 3 })
})

test('jwtClaims should be an empty object if there is no JWT token', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  const { jwtClaims } = await withPostGraphileContext(
    {
      pgPool,
    },
    context => context,
  );
  expect(jwtClaims).toEqual({})
})

test('will add extra settings as available', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await withPostGraphileContext(
    {
      pgPool,
      jwtToken: jwt.sign({ aud: 'postgraphile' }, 'secret', {
        noTimestamp: true,
      }),
      jwtSecret: 'secret',
      pgSettings: {
        'foo.bar': 'test1',
        'some.other.var': 'hello world',
      },
    },
    () => {},
  );
  expect(pgClient.query.mock.calls).toEqual([
    ['begin'],
    [
      {
        text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true)',
        values: [
          'foo.bar',
          'test1',
          'some.other.var',
          'hello world',
          'jwt.claims.aud',
          'postgraphile',
        ],
      },
    ],
    ['commit'],
  ]);
});

test('undefined and null extra settings are ignored while 0 is converted to a string', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await withPostGraphileContext(
    {
      pgPool,
      jwtToken: jwt.sign({ aud: 'postgraphile', true: true, false: false }, 'secret', {
        noTimestamp: true,
      }),
      jwtSecret: 'secret',
      pgSettings: {
        'foo.bar': 'test1',
        'some.other.var': null,
        'some.setting.not.defined': undefined,
        'some.setting.zero': 0,
        'number.setting': 42,
        'boolean.true': true,
        'boolean.false': false,
      },
    },
    () => {},
  );
  expect(pgClient.query.mock.calls).toEqual([
    ['begin'],
    [
      {
        text:
          'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true), set_config($11, $12, true), set_config($13, $14, true), set_config($15, $16, true)',
        values: [
          'foo.bar',
          'test1',
          'some.setting.zero',
          '0',
          'number.setting',
          '42',
          'boolean.true',
          'true',
          'boolean.false',
          'false',
          'jwt.claims.aud',
          'postgraphile',
          'jwt.claims.true',
          'true',
          'jwt.claims.false',
          'false',
        ],
      },
    ],
    ['commit'],
  ]);
});

test('extra pgSettings that are objects throw an error', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  let message;
  try {
    await withPostGraphileContext(
      {
        pgPool,
        jwtToken: jwt.sign({ aud: 'postgraphile' }, 'secret', {
          noTimestamp: true,
        }),
        jwtSecret: 'secret',
        pgSettings: {
          'some.object': { toString: () => 'SomeObject' },
        },
      },
      () => {},
    );
  } catch (error) {
    message = error.message;
  }
  expect(message).toBe(
    'Error converting pgSetting: object needs to be of type string, number or boolean.',
  );
});

test('extra pgSettings that are symbols throw an error', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  let message;
  try {
    await withPostGraphileContext(
      {
        pgPool,
        jwtToken: jwt.sign({ aud: 'postgraphile' }, 'secret', {
          noTimestamp: true,
        }),
        jwtSecret: 'secret',
        pgSettings: {
          'some.symbol': Symbol('some.symbol'),
        },
      },
      () => {},
    );
  } catch (error) {
    message = error.message;
  }
  expect(message).toBe(
    'Error converting pgSetting: symbol needs to be of type string, number or boolean.',
  );
});

test('will set the default role if available', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await withPostGraphileContext(
    {
      pgPool,
      jwtSecret: 'secret',
      pgDefaultRole: 'test_default_role',
    },
    () => {},
  );
  expect(pgClient.query.mock.calls).toEqual([
    ['begin'],
    [
      {
        text: 'select set_config($1, $2, true)',
        values: ['role', 'test_default_role'],
      },
    ],
    ['commit'],
  ]);
});

test('will set the default role if no other role was provided in the JWT', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await withPostGraphileContext(
    {
      pgPool,
      jwtToken: jwt.sign({ aud: 'postgraphile', a: 1, b: 2, c: 3 }, 'secret', {
        noTimestamp: true,
      }),
      jwtSecret: 'secret',
      pgDefaultRole: 'test_default_role',
    },
    () => {},
  );
  expect(pgClient.query.mock.calls).toEqual([
    ['begin'],
    [
      {
        text:
          'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true)',
        values: [
          'role',
          'test_default_role',
          'jwt.claims.aud',
          'postgraphile',
          'jwt.claims.a',
          '1',
          'jwt.claims.b',
          '2',
          'jwt.claims.c',
          '3',
        ],
      },
    ],
    ['commit'],
  ]);
});

test('will set a role provided in the JWT', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await withPostGraphileContext(
    {
      pgPool,
      jwtToken: jwt.sign(
        { aud: 'postgraphile', a: 1, b: 2, c: 3, role: 'test_jwt_role' },
        'secret',
        {
          noTimestamp: true,
        },
      ),
      jwtSecret: 'secret',
    },
    () => {},
  );
  expect(pgClient.query.mock.calls).toEqual([
    ['begin'],
    [
      {
        text:
          'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true), set_config($11, $12, true)',
        values: [
          'role',
          'test_jwt_role',
          'jwt.claims.aud',
          'postgraphile',
          'jwt.claims.a',
          '1',
          'jwt.claims.b',
          '2',
          'jwt.claims.c',
          '3',
          'jwt.claims.role',
          'test_jwt_role',
        ],
      },
    ],
    ['commit'],
  ]);
});

test('will set a role provided in the JWT superceding the default role', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await withPostGraphileContext(
    {
      pgPool,
      jwtToken: jwt.sign(
        { aud: 'postgraphile', a: 1, b: 2, c: 3, role: 'test_jwt_role' },
        'secret',
        {
          noTimestamp: true,
        },
      ),
      jwtSecret: 'secret',
      pgDefaultRole: 'test_default_role',
    },
    () => {},
  );
  expect(pgClient.query.mock.calls).toEqual([
    ['begin'],
    [
      {
        text:
          'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true), set_config($11, $12, true)',
        values: [
          'role',
          'test_jwt_role',
          'jwt.claims.aud',
          'postgraphile',
          'jwt.claims.a',
          '1',
          'jwt.claims.b',
          '2',
          'jwt.claims.c',
          '3',
          'jwt.claims.role',
          'test_jwt_role',
        ],
      },
    ],
    ['commit'],
  ]);
});

test('will set a role provided in the JWT', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await withPostGraphileContext(
    {
      pgPool,
      jwtToken: jwt.sign(
        {
          aud: 'postgraphile',
          a: 1,
          b: 2,
          c: 3,
          some: { other: { path: 'test_deep_role' } },
        },
        'secret',
        { noTimestamp: true },
      ),
      jwtSecret: 'secret',
      jwtRole: ['some', 'other', 'path'],
    },
    () => {},
  );
  expect(pgClient.query.mock.calls).toEqual([
    ['begin'],
    [
      {
        text:
          'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true), set_config($11, $12, true)',
        values: [
          'role',
          'test_deep_role',
          'jwt.claims.aud',
          'postgraphile',
          'jwt.claims.a',
          '1',
          'jwt.claims.b',
          '2',
          'jwt.claims.c',
          '3',
          'jwt.claims.some',
          JSON.stringify({ other: { path: 'test_deep_role' } }),
        ],
      },
    ],
    ['commit'],
  ]);
});

test('will set a role provided in the JWT superceding the default role', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() };
  const pgPool = { connect: jest.fn(() => pgClient) };
  await withPostGraphileContext(
    {
      pgPool,
      jwtToken: jwt.sign(
        {
          aud: 'postgraphile',
          a: 1,
          b: 2,
          c: 3,
          some: { other: { path: 'test_deep_role' } },
        },
        'secret',
        { noTimestamp: true },
      ),
      jwtSecret: 'secret',
      jwtRole: ['some', 'other', 'path'],
      pgDefaultRole: 'test_default_role',
    },
    () => {},
  );
  expect(pgClient.query.mock.calls).toEqual([
    ['begin'],
    [
      {
        text:
          'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true), set_config($11, $12, true)',
        values: [
          'role',
          'test_deep_role',
          'jwt.claims.aud',
          'postgraphile',
          'jwt.claims.a',
          '1',
          'jwt.claims.b',
          '2',
          'jwt.claims.c',
          '3',
          'jwt.claims.some',
          JSON.stringify({ other: { path: 'test_deep_role' } }),
        ],
      },
    ],
    ['commit'],
  ]);
});

describe('jwtVerifyOptions', () => {
  let pgClient;
  let pgPool;
  beforeEach(() => {
    pgClient = { query: jest.fn(), release: jest.fn() };
    pgPool = { connect: jest.fn(() => pgClient) };
  });

  test('will throw an error if jwtAudiences and jwtVerifyOptions.audience are both provided', async () => {
    await expectHttpError(
      withPostGraphileContext(
        {
          pgPool,
          jwtAudiences: ['some-other-audience'],
          jwtToken: jwt.sign({ aud: 'postgrest' }, 'secret'),
          jwtSecret: 'secret',
          jwtVerifyOptions: { audience: 'another-audience' },
        },
        () => {},
      ),
      403,
      "Provide either 'jwtAudiences' or 'jwtVerifyOptions.audience' but not both",
    );
    // Never set up the transaction due to error
    expect(pgClient.query.mock.calls).toEqual([]);
  });

  test('will throw an error if jwtAudiences is provided and jwtVerifyOptions.audience = undefined', async () => {
    await expectHttpError(
      withPostGraphileContext(
        {
          pgPool,
          jwtAudiences: ['some-other-audience'],
          jwtToken: jwt.sign({ aud: 'postgrest' }, 'secret'),
          jwtSecret: 'secret',
          jwtVerifyOptions: { audience: undefined },
        },
        () => {},
      ),
      403,
      "Provide either 'jwtAudiences' or 'jwtVerifyOptions.audience' but not both",
    );
    // Never set up the transaction due to error
    expect(pgClient.query.mock.calls).toEqual([]);
  });

  test('will succeed with both jwtAudiences and jwtVerifyOptions if jwtVerifyOptions does not have an audience field', async () => {
    await withPostGraphileContext(
      {
        pgPool,
        jwtAudiences: ['my-audience'],
        jwtToken: jwt.sign({ aud: 'my-audience' }, 'secret', {
          noTimestamp: true,
          subject: 'my-subject',
        }),
        jwtSecret: 'secret',
        jwtVerifyOptions: { subject: 'my-subject' },
      },
      () => {},
    );
    expect(pgClient.query.mock.calls).toEqual([
      ['begin'],
      [
        {
          text: 'select set_config($1, $2, true), set_config($3, $4, true)',
          values: ['jwt.claims.aud', 'my-audience', 'jwt.claims.sub', 'my-subject'],
        },
      ],
      ['commit'],
    ]);
  });

  test('will succeed with audience check disabled via null', async () => {
    await withPostGraphileContext(
      {
        pgPool,
        jwtToken: jwt.sign({ aud: 'my-audience' }, 'secret', {
          noTimestamp: true,
          subject: 'my-subject',
        }),
        jwtSecret: 'secret',
        jwtVerifyOptions: { subject: 'my-subject', audience: null },
      },
      () => {},
    );
    expect(pgClient.query.mock.calls).toEqual([
      ['begin'],
      [
        {
          text: 'select set_config($1, $2, true), set_config($3, $4, true)',
          values: ['jwt.claims.aud', 'my-audience', 'jwt.claims.sub', 'my-subject'],
        },
      ],
      ['commit'],
    ]);
  });

  test('will succeed with audience check disabled via empty array', async () => {
    await withPostGraphileContext(
      {
        pgPool,
        jwtToken: jwt.sign({ aud: 'my-audience' }, 'secret', {
          noTimestamp: true,
          subject: 'my-subject',
        }),
        jwtSecret: 'secret',
        jwtVerifyOptions: { subject: 'my-subject', audience: [] },
      },
      () => {},
    );
    expect(pgClient.query.mock.calls).toEqual([
      ['begin'],
      [
        {
          text: 'select set_config($1, $2, true), set_config($3, $4, true)',
          values: ['jwt.claims.aud', 'my-audience', 'jwt.claims.sub', 'my-subject'],
        },
      ],
      ['commit'],
    ]);
  });

  test('will succeed with audience check disabled via empty string', async () => {
    await withPostGraphileContext(
      {
        pgPool,
        jwtToken: jwt.sign({ aud: 'my-audience' }, 'secret', {
          noTimestamp: true,
          subject: 'my-subject',
        }),
        jwtSecret: 'secret',
        jwtVerifyOptions: { subject: 'my-subject', audience: '' },
      },
      () => {},
    );
    expect(pgClient.query.mock.calls).toEqual([
      ['begin'],
      [
        {
          text: 'select set_config($1, $2, true), set_config($3, $4, true)',
          values: ['jwt.claims.aud', 'my-audience', 'jwt.claims.sub', 'my-subject'],
        },
      ],
      ['commit'],
    ]);
  });

  test('will throw error if audience does not match', async () => {
    await expectHttpError(
      withPostGraphileContext(
        {
          pgPool,
          jwtAudiences: ['my-audience'],
          jwtToken: jwt.sign({ aud: 'incorrect-audience' }, 'secret', {
            noTimestamp: true,
            subject: 'my-subject',
          }),
          jwtSecret: 'secret',
          jwtVerifyOptions: { subject: 'my-subject' },
        },
        () => {},
      ),
      403,
      'jwt audience invalid. expected: my-audience',
    );
    // Never set up the transaction due to error
    expect(pgClient.query.mock.calls).toEqual([]);
  });

  test('will throw an error if the JWT token does not have an appropriate audience', async () => {
    await expectHttpError(
      withPostGraphileContext(
        {
          pgPool,
          jwtToken: jwt.sign({ aud: 'postgrest' }, 'secret'),
          jwtSecret: 'secret',
          jwtVerifyOptions: { audience: 'another-audience' },
        },
        () => {},
      ),
      403,
      'jwt audience invalid. expected: another-audience',
    );
    // Never set up the transaction due to error
    expect(pgClient.query.mock.calls).toEqual([]);
  });

  test('will throw an error from a mismatched subject', async () => {
    await expectHttpError(
      withPostGraphileContext(
        {
          pgPool,
          jwtAudiences: ['my-audience'],
          jwtSecret: 'secret',
          jwtToken: jwt.sign({ aud: 'my-audience', sub: 'gorilla' }, 'secret'),
          jwtVerifyOptions: { subject: 'orangutan' },
        },
        () => {},
      ),
      403,
      'jwt subject invalid. expected: orangutan',
    );
    // Never set up the transaction due to error
    expect(pgClient.query.mock.calls).toEqual([]);
  });

  test('will throw an error from an issuer array that does not match iss', async () => {
    await expectHttpError(
      withPostGraphileContext(
        {
          pgPool,
          jwtSecret: 'secret',
          jwtToken: jwt.sign({ aud: 'postgraphile', iss: 'alpha:nasa' }, 'secret'),
          jwtVerifyOptions: { issuer: ['alpha:aliens', 'alpha:ufo'] },
        },
        () => {},
      ),
      403,
      'jwt issuer invalid. expected: alpha:aliens,alpha:ufo',
    );
    // Never set up the transaction due to error
    expect(pgClient.query.mock.calls).toEqual([]);
  });

  test("will default to an audience of ['postgraphile'] if no audience params are provided", async () => {
    await expectHttpError(
      withPostGraphileContext(
        {
          pgPool,
          jwtSecret: 'secret',
          jwtToken: jwt.sign({ aud: 'something' }, 'secret'),
        },
        () => {},
      ),
      403,
      'jwt audience invalid. expected: postgraphile',
    );
    // No need for transaction since there's no settings
    expect(pgClient.query.mock.calls).toEqual([]);
  });
});
