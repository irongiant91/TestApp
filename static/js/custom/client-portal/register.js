(function (window) {
  NOVA.secret_key = ko.observable('');

  var clientRegisterValidator = $("#clientRegister").validate({
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
      userName: {
        required: true
      },
      userPassword : {
        required: true,
        minlength: 8,
      },
      confirmPassword: {
        required: true,
        minlength: 8,
        equalTo: "#userPswd",
      },
    },
    messages: {
      userName: {
        required: "Please enter user name"
      },
      userPassword : {
        required: "Please enter user password",
      },
      confirmPassword: {
        required: "Please enter confirm password",
        equalTo: "Please enter same as user password"            
      },
    },
    submitHandler: function() {
      NOVA.clientSignup();
    }
  });

  NOVA.clientSignup = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('username', $('#inputUserName').val());
    formdata.append('password', $('#userPswd').val());
    formdata.append('confirm_password', $('#confirmPswd').val());
    formdata.append('secret_key', NOVA.secret_key());
    $.ajax({
      method: 'POST',
        url: '/api/clientportal/client/signup',
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
      if(d.result == true)
        window.location = '/client-portal/contracts';
      else
        $('#errorWrp').removeClass('d-none').text(d.msg)
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorWrp').removeClass('d-none').text(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

})(this);
function init() {
  if (document.readyState == "interactive") {
    var docUrlArr = document.URL.split('/');
    var secret_key = docUrlArr[docUrlArr.length - 1];
    NOVA.secret_key(secret_key);
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;