(function (window) {
  NOVA.service_uid = ko.observable('');
  NOVA.vehicle_id = ko.observable('');
  NOVA.inspection_vehicle_id = ko.observable('');
  NOVA.odometer_reading = ko.observable('');
  NOVA.remarks = ko.observable('');
  NOVA.vehicle_service_id = ko.observable('');
  NOVA.vehicles_list = ko.observableArray([]);

  NOVA.getServiceRequestId = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = {
      'inspection_id': NOVA.inspection_id()
    }
    $.ajax({
      method: 'GET',
      url: '/api/inspection/get/service/request/uid',
      data: formdata,
      datatype: 'json',
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.service_uid(d.service_uid);
      NOVA.inspection_vehicle_id(d.vehicle_id);
      NOVA.getVehiclesList();
      if(d.vehicle_id != ''){
        $('#vehicleId').attr('disabled',true)
        $('#vehicleRegNumber').attr('disabled',true)
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.getVehiclesList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/inspection/get/service/vehicles/list',
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
      if(NOVA.inspection_vehicle_id() != '' || 'undefined'){
        $('#vehicleId').val(NOVA.inspection_vehicle_id()).trigger('change');
        $('#vehicleRegNumber').val(NOVA.inspection_vehicle_id()).trigger('change');
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.changeVehicelId = function(data, e){
    $('#vehicleId').val(NOVA.vehicle_id()).trigger('change');
    $('#vehicleRegNumber').val(NOVA.vehicle_id()).trigger('change');
  }

  jQuery.validator.addMethod("noSPace", function(value, element) {
    return this.optional(element) || /^[a-z,0-9]/i.test(value);
  }, "First space is not allowed");

  jQuery.validator.addMethod("dollarsscents", function (value, element) {
    return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
  }, "Maximum 8 digit and 2 decimal place ");

  var createServiceValidator = $("#createService").validate({
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
      serviceRequestId: {
        required: true,
        noSPace: true
      },
      vehicleId : {
        required: true,
        noSPace: true
      },
      vehicleRegNumber: {
        required: true,
        noSPace: true
      },
      odometerReading: {
        required: true,
        number: true,
        digits: true,
      },
      remarks: {
        required: true,
        noSPace: true,
      },
    },
    messages: {
      serviceRequestId: {
        required: "Please enter service request id"
      },
      vehicleId : {
        required: "Please enter vehicle id"
      },
      vehicleRegNumber: {
        required: "Please enter vehicle registration number"
      },
      odometerReading: {
        required: "Please enter odometer reading"
      },
      remarks: {
        required: "Please enter remarks"
      },
    },
    submitHandler: function() {
      NOVA.createVehicleService();      
    }
  });

  NOVA.createVehicleService = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('service_uid', NOVA.service_uid());
    formdata.append('vehicle_id', NOVA.vehicle_id());
    formdata.append('odometer_reading', NOVA.odometer_reading());
    formdata.append('remarks', NOVA.remarks());
    if(NOVA.inspection_id() != '' || 'undefined'){
      formdata.append('inspection_id', NOVA.inspection_id());
    }
    $.ajax({
      method: 'POST',
      url: '/api/inspection/create/vehicle/service',
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
      if(NOVA.service_from() == 'General'){
        window.location = '/vehicle/service/'+d.vehicle_service_id;
      }else{
        window.location = '/inspection/'+NOVA.inspection_id()+'/vehicle/service/'+d.vehicle_service_id;
      }

      NOVA.vehicle_service_id(d.vehicle_service_id);
      NOVA.vehicleDetailsGet();
      $('.service-items').removeClass('d-none');
      $('#createService').find('.form-control').attr('disabled','disabled');
      $('#edit-btn').removeClass('d-none');
      $('#save-btn').addClass('d-none');
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

})(this);
  
// function init() {
//   if (document.readyState == "interactive") {
//     NOVA.hideLoading();
//     NOVA.getServiceRequestId();
//     ko.applyBindings(NOVA);
//   }
// }

// document.onreadystatechange = init;