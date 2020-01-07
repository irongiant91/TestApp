(function (window) {

  NOVA.lead_id = ko.observable("");
  NOVA.current_arrangement = ko.observable("");
  NOVA.service_provider_a = ko.observable("");
  NOVA.service_provider_b = ko.observable("");
  NOVA.service_provider_c = ko.observable("");
  NOVA.change_reason = ko.observable("");
  NOVA.change_reason_other = ko.observable("");
  NOVA.warehouse_id = ko.observable("");


  $.validator.addMethod("dollarsscents", function (value, element) {
      return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
    }, "Maximum 8 digit and 2 decimal place ");

    $("#warehouseManagementForm").validate({
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
        // NOVA.leadwarehouseInfoSave();
      }
    });

    /*$.each($('.custom-control-input'), function(key, el){
      if ( $(el).val() == 'yes' ) {
        $(el).parent().parent().find('.form-control').removeClass('d-none');
        $(el).parent().parent().find('.input-group').removeClass('d-none');
      } else if($(el).val() == 'no') {
        $(el).parent().parent().find('.form-control').addClass('d-none');
        $(el).parent().parent().find('.input-group').addClass('d-none');   
      }
    })

    $('.custom-control-input').on('change', function(){
      if($(this).val() == 'yes') { 
        $(this).parent().parent().find('.form-control').removeClass('d-none');
        $(this).parent().parent().find('.input-group').removeClass('d-none');   
      } else if($(this).val() == 'no') {
        $(this).parent().parent().find('.form-control').addClass('d-none');
        $(this).parent().parent().find('.input-group').addClass('d-none');   
      }
    });*/

  $('button[name="previous"], button[name="next"], button[name="savedata"]').on('click', function (e) {
    e.preventDefault();
    if ($('#warehouseManagementForm').valid()) {
      if($(this).attr('name') == 'previous') {
        NOVA.Previous();
      } else if($(this).attr('name') == 'next') {
        NOVA.leadwarehouseInfoNext()
      } else{
        NOVA.leadwarehouseInfoSave()
      }
    }
  });

  NOVA.getwarehouseDetail = function(data,e){
    var formdata = {
      'lead_id': NOVA.lead_id(),
    }
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/warehous/details/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.current_arrangement(d.current_arrangement);
      NOVA.service_provider_a(d.service_provider_a);
      NOVA.service_provider_b(d.service_provider_b);
      NOVA.service_provider_c(d.service_provider_c);
      NOVA.change_reason(d.change_reason);
      NOVA.change_reason_other(d.change_reason_other);
      NOVA.warehouse_id(d.warehouse_id);
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

  NOVA.leadwarehouseInfoNext = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('current_arrangement', NOVA.current_arrangement());
    formdata.append('service_provider_a', NOVA.service_provider_a());
    formdata.append('service_provider_b', NOVA.service_provider_b());
    formdata.append('service_provider_c', NOVA.service_provider_c());
    formdata.append('change_reason', NOVA.change_reason());
    formdata.append('warehouse_id', NOVA.warehouse_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/warehouse/details/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/billing-information';
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.leadwarehouseInfoSave = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('current_arrangement', NOVA.current_arrangement());
    formdata.append('service_provider_a', NOVA.service_provider_a());
    formdata.append('service_provider_b', NOVA.service_provider_b());
    formdata.append('service_provider_c', NOVA.service_provider_c());
    formdata.append('change_reason', NOVA.change_reason());
    formdata.append('warehouse_id', NOVA.warehouse_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/warehouse/details/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      if(NOVA.change_reason() == 'Price' || NOVA.change_reason() =='Service' || NOVA.change_reason() =='Location'){
        NOVA.change_reason_other('')
      }else{
        NOVA.change_reason_other(NOVA.change_reason())
      }
      NOVA.showToast(d.msg);
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
    formdata.append('current_arrangement', NOVA.current_arrangement());
    formdata.append('service_provider_a', NOVA.service_provider_a());
    formdata.append('service_provider_b', NOVA.service_provider_b());
    formdata.append('service_provider_c', NOVA.service_provider_c());
    formdata.append('change_reason', NOVA.change_reason());
    formdata.append('warehouse_id', NOVA.warehouse_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/warehouse/details/create',
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


})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    var docUrlArr = document.URL.split('/');
    var lead_id = docUrlArr[docUrlArr.length - 3];
    NOVA.lead_id(lead_id);
    NOVA.getwarehouseDetail();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;