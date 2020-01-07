(function (window) {
  // NOVA = {}
  NOVA.password_visible = ko.observable(false);

  NOVA.email = ko.observable("");
  NOVA.password = ko.observable("");

  NOVA.toggleVisibility = function(){
    NOVA.password_visible(!NOVA.password_visible());
  }

  NOVA.initValidation = function(){
    $("#adminLogin").validate({
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
        userName: "required",
        userPassword: {
          required: true,
          minlength: 8
        },
      },
      messages: {
        userName: "Please enter user name",
        userPassword: {
          required: "Please enter your password",
          minlength: "Minimum 8 characters required"
        },
      },
      submitHandler: function() {
        $('#errorWrp').addClass('d-none');
        NOVA.authenticateUser();
      }
    });
  }

  NOVA.authenticateUser = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();

    formdata.append('userName', NOVA.email());
    formdata.append('userPassword', NOVA.password());
    $.ajax({
      method: 'POST',
        url: '/api/admin/login',
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
      // location.reload();
      if(d.result == true){
        // window.location =$('#redirectUrl').val();
        window.location = '/home/';
      }
      else{
        $('#errorWrp').removeClass('d-none').text(d.msg)
      }
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
      $('.loader').hide()
      NOVA.initValidation();
      NOVA.getAppLogo();
      ko.applyBindings(NOVA);
    }
  }

document.onreadystatechange = init;