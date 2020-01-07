(function (window) {

	NOVA.permissionsList = ko.observableArray([]);
  NOVA.role_permissions = ko.observableArray([]);
  NOVA.selected_permissions = ko.observableArray([]);
  NOVA.save_enable = ko.observable(false);
  NOVA.role_id = ko.observable('');

  $("#createRole").validate({
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
        roleName: {
          required: true
        },
        roleDescription: {
          required: true
        },
      },
      messages: {
        roleName: {
          required: "Please enter role name",
        },
        roleDescription: {
          required: "Please enter role description"
        }
      },      
      submitHandler: function() {
        if(NOVA.save_enable()){
          NOVA.editRole();
        }
      }
    });

    NOVA.permissionClick = function(data,e){
    var dataId = $(e.target).attr('data-id');
    // alert(dataId)
    if( $(e.target).prop( 'checked' ) ){
      if( $(e.target).siblings('label').text().toLowerCase().indexOf('create') !== -1 || $(e.target).siblings('label').text().toLowerCase().indexOf('manage') !== -1 || $(e.target).siblings('label').text().toLowerCase().indexOf('approve') !== -1 ){

        var initialWord = $(e.target).siblings('label').text().toLowerCase();
        var initialLastWord = initialWord.split(" ").splice(-1)[0];

        $(e.target).parent().parent().find(".form-check").each(function(i, el){
          var selectedWord = $(el).find('label').text().toLowerCase();
          var selectedLastWord = selectedWord.split(" ").splice(-1)[0];

          if (selectedLastWord == initialLastWord){
            if( $(el).find('label').text().toLowerCase().indexOf('view') !== -1 ){
              $(el).find('.form-check-input').prop('checked', true);
            }
          }
        })
      }

      if (dataId == "Lead-Create Requirement Gathering"){
        $("[data-id='Lead-View Requirement Gathering']").prop("checked", true);
      }

      if (dataId == "Lead-Configure revenue"){
        $("[data-id='Lead-View configured revenue']").prop("checked", true);
      }

      if (dataId == "Lead-Configure expense"){
        $("[data-id='Lead-View configured expense']").prop("checked", true);
      }

      if (dataId == "Lead-Manage Lead"){
        $("[data-id='Lead-View Lead']").prop("checked", true);
      }

      if (dataId == "Admin-Manage Role"){
        $("[data-id='Admin-View Role List']").prop("checked", true);
      }

      if (dataId == "Admin-Manage User"){
        $("[data-id='Admin-View User List']").prop("checked", true);
      }

      if (dataId == "Admin-Manage Lead Channel"){
        $("[data-id='Admin-View Channel List']").prop("checked", true);
      }

      if (dataId == "Admin-Manage Vehicle Type"){
        $("[data-id='Admin-View Vehicle Type List']").prop("checked", true);
      }

      if (dataId == "Admin-Manage Vehicle Feature Type"){
        $("[data-id='Admin-View Vehicle Feature List']").prop("checked", true);
      }

      if (dataId == "Admin-Manage Contract Based Services"){
        $("[data-id='Admin-View Contract Based Service List']").prop("checked", true);
      }

      if (dataId == "Admin-Manage Cost Bearing Item"){
        $("[data-id='Admin-View Cost Bearing Item List']").prop("checked", true);
      }

      if (dataId == "Admin-Manage Job Type"){
        $("[data-id='Admin-View Job Type List']").prop("checked", true);
      }

      if (dataId == "Admin-Role create"){
        $("[data-id='Admin-View Role List']").prop("checked", true);
      }

      if (dataId == "Admin-User Create"){
        $("[data-id='Admin-View User List']").prop("checked", true);
      }

      if (dataId == "Admin-Lead Channel Create"){
        $("[data-id='Admin-View Channel List']").prop("checked", true);
      }

      if (dataId == "Admin-Vehicle Type Create"){
        $("[data-id='Admin-View Vehicle Type List']").prop("checked", true);
      }

      if (dataId == "Admin-Vehicle Feature Type Create"){
        $("[data-id='Admin-View Vehicle Feature List']").prop("checked", true);
      }

      if (dataId == "Admin-Contract Based Services Create"){
        $("[data-id='Admin-View Contract Based Service List']").prop("checked", true);
      }

      if (dataId == "Admin-Cost Bearing Item Create"){
        $("[data-id='Admin-View Cost Bearing Item List']").prop("checked", true);
      }

      if (dataId == "Admin-Job Type Create"){
        $("[data-id='Admin-View Job Type List']").prop("checked", true);
      }

      if (dataId == "Admin-Manage Workflow"){
        $("[data-id='Admin-View Workflow List']").prop("checked", true);
      }

      if (dataId == "Admin-Workflow Create"){
        $("[data-id='Admin-View Workflow List']").prop("checked", true);
      }

      if (dataId == "Transport-Manage order"){
        $("[data-id='Transport-View orders']").prop("checked", true);
      }


      if (dataId == "Transport-Create order"){
        $("[data-id='Transport-View orders']").prop("checked", true);
      }

      if (dataId == "Transport-Create vehicle"){
        $("[data-id='Transport-View vehicle list']").prop("checked", true);
      }

      if (dataId == "Transport-Create vehicle"){
        $("[data-id='Transport-View vehicle list']").prop("checked", true);
      }

      if (dataId == "Transport-Manage vehicle"){
        $("[data-id='Transport-View vehicle list']").prop("checked", true);
      }

      if (dataId == "Transport-Manage client info"){
        $("[data-id='Transport-View client list']").prop("checked", true);
      }

      

      if (dataId == "Transport-Manage Document"){
        $("[data-id='Transport-View Documents']").prop("checked", true);
      }

      if (dataId == "Transport-Manage Job List"){
        $("[data-id='Transport-View Job List']").prop("checked", true);
      }

      if (dataId == "Transport-Manage Invoice"){
        $("[data-id='Transport-View Invoice']").prop("checked", true);
      }

      if (dataId == "Transport-Manage Contract"){
        $("[data-id='Transport-View Contract']").prop("checked", true);
        $("[data-id='Transport-View client list']").prop("checked", true);
      }

      if (dataId == "Transport-Publish"){
        $("[data-id='Transport-View Contract']").prop("checked", true);
      }

      if (dataId == "Transport-Export"){
        $("[data-id='Transport-View Stops']").prop("checked", true);
      }

      if (dataId == "Lead-Lead Create"){
        $("[data-id='Lead-View Lead']").prop("checked", true);
      }

      if (dataId == "Transport-Manage CN & DN"){
        $("[data-id='Transport-View CN & DN']").prop("checked", true);
      }

      if (dataId == "Transport-Create CN & DN"){
        $("[data-id='Transport-View CN & DN']").prop("checked", true);
      }

      if (dataId == "Transport-Manage finance"){
        $("[data-id='Transport-View finance']").prop("checked", true);
      }

      if (dataId == "Transport-Create finance"){
        $("[data-id='Transport-View finance']").prop("checked", true);
      }

      if (dataId == "Transport-Create incident"){
        $("[data-id='Transport-View incident list']").prop("checked", true);
      }

      if (dataId == "Transport-Manage incident"){
        $("[data-id='Transport-View incident list']").prop("checked", true);
      }

      if (dataId == "Transport-Create service record"){
        $("[data-id='Transport-View service record']").prop("checked", true);
      }

      if (dataId == "Transport-Manage service record"){
        $("[data-id='Transport-View service record']").prop("checked", true);
      }

      if (dataId == "Admin-Create serviceable item"){
        $("[data-id='Admin-View serviceable item list']").prop("checked", true);
      }

      if (dataId == "Admin-Manage serviceable item"){
        $("[data-id='Admin-View serviceable item list']").prop("checked", true);
      }

      if (dataId == "Admin-Create geofence"){
        $("[data-id='Admin-View geo fence list']").prop("checked", true);
      }

      if (dataId == "Admin-Manage geofence"){
        $("[data-id='Admin-View geo fence list']").prop("checked", true);
      }

      if (dataId == "Admin-Manage email config"){
        $("[data-id='Admin-View email config list']").prop("checked", true);
      }

      if (dataId == "Transport-Create Inspection"){
        $("[data-id='Transport-View configured inspection list']").prop("checked", true);
      }

      if (dataId == "Transport-Manage Inspection"){
        $("[data-id='Transport-View configured inspection list']").prop("checked", true);
      }

    } else {
      if( $(e.target).siblings('label').text().toLowerCase().indexOf('view') !== -1){
        $(e.target).parent().parent().find(".form-check").each(function(i, el){
          if( $(el).find('label').text().toLowerCase().indexOf('create') !== -1 || $(el).find('label').text().toLowerCase().indexOf('manage') !== -1 || $(el).find('label').text().toLowerCase().indexOf('approve') !== -1 ){
            if ($(el).find('.form-check-input').prop('checked')){
              $(e.target).prop('checked', true);
            }
          }
        })
      }

      
      if (dataId == "Lead-View Requirement Gathering"){
        $("[data-id='Lead-Create Requirement Gathering']").prop("checked", false);
      }

      if (dataId == "Lead-Configure revenue"){
        $("[data-id='Lead-View configured revenue']").prop("checked", false);
      }

      if (dataId == "Lead-Configure expense"){
        $("[data-id='Lead-View configured expense']").prop("checked", false);
      }

      // if (dataId == "Lead-Manage Lead"){
      //   $("[data-id='Lead-View Lead']").prop("checked", false);
      // }

      if (dataId == "Admin-Manage Role"){
        $("[data-id='Admin-View Role List']").prop("checked", false);
      }

      if (dataId == "Admin-Manage User"){
        $("[data-id='Admin-View User List']").prop("checked", false);
      }

      if (dataId == "Admin-Manage Lead Channel"){
        $("[data-id='Admin-View Channel List']").prop("checked", false);
      }

      if (dataId == "Admin-Manage Vehicle Type"){
        $("[data-id='Admin-View Vehicle Type List']").prop("checked", false);
      }

      if (dataId == "Admin-Manage Vehicle Feature Type"){
        $("[data-id='Admin-View Vehicle Feature List']").prop("checked", false);
      }

      // if (dataId == "Admin-Manage Contract Based Services"){
      //   $("[data-id='Admin-View Contract Based Service List']").prop("checked", false);
      // }

      // if (dataId == "Admin-Manage Cost Bearing Item"){
      //   $("[data-id='Admin-View Cost Bearing Item List']").prop("checked", false);
      // }

      // if (dataId == "Admin-Manage Job Type"){
      //   $("[data-id='Admin-View Job Type List']").prop("checked", false);
      // }

      if (dataId == "Admin-Role create"){
        $("[data-id='Admin-View Role List']").prop("checked", false);
      }

      if (dataId == "Admin-User Create"){
        $("[data-id='Admin-View User List']").prop("checked", false);
      }

       if (dataId == "Admin-Lead Channel Create"){
        $("[data-id='Admin-View Channel List']").prop("checked", false);
      }

      if (dataId == "Admin-Vehicle Type Create"){
        $("[data-id='Admin-View Vehicle Type List']").prop("checked", false);
      }

      if (dataId == "Admin-Vehicle Feature Type Create"){
        $("[data-id='Admin-View Vehicle Feature List']").prop("checked", false);
      }

      // if (dataId == "Admin-Contract Based Services Create"){
      //   $("[data-id='Admin-View Contract Based Service List']").prop("checked", false);
      // }

      // if (dataId == "Admin-Cost Bearing Item Create"){
      //   $("[data-id='Admin-View Cost Bearing Item List']").prop("checked", false);
      // }

      // if (dataId == "Admin-Job Type Create"){
      //   $("[data-id='Admin-View Job Type List']").prop("checked", false);
      // }

      // if (dataId == "Admin-Manage Workflow"){
      //   $("[data-id='Admin-View Workflow List']").prop("checked", false);
      // }

      // if (dataId == "Admin-Workflow Create"){
      //   $("[data-id='Admin-View Workflow List']").prop("checked", false);
      // }

      if (dataId == "Transport-Manage order"){
        $("[data-id='Transport-View orders']").prop("checked", false);
      }

      if (dataId == "Transport-View orders"){
        $("[data-id='Transport-Manage order']").prop("checked", false);
      }

      if (dataId == "Transport-Mobile-View Orders"){
        $("[data-id='Transport-Mobile-Manage Order']").prop("checked", false);
      }

      if (dataId == "Transport-Create order"){
        $("[data-id='Transport-View orders']").prop("checked", false);
      }

      if (dataId == "Transport-Create vehicle"){
        $("[data-id='Transport-View vehicle list']").prop("checked", false);
      }

      if (dataId == "Vehicle-Manage vehicle"){
        $("[data-id='Transport-View vehicle list']").prop("checked", false);
      }

      if (dataId == "Transport-Manage client info"){
        $("[data-id='Transport-View client list']").prop("checked", false);
      }

      if (dataId == "Transport-Manage contract"){
        $("[data-id='Transport-View client list']").prop("checked", false);
      }

      if (dataId == "Admin-View Role List"){
        $("[data-id='Admin-Manage Role']").prop("checked", false);
        $("[data-id='Admin-Role create']").prop("checked", false);

      }

      if (dataId == "Admin-View User List"){
        $("[data-id='Admin-Manage User']").prop("checked", false);
        $("[data-id='Admin-User Create']").prop("checked", false);
      }

      if (dataId == "Admin-View Channel List"){
        $("[data-id='Admin-Manage Lead Channel']").prop("checked", false);
        $("[data-id='Admin-Lead Channel Create']").prop("checked", false);

      }

      if (dataId == "Admin-View Vehicle Type List"){
        $("[data-id='Admin-Manage Vehicle Type']").prop("checked", false);
        $("[data-id='Admin-Vehicle Type Create']").prop("checked", false);
      }

      if (dataId == "Admin-View Vehicle Feature List"){
        $("[data-id='Admin-Manage Vehicle Feature Type']").prop("checked", false);
      }

      if (dataId == "Admin-View Workflow List"){
        $("[data-id='Admin-Manage Workflow']").prop("checked", false);
        $("[data-id='Admin-Workflow Create']").prop("checked", false);
      }

      if (dataId == "Admin-View Contract Based Service List"){
        $("[data-id='Admin-Manage Contract Based Services']").prop("checked", false);
        $("[data-id='Admin-Contract Based Services Create']").prop("checked", false);
      }

      if (dataId == "Admin-View Cost Bearing Item List"){
        $("[data-id='Admin-Manage Cost Bearing Item']").prop("checked", false);
        $("[data-id='Admin-Cost Bearing Item Create']").prop("checked", false);
      }

      if (dataId == "Admin-View Job Type List"){
        $("[data-id='Admin-Manage Job Type']").prop("checked", false);
        $("[data-id='Admin-Job Type Create']").prop("checked", false);
      }

      if (dataId == "Lead-View Lead"){
        $("[data-id='Lead-Manage Lead']").prop("checked", false);
        $("[data-id='Lead-Lead Create']").prop("checked", false);
      }

      if (dataId == "Transport-View orders"){
        $("[data-id='Transport-Create order']").prop("checked", false);
        $("[data-id='Transport-Manage order']").prop("checked", false);
        $("[data-id='Transport-View Documents']").prop("checked", false);
        // $("[data-id='Transport-View Invoice']").prop("checked", false);
        $("[data-id='Transport-View Stops']").prop("checked", false);
        $("[data-id='Transport-Export']").prop("checked", false);
        $("[data-id='Transport-Manage Document']").prop("checked", false);
      } 

      if (dataId == "Transport-View vehicle list"){
        $("[data-id='Transport-Create vehicle']").prop("checked", false);
        $("[data-id='Transport-Manage vehicle']").prop("checked", false);
      }

      if (dataId == "Transport-View client list"){
        $("[data-id='Transport-Manage client info']").prop("checked", false);
        $("[data-id='Transport-View Price List']").prop("checked", false);
        $("[data-id='Transport-View Contract']").prop("checked", false);
        $("[data-id='Transport-Manage Contract']").prop("checked", false);
        $("[data-id='Transport-Publish']").prop("checked", false);
        $("[data-id='Transport-View CN & DN']").prop("checked", false);
        $("[data-id='Transport-Create CN & DN']").prop("checked", false);
        $("[data-id='Transport-Manage CN & DN']").prop("checked", false);
      }

      if (dataId == "Transport-View CN & DN"){
        $("[data-id='Transport-Create CN & DN']").prop("checked", false);
        $("[data-id='Transport-Manage CN & DN']").prop("checked", false);
      }

      if (dataId == "Transport-View Contract"){
        $("[data-id='Transport-Manage Contract']").prop("checked", false);
        $("[data-id='Transport-Publish']").prop("checked", false);
      }

      if (dataId == "Transport-View Invoice"){
        $("[data-id='Transport-Manage Invoice']").prop("checked", false);
      }

      if (dataId == "Transport-View Stops"){
        $("[data-id='Transport-Export']").prop("checked", false);
      }

      if (dataId == "Transport-View Documents"){
        $("[data-id='Transport-Manage Document']").prop("checked", false);
      }

      if (dataId == "Transport-View Job List"){
        $("[data-id='Transport-Manage Job List']").prop("checked", false);
      }

      if (dataId == "Transport-View Invoice"){
        $("[data-id='Transport-Manage Invoice']").prop("checked", false);
      }

      if (dataId == "Transport-View Contract"){
        $("[data-id='Transport-Manage Contract']").prop("checked", false);
      }

      if (dataId == "Transport-Manage CN & DN"){
        $("[data-id='Transport-View CN & DN']").prop("checked", false);
      }

      if (dataId == "Transport-Create CN & DN"){
        $("[data-id='Transport-View CN & DN']").prop("checked", false);
      }

      if (dataId == "Transport-Create finance"){
        $("[data-id='Transport-View finance']").prop("checked", false);
      }

      if (dataId == "Transport-Manage finance"){
        $("[data-id='Transport-View finance']").prop("checked", false);
      }

      if (dataId == "Transport-Create incident"){
        $("[data-id='Transport-View incident list']").prop("checked", false);
      }

      if (dataId == "Transport-Manage incident"){
        $("[data-id='Transport-View incident list']").prop("checked", false);
      }

      if (dataId == "Transport-Create service record"){
        $("[data-id='Transport-View service record']").prop("checked", false);
      }

      if (dataId == "Transport-Manage service record"){
        $("[data-id='Transport-View service record']").prop("checked", false);
      }

      if (dataId == "Transport-View service record"){
        $("[data-id='Transport-Manage service record']").prop("checked", false);
        $("[data-id='Transport-Create service record']").prop("checked", false);
      }

      if (dataId == "Transport-View incident list"){
        $("[data-id='Transport-Manage incident']").prop("checked", false);
        $("[data-id='Transport-Create incident']").prop("checked", false);
      }

      if (dataId == "Transport-View finance"){
        $("[data-id='Transport-Manage finance']").prop("checked", false);
        $("[data-id='Transport-Create finance']").prop("checked", false);
      }

      if (dataId == "Admin-Create serviceable item"){
        $("[data-id='Admin-View serviceable item list']").prop("checked", false);
      }

      if (dataId == "Admin-Manage serviceable item"){
        $("[data-id='Admin-View serviceable item list']").prop("checked", false);
      }

      if (dataId == "Admin-View serviceable item list"){
        $("[data-id='Admin-Manage serviceable item']").prop("checked", false);
        $("[data-id='Admin-Create serviceable item']").prop("checked", false);
      }

      if (dataId == "Admin-Create geofence"){
        $("[data-id='Admin-View geo fence list']").prop("checked", false);
      }

      if (dataId == "Admin-Manage geofence"){
        $("[data-id='Admin-View geo fence list']").prop("checked", false);
      }

      if (dataId == "Admin-View geo fence list"){
        $("[data-id='Admin-Manage geofence']").prop("checked", false);
        $("[data-id='Admin-Create geofence']").prop("checked", false);
      }

      if (dataId == "Admin-View email config list"){
        $("[data-id='Admin-Manage email config']").prop("checked", false);
      }

    }
    NOVA.selectedPermissions();
  }

  NOVA.selectedPermissions = function(){
    NOVA.role_permissions([]);
    $('.permissions-list input[type="checkbox"]:checked').each(function(){
      NOVA.role_permissions.push($(this).val());
    })
    if(NOVA.role_permissions().length > 0){
      if(($.trim($('#roleName').val())) && ($.trim($('#roleDescription').val()))){
        NOVA.save_enable(true);
      } else{
        NOVA.save_enable(false);
      }
    }else{
      NOVA.save_enable(false);
    }
    console.log(NOVA.role_permissions());
  }

  $('#roleName, #roleDescription').on('keyup change', function(event) {
    if($.trim($('#roleName').val())){
      if($.trim($('#roleDescription').val())){
        // $('.btn-success').prop('disabled', false);
        if(NOVA.role_permissions().length > 0){
          NOVA.save_enable(true);
        } else{
          NOVA.save_enable(false);
        }
      } else{
        // $('.btn-success').prop('disabled', true);
        NOVA.save_enable(false);
      }
    } else{
      // $('.btn-success').prop('disabled', true);
      NOVA.save_enable(false);
    }
  });

	NOVA.getPermissions = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/permissions/get',
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.permissionsList([]);
      for(var i=0; i<d.length; i++){
        NOVA.permissionsList.push(d[i]);
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

  NOVA.getRoleDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/role/details/get',
      data: {'role_id': NOVA.role_id()},
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      console.log(d);
      NOVA.save_enable(true);
      NOVA.role_permissions([]);
      $('#roleName').val(d.role_name);
      $('#roleDescription').val(d.description);
      NOVA.selected_permissions(d.permissions);
      NOVA.role_permissions(d.permissions);
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always( function(){
      NOVA.hideLoading();
    })
  }

  NOVA.editRole = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('role_id', NOVA.role_id());
    formdata.append('role_name', $('#roleName').val());
    formdata.append('description', $('#roleDescription').val());
    formdata.append('role_permissions', ko.toJSON(NOVA.role_permissions()));
    $.ajax({
      method: 'POST',
      url: '/api/admin/role/edit',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
      $('#errorModal').on('hidden.bs.modal', function (e) {
        window.location = '/admin/role-management';
      });
      
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
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
    var docUrlArr = document.URL.split('/');
    var role_id = docUrlArr[docUrlArr.length - 1];
    NOVA.role_id(role_id);
    NOVA.getPermissions();
    NOVA.getRoleDetails();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;