(function () {
  const key = sessionStorage.getItem('spx_key');
  sessionStorage.removeItem('spx_key');

  if (!key) {
    document.getElementById('success-state').hidden = true;
    document.getElementById('error-state').hidden = false;
    return;
  }

  document.getElementById('license-key').textContent = key;

  document.getElementById('copy-btn').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(key);
      const btn = document.getElementById('copy-btn');
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy Key';
        btn.classList.remove('copied');
      }, 2000);
    } catch {
      prompt('Copy this key:', key);
    }
  });

  document.getElementById('download-btn').addEventListener('click', () => {
    const content = [
      'Spectra Pro License Key',
      '=======================',
      key,
      '',
      'How to activate:',
      '1. Open the Spectra extension in Chrome',
      '2. Click "Activate Pro"',
      '3. Paste this key and click Activate',
      '',
      'Support: getspectra404@gmail.com',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'spectra-license.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  });
})();
