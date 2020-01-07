(function (window) {
  

  NOVA.openSidebarRight = function(){
    createvehiclePropertyFormValidator.resetForm()
    $("body").addClass("sidebar-right-open")
  }

  NOVA.closeSidebarRight = function(){
    createvehiclePropertyFormValidator.resetForm()
    $("body").removeClass("sidebar-right-open")
  }  

  NOVA.init = function(){
    $('#driverPropertyReqirement').select2({
      width: '100%',
      tags: true,
      placeholder: '',
      dropdownPosition: 'above'
    });

    jQuery.validator.addMethod("dollarsscents", function (value, element) {
      return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
    }, "Maximum 8 digit and 2 decimal place ");

    createvehiclePropertyFormValidator = $("#createvehiclePropertyForm").validate({
      errorElement: 'span',
      errorClass: 'error text-danger',
      errorPlacement: function(error, element) {
        if (element.parent().hasClass("input-group")) {
          error.appendTo( element.parent().parent());
        } else {
          error.appendTo( element.parent());
        }
      },
      rules: {
        tonnage: {
          number: true
        },
        cubicMeter: {
          number: true
        },
        pallets: {
          number: true
        },
        carton: {
          number: true
        },
      },
      messages: {
        propertyName: {
          required: "Please enter property name"
        },
        serviceFee: {
          number: "Please enter valid number"
        }
      },
      submitHandler: function() {
      }
    });
  }

})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    NOVA.init();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;