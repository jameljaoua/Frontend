import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { Header } from '../../shared/public/header/header';
import { Footer } from '../../shared/public/footer/footer';
import { ChatBot } from '../../public/components/chat-bot/chat-bot';
declare var $: any; // Déclaration pour jQuery
declare var niceSelect: any; // Pour nice-select
declare var noUiSlider: any; // Pour noUiSlider
declare var OwlCarousel: any; // Pour Owl Carousel

@Component({
  selector: 'app-public-layout',
  imports: [
         CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,  
    MaterialModule,
    Header,
    Footer,
    ChatBot
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout implements AfterViewInit {
  ngAfterViewInit() {
    this.initializePlugins();
  }
    private initializePlugins() {
    // Initialiser les plugins après le chargement de la vue
    setTimeout(() => {
      this.initNiceSelect();
      this.initOwlCarousel();
      this.initNoUiSlider();
      this.initSlick();
      this.initTabs();
    }, 100); // Petit délai pour s'assurer que le DOM est prêt
  }
  private initNiceSelect() {
    if (typeof $ !== 'undefined' && $('.nice-select').length) {
      $('.nice-select').niceSelect();
    }
  }
    private initOwlCarousel() {
    if (typeof $ !== 'undefined' && $('.owl-carousel').length) {
      $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        responsive: {
          0: { items: 1 },
          600: { items: 3 },
          1000: { items: 5 }
        }
      });
    }
  }
    private initNoUiSlider() {
    if (typeof noUiSlider !== 'undefined') {
      const sliders = document.querySelectorAll('.nouislider');
      sliders.forEach((slider: any) => {
        noUiSlider.create(slider, {
          start: [20, 80],
          connect: true,
          range: { 'min': 0, 'max': 100 }
        });
      });
    }
  }
  private initSlick() {
    if (typeof $ !== 'undefined' && $('.slick-slider').length) {
      $('.slick-slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
          { breakpoint: 1024, settings: { slidesToShow: 3 } },
          { breakpoint: 600, settings: { slidesToShow: 2 } },
          { breakpoint: 480, settings: { slidesToShow: 1 } }
        ]
      });
    }
  }
    private initTabs() {
    if (typeof $ !== 'undefined' && $('.tabs').length) {
      $('.tabs').each(function() {
        $(this).find('.tab-links a').on('click', function(e) {
          e.preventDefault();
          const tabId = $(this).attr('href');
          $(this).parent().siblings().removeClass('active');
          $(this).parent().addClass('active');
          $(tabId).siblings().hide();
          $(tabId).show();
        });
      });
    }
  }
}
