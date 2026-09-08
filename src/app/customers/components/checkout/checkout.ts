import { CommonModule } from '@angular/common';
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { CustomerService } from '../../services/customer.service';
import { StripeService } from '../../../stripe.service';

@Component({
  selector: 'app-checkout',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit, AfterContentChecked {
  userId: number;
  profileForm: any;
  orderId!: number;
  totalAmount: any;
  myOrder: any;
  stripe: any;
  isProcessing = false;

  constructor(
    private stripeService: StripeService,
    private customerService: CustomerService,
    private userStorage: UserStorageService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  card: any;

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  async ngOnInit() {
    this.stripe = await this.stripeService.getStripe();
    const elements = this.stripe.elements();
    this.card = elements.create('card', {
      hidePostalCode: true,
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
        }
      }
    });

    this.card.mount('#card-element');
    this.userId = Number(UserStorageService.getUserId());
    this.loadProfile();
    this.getMyOrders();
    this.activatedRoute.paramMap.subscribe(params => {
      this.orderId = Number(params.get('orderId'));
      if (this.orderId) {
        this.getOrderedProductsDetailsByOrderId();
      } else {
        this.snackBar.open('Invalid order ID', 'ERROR', { duration: 3000 });
      }
    });
  }

  loadProfile() {
    this.customerService.getProfile(this.userId).subscribe(res => {
      this.profileForm = res;
      this.cdRef.detectChanges();
    });
  }

  getMyOrders() {
    this.customerService.getOrdersByUserId().subscribe(res => {
      this.myOrder = res;
      this.cdRef.detectChanges();
    });
  }

  getOrderedProductsDetailsByOrderId() {
    this.customerService.getOrderedProducts(this.orderId).subscribe(res => {
      this.totalAmount = res.orderAmount;
      this.cdRef.detectChanges();
    });
  }

  async pay() {
    setTimeout(() => {
      this.isProcessing = true;
    });

    const { token, error } = await this.stripe.createToken(this.card);

    if (error) {
      this.snackBar.open(error.message, 'ERREUR', { duration: 3000 });
      this.isProcessing = false;
    } else {
      this.processPayment(token.id);
    }
  }

  processPayment(stripeToken: string) {
    const paymentDto = {
      userId: this.userId,
      orderId: this.orderId,
      stripeToken: stripeToken,
      amount: this.totalAmount
    };

    this.customerService.Pay(paymentDto).subscribe({
      next: (res) => {
        this.snackBar.open('Payment successful !', 'Success', { duration: 3000 });
        this.isProcessing = false;
        this.router.navigateByUrl('/customer/my-orders');
      },
      error: (err) => {
        console.error(err);
        const errorMsg = err.error ? err.error : 'Error during payment';
        this.snackBar.open('Error during payment', 'Error', { duration: 3000 });
        this.isProcessing = false;
      }
    });
  }
}