(() => {
  const button = document.querySelector('#copy-doge');
  const address = document.querySelector('#doge-address');
  const status = document.querySelector('#copy-status');
  if (!button || !address || !status) return;
  button.hidden = false;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(address.textContent.trim());
      status.textContent = 'Dogecoin address copied.';
    } catch {
      status.textContent = 'Copy was unavailable. Select and copy the address shown above.';
    }
  });
})();
