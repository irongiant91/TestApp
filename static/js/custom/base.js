(function (window) {
  NOVA = {};
  NOVA.app_logo = ko.observable('');

  NOVA.showError = function(){
    NOVA.showErrorModal('Feature not implemented');
  };

  NOVA.showLoading = function(){
    $(".loader").show();
    $(".no-data").removeClass('active');
  };

  NOVA.hideLoading = function(){
    $(".loader").hide();
    $(".no-data").addClass('active');
  };

  NOVA.showErrorModal = function(msg){
    $("#errorModal").modal('show');
    $("#errorMessage").text(msg);
  };

  var toastTimer
  NOVA.showToast = function( msg ){
    if ( $("#customToast").hasClass('visible') ) {
      $("#customToast").text(msg);
      window.clearTimeout(toastTimer)
      toastTimer = window.setTimeout(function(){
        $("#customToast").removeClass('visible')
      }, 3000)
    } else {
      $("#customToast").text(msg).addClass('visible')
      toastTimer = window.setTimeout(function(){
        $("#customToast").removeClass('visible')
      }, 3000)
    }
    
  };

  NOVA.showErrorToast = function(data, e){
    e.stopPropagation()
    NOVA.showToast("Feature not implemented")
  }

  $(document).on("hidden.bs.modal", function (e) { 
    if ($('.modal:visible').length) { 
      $('body').addClass('modal-open');
    }
  });

  $(document).on("keypress", "input.form-control, textarea.form-control", function(e) {
    if (e.which === 32 && !this.value.length){
      e.preventDefault();
    }
  });

  $(document).on("click", ".filter-dropdown", function (e) { 
    e.stopPropagation();
  });


  NOVA.getCookie = function(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  ko.bindingHandlers.popover = {
    init: function (element, valueAccessor) {
      var local = ko.utils.unwrapObservable(valueAccessor()),
      options = {};

      ko.utils.extend(options, ko.bindingHandlers.popover.options);
      ko.utils.extend(options, local);

      $(element).popover(options);

      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        $(element).popover("dispose");
      });
    },
    options: {
      placement: "top",
      trigger: "hover"
    }
  };

  ko.bindingHandlers.select2 = {
    init: function(el, valueAccessor, allBindingsAccessor, viewModel) {
      ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
        $(el).select2('destroy');
      });

      var allBindings = allBindingsAccessor(),
          select2 = ko.utils.unwrapObservable(allBindings.select2);

      $(el).select2(select2);
    },
    update: function (el, valueAccessor, allBindingsAccessor, viewModel) {
        var allBindings = allBindingsAccessor().select2;

        if ("value" in allBindings) {

            if ((allBindings.multiple || el.multiple) && allBindings.value().constructor != Array) {                
                $(el).val(allBindings.value().split(',')).trigger('change');
            }
            else {
                $(el).val(allBindings.value()).trigger('change');
            }

            // if ((allBindings.select2.multiple || el.multiple)) {                
            //   $(el).val(allBindings.value()).trigger('change');
            // }
            // else {
            //   $(el).val(allBindings.value()).trigger('change');
            // }
        } else if ("selectedOptions" in allBindings) {
            var converted = [];
            var textAccessor = function(value) { return value; };
            if ("optionsText" in allBindings) {
                textAccessor = function(value) {
                    var valueAccessor = function (item) { return item; }
                    if ("optionsValue" in allBindings) {
                        valueAccessor = function (item) { return item[allBindings.optionsValue]; }
                    }
                    var items = $.grep(allBindings.options(), function (e) { return valueAccessor(e) == value});
                    if (items.length == 0 || items.length > 1) {
                        return "UNKNOWN";
                    }
                    return items[0][allBindings.optionsText];
                }
            }
            $.each(allBindings.selectedOptions(), function (key, value) {
                converted.push({id: value, text: textAccessor(value)});
            });
            $(el).select2("data", converted);
        }
        $(el).trigger("change");
    }
  };

  NOVA.getAppLogo = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/app/logo/get',
      beforeSend: function(xhr, settings) {
        // NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.app_logo(d)
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      // NOVA.hideLoading();
    })
  };

  
})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;