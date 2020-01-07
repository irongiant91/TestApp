(function (window) {

  NOVA.lead_id = ko.observable("");
  NOVA.inventory_system = ko.observable("");
  NOVA.inventory_by_mes = ko.observable("");
  NOVA.inventory_visibility = ko.observable("");
  NOVA.inventory_report_requirement = ko.observable("");
  NOVA.inventory_report_requirement_other = ko.observable("");
  NOVA.need_barcode_scanning = ko.observable("");
  NOVA.barcode_by_mes = ko.observable("");
  NOVA.has_cycle_count = ko.observable("");
  NOVA.cycle_count_details = ko.observable("");
  NOVA.need_physical_count = ko.observable("");
  NOVA.physical_count_details = ko.observable("");
  NOVA.inventry_managment_id = ko.observable("");


  $.validator.addMethod("dollarsscents", function (value, element) {
      return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
    }, "Maximum 8 digit and 2 decimal place ");

    $("#inventoryManagementForm").validate({
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
        
      },
      submitHandler: function() {
        // NOVA.leadinventoryInfoSave();
      }
    });

    $('button[name="previous"], button[name="next"], button[name="savedata"]').on('click', function (e) {
    e.preventDefault();
    if ($('#inventoryManagementForm').valid()) {
      if($(this).attr('name') == 'previous') {
        NOVA.Previous();
      } else if($(this).attr('name') == 'next') {
        NOVA.leadinventoryInfoNext()
      } else{
        NOVA.leadinventoryInfoSave()
      }
    }
  });


  NOVA.getinventoryDetail = function(data,e){
    var formdata = {
      'lead_id': NOVA.lead_id(),
    }
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/inventory/management/info/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.inventory_system(d.inventory_system);
      NOVA.inventory_by_mes(d.inventory_by_mes);
      NOVA.inventory_visibility(d.inventory_visibility);
      NOVA.inventory_report_requirement(d.inventory_report_requirement);
      NOVA.inventory_report_requirement_other(d.inventory_report_requirement_other);
      NOVA.need_barcode_scanning(d.need_barcode_scanning);
      NOVA.barcode_by_mes(d.barcode_by_mes);
      NOVA.has_cycle_count(d.has_cycle_count);
      NOVA.cycle_count_details(d.cycle_count_details);
      NOVA.need_physical_count(d.need_physical_count);
      NOVA.physical_count_details(d.physical_count_details);
      NOVA.inventry_managment_id(d.inventry_managment_id);
      if(d.has_requirements == true){
        $('.has-requirement').prop("disabled", true)
      }else{
        $('.has-requirement').prop("disabled", false)
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.leadinventoryInfoSave = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('inventory_system', NOVA.inventory_system());
    formdata.append('inventory_by_mes', NOVA.inventory_by_mes());
    formdata.append('inventory_visibility', NOVA.inventory_visibility());
    formdata.append('inventory_report_requirement', NOVA.inventory_report_requirement());
    formdata.append('need_barcode_scanning', NOVA.need_barcode_scanning());
    formdata.append('barcode_by_mes', NOVA.barcode_by_mes());
    formdata.append('has_cycle_count', NOVA.has_cycle_count());
    formdata.append('cycle_count_details', NOVA.cycle_count_details());
    formdata.append('need_physical_count', NOVA.need_physical_count());
    formdata.append('physical_count_details', NOVA.physical_count_details());
    formdata.append('inventry_managment_id', NOVA.inventry_managment_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/inventory/management/info/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d.msg);
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.leadinventoryInfoNext = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('inventory_system', NOVA.inventory_system());
    formdata.append('inventory_by_mes', NOVA.inventory_by_mes());
    formdata.append('inventory_visibility', NOVA.inventory_visibility());
    formdata.append('inventory_report_requirement', NOVA.inventory_report_requirement());
    formdata.append('need_barcode_scanning', NOVA.need_barcode_scanning());
    formdata.append('barcode_by_mes', NOVA.barcode_by_mes());
    formdata.append('has_cycle_count', NOVA.has_cycle_count());
    formdata.append('cycle_count_details', NOVA.cycle_count_details());
    formdata.append('need_physical_count', NOVA.need_physical_count());
    formdata.append('physical_count_details', NOVA.physical_count_details());
    formdata.append('inventry_managment_id', NOVA.inventry_managment_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/inventory/management/info/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/value-added-services';
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.Previous = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('inventory_system', NOVA.inventory_system());
    formdata.append('inventory_by_mes', NOVA.inventory_by_mes());
    formdata.append('inventory_visibility', NOVA.inventory_visibility());
    formdata.append('inventory_report_requirement', NOVA.inventory_report_requirement());
    formdata.append('need_barcode_scanning', NOVA.need_barcode_scanning());
    formdata.append('barcode_by_mes', NOVA.barcode_by_mes());
    formdata.append('has_cycle_count', NOVA.has_cycle_count());
    formdata.append('cycle_count_details', NOVA.cycle_count_details());
    formdata.append('need_physical_count', NOVA.need_physical_count());
    formdata.append('physical_count_details', NOVA.physical_count_details());
    formdata.append('inventry_managment_id', NOVA.inventry_managment_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/inventory/management/info/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/storage-requirement';
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.productProfile = function(){
    window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/product-profile';
  };
  
  NOVA.logisticsInformation = function(){
    window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/logistics-information';
  };
  
  NOVA.productReceiving = function(){
    window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/product-receiving';
  };
  
  NOVA.orderProcessing = function(){
    window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/order-processing-shipment';
  };
  
  NOVA.storageRequirement = function(){
    window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/storage-requirement';
  };
  
  NOVA.inventoryManagement = function(){
    window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/inventory-management';
  };
  
  NOVA.valueAS = function(){
    window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/value-added-services';
  };
  
  NOVA.warehouseManagement = function(){
    window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/warehouse-management';
  };
  
  NOVA.billingInformation = function(){
    window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/billing-information';
  }

  $('#navItemLeads').addClass('active');

})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    var docUrlArr = document.URL.split('/');
    var lead_id = docUrlArr[docUrlArr.length - 3];
    NOVA.lead_id(lead_id);
    NOVA.getinventoryDetail();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;