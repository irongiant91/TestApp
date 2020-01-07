(function (window) {

  $.validator.addMethod("regex", function(value, element, regexpr) {
    return regexpr.test(value);
  });

  $("#resetPassword").validate({
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
      resetPaswd: {
        required: true,
        // regex: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      },
    },
    messages: {          
      resetPaswd: {
       required:"Please enter username",
        // regex: "Please enter a valid email address"
      },
    },
    submitHandler: function() {
      $('#errorWrp').addClass('d-none');
      NOVA.forgotPassword();
    }
  });

  NOVA.forgotPassword = function(){
    if($("#resetPassword").valid()){
      var csrftoken = NOVA.getCookie('csrftoken');
      var formdata = new FormData();
      formdata.append('email', $('#resetPaswd').val());
      $.ajax({
        method: 'POST',
        url: '/api/admin/forgot/password',
        data: formdata,
        contentType: false,
        processData: false,
        beforeSend: function(xhr, settings) {
           NOVA.showLoading();
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      })
      .done( function (d, textStatus, jqXHR) {
        $('#errorWrp').addClass('d-none');
        $('#resetPaswd').val('');
        NOVA.showErrorModal(d);
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        $('#errorWrp').removeClass('d-none').text(jQuery.parseJSON(jqXHR.responseText));
      })
      .always(function(){
        NOVA.hideLoading();
      })
    }
  }
})(this);

  function init() {
    if (document.readyState == "interactive") {
      ko.applyBindings(NOVA);
      NOVA.getAppLogo();
      NOVA.hideLoading();
    }
  }

  document.onreadystatechange = init;