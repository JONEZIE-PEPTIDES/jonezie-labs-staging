const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

test('checkout accepts only aliases paired with a RefRef code', async () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'checkout.js'), 'utf8');
  const start = source.indexOf('async function loadActivePartnerCodes()');
  const end = source.indexOf('if (!AD_SALE_MODE) loadActivePartnerCodes();', start);
  assert.ok(start >= 0 && end > start);
  const activePartnerCodes = new Set();
  const partnerRefCodes = new Map();
  let renders = 0;
  const context = {
    activePartnerCodes, partnerRefCodes,
    fetch: async () => ({ ok: true, json: async () => ({ activeCodes: [
      { code: 'zleonard', refCode: 'u9vj3ea82z' },
      { code: 'BROKEN' },
      'LEGACY'
    ] }) }),
    renderCart: () => { renders += 1; },
    console
  };
  await vm.runInNewContext(source.slice(start, end) + '\nloadActivePartnerCodes()', context);
  assert.deepEqual([...activePartnerCodes], ['ZLEONARD']);
  assert.equal(partnerRefCodes.get('ZLEONARD'), 'u9vj3ea82z');
  assert.equal(renders, 1);
});
