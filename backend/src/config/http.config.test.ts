import { deepStrictEqual, strictEqual } from 'assert';
import { getHttpConfig, parseCorsOrigins, parsePort } from './http.config';

deepStrictEqual(getHttpConfig({}), {
  port: 3000,
  corsOrigins: [
    'http://localhost:8081',
    'http://localhost:8080',
    'http://localhost:3000',
    'http://127.0.0.1:8081',
    'http://127.0.0.1:8080',
  ],
});

deepStrictEqual(parseCorsOrigins('https://app.example.com, https://admin.example.com'), [
  'https://app.example.com',
  'https://admin.example.com',
]);

strictEqual(parseCorsOrigins('*'), true);
strictEqual(parsePort('not-a-port'), 3000);
strictEqual(parsePort('70000'), 3000);
