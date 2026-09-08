import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  subscribeEmail: string = '';
  currentYear: number = new Date().getFullYear();

  onSubscribe() {
    if (!this.subscribeEmail) return;
    // TODO: brancher sur un endpoint newsletter si tu en as un côté Spring Boot
    console.log('Subscribe:', this.subscribeEmail);
    this.subscribeEmail = '';
  }
}