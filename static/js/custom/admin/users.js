(function (window) {

  NOVA.name = ko.observable('');
  NOVA.username = ko.observable('');
  NOVA.email = ko.observable('');
  NOVA.phone = ko.observable('');
  NOVA.user_id = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.employeeNumber = ko.observable('');
  NOVA.designation = ko.observable('');
  NOVA.selectedRole = ko.observable('');
  NOVA.selectedAttr = ko.observable('');
  NOVA.attrList = ko.observableArray([]);
  NOVA.roleList = ko.observableArray([]);
  NOVA.userList = ko.observableArray([]);
  NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.pages_list = ko.observableArray([]);
  NOVA.isDriver = ko.observable(false);
  NOVA.allowAttendence = ko.observable(false);

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
    createUserFormValidator.resetForm();
    $('#isdriver').prop('checked', false);
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
            viewMode: 2,
            minContainerWidth: 96,
            autoCropArea: 1,
            crop: function(event) {

            }
          });
        }

        reader.readAsDataURL(event.target.files[0]);
      }

    }
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


    jQuery.validator.addMethod("noSPace", function(value, element) {
        return this.optional(element) || /^[a-z,0-9]/i.test(value);
    }, "First space is not allowed");

    $.validator.addMethod(
      "regex",
      function(value, element, regexp) {
        var check = false;
        return this.optional(element) || regexp.test(value);
      },
      "Please provide a valid username."
    );

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
          required: true,
          noSPace: true
        },
        userName: {
          required: true,
          regex: /^[a-zA-Z0-9]+$/,
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
        NOVA.createUser();
      }
    });
  }

  NOVA.resetUserCreateForm = function() {
    NOVA.closeSidebarRight();
    $('#profileImagePreview').cropper('destroy').removeAttr('src');
    $('#attributeSelector').val('').trigger('change');
    NOVA.profileImageVisibility(false);
    NOVA.selectedAttr('');
    $('#createUserForm').each(function(){
      this.reset();
    });
  }

  NOVA.createUser = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    console.log(NOVA.isDriver())
    formdata.append('name', NOVA.name());
    formdata.append('username', NOVA.username());
    formdata.append('email', NOVA.email());
    formdata.append('phone', NOVA.phone());
    formdata.append('employee_number', NOVA.employeeNumber());
    formdata.append('designation', NOVA.designation());
    formdata.append('role_id', NOVA.selectedRole());
    formdata.append('attributes', NOVA.selectedAttr());
    formdata.append('is_driver', NOVA.isDriver());
    formdata.append('allow_attendence', NOVA.allowAttendence());

    if(NOVA.profileImageVisibility()) {
      cropper1 = $('#profileImagePreview').cropper('getCroppedCanvas')
      if (!cropper1){
        return;
      }
      var uriOut1 = cropper1.toDataURL('image/jpeg');
      var blobIMG1 = dataURItoBlob(uriOut1);
      formdata.append('image', blobIMG1);
    }

    $.ajax({
      method: 'POST',
      url: '/api/admin/user/create',
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
      NOVA.resetUserCreateForm();
      NOVA.getUsers();
      NOVA.getAttributes();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.closeSidebarRight();
      $('#errorMessage').text(jqXHR.responseJSON);
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
      $('#attributeSelector').trigger("change")
      console.log(NOVA.attrList());
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
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
      console.log(NOVA.roleList());
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.search = function() {
    NOVA.current_page(1);
    NOVA.getUsers();
  }

  NOVA.getUsers = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/users/get',
      data:{'search_term':$('#search-input').val(),'page_number': NOVA.current_page()},
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.userList([]);
      for(var i = 0; i < d.data.length; i++) {
        NOVA.userList.push(d.data[i]);
      }
      NOVA.page_count(d.page_count);
      NOVA.refreshPagination();
      NOVA.pageSearch('')
      if(d.fr_running_status == true){
        $("#imageTraining").attr("disabled", true);
      }else{
        $("#imageTraining").attr("disabled", false);
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

  NOVA.changeStatus = function(data) {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    
    formdata.append('user_id', data.id);
    formdata.append('status', data.status);

    $.ajax({
      method: 'POST',
      url: '/api/admin/user/status/change',
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
      NOVA.getUsers();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

   NOVA.deleteUser = function(data) {
    console.log(data)
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
      $("#confirmModal").modal('hide')
      NOVA.showToast(d)
      NOVA.getUsers();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      $("#confirmModal").modal('hide')
      NOVA.hideLoading();
    })
  }

  NOVA.getDetails = function(data) {
    location.href = '/admin/user/detail/'+data.id;
  }

  NOVA.refreshPagination = function(){
    var max = NOVA.current_page() + 2;
    if(max > NOVA.page_count())
      max = NOVA.page_count();
    var min = max - 2;
    if(min < 1)
      min = 1;
    NOVA.pages_list([]);
    for(i=min;i<=max;i++){
      NOVA.pages_list.push(i);
    }
    console.log(NOVA.pages_list())
  };

  NOVA.getPrevPage = function(){
    if(NOVA.current_page() != 1){
      NOVA.current_page(NOVA.current_page() - 1);
      NOVA.getUsers();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getUsers();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getUsers();
  };

  NOVA.getFirstPage = function(){
    NOVA.current_page(1);
    NOVA.getUsers();
  }
  NOVA.getLastPage = function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getUsers();
  }

  NOVA.pageSearchGo = function(data, e){
    if (NOVA.pageSearch() > NOVA.page_count()){
      NOVA.current_page(NOVA.page_count());
      NOVA.pageSearch(NOVA.page_count());
    }else{
      if (NOVA.pageSearch() != ''){
        NOVA.current_page(NOVA.pageSearch());
      }
    }
    NOVA.getUsers();
  }

  NOVA.confirmdelete = function(data){
    $("#confirmModal").modal('show')
    NOVA.user_id(data.id)
  }
  
  $('#navItemAdmin').addClass('active');

  NOVA.imageTrain = function(data) {
    $("#imageTraining").attr("disabled", true);
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    $.ajax({
      method: 'POST',
      url: '/api/admin/images/train',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
      // NOVA.showLoading();
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      // NOVA.hideLoading();
    })
  }

})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.init();
    NOVA.getAppLogo();
    ko.applyBindings(NOVA);
    NOVA.getAttributes();
    NOVA.getRoles();
    NOVA.getUsers();
  }
}
document.onreadystatechange = init;