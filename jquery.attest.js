(function() {
  var attest;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  attest = (function() {
    attest.prototype.defaults = {
      nodes: 'input, select, textarea',
      ignored: '[type=submit], [type=image], [type=button], [type=reset], [type=hidden]',
      submit: '[type=submit]',
      validClass: 'valid',
      errorClass: 'error',
      requiredClass: 'required',
      modifiers: 'i',
      patterns: {
        email: /^[a-z0-9_.%+\-]+@[0-9a-z.\-]+\.[a-z.]{2,6}$/i,
        url: /[a-z][\-\.+a-z]*:\/\//i,
        number: /^\d+$/
      }
    };
    function attest(form, options) {
      this.form = $(form);
      this.options = $.extend(true, {}, this.defaults, options);
      this.fields = this.form.find(this.options.nodes).not(this.options.ignored);
      this.submit = this.form.find(this.options.submit);
      this._bindings();
      this.submit.bind('click', __bind(function(e) {
        if (this.validate().length) {
          return false;
        }
      }, this));
      this.form.bind('submit', __bind(function(e) {
        if (e.which === 13 && this.validate().length) {
          return false;
        }
      }, this));
    }
    attest.prototype._bindings = function() {
      return this.fields.bind('blur keyup keydown', __bind(function(e) {
        var el, invalid;
        el = $(e.currentTarget);
        if (!(e.type === 'blur' || el.hasClass('error'))) {
          return;
        }
        return invalid = this._isRequired(el) || this._isValid(el);
      }, this));
    };
    attest.prototype._isRequired = function(el) {
      var required, val;
      required = el.attr('required');
      val = el.val();
      if (required && (!(val != null) || val.length === 0)) {
        el.addClass(this.options.requiredClass);
        return true;
      } else {
        el.removeClass(this.options.requiredClass);
      }
      return null;
    };
    attest.prototype._isValid = function(el) {
      var match, pattern;
      if (el.data('match')) {
        match = this.form.find(el.data('match'));
        if ((match != null) && $(match).val() !== el.val()) {
          el.addClass(this.options.errorClass);
          return true;
        } else {
          el.removeClass(this.options.errorClass);
        }
      }
      pattern = el.attr('pattern') ? new RegExp(el.attr('pattern'), this.options.modifiers) : this.options.patterns[el.attr('type')] ? this.options.patterns[el.attr('type')] : void 0;
      if (pattern) {
        if (pattern.test(el.val())) {
          el.removeClass(this.options.errorClass);
        } else {
          el.addClass(this.options.errorClass);
          return true;
        }
      }
      return null;
    };
    attest.prototype._option = function(key, value) {
      if ($.isPlainObject(key)) {
        return this.options = $.extend(true, this.options, key);
      }
    };
    attest.prototype.validate = function() {
      return this.fields.map(__bind(function(idx, field) {
        var el, invalid;
        el = $(field);
        invalid = this._isRequired(el) || this._isValid(el);
        if (invalid) {
          el.addClass(this.options.errorClass);
        }
        if (invalid) {
          return field;
        } else {
          return null;
        }
      }, this));
    };
    return attest;
  })();
  jQuery.fn.attest = function(options) {
    var args, isMethodCall, returnValue;
    isMethodCall = typeof options === "string";
    args = Array.prototype.slice.call(arguments, 1);
    returnValue = this;
    this.each(function() {
      var instance, methodValue;
      instance = $.data(this, 'attest');
      if (isMethodCall) {
        if (!instance) {
          return $.error("cannot call methods on attest prior to initialization; attempted to call method '" + options + "'");
        }
        if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
          return $.error("no such method '" + options + "' for attest instance");
        }
        methodValue = instance[options].apply(instance, args);
        if ((methodValue != null) && methodValue !== instance) {
          returnValue = (methodValue && methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue);
          return false;
        }
      } else {
        if (instance) {
          return instance._option(options || {});
        } else {
          return $.data(this, 'attest', new attest(this, options));
        }
      }
    });
    return returnValue;
  };
}).call(this);
