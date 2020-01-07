(function (window) {

  NOVA.profileImageVisibility = ko.observable(true);
  NOVA.isDisabled = ko.observable(true);
  NOVA.user_id = ko.observable('');
  NOVA.name = ko.observable('');
  NOVA.username = ko.observable('');
  NOVA.email = ko.observable('');
  NOVA.phone = ko.observable('');
  NOVA.employeeNumber = ko.observable('');
  NOVA.designation = ko.observable('');
  NOVA.selectedRole = ko.observable('');
  NOVA.selectedAttr = ko.observable('');
  NOVA.attributes = ko.observableArray([]);
  NOVA.roleList = ko.observableArray([]);
  NOVA.attrList = ko.observableArray([]);
  NOVA.image = ko.observable('');
  NOVA.newPassword = ko.observable('');
  NOVA.confirmPassword = ko.observable('');
  NOVA.isDriver = ko.observable('');
  NOVA.allowAttendence = ko.observable('');
  $.validator.addMethod("emailRegex", function(value, element) {
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test( value );
  });

  $.validator.addMethod("phoneRegex", function(value, element) {
    return /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/.test( value );
  });

  $.validator.addMethod("alphaNumeric", function(value, element) {
    return /^\w+$/.test( value );
  });

  $('#attributeSelector').select2({
      width: '100%',
      tags: true,
      placeholder: ''
    });

  var createUserFormValidator = $("#userDetilForm").validate({
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
      name: {
        required: true
      },
      userName: {
        required: true
      },
      email: {
        required: true,
        emailRegex: true
      },
      phone: {
        required: true,
        phoneRegex: true,
        minlength: 6
      },
      employeeNumber: {
        required: true,
        alphaNumeric: true
      },
      designation: {
        required: true
      },
      role: {
        required: true
      },
      newPswd: {
        // required: true,
        minlength: 8,
      },
      confirmPswd: {
        // required: true,
        minlength: 8,
        equalTo: "#newPswd"
      }
    },
    messages: {
      name: {
        required: "Please enter your name"
      },
      userName: {
        required: "Please enter your username"
      },
      email: {
        required: "Please enter your email",
        emailRegex: "Please enter a valid email"
      },
      phone: {
        required: "Please enter your phone number",
        phoneRegex: "Please enter a valid phone number",
        minlength: "Please enter a minimum of 6 digits",
      },
      employeeNumber: {
        required: "Please enter your employee number",
        alphaNumeric: "Please enter a valid employee number"
      },
      designation: {
        required: "Please enter your designation"
      },
      role: {
        required: "Please enter your role"
      }
    },
    submitHandler: function() {
      NOVA.updateUser();
    }
  });

  NOVA.editUser = function(e){
    NOVA.profileImageVisibility(false);
    $('.edit-user-btn').addClass( 'd-none' );
    $('.create-user-btn').removeClass('d-none');
    $('.detail-view .form-control').prop('disabled', false);
    $('#attributeSelector').prop('disabled', false);
    $('#user-role').prop('disabled', false);
  }

  NOVA.afterEdit = function(){
    NOVA.profileImageVisibility(true);
    $('.edit-user-btn').removeClass( 'd-none' );
    $('.create-user-btn').addClass('d-none');
    $('.detail-view .form-control').prop('disabled', true);
    $('#attributeSelector').prop('disabled', true);
    $('#user-role').prop('disabled', true);
  }
  

  NOVA.getExtension = function(file) {
    var filename = file.name
    pos = filename.lastIndexOf(".");
    if (filename === "" || pos < 1)
      return "";
    return filename.slice(pos + 1);
  }

  NOVA.isImage = function(file) {
    var ext = NOVA.getExtension(file);
    switch (ext.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
    case 'png':
      return true;
    }
    return false;
  }

  NOVA.fileReadProfileImage = function(data, event) {
    if (event.target.files && event.target.files[0]) {

      if (NOVA.isImage(event.target.files[0])){
        var reader = new FileReader();

        reader.onload = function(e) {

          
          $('#detailProfileImagePreview').attr('src', e.target.result);
          NOVA.profileImageVisibility(true);
          $('.clear-image-icon').removeClass('d-none');

          $('#detailProfileImagePreview').cropper({
            aspectRatio: 1,
            dragMode: 'move',
            viewMode: 1,
            minContainerWidth: 224,
            autoCropArea: 1,
            crop: function(event) {

            }
          });
        }

        reader.readAsDataURL(event.target.files[0]);
      }

    }
  }

  NOVA.clearProfileImagePreview = function(e){
    $('#detailProfileImagePreview').cropper('destroy').removeAttr('src');
    NOVA.profileImageVisibility(false);
  }

  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    var blob = new Blob([ab], {type: mimeString});
    return blob;
  }

  // $('#errorModal').on('hidden.bs.modal', function (e) {
  //   window.location = '/admin/users/';
  // });

  NOVA.getUserDetails = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/user/details/get',
      data:{'user_id': NOVA.user_id()},
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.name(d.name);
      NOVA.username(d.username);
      NOVA.email(d.email);
      NOVA.phone(d.phone);
      NOVA.employeeNumber(d.employee_number);
      NOVA.designation(d.designation);
      NOVA.selectedRole(d.userrole);
      NOVA.selectedAttr(d.attributes);
      NOVA.image(d.image);
      NOVA.isDriver(d.is_driver);
      NOVA.allowAttendence(d.allow_attendence);
      $('#user-role').val(d.userrole).trigger('change');
      $('#attributeSelector').val(d.attributes).trigger('change');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      if(jqXHR.responseJSON == "Invalid User"){
        location.href = '/admin/users/';
      } else {
        $('#errorMessage').text(jqXHR.responseJSON);
        $('.error-modal').modal('show');
      }
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.getRoles = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/roles/get',
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.roleList([]);
      for(var i = 0; i < d.length; i++) {
        NOVA.roleList.push(d[i]);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.getAttributes = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/attributes/get',
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.attrList([]);
      for(var i = 0; i < d.length; i++) {
        NOVA.attrList.push(d[i]);
      }
      NOVA.getUserDetails();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.deleteUser = function() {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();

    formdata.append('user_id', NOVA.user_id());

    $.ajax({
      method: 'POST',
      url: '/api/admin/user/delete',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d);
      window.location = '/admin/users/';
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.updateUser = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    if(NOVA.newPassword() != NOVA.confirmPassword()) {
      $('#errorMessage').text("Password doesn't match");
      $('.error-modal').modal('show')
    }
    formdata.append('user_id', NOVA.user_id());
    formdata.append('name', NOVA.name());
    formdata.append('username', NOVA.username());
    formdata.append('email', NOVA.email());
    formdata.append('phone', NOVA.phone());
    formdata.append('employee_number', NOVA.employeeNumber());
    formdata.append('designation', NOVA.designation());
    formdata.append('role_id', NOVA.selectedRole());
    formdata.append('attributes', NOVA.selectedAttr());
    formdata.append('new_password', NOVA.newPassword());
    formdata.append('confirm_password', NOVA.confirmPassword());
    formdata.append('is_driver', NOVA.isDriver());
    formdata.append('allow_attendence', NOVA.allowAttendence());

    if(NOVA.profileImageVisibility()) {
      cropper1 = $('#detailProfileImagePreview').cropper('getCroppedCanvas')
      if (!cropper1){
        return;
      }
      var uriOut1 = cropper1.toDataURL('image/jpeg');
      var blobIMG1 = dataURItoBlob(uriOut1);
      formdata.append('image', blobIMG1);
    }

    $.ajax({
      method: 'POST',
      url: '/api/admin/user/edit',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d);
      NOVA.afterEdit();
      // if(NOVA.profileImageVisibility()){
      //   $('#detailProfileImagePreview').cropper('destroy').removeAttr('src');
      //   NOVA.profileImageVisibility(false);
      // }
      NOVA.newPassword('');
      NOVA.confirmPassword('');
      NOVA.getUserDetails();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  $('#navItemAdmin').addClass('active');

})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    ko.applyBindings(NOVA);
    var docUrlArr = document.URL.split('/');
    var user_id = docUrlArr[docUrlArr.length - 1];
    NOVA.user_id(user_id);
    NOVA.getRoles();
    NOVA.getAttributes();
  }
}
document.onreadystatechange = init;