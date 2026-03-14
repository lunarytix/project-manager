const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

// Use an in-memory DB for tests
process.env.DB_PATH = ':memory:';

const app = require('../src/app');

let server;
let baseUrl;

before(() => {
  server = http.createServer(app);
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(() => new Promise((resolve) => server.close(resolve)));

async function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(baseUrl + path);
    const opts = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    const r = http.request(opts, (res) => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        let json = null;
        try { json = raw ? JSON.parse(raw) : null; } catch {}
        resolve({ status: res.statusCode, body: json });
      });
    });
    r.on('error', reject);
    if (body !== undefined) r.write(JSON.stringify(body));
    r.end();
  });
}

describe('Projects API', () => {
  let createdId;

  test('GET /api/projects returns empty array initially', async () => {
    const { status, body } = await req('GET', '/api/projects');
    assert.equal(status, 200);
    assert.ok(Array.isArray(body));
  });

  test('POST /api/projects creates a project', async () => {
    const { status, body } = await req('POST', '/api/projects', {
      name: 'Test Project',
      description: 'A test project',
      status: 'pending',
      priority: 'high',
    });
    assert.equal(status, 201);
    assert.equal(body.name, 'Test Project');
    assert.equal(body.status, 'pending');
    assert.equal(body.priority, 'high');
    assert.ok(body.id);
    createdId = body.id;
  });

  test('POST /api/projects returns 400 when name is missing', async () => {
    const { status, body } = await req('POST', '/api/projects', { description: 'No name' });
    assert.equal(status, 400);
    assert.ok(body.error);
  });

  test('POST /api/projects returns 400 for invalid status', async () => {
    const { status, body } = await req('POST', '/api/projects', { name: 'X', status: 'unknown' });
    assert.equal(status, 400);
    assert.ok(body.error);
  });

  test('GET /api/projects/:id returns the project', async () => {
    const { status, body } = await req('GET', `/api/projects/${createdId}`);
    assert.equal(status, 200);
    assert.equal(body.id, createdId);
  });

  test('GET /api/projects/:id returns 404 for missing project', async () => {
    const { status } = await req('GET', '/api/projects/99999');
    assert.equal(status, 404);
  });

  test('PUT /api/projects/:id updates the project', async () => {
    const { status, body } = await req('PUT', `/api/projects/${createdId}`, {
      name: 'Updated Project',
      status: 'in-progress',
    });
    assert.equal(status, 200);
    assert.equal(body.name, 'Updated Project');
    assert.equal(body.status, 'in-progress');
  });

  test('PUT /api/projects/:id returns 404 for missing project', async () => {
    const { status } = await req('PUT', '/api/projects/99999', { name: 'X' });
    assert.equal(status, 404);
  });

  test('GET /api/projects supports search filter', async () => {
    await req('POST', '/api/projects', { name: 'Alpha project' });
    await req('POST', '/api/projects', { name: 'Beta work' });

    const { body } = await req('GET', '/api/projects?search=Alpha');
    assert.ok(body.some(p => p.name === 'Alpha project'));
    assert.ok(!body.some(p => p.name === 'Beta work'));
  });

  test('GET /api/projects supports status filter', async () => {
    await req('POST', '/api/projects', { name: 'Done project', status: 'completed' });
    const { body } = await req('GET', '/api/projects?status=completed');
    assert.ok(body.every(p => p.status === 'completed'));
  });

  test('DELETE /api/projects/:id removes the project', async () => {
    const { status } = await req('DELETE', `/api/projects/${createdId}`);
    assert.equal(status, 204);
    const { status: getStatus } = await req('GET', `/api/projects/${createdId}`);
    assert.equal(getStatus, 404);
  });

  test('DELETE /api/projects/:id returns 404 for missing project', async () => {
    const { status } = await req('DELETE', '/api/projects/99999');
    assert.equal(status, 404);
  });
});
