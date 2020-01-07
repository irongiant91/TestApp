(function (window) {
  NOVA.username = ko.observable("");
  NOVA.password = ko.observable("");

  var clientLoginValidator = $("#clientLogin").validate({
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
    },
    messages: {
      userName: {
        required: "Please enter user name"
      },
      userPassword : {
        required: "Please enter user password",
      },
    },
    submitHandler: function() {
      NOVA.clientLogin();
    }
  });

  NOVA.clientLogin = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();

    formdata.append('userName', NOVA.username());
    formdata.append('userPassword', NOVA.password());
    $.ajax({
      method: 'POST',
        url: '/api/clientportal/client/login',
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
      if(d.result == true){
        window.location = '/client-portal/contracts';
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
      ko.applyBindings(NOVA);
    }
  }

document.onreadystatechange = init;