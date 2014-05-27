touched = false;

$(function () {
	PulseArrows();

	$(window).on('resize', SetSlideHeight);
	InitSlideHeight();

	$(window).on('ds-resize', function () {
		InitCurtain();
	});
	InitCurtain();

	function scrollToSlide(slide) {
		if(slide.length) {
			var scrollVal = 0;
			var wrap = slide.data('ds-curtain-parent');
			if(wrap) {
				scrollVal = wrap.offset().top;
			} else {
				scrollVal = slide.offset().top;
			}
			$('html,body').animate({'scrollTop': scrollVal});
		}
	}

	if(window.location.hash) {
		var slide = $(window.location.hash);
		scrollToSlide(slide);
	}

	$('.slide-nav-link').on('click', function (e) {
		var slide = $($(this).attr('href'));
		scrollToSlide(slide);
	});

	$(window).on('scroll', CheckPager);
	CheckPager();
});

function CheckPager() {
	$('.main-section').each(function (e) {
		var slide = $(this);

		var scrollVal = 0;
		var wrap = slide.data('ds-curtain-parent');
		if(wrap) {
			scrollVal = wrap.offset().top;
		} else {
			scrollVal = slide.offset().top;
		}

		if($(window).scrollTop() >= scrollVal) {
			$('.slide-pager a').removeClass('active');
			$('.pager-link-' + slide.attr('id')).addClass('active');
		}
	});
}

function InitCurtain() {
	if($(window).width() > 768) {
		$('.main-slides .main-section').dsCurtain();
	} else {
		$('.main-slides .main-section').dsCurtain('destroy');
	}
}

function PulseArrows() {
	var arrows = $('.down-arrows img');
	arrows.stop(true);
	arrows.css({'opacity': '0'});
	$(arrows[0])
		.animate({'opacity': 0.75, 'queue': true, 'easing': 'easeInQuint', 'duration': 100})
		.animate({'opacity': 0, 'queue': true, 'easing': 'easeOutQuint', 'duration': 100})
	;

	$(arrows[1])
		.delay(100)
		.animate({'opacity': 0.75, 'queue': true, 'easing': 'easeInQuint', 'duration': 100})
		.animate({'opacity': 0, 'queue': true, 'easing': 'easeOutQuint', 'duration': 100})
	;

	$(arrows[2])
		.delay(200)
		.animate({'opacity': 0.75, 'queue': true, 'easing': 'easeInQuint', 'duration': 100})
		.animate({'opacity': 0, 'queue': true, 'easing': 'easeOutQuint', 'duration': 100})
	;

	setTimeout(PulseArrows, 1700);
}

function InitSlideHeight() {
	if($(window).width() > 768) {
		$('.main-slides .section-content').css({'min-height': $(window).height() + 'px'});
	} else {
		$('.intro-section .section-content').css({'min-height': $(window).height() + 'px'});
	}
}

function SetSlideHeight() {
	if($(window).width() > 768) {
		$('.main-slides .section-content').css({'min-height': $(window).height() + 'px'});
	} else {
		var tempH = $('.intro-section .section-content').css('min-height');
		$('.main-slides .section-content').css({'min-height': ''});
		$('.intro-section .section-content').css({'min-height': tempH});
	}
}

/* DS CURTAIN PLUGIN */
(function ($) {
	var init = false;
	var totalSlides = 0;

	var slides = [];
	var slidePos = [];

	var $this = undefined;

	var options = {};

	var methods = {
		init: function (args) {
			$this = this;

			if(touched == false && init == false) {
				options = $.extend({
					deadZone: 0
				}, args);

				init = true;
				totalSlides = this.length;

				this.each(function (i) {
					var slide = $(this);

					slide.wrap('<div class="curtain-wrap"></div>');
					var wrap = slide.parent();
					slide.data('ds-curtain-parent', wrap);
					wrap.data('ds-curtain-child', slide);

					if(totalSlides == (i + 1)) {
						wrap.height(slide.height());
					} else {
						wrap.height(slide.height() + options.deadZone);
					}

					slides.push(slide);
					slidePos.push(wrap.offset().top);

					slide.css({
						'z-index': i
					});
				});

				this.css({
					'position': 'fixed',
					'left': '0',
					'top': '0',
					'right': '0'
				});

				$this.dsCurtain('setScroll');
			}

			$(window).on('ds-resize.ds-curtain', function () {
				$this.dsCurtain('reinit');
			});

			$(window).on('scroll.ds-curtain', function () {
				$this.dsCurtain('setScroll');
			});

			$(window).on('touchstart', function (e) {
				if(!touched) {
					touched = true;
					$this.dsCurtain('destroy');

					$(".slide").addClass("mobile");
				}
			});

			return this;
		},
		reinit: function () {
			if(init) {
				$this.dsCurtain('destroy');
				$this.dsCurtain();
			}
		},
		setScroll: function () {
			if(init) {
				for(var i = 0; i < slides.length; i++) {
					var slide = slides[i];
					var wrap = slide.data('ds-curtain-parent');
					if($(window).scrollTop() > slidePos[i] && $(window).scrollTop() <= slidePos[i + 1]) {
						slide.css({
							'position': 'fixed',
							'left': '0',
							'top': '0',
							'right': '0'
						});
					} else {
						slide.css({
							'position': '',
							'left': '',
							'top': '',
							'right': ''
						});
					}
				}
			}
		},
		destroy: function (options) {
			if(init) {
				init = false;

				for(i in slides) {
					var slide = slides[i];

					slide.css({
						'position': '',
						'left': '',
						'top': '',
						'right': '',
						'z-index': ''
					});

					var wrap = slide.data('ds-curtain-parent');
					slide.data('ds-curtain-parent', null);
					wrap.data('ds-curtain-child', null);
					wrap.replaceWith(slide);
				}

				slides = [];
				totalslides = 0;
				slidePos = [];

				$(window).off('.ds-curtain');
			}
		}
	}

	$.fn.dsCurtain = function (method) {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if(typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.dsCurtain');
		}
	};
})(jQuery);
