/* 
Name                 : RivoraMart – Free Multipurpose Bootstrap 5 eCommerce Template
Author               : TemplateRise
Url                  : https://www.templaterise.com/template/rivoramart-free-multipurpose-bootstrap-5-ecommerce-template
*/

$(function () {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );

  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // new WOW().init();

  $(".offer-slider").owlCarousel({
    responsiveClass: true,
    loop: true,
    margin: 0,
    autoplay: true,
    dots: false,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  });

  $(".banner-slider").owlCarousel({
    responsiveClass: true,
    loop: true,
    margin: 0,
    autoplay: true,
    dots: true,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  });

  $(".banner-slider").on("changed.owl.carousel", function (event) {
    new WOW().init();
  });

  $(".category-slider").owlCarousel({
    responsiveClass: true,
    loop: true,
    margin: 50,
    autoplay: true,
    dots: false,
    nav: false,
    responsive: {
      0: {
        items: 3,
      },
      600: {
        items: 4,
      },
      992: {
        items: 7,
      },
      1200: {
        items: 8,
      },
    },
  });


  $(".blog-slider").owlCarousel({
    responsiveClass: true,
    loop: false,
    margin: 40,
    autoplay: false,
    responsive: {
      0: {
        nav: false,
        dots: true,
        items: 1,
      },
      600: {
        nav: false,
        dots: false,
        items: 2,
      },
      1000: {
        nav: true,
        dots: false,
        items: 3,
      },
    },
  });

  /////// Nice Select ///
  $(".nice-option").niceSelect();

  //// Price Range ///

  var slider = document.getElementById("priceRange");
  var priceRangeValue = document.getElementById("priceRange-value");

  // Check if the elements exist
  if (slider && priceRangeValue) {
    // Your code for creating the slider and updating the input field
    noUiSlider.create(slider, {
      start: [20, 80],
      connect: true,
      range: {
        min: 0,
        max: 100,
      },
      format: {
        to: function (value) {
          return Math.round(value);
        },
        from: function (value) {
          return value.replace("$", "");
        },
      },
    });

    // Update input field with slider value
    slider.noUiSlider.on("update", function (values, handle) {
      priceRangeValue.textContent = "$" + values[0] + " - $" + values[1];
    });
  }

  // if ($('#product-img-zoom').length > 0) {
  //     ZoomActive();
  // }

  // function ZoomActive() {
  //     $('#product-img-zoom').ezPlus({
  //         zoomType: 'inner',
  //         cursor: 'crosshair',
  //         borderSize: 0
  //     });
  // }

  // var $sliderSingle = initSlider();

  // // Initialize the slider
  // function initSlider() {
  //   if ($(".slider-nav").length > 0) {
  //     var $sliderSingle = $(".slider-nav").slick({
  //       slidesToShow: 4,
  //       slidesToScroll: 1,
  //       arrows: false,
  //       dots: false,
  //       focusOnSelect: true,
  //     });
  //     return $sliderSingle;
  //   }
  //   return null;
  // }

  // // Function to get the index of the active slide
  // function getActiveSlideIndex() {
  //   if ($sliderSingle) {
  //     return $sliderSingle.slick("slickCurrentSlide");
  //   }
  //   return -1;
  // }

  // // Function to get the image source of the active slide
  // function getImageOfActiveSlide() {
  //   var activeSlideIndex = getActiveSlideIndex();
  //   if (activeSlideIndex !== -1) {
  //     var $activeSlide = $(".slider-nav .slick-slide").eq(activeSlideIndex);
  //     var $img = $activeSlide.find("img");
  //     var imgSrc = $img.attr("src");
  //     return imgSrc;
  //   }
  //   return null;
  // }

  // // Function to update the active image and zoom
  // function updateActiveImage() {
  //   var activeImgSrc = getImageOfActiveSlide();
  //   if (activeImgSrc && $("#product-img-active").length > 0) {
  //     $("#product-img-active img").attr("src", activeImgSrc);
  //   }
  // }

  // // Event listener for slider change
  // if ($sliderSingle) {
  //   $sliderSingle.on("afterChange", function (event, slick, currentSlide) {
  //     updateActiveImage();
  //   });
  // }

  //////  Counter Increament

  $(".count-increament").click(function (e) {
    var count = $(this).parent().find("input").val();
    count++;
    $(this).parent().find("input").val(count);
  });

  //////  Counter Decreament

  $(".count-decreament").click(function (e) {
    var count = $(this).parent().find("input").val();
    count--;
    if (count > 0) {
      $(this).parent().find("input").val(count);
    }
  });

  $(".new-arrivals-slider").owlCarousel({
    loop: true,
    margin: 15,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 1 },
      576: { items: 2 },
      992: { items: 3 },
    },
  });

  $(".deal-slider").owlCarousel({
    loop: true,
    margin: 15,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 1 },
      576: { items: 1 },
      992: { items: 1 },
    },
  });

  $(".product-slider").owlCarousel({
    loop: true,
    margin: 15,
    nav: false,
    dots: false,
    responsive: {
      0: { items: 1 },
      576: { items: 2 },
      992: { items: 3 },
    },
  });

  $(".product-recommended-slider").owlCarousel({
    loop: true,
    margin: 15,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 1 },
      576: { items: 2 },
      992: { items: 4 },
    },
  });

  function startCountdown(element) {
    let secondsLeft = parseInt(element.getAttribute("data-second"));

    function updateTimer() {
      if (secondsLeft <= 0) {
        element.innerHTML = "<span class='text-danger'>Deal Expired</span>";
        return;
      }

      const days = Math.floor(secondsLeft / (60 * 60 * 24));
      const hours = Math.floor((secondsLeft % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((secondsLeft % (60 * 60)) / 60);
      const seconds = secondsLeft % 60;

      element.querySelector("#days").innerText = days;
      element.querySelector("#hours").innerText = hours;
      element.querySelector("#minutes").innerText = minutes;
      element.querySelector("#seconds").innerText = seconds;

      secondsLeft--;
      setTimeout(updateTimer, 1000);
    }

    updateTimer();
  }

  // Run countdown for all elements with class "countdown"
  document.querySelectorAll(".countdown").forEach(startCountdown);

  ////// Rating Section ///////

  const stars = document.querySelectorAll(".star");
  const ratingValue = document.getElementById("rating-number");

  if (ratingValue) {
    // Check if the element exists
    stars.forEach((star) => {
      star.addEventListener("click", function () {
        const selectedValue = this.getAttribute("data-value");
        ratingValue.value = selectedValue; // Update the value only if the element exists
        stars.forEach((s) => {
          s.classList.remove("selected");
          if (s.getAttribute("data-value") <= selectedValue) {
            s.classList.add("selected");
          }
        });
      });
    });
  }

  const thumbContainer = document.getElementById("thumbContainer");
  const thumbUp = document.getElementById("thumbUp");
  const thumbDown = document.getElementById("thumbDown");

  const container = document.getElementById("mainImageContainer");
  const productImage = document.getElementById("productImage");
  const lens = document.querySelector(".magnifier-lens");
  const preview = document.querySelector(".magnifier-preview");
  const previewImg = document.getElementById("zoomedImage");

  if (
    thumbContainer &&
    thumbUp &&
    thumbDown &&
    container &&
    productImage &&
    lens &&
    preview &&
    previewImg
  ) {
    // Create thumbnails data
    const thumbnailsData = Array.from(
      thumbContainer.querySelectorAll(".thumbnail")
    ).map((el, index) => ({
      src: el.dataset.image,
      thumbSrc: el.querySelector("img").src,
      active: index === 0, // First one is active by default
    }));

    let startIndex = 0;
    let visibleCount = getVisibleCount();

    // Get visible count based on device width
    function getVisibleCount() {
      if (window.innerWidth < 768) {
        return 3; // Mobile
      } else if (window.innerWidth < 1024) {
        return 4; // Tablet
      } else {
        return 4; // Desktop
      }
    }

    // Render thumbnails
    function renderThumbnails() {
      thumbContainer.innerHTML = "";
      const visibleThumbs = thumbnailsData.slice(
        startIndex,
        startIndex + visibleCount
      );

      visibleThumbs.forEach((thumb) => {
        const div = document.createElement("div");
        div.className = "thumbnail" + (thumb.active ? " active" : "");
        div.dataset.image = thumb.src;
        div.innerHTML = `<img src="${thumb.thumbSrc}" alt="">`;

        div.addEventListener("click", () => {
          // Update all thumbnails
          thumbnailsData.forEach((t) => (t.active = false));
          thumb.active = true;

          // Update main image and zoomed image
          productImage.src = thumb.src;
          previewImg.src = thumb.src;

          // Re-render thumbnails
          renderThumbnails();
        });

        thumbContainer.appendChild(div);
      });

      // Arrow state
      thumbUp.classList.toggle("disabled", startIndex === 0);
      thumbDown.classList.toggle(
        "disabled",
        startIndex + visibleCount >= thumbnailsData.length
      );
    }

    // Thumbnail navigation
    thumbUp.addEventListener("click", () => {
      if (startIndex > 0) {
        startIndex--;
        renderThumbnails();
      }
    });

    thumbDown.addEventListener("click", () => {
      if (startIndex + visibleCount < thumbnailsData.length) {
        startIndex++;
        renderThumbnails();
      }
    });

    // Initialize thumbnails
    renderThumbnails();

    // Magnifier logic
    container.addEventListener("mousemove", moveLens);
    container.addEventListener("mouseenter", showMagnifier);
    container.addEventListener("mouseleave", hideMagnifier);

    function showMagnifier() {
      lens.style.display = "block";
      preview.style.display = "block";
    }

    function hideMagnifier() {
      lens.style.display = "none";
      preview.style.display = "none";
    }

    function moveLens(e) {
      // Prevent default behavior
      e.preventDefault();

      // Get the position of the image
      const rect = productImage.getBoundingClientRect();
      const lensWidth = lens.offsetWidth;
      const lensHeight = lens.offsetHeight;

      // Calculate the position of the lens
      let x = e.clientX - rect.left - lensWidth / 2;
      let y = e.clientY - rect.top - lensHeight / 2;

      // Keep lens inside image boundaries
      x = Math.max(0, Math.min(x, rect.width - lensWidth));
      y = Math.max(0, Math.min(y, rect.height - lensHeight));

      // Set lens position
      lens.style.left = x + "px";
      lens.style.top = y + "px";

      // Calculate the zoom ratio (3x)
      const ratio = 3;

      // Calculate background position for zoomed image
      const bgX = -(x * ratio);
      const bgY = -(y * ratio);

      // Set zoomed image position
      previewImg.style.left = bgX + "px";
      previewImg.style.top = bgY + "px";
    }
  }


  // Sidebar Navigation

  const navLinks = document.querySelectorAll(".sidebar .nav-link");
  const pages = document.querySelectorAll(".page-content");

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      const pageId = link.getAttribute("data-page");

      // Only prevent default if it's not logout (or any external link)
      if (pageId) {
        e.preventDefault();

        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        // Hide all pages
        pages.forEach(page => page.classList.remove("active"));

        // Show selected page
        document.getElementById(pageId).classList.add("active");
      }
      // else: normal navigation for logout
    });
  });


  $("#sameShippingAddress").change(function () {
    if ($(this).is(":checked")) {
      $(".shipping-details").hide();
    } else {
      $(".shipping-details").show();
    }
  });


    $('.toggle-password').click(function() {
      var input = $(this).siblings('.input-password');
      var isPassword = input.attr('type') === 'password';
  
      // Toggle input type
      input.attr('type', isPassword ? 'text' : 'password');
  
      // Toggle icon based on input type
      var icon = isPassword 
          ? `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
              </svg>` 
          : `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>`;
      
      $(this).html(icon);
  });
  

  $('#filter-section-close').click(function() {
      var myOffcanvasEl = document.getElementById('filter-section');
      var offcanvasInstance = bootstrap.Offcanvas.getInstance(myOffcanvasEl);

      if (offcanvasInstance) {
          offcanvasInstance.hide();
      } else {
          new bootstrap.Offcanvas(myOffcanvasEl).hide();
      }
  });

});
