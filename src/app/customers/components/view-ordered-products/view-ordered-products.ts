import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-ordered-products',
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './view-ordered-products.html',
  styleUrl: './view-ordered-products.css',
})
export class ViewOrderedProducts {
  orderId!: number;
  orderedProductsDetailsList = [];
  totalAmount :any ;
  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef){}
    ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.orderId = Number(params.get('orderId'));
      if (this.orderId) {
        this.getOrderedProductsDetailsByOrderId();
      } else {
        this.snackBar.open('Invalid order ID', 'ERROR', {duration: 3000});
      }
    });
  }

getOrderedProductsDetailsByOrderId() {
  this.customerService.getOrderedProducts(this.orderId).subscribe(res => {

    res.productDtoList.forEach(element => {
      element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
      this.orderedProductsDetailsList.push(element);
    });

    this.totalAmount = res.orderAmount;
    this.cdr.detectChanges(); 

  });
}
}
