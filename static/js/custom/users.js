(function (window) {

  NOVA.profileImageVisibility = ko.observable(false);

  $.validator.addMethod("emailRegex", function(value, element) {
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test( value );
  });

  $.validator.addMethod("phoneRegex", function(value, element) {
    return /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/.test( value );
  });

  $.validator.addMethod("alphaNumeric", function(value, element) {
    return /^\w+$/.test( value );
  });


  var createUserFormValidator

  NOVA.openSidebarRight = function(){
    createUserFormValidator.resetForm()
    $("body").addClass("sidebar-right-open")
  }

  NOVA.closeSidebarRight = function(){
    createUserFormValidator.resetForm()
    $("body").removeClass("sidebar-right-open")
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

          NOVA.profileImageVisibility(true);
          $('#profileImagePreview').attr('src', e.target.result);

          $('#profileImagePreview').cropper({
            aspectRatio: 1,
            dragMode: 'move',
            viewMode: 1,
            crop: function(event) {

            }
          });
        }

        reader.readAsDataURL(event.target.files[0]);
      }

    }
  }

  NOVA.clearProfileImagePreview = function(){
    $('#profileImagePreview').cropper('destroy').removeAttr('src');
    NOVA.profileImageVisibility(false);
  }

  NOVA.init = function(){
    $('#attributeSelector').select2({
      width: '100%',
      tags: true,
      placeholder: ''
    });

    createUserFormValidator = $("#createUserForm").validate({
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
        NOVA.closeSidebarRight()
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