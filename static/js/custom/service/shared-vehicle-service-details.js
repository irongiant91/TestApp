(function (window) {
  NOVA.vehicle_service_id = ko.observable('');
  NOVA.service_uid = ko.observable('');
  NOVA.vehicle_id = ko.observable('');
  NOVA.odometer_reading = ko.observable('');
  NOVA.remarks = ko.observable('');
  NOVA.created_by = ko.observable('');
  NOVA.created_on = ko.observable('');
  NOVA.status = ko.observable('');
  NOVA.from_inspection = ko.observable('');
  NOVA.insp_uid = ko.observable('');
  NOVA.inspection_id = ko.observable('');
  NOVA.vehicles_list = ko.observableArray([]);
  NOVA.all_service_items = ko.observableArray([]);
  NOVA.service_items = ko.observableArray([]);
  NOVA.vehicle_service_items_list = ko.observableArray([]);

  var serviceItem = function(){
    this.item_id = ko.observable('');
    this.serviceitem_id = ko.observable('');
    this.item_name = ko.observable('');
    this.item_quantity = ko.observable('');
    this.item_unitprice = ko.observable('');
    this.item_amount = ko.observable('');
    this.is_editable = ko.observable('true');
    this.is_deletable = ko.observable('true');
    this.fill = function (d) {
      this.item_id('' || d.item_id);
      this.serviceitem_id('' || d.serviceitem_id);
      this.item_name('' || d.item_name);
      this.item_quantity('' || d.item_quantity);
      this.item_unitprice('' || d.item_unitprice);
      this.item_amount('' || d.item_amount);
      this.is_editable('' || d.is_editable);
      this.is_deletable('' || d.is_deletable);
    }
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
      NOVA.allServiceItemsGet();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.allServiceItemsGet = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/inspection/get/all/service/items',
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.all_service_items([]);
      for(var i=0; i<d.service_items_list.length; i++){
        NOVA.all_service_items.push(d.service_items_list[i]);
      }
      NOVA.getServiceDetails();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.getServiceDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/inspection/get/service/details',
      data: {'vehicle_service_id': NOVA.vehicle_service_id()},
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.service_uid(d.service_uid);
      NOVA.vehicle_id(d.vehicle_id);
      $('#vehicleId').val(NOVA.vehicle_id()).trigger('change');
      $('#vehicleRegNumber').val(NOVA.vehicle_id()).trigger('change');
      NOVA.odometer_reading(d.odometer_reading);
      NOVA.remarks(d.remarks);
      NOVA.created_by(d.created_by);
      var offset = moment().utcOffset();
      created_on = moment.utc(d.created_on, "DD MMM YYYY hh:mmA").utcOffset(offset).format("DD MMM YYYY HH:mm:ss");
      NOVA.created_on(created_on);
      NOVA.status(d.status);
      NOVA.from_inspection(d.from_inspection);
      NOVA.insp_uid(d.insp_uid);
      $('[data-toggle="tooltip"]').tooltip()
      $('#createService').find('.editable').attr('disabled','disabled');
      $('#edit-btn').removeClass('d-none');
      $('#save-btn').addClass('d-none');
      NOVA.inspection_id(d.inspection_id);
      if(d.inspection_id != ''){
        $('#vehicleId').attr('disabled',true)
        $('#vehicleRegNumber').attr('disabled',true)
      }
      NOVA.getVehicleServiceItems();
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

  NOVA.getVehicleServiceItems = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/inspection/get/vehicle/service/items',
      data: {'vehicle_service_id': NOVA.vehicle_service_id()},
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.vehicle_service_items_list([]);
      for(var i=0;i<d.service_items_list.length;i++){
        var service_item = new serviceItem();
        service_item.fill(d.service_items_list[i]);
        NOVA.vehicle_service_items_list.push(service_item);
      }
      if(NOVA.vehicle_service_items_list().length == 0){
        NOVA.addServiceItem();
        $('#confirmServiceItem').removeClass('d-none')
        $('#editServiceItem').addClass('d-none')
        $('#add-new-btn').prop('disabled',true);
        $('#completeServiceItem').addClass('d-none')
      }else{
        $('#edit-btn').prop('disabled',true);
        $('#add-new-btn').prop('disabled',true);
        $(".remove-item").prop("disabled", true);
        $('#confirmServiceItem').addClass('d-none')
        $('#editServiceItem').removeClass('d-none')
        $('#completeServiceItem').removeClass('d-none')
      }
      if(NOVA.status() == 'Closed'){
        $('#edit-btn').prop('disabled',true);
        $(".remove-item").prop("disabled", true);
        $('#confirmServiceItem').addClass('d-none')
        $('#editServiceItem').addClass('d-none')
        $('#completeServiceItem').addClass('d-none')
        $('#add-new-btn').addClass('d-none')
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.editService = function(){
    $('#edit-btn').prop('disabled',false);
    $('#add-new-btn').prop('disabled',false);
    $(".remove-item").prop("disabled", false);
    $('#editServiceItem').addClass('d-none')
    $('#completeServiceItem').addClass('d-none')
    $('#confirmServiceItem').removeClass('d-none')
    if(NOVA.inspection_id() != ''){
      $('#vehicleId').attr('disabled',true)
      $('#vehicleRegNumber').attr('disabled',true)
    }
  }

  $(document).on('click', '#edit-btn', function(){
    $('#createService').find('.editable').removeAttr('disabled');
    $('#edit-btn').addClass('d-none');
    $('#save-btn').removeClass('d-none');
    if(NOVA.inspection_id() != ''){
      $('#vehicleId').attr('disabled','disabled')
      $('#vehicleRegNumber').attr('disabled','disabled')
    }
  })

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
      NOVA.saveVehicleService();      
    }
  });

  NOVA.saveVehicleService = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('vehicle_service_id', NOVA.vehicle_service_id());
    formdata.append('vehicle_id', NOVA.vehicle_id());
    formdata.append('odometer_reading', NOVA.odometer_reading());
    formdata.append('remarks', NOVA.remarks());
    $.ajax({
      method: 'POST',
      url: '/api/inspection/update/vehicle/service',
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
      NOVA.getServiceDetails();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.addServiceItem = function(){
    $('#add-new-btn').prop('disabled',true);
    NOVA.vehicle_service_items_list().forEach(function(entry) {
      entry.is_editable('false');
    })

    var service_item = new serviceItem();
    d = {
      'item_id':'',
      'serviceitem_id':'',
      'item_name':'',
      'item_quantity':'',
      'item_unitprice':'',
      'item_amount':'',
      'is_editable':'true',
      'is_deletable':'true',
    }
    service_item.fill(d);
    NOVA.vehicle_service_items_list.push(service_item);
    NOVA.service_items([]);
    for(var i=0; i<NOVA.all_service_items().length; i++){
      NOVA.service_items.push(NOVA.all_service_items()[i])
    }
  }

  NOVA.addButtonStatusCheck = function(){
    for (var i = 0; i < NOVA.vehicle_service_items_list().length; i++) {
      entry = NOVA.vehicle_service_items_list()[i]
      if(entry.item_quantity() == '' || entry.serviceitem_id() == ''){
        $('#add-new-btn').prop('disabled',true);
        break;
      }else{
        $('#add-new-btn').prop('disabled',false);
      }
    }
  };


  NOVA.changeItem = function(parent,index,data, e){
    var item_id = $(e.target).val();
    NOVA.service_items().forEach(function(entry) {
      if(entry.vehicleservice_item_id == item_id){
        data.serviceitem_id(entry.vehicleservice_item_id);
        data.item_name(entry.vehicleservice_item_name);
        data.item_unitprice(entry.vehicleservice_item_price);

        var quantity = data.item_quantity();
        var price = data.item_unitprice();
        var amount = quantity * price;
        data.item_amount(amount);
      }
    })
    NOVA.addButtonStatusCheck();
    /*$('#add-new-btn').removeAttr('disabled');
    if(data.item_id() == '' || data.item_quantity() == ''){
      alert(1)
      $('#add-new-btn').attr('disabled','disabled')
    }*/

    /*$('#add-new-btn').removeAttr('disabled');
    NOVA.vehicle_service_items_list().forEach(function(entry) {
      if(entry.item_id() == '' || entry.item_quantity() == ''){
        $('#add-new-btn').attr('disabled','disabled')
      }
    })*/
  }

  NOVA.changeItemQuantity = function(data, e){
    data.item_quantity($(e.target).val());
    var quantity = data.item_quantity();
    var price = data.item_unitprice();
    var amount = quantity * price;
    data.item_amount(amount);
    NOVA.addButtonStatusCheck();

    /*$('#add-new-btn').removeAttr('disabled');
    if(data.item_id() == '' || data.item_quantity() == ''){
      alert(1)
      $('#add-new-btn').attr('disabled','disabled')
    }*/

    /*NOVA.vehicle_service_items_list().forEach(function(entry) {
      console.log(entry)
      if(entry.item_id() == '' || entry.item_quantity() == ''){
        alert(1)
        $('#add-new-btn').attr('disabled','disabled')
      }
    })*/
  }

  NOVA.editItem = function(data, e){
    data.is_editable('true');
    NOVA.service_items([]);
    for(var i=0; i<NOVA.all_service_items().length; i++){
      NOVA.service_items.push(NOVA.all_service_items()[i])
    }
    $('#item-'+data.item_id()).val(data.serviceitem_id());
  }

  NOVA.deleteItem = function(data, e){
    NOVA.vehicle_service_items_list.remove(data);
    if(NOVA.vehicle_service_items_list().length == 0){
        NOVA.addServiceItem();
    }
  }

  $.validator.addMethod("itemRequired", $.validator.methods.required, "Please select service item ");
  $.validator.addClassRules("item", {
    itemRequired: true    
  });

  $.validator.addMethod("quantityRequired", $.validator.methods.required, "Please enter quantity");
  $.validator.addClassRules("quantity", {
    quantityRequired: true,
    number: true,
    digits: true,
    maxlength: 4,
  });

  $.validator.addMethod("unitPriceRequired", $.validator.methods.required, "Please enter quantity");
  $.validator.addClassRules("unit-price", {
    unitPriceRequired: true,
    number: true,
    dollarsscents: true,
  });

  $.validator.addMethod("amountRequired", $.validator.methods.required, "Please enter quantity");
  $.validator.addClassRules("amount", {
    amountRequired: true,
    number: true,
    dollarsscents: true,
  });

  var sericeItemsValidator = $("#sericeItems").validate({
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
    
    submitHandler: function() {
      NOVA.confirmServiceItems();
    }
  });

  NOVA.confirmServiceItems = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('vehicle_service_id', NOVA.vehicle_service_id());
    formdata.append('service_items', ko.toJSON(NOVA.vehicle_service_items_list()));
    $.ajax({
      method: 'POST',
      url: '/api/inspection/confirm/service/items',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      /*if(NOVA.inspection_id() !='' | NOVA.inspection_id() != undefined){
        window.location = '/inspection-report/'+NOVA.inspection_id()+'/detail'
      }else{
        window.location = '/service'
      }*/
      $('#completeServiceItem').removeClass('d-none')
      NOVA.showToast(d.msg);
      NOVA.getServiceDetails();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.completeService = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('vehicle_service_id', NOVA.vehicle_service_id());
    $.ajax({
      method: 'POST',
      url: '/api/inspection/complete/service',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      if(NOVA.inspection_id()){
        window.location = '/inspection-report/'+NOVA.inspection_id()+'/detail'
      }else{
        window.location = '/service'
      }
     /* if(NOVA.inspection_id() !='' | NOVA.inspection_id() != undefined){
        window.location = '/inspection-report/'+NOVA.inspection_id()+'/detail'
      }else{
        window.location = '/service'
      }*/
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }


  NOVA.inspectionRedirect = function(){
    window.open('/inspection-report/'+NOVA.inspection_id()+'/detail');
  }


})(this);
  
// function init() {
//   if (document.readyState == "interactive") {
//     NOVA.hideLoading();
//     var docUrlArr = document.URL.split('/');
//     var vehicle_service_id = docUrlArr[docUrlArr.length - 1];
//     NOVA.vehicle_service_id(vehicle_service_id);
//     NOVA.getVehiclesList();
//     ko.applyBindings(NOVA);
//   }
// }

// document.onreadystatechange = init;