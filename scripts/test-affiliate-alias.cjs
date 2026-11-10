const assert = require('node:assert/strict');
const test = require('node:test');
const { suggestAlias } = require('./generate-affiliate-alias.cjs');

test('first initial and full surname make a readable checkout code', () => {
  assert.equal(suggestAlias('Zack', 'Leonard'), 'ZLEONARD');
  assert.equal(suggestAlias('Zoë', "O'Neil"), 'ZONEIL');
});

test('matching names receive a stable numeric suffix', () => {
  assert.equal(suggestAlias('Jane', 'Smith', ['JSMITH']), 'JSMITH2');
  assert.equal(suggestAlias('Jane', 'Smith', ['JSMITH', 'JSMITH2']), 'JSMITH3');
});
