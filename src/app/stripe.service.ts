import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise = loadStripe('pk_test_51TJ9ZKPH0JgEpo29Qvt7X36u0qhKCGuLRiZxktX50HOHFKuKkJ7eZul8TuAcZNnNxEntMkeTnpaSPbKmHDO0hytc00GQ12kcFj');

  async getStripe(): Promise<Stripe | null> {
    return await this.stripePromise;
  }
}
