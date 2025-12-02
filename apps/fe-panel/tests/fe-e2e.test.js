import assert from 'node:assert/strict'
import { test } from 'node:test'

const FE = 'http://localhost:3001'

async function getText(url) {
  const res = await fetch(url)
  return { ok: res.ok, status: res.status, text: await res.text() }
}

test('Home renderiza Laurio Content Backlog', async () => {
  const { ok, text } = await getText(`${FE}/`)
  assert.ok(ok)
  assert.ok(text.includes('Laurio Content Backlog'))
})

test('Backlog lista carga HTML base', async () => {
  const { ok, text } = await getText(`${FE}/backlog`)
  assert.ok(ok)
  assert.ok(text.length > 0)
})
