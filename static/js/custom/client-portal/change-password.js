(function (window) {  
  var changePswdValidator = $("#changePswd").validate({
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
      newpswd: {
        required: true,
        minlength: 8
      },
      confirmPswd: {
        required: true,
        minlength: 8,
        equalTo: "#newpswd",
      },
    },
    messages: {
      newpswd: {
        required: "Please enter new password",
      },
      confirmPswd: {
        required: "Please enter confirm password",
        equalTo: "Please enter same as user password",
      }
    },
    submitHandler: function() {
      NOVA.resetPasswordClient();
    }
  });

  NOVA.resetPasswordClient = function(){
    var docUrlArr = document.URL.split('/')
    var token = docUrlArr[docUrlArr.length - 1];
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('new_password', $('#newpswd').val());
    formdata.append('confirm_password', $('#confirmPswd').val());
    formdata.append('token', token);
    $.ajax({
      method: 'POST',
      url: '/api/clientportal/client/password/reset',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $('#errorMessage').addClass('d-none');
      $('#passwordChangeModal').modal('show');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').removeClass('d-none').text(jQuery.parseJSON(jqXHR.responseText))
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