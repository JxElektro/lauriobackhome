import assert from 'node:assert/strict'
import { test } from 'node:test'

const BFF = 'http://localhost:3000'
const ADK = 'http://localhost:8000'

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  return { ok: res.ok, status: res.status, json: await res.json() }
}

async function getJSON(url) {
  const res = await fetch(url)
  return { ok: res.ok, status: res.status, json: await res.json() }
}

async function patchJSON(url, body) {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  return { ok: res.ok, status: res.status, json: await res.json() }
}

test('ADK responde a /run-flow', async () => {
  const { ok, json } = await postJSON(`${ADK}/run-flow`, { topics: ['prueba flujo'], context: 'audiencia joven' })
  assert.ok(ok)
  assert.equal(json.status, 'success')
  assert.ok(Array.isArray(json.results))
})

test('Orchestrations weekly-content crea items y los persiste', async () => {
  const { ok, json } = await postJSON(`${BFF}/orchestrations/weekly-content`, {
    topics: ['IA y empleo junior', 'soft skills'],
    context: 'audiencia joven'
  })
  assert.ok(ok)
  assert.equal(json.status, 'success')
  assert.ok(json.createdItemsCount >= 1)
  assert.ok(Array.isArray(json.items))
  const first = json.items[0]
  assert.ok(first.id)
  assert.ok(typeof first.structure === 'string')

  const backlog = await getJSON(`${BFF}/backlog`)
  assert.ok(backlog.ok)
  assert.ok(Array.isArray(backlog.json))
  const found = backlog.json.find(i => i.id === first.id)
  assert.ok(found)
})

test('PATCH /backlog/:id actualiza estado', async () => {
  const before = await getJSON(`${BFF}/backlog`)
  assert.ok(before.ok)
  assert.ok(Array.isArray(before.json))
  assert.ok(before.json.length >= 1)
  const id = before.json[0].id

  const updated = await patchJSON(`${BFF}/backlog/${id}`, { status: 'approved' })
  assert.ok(updated.ok)
  assert.equal(updated.json.status, 'approved')

  const after = await getJSON(`${BFF}/backlog/${id}`)
  assert.ok(after.ok)
  assert.equal(after.json.status, 'approved')
}
)
