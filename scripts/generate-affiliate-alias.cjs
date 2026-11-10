// Owner onboarding helper. The alias is for Jonezie checkout; RefRef keeps its
// generated code and the two values are paired in affiliate-codes.json.
function cleanName(value) {
  return String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function suggestAlias(firstName, lastName, usedCodes = []) {
  const initial = cleanName(firstName).slice(0, 1);
  const surname = cleanName(lastName);
  if (!initial || !surname) throw new Error('First name and full last name are required');
  const base = initial + surname;
  if (base.length > 32) throw new Error('Name exceeds the 32-character checkout code limit');
  const used = new Set(usedCodes.map((code) => String(code).toUpperCase()));
  if (!used.has(base)) return base;
  for (let number = 2; number < 1000; number++) {
    const candidate = base + number;
    if (candidate.length <= 32 && !used.has(candidate)) return candidate;
  }
  throw new Error('No available alias for this name');
}

module.exports = { suggestAlias };

if (require.main === module) {
  const [firstName, lastName] = process.argv.slice(2);
  const entries = require('../affiliate-codes.json').activeCodes || [];
  const used = entries.map((entry) => typeof entry === 'string' ? entry : entry.code);
  process.stdout.write(suggestAlias(firstName, lastName, used) + '\n');
}
