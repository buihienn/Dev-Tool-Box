import { resolveApiUrl } from './config/api';

test('builds a backend URL from a relative API path', () => {
  expect(resolveApiUrl('/api/categories/all', '/'))
    .toBe('/api/categories/all');
});

test('does not modify an absolute URL', () => {
  expect(resolveApiUrl('https://example.com/status', ''))
    .toBe('https://example.com/status');
});
