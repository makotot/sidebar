(function (window, $) {

	// TODO
	// - check the actual
	// - add options
	// - some demos, patterns

	var Sidebar = function (target, opts) {
		this.$sidebar = $(target);
		this.$body = $(document.body);
		this.$content = this.$body.find('.jsc-sidebar-content');
		this.sidebarW = this.$sidebar.width();
		this.opts = opts;
		this.meta = this.$sidebar.data('sidebar-options');
	};

	Sidebar.prototype = {

		defaults: {
			trigger: null,
			scrollbarDisplay: false,
			pullCb: function () {},
			pushCb: function () {}
		},

		init: function () {
			this.config = $.extend({}, this.defaults, this.opts, this.meta);

			this.$trigger = this.config.trigger ? this.$body.find(this.config.trigger) : this.$body.find('.jsc-sidebar-trigger');

			this.detect3dEnabled();
			this.attachEvent();

			return this;
		},

		pushTransitionEndEvent: 'transitionEnd.push webkitTransitionEnd.push transitionend.push msTransitionEnd.push',

		pullTransitionEndEvent: 'transitionEnd.pull webkitTransitionEnd.pull transitionend.pull msTransitionEnd.pull',
		
		isAndroid: function () {
			var ua = (window.navigator.userAgent).toLowerCase(),
				isAndroid = ua.indexOf('android') > -1;

			return isAndroid;
		},

		hasTranslate3dSupport: function () {
			var p = document.createElement('p'),
				has3dSupport,
				transforms = {
					'transform': 'transform',
					'webkitTransform': '-webkit-transform',
					'MozTransform': '-moz-transform',
					'msTransform': '-ms-transform'
				};

			this.$body[0].insertBefore(p, null);

			for (var transform in transforms) {
				if (p.style[transform] !== undefined) {
					p.style[transform] = 'translate3d(1px, 1px, 1px)';
					has3dSupport = window.getComputedStyle(p).getPropertyValue(transforms[transform]);
				}
			}
			this.$body[0].removeChild(p);

			return (has3dSupport !== undefined && has3dSupport.length && has3dSupport !== 'none');
		},

		detect3dEnabled: function () {
			if (this.isAndroid() || !this.hasTranslate3dSupport()) {
				this.$content.removeClass('jsc-sidebar-pulled');
			}
		},

		attachEvent: function () {
			this.$trigger.on('click', $.proxy(function (e) {
				e.preventDefault();
				this.push();
			}, this));

			this.$content
				.on(this.pushTransitionEndEvent, $.proxy(function () {
					this.detectPushEnd();
					this.config.pushCb();
				}, this))
				.on('click', $.proxy(function () {
					this.pull();
				}, this));
		},

		push: function () {
			if (this.isAndroid() || !this.hasTranslate3dSupport()) {
				this.slidePush();
			} else {
				this.$content
					.removeClass('jsc-sidebar-pull-end')
					.addClass('jsc-sidebar-pushed');
			}
		},

		pull: function () {
			if (this.isAndroid() || !this.hasTranslate3dSupport()) {
				this.slidePull();
			} else {

				if (!this.$content.hasClass('jsc-sidebar-push-end')) {
					return;
				}

				this.$content.removeClass('jsc-sidebar-pushed');
			}
		},

		slidePull: function () {
			if (this.$content.data('sidebar-first-click') !== 1 || !(this.$content.hasClass('jsc-sidebar-opened'))) {
				return;
			}

			this.$content.stop().animate({
				marginLeft: 0
			}).promise().done($.proxy(function () {
				this.$content.removeClass('jsc-sidebar-opened');
				!this.config.scrollbarDisplay && this.$content.removeClass('jsc-sidebar-scroll-disabled');

				this.config.pullCb();
			}, this));
		},

		slidePush: function () {
			var distance = this.sidebarW + 'px';

			this.$content.stop().animate({
				marginLeft: distance
			}).promise().done($.proxy(function () {
				this.$content.addClass('jsc-sidebar-opened');
				!this.config.scrollbarDisplay && this.$content.addClass('jsc-sidebar-scroll-disabled');

				if (!this.$content.data('sidebar-first-click')) {
					this.$content.data('sidebar-first-click', 1);
				}
				this.config.pushCb();

			}, this));
		},

		detectPushEnd: function () {
			this.$content.addClass('jsc-sidebar-opened');
			!this.config.scrollbarDisplay && this.$content.addClass('jsc-sidebar-scroll-disabled');

			this.$content
				.addClass('jsc-sidebar-push-end')
				.off(this.pushTransitionEndEvent)
				.on(this.pullTransitionEndEvent, $.proxy(function () {
					this.detectPullEnd();
					this.config.pullCb();
				}, this));
		},

		detectPullEnd: function () {
			this.$content.removeClass('jsc-sidebar-disabled');
			!this.config.scrollbarDisplay && this.$content.removeClass('jsc-sidebar-scroll-disabled');

			this.$content
				.removeClass('jsc-sidebar-push-end')
				.addClass('jsc-sidebar-pull-end')
				.off(this.pullTransitionEndEvent)
				.on(this.pushTransitionEndEvent, $.proxy(function () {
					this.detectPushEnd();
					this.config.pushCb();
				}, this));
		}

	};

	Sidebar.defaults = Sidebar.prototype.defaults;


	$.fn.sidebar = function (options) {
		return this.each(function () {
			new Sidebar(this, options).init();
		});
	};

	window.Sidebar = Sidebar;

})(window, jQuery);
