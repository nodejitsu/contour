'use strict';

/**
 * Trigger the Login lightbox.
 *
 * @constructor
 * @api private
 */
Cortex.app('Login', Cortex.View.extend({
  selector: '[data-login]',

  //
  // Potential redirect location, can be set on the evoking element with
  // an attributed named data-redirect.
  //
  redirect: null,

  /**
   * Delegate the events.
   *
   * @type {Object}
   */
  delegate: {
    'click': 'modal',
    'click < section.modal a.forgotten': 'forgot'
  },

  /**
   * Initialize called by the constructor on load.
   *
   * @api private
   */
  initialize: function initialize() {
    var hash = window.location.hash.match(/^\#?\/([^\/]+)?\/?$/)
      , self = this;

    //
    // The login form is in the DOM by default so it can leverage
    // browser password saving features.
    //
    this.content = $('section.modal').get('innerHTML');

    if (hash && hash[1] === 'login') setTimeout(function check() {
      if (Cortex.app('modal')) return self.render('login');

      setTimeout(check, 100);
    }, 100);
  },

  /**
   * Open the Login modal
   *
   * @param {Event} e
   * @api private
   */
  modal: function modal(e) {
    e.preventDefault();

    // Remove the old listeners so we don't trigger the regular validation
    Cortex.app('modal').off('done');

    var self = this;
    self.redirect = $(e.element).get('data-redirect');

    if (!this.restore) this.restore = Cortex.app('modal').on('close', function () {
      // The modal is closed, make sure that we still have a login state
      // present or restore it with our cached content.
      var modal = $('section.modal');
      if (~modal.get('innerHTML').indexOf('type="password"')) return;

      modal.set('innerHTML', self.content);
    });

    return this.render('login');
  },

  /**
   * The user actually forgot their password.
   *
   * @param {Event} e
   * @api public
   */
  forgot: function forgot(e) {
    e.preventDefault();

    // Remove the old listeners so we don't trigger the regular validation
    Cortex.app('modal').off('done');
    return this.render('forgot');
  },

  /**
   * The user requested a password forget.
   *
   * @api public
   */
  forgotten: function forgotten() {
    var self = this
      , username = $('.modal input[name="username"]')
      , button = $('.modal button[type="submit"]');

    // Add an disabled state to the button as we are processing it
    button.addClass('disabled loading')
      .set('disabled', 'disabled')
      .set('innerHTML', 'Submitting');

    username = username.set('readOnly', true).get('value');

    Cortex.request({
        url: '/forgot'
      , method: 'post'
      , type: 'json'
      , data: {
            username: username
        }
      , success: function success(res) {
          if (res.error) {
            return self.render('forgot', {
                error: 'Invalid user account'
              , username: username
            });
          }

          return self.render('forgot', {
              success: 'We have sent an password reset request to your e-mail address'
            , username: username
          });
        }
    });
  },

  /**
   * Validate the login credentials.
   *
   * @param {Boolean} closed the user closed modal
   * @api private
   */
  validate: function validate(closed) {
    if (closed) return;

    var username = $('.modal input[name="username"]')
      , password = $('.modal input[name="password"]')
      , button = $('.modal button[type="submit"]')
      , self = this;

    // Add an disabled state to the button as we are processing it
    button.addClass('disabled loading')
      .set('disabled', 'disabled')
      .set('innerHTML', 'Logging in');

    username = username.set('readOnly', true).get('value');
    password = password.set('readOnly', true).get('value');

    // Show the spinner.
    $('.modal .close').addClass('gone');
    $('.modal .spinner').removeClass('gone');

    Cortex.request({
        url: '/signin/verify'
      , method: 'post'
      , type: 'json'
      , data: {
            username: username
          , password: password
        }
      , success: function success(res) {
          if (res.status === 'error') return self.render('login', {
              error: res.message
            , username: username
            , password: password
          });

          $('.modal form').plain(0).submit();
        }
    });

    return this;
  },

  /**
   * Handle the interactions in the modal box.
   *
   * @param {Boolean} closed did the user close the modal?
   * @param {Event} action the button that triggered the action
   * @api private
   */
  close: function close(type, closed, action) {
    // remove event listeners
    if (closed) return;

    return type === 'login'
      ? this.validate()
      : this.forgotten();
  },

  /**
   * Render a new Modal window where the user can log his stuff
   *
   * @param {Object} data
   * @api public
   */
  render: function render(name, data) {
    var template;

    if (name !== 'login') {
      template = this.template(name, data || {});

      template.where('name').is('username').use('username').as('value');
      template.where('name').is('password').use('password').as('value');

      if (data && data.error) {
        template.className('error').use('error');
      } else {
        template.className('error').remove();
      }

      if (data && data.success) {
        template.className('success').use('success');
      } else {
        template.className('success').remove();
      }
    } else if (data && data.error) {
      // Hide the spinner and show the close button.
      $('.modal .close').removeClass('gone');
      $('.modal .spinner').addClass('gone');

      // Login request, but with data.. so the login failed
      $('.modal input[name="username"], .modal input[name="password"]').set(
        'readOnly',
        false
      );

      $('.modal button[type="submit"]')
        .removeClass('disabled loading')
        .set('innerHTML', 'Log in')
        .set('disabled', '');

      $('.modal .error').removeClass('gone').set('innerHTML', data.error);
    }

    Cortex.app('modal')
      .render(template)
      .once('done', this.close.bind(this, name));

    //
    // Check if we need to create a hidden input field with a redirect directive.
    //
    if (this.redirect) {
      $('.modal form input[name="redirect"]').set('value', this.redirect);
    }

    return this;
  }
}), { once: 'login' });