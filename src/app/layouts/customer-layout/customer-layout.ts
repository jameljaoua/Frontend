import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { CustomerHeader } from '../../shared/customer/customer-header/customer-header';
import { CustomerFooter } from '../../shared/customer/customer-footer/customer-footer';
import { ChatBot } from '../../customers/components/chat-bot/chat-bot';

declare var $: any;

@Component({
  selector: 'app-customer-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    CustomerHeader,
    CustomerFooter,
    ChatBot
  ],
  templateUrl: './customer-layout.html',
  styleUrl: './customer-layout.css',
})
export class CustomerLayout implements AfterViewInit {
  
  ngAfterViewInit() {
    // Attendre que le DOM soit complètement chargé
    setTimeout(() => {
      this.initializePlugins();
    }, 300);
  }

  private initializePlugins() {
    // Vérifier que jQuery est chargé
    if (typeof $ === 'undefined') {
      console.warn('jQuery is not loaded');
      return;
    }

    this.initNiceSelect();
    this.initTabs();
    // Ne PAS initialiser Owl Carousel ici car il sera initialisé dans chaque composant
  }

  private initNiceSelect() {
    try {
      if ($('.nice-select').length && $.fn.niceSelect) {
        $('.nice-select').niceSelect();
      }
    } catch (error) {
      console.error('Error initializing niceSelect:', error);
    }
  }

  private initTabs() {
    try {
      if ($('.tabs').length) {
        $('.tabs').each(function(this: any) {
          $(this).find('.tab-links a').off('click').on('click', function(e: any) {
            e.preventDefault();
            const $this = $(this);
            const tabId = $this.attr('href');
            
            $this.parent().siblings().removeClass('active');
            $this.parent().addClass('active');
            
            $(tabId).siblings().hide();
            $(tabId).show();
          });
        });
      }
    } catch (error) {
      console.error('Error initializing tabs:', error);
    }
  }
}