class attest
  defaults:
    nodes: 'input, select, textarea'
    ignored: '[type=submit], [type=image], [type=button], [type=reset], [type=hidden]'
    submit: '[type=submit]'
    validClass: 'valid'
    errorClass: 'error'
    requiredClass: 'required'
    modifiers: 'i'
    patterns:
      email: /^[a-z0-9_.%+\-]+@[0-9a-z.\-]+\.[a-z.]{2,6}$/i
      url: /[a-z][\-\.+a-z]*:\/\//i
      number: /^\d+$/
  
  constructor: (form, options) ->
    @form = $(form)
    @options = $.extend true, {}, @defaults, options
    @fields = @form.find(@options.nodes).not(@options.ignored)
    @submit = @form.find(@options.submit)
    @_bindings()
    
  _bindings: ->
    @fields.each (idx, el) =>
      $(el).bind 'blur keyup keydown', (e) =>
        el = $(e.target)
        invalid = @_isRequired(el) or @_isValid(el) or @validate().length > 0
        @submit.attr 'disabled', if invalid then 'disabled' else null
          
  _isRequired: (el) ->
    required = el.attr('required')
    val = el.val()
    if required and (!val? or val.length == 0)
      el.addClass @options.requiredClass
      return true
    else
      el.removeClass @options.requiredClass
    null
    
  _isValid: (el) ->
    if el.data('match')
      match = @form.find el.data('match')
      if match? and $(match).val() != el.val()
        el.addClass(@options.errorClass)
        return true
      else
        el.removeClass(@options.errorClass)
    pattern = if el.attr('pattern')
      new RegExp el.attr('pattern'), @options.modifiers
    else if @options.patterns[el.attr('type')]
      new RegExp @options.patterns[el.attr('type')]
    if pattern
      if pattern.test(el.val())
        el.removeClass(@options.errorClass)
      else
        el.addClass(@options.errorClass)
        return true
    null
    
  validate: ->
    @fields.map (idx, field) =>
      el = $(field)
      invalid = @_isRequired(el) or @_isValid(el)
      if invalid then field else null

jQuery.fn.attest = (options) ->
  isMethodCall = typeof options == "string"
  args = Array.prototype.slice.call arguments, 1
  returnValue = this
  
  this.each ->
    if isMethodCall
      instance = $.data this, 'attest'
      return $.error "cannot call methods on attest prior to initialization; attempted to call method '#{options}'" if !instance
      return $.error "no such method '#{options}' for attest instance" if !$.isFunction(instance[options]) || options.charAt(0) == "_"
      methodValue = instance[options].apply instance, args
      if methodValue? and methodValue != instance
        returnValue = (if methodValue and methodValue.jquery
        then returnValue.pushStack methodValue.get()
        else methodValue)
        return false
    else
	    $.data this, 'attest', new attest(this, options)
  returnValue