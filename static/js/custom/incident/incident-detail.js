(function (window) {
  NOVA.incident_id = ko.observable();  
  NOVA.incident_uid = ko.observable('');
  NOVA.vehicle_id = ko.observable('');
  NOVA.issue_id = ko.observable('');
  NOVA.incident_remarks = ko.observable('');
  NOVA.controller_remarks = ko.observable('');
  NOVA.edit_mode = ko.observable(false);
  NOVA.created_by = ko.observable('');
  NOVA.created_date = ko.observable('');
  
  NOVA.incidentsList = ko.observableArray([]);  
  NOVA.vehicles_list = ko.observableArray([]);
  NOVA.issues_list = ko.observableArray([]);
  NOVA.images_list = ko.observableArray([]);
  NOVA.preview_images = ko.observableArray([]);
  NOVA.files = ko.observableArray([]);

  NOVA.getVehiclesList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/vehicles/list',
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.vehicles_list([]);
      for(var i=0; i<d.vehicles_list.length; i++){
        NOVA.vehicles_list.push(d.vehicles_list[i]);
      }
      NOVA.getIssueTypes();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.getIssueTypes = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/issuetypes/list',
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.issues_list([]);
      for(var i=0; i<d.issues_list.length; i++){
        NOVA.issues_list.push(d.issues_list[i]);
      }
      NOVA.getIncidentDetails();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.getIncidentDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/incident/details',
      data:{'incident_id': NOVA.incident_id()},
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.incident_uid(d.incident_uid);
      NOVA.vehicle_id(d.vehicle_id);
      NOVA.issue_id(d.issue_id);
      NOVA.incident_remarks(d.incident_remarks);
      NOVA.controller_remarks(d.controller_remarks);
      NOVA.created_by(d.created_by);
      NOVA.created_date(d.created_date);
      NOVA.images_list([]);
      NOVA.files([]);
      NOVA.preview_images([]);
      for(var i=0; i<d.incident_images.length; i++){
        NOVA.images_list.push(d.incident_images[i]);
      }
      $('#vehicleId').val(NOVA.vehicle_id()).trigger('change');
      $('#selectIssue').val(NOVA.issue_id()).trigger('change');
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }  
  
  NOVA.getBase64 = function(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  NOVA.setThumbnailWidth = function(){
    $('.thumbnail').each(function(el, i){
      let imgWidth = $(this).width();
    })
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  NOVA.uploadImage = function(data, e, file){
    NOVA.getBase64(file).then(function(data){
      NOVA.files.push(dataURLtoFile(data, file.name))
      NOVA.preview_images.push({preview:data})
      NOVA.setThumbnailWidth();
      $('#uploadImage').val('');
    })
  }

  NOVA.removeImage = function(data, e, index){
    NOVA.preview_images.remove(data);
    NOVA.files().splice(index(), 1);
  }

  NOVA.removeIncidentImage = function(data, e, index){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('incident_id', NOVA.incident_id());
    formdata.append('image_id', data.image_id);
    $.ajax({
      method: 'POST',
      url: '/api/order/delete/incident/image',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.images_list.remove(data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  $(document).on('click','.edit-invoice-btn', function(){
    $(this).addClass('d-none');
    $('.save-invoice-btn').removeClass('d-none');
    $('#incidentDetailForm .incident-edit').prop('disabled', false);
    NOVA.edit_mode(true);
  });

  NOVA.saveIncidentDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('incident_id', NOVA.incident_id());
    formdata.append('vehicle_id', NOVA.vehicle_id());
    formdata.append('issue_id', NOVA.issue_id());
    formdata.append('incident_remarks', NOVA.incident_remarks());
    formdata.append('controller_remarks', NOVA.controller_remarks());
    if (NOVA.files().length){
      $.each(NOVA.files(), function(i, file) {
        formdata.append('images', file);
      });
    }
    $.ajax({
      method: 'POST',
      url: '/api/order/update/incident',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.showToast(d.msg);
      $('.save-invoice-btn').addClass('d-none');
      $('.edit-invoice-btn').removeClass('d-none');
      $('#incidentDetailForm .incident-edit').prop('disabled', true);
      NOVA.edit_mode(false);
      NOVA.getIncidentDetails();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.confirmdeleteIncident = function(data){
    $("#confirmModal").modal('show')
  }

  NOVA.deleteIncident = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('incident_id', NOVA.incident_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/delete/incident',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.showToast(d.msg);
      setTimeout(function() {
        window.location = '/incident';
      }, 500);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

})(this);
  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var incident_id = docUrlArr[docUrlArr.length - 1];
    NOVA.incident_id(incident_id);
    NOVA.getVehiclesList();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;