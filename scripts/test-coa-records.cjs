const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const context = { window: {}, Intl, Date };
vm.createContext(context);
for (const file of ['coa-data.js', 'coa-panel.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context);
const api = context.window.JONEZIE_BATCH_COA;

test('owner-confirmed shared lot resolves both GHK-Cu strengths to the original tested sample', () => {
  const fifty = api.recordsFor('ghk-cu', '50mg')[0];
  const hundred = api.recordsFor('ghk-cu', '100 MG')[0];
  assert.equal(fifty, hundred);
  assert.equal(hundred.sampleStrength, '50mg');
  assert.equal(hundred.contentMg, '49.63');
  assert.equal(hundred.purityPercent, '99.99');
  assert.equal(hundred.lot, 'JLGHK3552');
  assert.equal(hundred.reportUrl, 'https://kmdanalytical.com/coa/JL-20261116-EB3D-01');
});

test('a GHK-Cu result cannot be substituted for another compound, blend, or unconfirmed strength', () => {
  for (const [slug, strength] of [['semaglutide', '50mg'], ['bpc-157-10mg-plus-ghk-cu-50mg-plus-tb500-10mg', '70mg'], ['ghk-cu', '150mg'], ['ghk-cu', '5mg'], ['ghk-cu', '']]) {
    assert.equal(api.recordsFor(slug, strength).length, 0);
  }
});
