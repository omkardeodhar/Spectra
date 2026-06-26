const WORKER  = 'https://spectra-worker.getspectra404.workers.dev';
const RZP_KEY = 'rzp_live_T6LVIZDkLjbOhU';

function initCheckout() {
  const btn = document.getElementById('get-pro-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'Please wait…';

    try {
      const orderRes = await fetch(`${WORKER}/create-order`, { method: 'POST' });
      if (!orderRes.ok) throw new Error('order_failed');
      const { order_id, amount, currency } = await orderRes.json();

      const options = {
        key: RZP_KEY,
        amount,
        currency,
        name: 'Spectra',
        description: 'Pro License — one-time',
        order_id,
        config: {
          display: {
            blocks: {
              pay: {
                name: 'Pay with',
                instruments: [
                  { method: 'upi' },
                  { method: 'card' },
                  { method: 'netbanking' },
                ],
              },
            },
            sequence: ['block.pay'],
            preferences: { show_default_blocks: false },
          },
        },
        theme: { color: '#2563eb' },
        modal: {
          ondismiss() {
            btn.disabled = false;
            btn.textContent = 'Get Pro — ₹299';
          },
        },
        handler: async (response) => {
          btn.textContent = 'Verifying…';
          try {
            const verifyRes = await fetch(`${WORKER}/verify-and-issue`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                payment_id: response.razorpay_payment_id,
                order_id:   response.razorpay_order_id,
                signature:  response.razorpay_signature,
              }),
            });
            if (!verifyRes.ok) throw new Error('verify_failed');
            const { key } = await verifyRes.json();
            sessionStorage.setItem('spx_key', key);
            window.location.href = 'success.html';
          } catch {
            alert(
              'Payment received but license delivery failed.\n\n' +
              'Email getspectra404@gmail.com with your payment ID:\n' +
              response.razorpay_payment_id
            );
            btn.disabled = false;
            btn.textContent = 'Get Pro — ₹299';
          }
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch {
      alert('Could not start checkout. Please try again.');
      btn.disabled = false;
      btn.textContent = 'Get Pro — ₹299';
    }
  });
}

document.addEventListener('DOMContentLoaded', initCheckout);
