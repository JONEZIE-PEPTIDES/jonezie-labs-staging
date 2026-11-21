window.JONEZIE_BATCH_COA = (() => {
  const records = window.JONEZIE_COA_RECORDS || [];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const normalizeStrength = value => String(value || '').toLowerCase().replace(/\s+/g, '');
  const recordsFor = (slug, strength) => records.filter(record => record.slug === slug && record.coveredStrengths.some(value => normalizeStrength(value) === normalizeStrength(strength)));
  const date = value => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value + 'T12:00:00Z'));

  function create({ product, button, onStrengthChange }) {
    if (!records.some(record => record.slug === product.slug)) return null;
    const anchor = document.querySelector('[data-product-highlights]');
    if (!anchor) return null;
    const panel = document.createElement('section');
    panel.id = 'batch-records';
    panel.className = 'section-shell batch-coa';
    panel.setAttribute('aria-label', 'Batch certificates of analysis');
    panel.setAttribute('tabindex', '-1');
    panel.innerHTML = `
      <div class="batch-coa-heading"><div><p class="batch-coa-eyebrow">Jonezie batch records</p><h2>Your batch.<br /><em>The full picture.</em></h2></div><label class="batch-coa-picker">Selected strength<select aria-label="COA strength">${product.options.map(option => `<option value="${escape(option.code)}">${escape(option.mgOption)}</option>`).join('')}</select></label></div>
      <div class="batch-coa-record">
        <div class="batch-coa-record-heading"><div><span>Certificate of analysis</span><h3 data-coa-title></h3></div><span class="batch-coa-status" data-coa-status></span></div>
        <div data-coa-available>
          <div class="batch-coa-lot"><span data-coa-lot></span><span data-coa-coverage></span></div>
          <div class="batch-coa-tabs" role="tablist" aria-label="Certificate details">
            <button type="button" role="tab" id="batch-summary-tab" aria-selected="true" aria-controls="batch-summary" tabindex="0">At a glance</button>
            <button type="button" role="tab" id="batch-original-tab" aria-selected="false" aria-controls="batch-original" tabindex="-1">Original report</button>
            <button type="button" role="tab" id="batch-history-tab" aria-selected="false" aria-controls="batch-history" tabindex="-1">Batch records</button>
          </div>
          <div role="tabpanel" id="batch-summary" aria-labelledby="batch-summary-tab">
            <div class="batch-coa-summary"><div class="batch-coa-purity"><span>Chromatographic purity</span><strong data-coa-purity></strong><span data-coa-purity-scope></span></div><dl class="batch-coa-metadata" data-coa-metadata></dl></div>
            <div class="batch-coa-document"><div><strong>Original laboratory document</strong><span data-coa-certificate></span></div><a data-coa-report-link target="_blank" rel="noopener noreferrer">View original COA <span aria-hidden="true">↗</span></a></div>
            <details class="batch-coa-assays"><summary>What the laboratory tested <span aria-hidden="true">+</span></summary><div class="batch-coa-results" data-coa-results></div><p>Purity is the percentage of integrated chromatographic peak area. It is a separate measurement from the reported milligrams per vial. This certificate does not report sterility or endotoxin results.</p></details>
            <p class="batch-coa-sample-note" data-coa-sample-note></p>
          </div>
          <div role="tabpanel" id="batch-original" aria-labelledby="batch-original-tab" hidden>
            <div class="batch-coa-original"><span class="batch-coa-paper-icon" aria-hidden="true">↗</span><p class="batch-coa-eyebrow">KMD Analytical</p><h3>The complete laboratory report.</h3><p>Read the full certificate, chromatogram, sample photograph, results, and laboratory notes on the issuing laboratory’s website.</p><span data-coa-original-id></span><a data-coa-report-link target="_blank" rel="noopener noreferrer">Open the original report <span aria-hidden="true">↗</span></a><p class="batch-coa-original-note">Opens KMD Analytical in a new tab.</p></div>
          </div>
          <div role="tabpanel" id="batch-history" aria-labelledby="batch-history-tab" hidden><p class="batch-coa-records-intro">Published certificates for this lot and selected strength.</p><div data-coa-history></div></div>
        </div>
        <div class="batch-coa-unavailable" data-coa-unavailable hidden><span>Report not posted</span><h3>No matching report is published for this strength.</h3><p>Results from another strength or lot are not substituted here.</p><a data-coa-question>Ask about this report</a></div>
      </div>`;
    anchor.before(panel);
    const find = selector => panel.querySelector(selector);
    const tabs = Array.from(panel.querySelectorAll('[role="tab"]'));
    function selectTab(tab, focus = false) {
      tabs.forEach(item => {
        const active = item === tab;
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
        document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
      });
      if (focus) tab.focus();
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
        if (event.key === 'ArrowLeft') next = tabs[(index + tabs.length - 1) % tabs.length];
        if (event.key === 'Home') next = tabs[0];
        if (event.key === 'End') next = tabs[tabs.length - 1];
        if (next) { event.preventDefault(); selectTab(next, true); }
      });
    });
    find('select').addEventListener('change', event => onStrengthChange(event.target.value));
    const focus = () => { panel.focus({ preventScroll: true }); panel.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); };
    button?.addEventListener('click', focus);
    return {
      focus,
      update(option) {
        const matching = recordsFor(product.slug, option.mgOption);
        const record = matching[0];
        find('select').value = option.code;
        find('[data-coa-title]').textContent = record ? `${record.compound} · Batch certificate` : `${product.name} · ${option.mgOption}`;
        find('[data-coa-status]').textContent = record ? 'COA available' : 'Report not posted';
        find('[data-coa-status]').dataset.available = String(Boolean(record));
        find('[data-coa-available]').hidden = !record;
        find('[data-coa-unavailable]').hidden = Boolean(record);
        if (button) { button.disabled = false; button.textContent = record ? 'View batch COA' : 'View batch records'; }
        if (!record) {
          find('[data-coa-question]').href = `mailto:customerservice@jonezielabs.com?subject=${encodeURIComponent(`COA request: ${product.name} ${option.mgOption}`)}`;
          return;
        }
        const sameStrength = normalizeStrength(option.mgOption) === normalizeStrength(record.sampleStrength);
        find('[data-coa-lot]').textContent = `LOT · ${record.lot}`;
        find('[data-coa-coverage]').textContent = `Shared lot · ${record.coveredStrengths.join(' / ')}`;
        find('[data-coa-purity]').innerHTML = `${escape(record.purityPercent)}<small>%</small>`;
        find('[data-coa-purity-scope]').textContent = `${record.method} · tested ${record.sampleStrength} sample`;
        find('[data-coa-metadata]').innerHTML = [
          [`Content of tested ${record.sampleStrength} vial`, `${record.contentMg}mg`],
          ['Reported identity', record.identity],
          ['Tested by', record.laboratory],
          ['Date analyzed', date(record.analyzed)]
        ].map(([label, value]) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('');
        panel.querySelectorAll('[data-coa-report-link]').forEach(link => { link.href = record.reportUrl; });
        find('[data-coa-certificate]').textContent = record.id;
        find('[data-coa-original-id]').textContent = `Certificate ${record.id} · Issued ${date(record.issued)}`;
        find('[data-coa-results]').innerHTML = `<table><thead><tr><th scope="col">Test</th><th scope="col">Specification</th><th scope="col">Result</th></tr></thead><tbody>${record.results.map(row => `<tr><th scope="row">${escape(row.test)}</th><td>${escape(row.specification)}</td><td>${escape(row.result)}<span>${escape(row.status)}</span></td></tr>`).join('')}</tbody></table><p>Retention time: ${escape(record.retentionMinutes)} minutes. ${escape(record.overall)}.</p>`;
        find('[data-coa-sample-note]').textContent = sameStrength
          ? `Laboratory results apply to the submitted ${record.sampleStrength} sample. Jonezie identifies this lot as supplying both listed strengths; match the lot number to your vial.`
          : `This lot also supplies ${option.mgOption}, as confirmed by Jonezie. The laboratory tested a ${record.sampleStrength} vial: the ${record.contentMg}mg content result is for that sample, not a measured ${option.mgOption} vial.`;
        find('[data-coa-history]').innerHTML = matching.map(item => `<div class="batch-coa-history-row"><div><strong>${escape(item.lot)}</strong><span>${escape(item.sampleStrength)} sample tested · ${escape(date(item.analyzed))}</span></div><a href="${escape(item.reportUrl)}" target="_blank" rel="noopener noreferrer">View certificate ↗</a></div>`).join('');
      }
    };
  }
  return { recordsFor, create };
})();
