import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51LLpCxGncPXaAbkqHP7WP1R807kwSuJnNLTR8NWOVklw7Hlwee48FX9Nd1Qdbz4BWFUqecp8db4zJYAiYbMHpq2o00g11xoy6F'
);

export const bookTour = async (tourId) => {
  try {
    // 1 get checkout session from the server (API)
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    //console.log(session);
    // 2 create checkout form and charge card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
