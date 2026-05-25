import { RAZORPAY_KEY_ID, supabase } from './config.js';
import { getCart, getCartTotal, clearCart } from './cart.js';
import { getCurrentUser } from './auth.js';

// ── Create order on backend (Supabase Edge Function) ──────────
async function createOrder(amount) {
  const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
    body: { amount: amount * 100 } // paise
  });
  if (error) throw error;
  return data;
}

// ── Save order to DB ──────────────────────────────────────────
async function saveOrder(user, paymentData, items, total) {
  const { data, error } = await supabase.from('orders').insert({
    user_id: user.id,
    items,
    total,
    razorpay_order_id: paymentData.razorpay_order_id,
    razorpay_payment_id: paymentData.razorpay_payment_id,
    status: 'paid'
  }).select().single();
  if (error) throw error;
  return data;
}

// ── Main checkout function ────────────────────────────────────
export async function initiateCheckout(shippingInfo) {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = '/pages/auth.html?redirect=checkout';
    return;
  }

  const cart = getCart();
  const total = getCartTotal();

  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  try {
    const order = await createOrder(total);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: total * 100,
      currency: 'INR',
      name: 'DRIP. Clothing',
      description: `Order for ${cart.length} item(s)`,
      order_id: order.id,
      prefill: {
        name: shippingInfo.name || user.user_metadata?.full_name,
        email: user.email,
        contact: shippingInfo.phone || ''
      },
      theme: { color: '#1a1a1a' },
      handler: async function (response) {
        try {
          const savedOrder = await saveOrder(user, response, cart, total);
          clearCart();
          window.location.href = `/pages/order-success.html?order=${savedOrder.id}`;
        } catch (err) {
          console.error('Order save failed:', err);
          alert('Payment received but order save failed. Contact support.');
        }
      },
      modal: {
        ondismiss: () => console.log('Payment cancelled')
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      alert(`Payment failed: ${response.error.description}`);
    });
    rzp.open();

  } catch (err) {
    console.error('Checkout error:', err);
    alert('Something went wrong. Please try again.');
  }
}
