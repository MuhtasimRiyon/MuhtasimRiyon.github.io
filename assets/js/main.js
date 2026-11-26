!(function($) {
  "use strict";

  // Preloader
  $(window).on('load', function() {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function() {
        $(this).remove();
      });
    }
  });

  // Hero typed
  if ($('.typed').length) {
    var typed_strings = $(".typed").data('typed-items');
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  // Smooth scroll for the navigation menu and links with .scrollto classes
  function closeMobileNav() {
    $('body').removeClass('mobile-nav-active');
    $('.mobile-nav-toggle').attr('aria-expanded', 'false')
      .find('i').removeClass('icofont-close').addClass('icofont-navigation-menu');
  }

  $(document).on('click', '.nav-menu a, .scrollto', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        e.preventDefault();

        var scrollto = target.offset().top;

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          closeMobileNav();
        }
        return false;
      }
    }
  });

  // Activate smooth scroll on page load with hash links in the url
  $(document).ready(function() {
    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var scrollto = $(initial_nav).offset().top;
        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');
      }
    }
  });

  $(document).on('click', '.mobile-nav-toggle', function(e) {
    $('body').toggleClass('mobile-nav-active');
    $(this).attr('aria-expanded', $('body').hasClass('mobile-nav-active') ? 'true' : 'false');
    $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
  });

  $(document).click(function(e) {
    var container = $(".mobile-nav-toggle");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if ($('body').hasClass('mobile-nav-active')) {
        closeMobileNav();
      }
    }
  });

  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' && $('body').hasClass('mobile-nav-active')) {
      closeMobileNav();
      $('.mobile-nav-toggle').trigger('focus');
    }
  });

  $(window).on('resize', function() {
    if (window.innerWidth >= 992) closeMobileNav();
  });

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, #mobile-nav');

  $(window).on('scroll', function() {
    var cur_pos = $(this).scrollTop() + 300;

    nav_sections.each(function() {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
      if (cur_pos < 200) {
        $(".nav-menu ul:first li:first").addClass('active');
      }
    });
  });

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Skills section
  $('.skills-content').waypoint(function() {
    $('.progress .progress-bar').each(function() {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, {
    offset: '80%'
  });

  // Init AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      once: true
    });
  }

  const portfolio = document.getElementById('portfolio');
  if (portfolio) {
    const dialog = portfolio.querySelector('.portfolio-dialog');
    const galleryImage = dialog.querySelector('.portfolio-gallery img');
    const galleryCaption = dialog.querySelector('.portfolio-gallery figcaption');
    const galleryControls = dialog.querySelector('.portfolio-gallery-controls');
    const galleryOriginal = dialog.querySelector('.portfolio-gallery-original');
    let screenshots = [];
    let screenshotIndex = 0;
    let detailsButton;

    portfolio.querySelectorAll('[data-project-count]').forEach(function(label) {
      const group = label.closest('.portfolio-group') || portfolio;
      const count = group.querySelectorAll('.portfolio-card').length;
      label.textContent = count + (count === 1 ? ' project' : ' projects');
      label.hidden = false;
    });

    function showScreenshot() {
      const screenshot = screenshots[screenshotIndex];
      galleryImage.alt = screenshot.textContent;
      galleryImage.src = screenshot.href;
      galleryOriginal.href = screenshot.href;
      galleryCaption.textContent = screenshots.length === 1
        ? screenshot.textContent
        : (screenshotIndex + 1) + ' / ' + screenshots.length + ' · ' + screenshot.textContent;
    }

    portfolio.addEventListener('click', function(event) {
      const button = event.target.closest('[data-project-details]');
      if (!button) return;

      const card = button.closest('.portfolio-card');
      detailsButton = button;
      dialog.querySelector('.portfolio-dialog-group').textContent = card.closest('.portfolio-group').querySelector('h3').textContent;
      dialog.querySelector('#portfolio-dialog-title').textContent = card.querySelector('h4').textContent;
      dialog.querySelector('#portfolio-dialog-description').textContent = card.querySelector('.portfolio-description').textContent;
      dialog.querySelector('.portfolio-dialog-visit').href = card.querySelector('.portfolio-visit').href;
      screenshots = Array.from(card.querySelectorAll('.portfolio-screenshots a'));
      screenshotIndex = 0;
      galleryControls.hidden = screenshots.length < 2;
      showScreenshot();
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('portfolio-dialog-open');
    });

    galleryControls.addEventListener('click', function(event) {
      const button = event.target.closest('[data-gallery-step]');
      if (!button) return;

      const step = Number(button.dataset.galleryStep);
      screenshotIndex = (screenshotIndex + step + screenshots.length) % screenshots.length;
      showScreenshot();
    });

    dialog.addEventListener('click', function(event) {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener('close', function() {
      document.body.classList.remove('portfolio-dialog-open');
      detailsButton.focus({ preventScroll: true });
    });
  }

  $(window).on('load', aos_init);

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

  // Portfolio details carousel
  $(".portfolio-details-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

})(jQuery);
