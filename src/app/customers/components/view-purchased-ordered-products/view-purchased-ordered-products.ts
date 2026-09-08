import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Component({
  selector: 'app-view-purchased-ordered-products',
  imports: [CommonModule, RouterLink],
  templateUrl: './view-purchased-ordered-products.html',
  styleUrl: './view-purchased-ordered-products.css',
})
export class ViewPurchasedOrderedProducts {
  orderId!: number;
  orderedProductsDetailsList: any[] = [];
  totalAmount: any;
  userId: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private userStorage: UserStorageService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.orderId = Number(params.get('orderId'));
      if (this.orderId) {
        this.getPurchasedOrderedProductsDetailsByOrderId();
      } else {
        this.snackBar.open('Invalid order ID', 'ERROR', { duration: 3000 });
      }
    });
  }

  getPurchasedOrderedProductsDetailsByOrderId() {
    this.customerService.getPurchasedOrderedProducts(this.orderId).subscribe(res => {
      res.productDtoList.forEach((element: any) => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        element.hasFile = element.productFileName != null && element.productFileName !== '';
        this.orderedProductsDetailsList.push(element);
      });

      this.totalAmount = res.orderAmount;
      this.cdr.detectChanges();
    });
  }

  downloadProductFile(productId: number, fileName: string) {
    if (!productId) {
      this.showErrorMessage('Invalid product ID');
      return;
    }

    const snackBarRef = this.snackBar.open('Downloading file...', 'Close', { duration: 0 });
    this.userId = Number(UserStorageService.getUserId());
    this.customerService.downloadProductFile(productId, this.userId).subscribe({
      next: (blob: Blob) => {
        snackBarRef.dismiss();

        if (blob.size === 0) {
          this.showErrorMessage('File is empty');
          return;
        }

        const finalFileName = fileName || `product-${productId}.bin`;
        this.downloadBlob(blob, finalFileName);

        this.snackBar.open('Download completed!', 'SUCCESS', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      },
      error: (err) => {
        snackBarRef.dismiss();
        console.error('Download error:', err);
        this.handleDownloadError(err);
      }
    });
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  private handleDownloadError(err: any): void {
    let errorMessage = 'Error downloading file';

    if (err.status === 404) {
      errorMessage = 'File not found';
    } else if (err.status === 500) {
      errorMessage = 'Server error';
    } else if (err.status === 0) {
      errorMessage = 'Network error - check your connection';
    }

    this.showErrorMessage(errorMessage);
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'ERROR', {
      duration: 4000,
      panelClass: 'error-snackbar'
    });
  }
}