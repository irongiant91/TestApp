(function (window) {

  $.validator.addMethod("emailRegex", function(value, element) {
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test( value );
  });

  var forgotPaswdValidator = $("#forgotPaswd").validate({
    errorElement: 'span',
    errorClass: 'error text-danger',
    errorPlacement: function(error, element) {
      if (element.parent().hasClass("input-group")) {
        error.appendTo( element.parent().parent());
      } else if (element.parent().hasClass("custom-radio")) {
        error.appendTo( element.parent().parent().parent());
      } else {
        error.appendTo( element.parent());
      }
    },
    rules: {
      email: {
        required: true,
        // emailRegex: true,
      },
    },
    messages: {
      email: {
        required: "Please enter email",
        // emailRegex: "Please enter valid email",
      },
    },
    submitHandler: function() {
      NOVA.forgotPasswordClient();
    }
  });

  NOVA.forgotPasswordClient = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('email', $('#resetPaswd').val());
    $.ajax({
      method: 'POST',
      url: '/api/clientportal/client/forgot/password',
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
      $('#errorWrp').removeClass('d-none').text(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

})(this);

function init() {
  if (document.readyState == "interactive") {
    ko.applyBindings(NOVA);
    NOVA.hideLoading();
  }
}
document.onreadystatechange = init;