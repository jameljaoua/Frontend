import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { AdminService } from '../../service/admin.service';
Chart.register(...registerables);
@Component({
  selector: 'app-analytics',
  imports: [
        CommonModule,
    RouterLink,
  ],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
})
export class Analytics {
reportData: any;
purchasedOrders : any[] = [];

constructor(private adminService :AdminService,private cdr: ChangeDetectorRef
){
this.getAllPurchasedOrders();
}
ngOnInit() {
  this.adminService.getOrdersReport().subscribe(res => {
    this.reportData = res;
    // On laisse le temps au DOM de s'initialiser
    setTimeout(() => {
      this.createChart(res.labels, res.data);
    }, 0);
  });
}
       getAllPurchasedOrders(){
      this.purchasedOrders = [];
      this.adminService.getAllPurchasedOrders().subscribe(res=>{
        res.forEach(element => {
          this.purchasedOrders.push(element);
        });
            this.cdr.detectChanges(); 

      })
    }
createChart(labels: string[], data: number[]) {
  const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
  
  new Chart(ctx, {
    type: 'line', // Changement : type 'line' au lieu de 'bar'
    data: {
      labels: labels,
      datasets: [{
        label: 'Purchased Orders',
        data: data,
        fill: true, // Active le remplissage sous la ligne
        backgroundColor: 'rgba(25, 135, 84, 0.2)', // Vert transparent pour le fond
        borderColor: '#198754', // Vert AdminLTE pour la ligne
        borderWidth: 3,
        pointBackgroundColor: '#198754',
        tension: 0.4, // C'est ici qu'on crée l'effet "vague" lissé (smooth)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // Masque la légende pour correspondre à la capture
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            drawOnChartArea: true,
          }
        },
        x: {
          grid: {
            display: false // Masque les lignes verticales pour un look épuré
          }
        }
      }
    }
  });
}
}
