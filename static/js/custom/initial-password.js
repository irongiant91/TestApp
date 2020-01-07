(function (window) {

  $.validator.addMethod("regex", function(value, element, regexpr) {
    return regexpr.test(value);
  });

  $("#intialResetPassword").validate({
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
      newpassword: {
        required: true,
        minlength: 8
      },
      confirmpassword: {
        required: true,
        minlength: 8,
        equalTo: "#newPassword"
      }
    },
    messages: {          
      newpassword: {
        required:"Please enter new password",
      },
      confirmpassword: {
        required:"Please enter confirm password",
      }
    },
    submitHandler: function() { 
      $('#errorWrp').addClass('d-none');
      NOVA.intialResetPassword();
    }
  });

  NOVA.intialResetPassword = function(){
    var docUrlArr = document.URL.split('/')
    var token = docUrlArr[docUrlArr.length - 1];
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('password', $('#newPassword').val());
    formdata.append('confirm_password', $('#confirmpassword').val());
    formdata.append('token', token);
    $.ajax({
      method: 'POST',
      url: '/api/admin/initial/password/reset',
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
        window.location = '/login/';
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
      NOVA.getAppLogo();
      NOVA.hideLoading();
    }
  }

  document.onreadystatechange = init;