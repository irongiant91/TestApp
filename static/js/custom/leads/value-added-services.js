(function (window) {

  NOVA.lead_id = ko.observable("");
  NOVA.invoice_by_mes = ko.observable("");
  NOVA.is_documents_collected = ko.observable("");
  NOVA.need_special_documents = ko.observable("");
  NOVA.special_document_details = ko.observable("");
  NOVA.customised_services = ko.observable("");
  NOVA.customised_other_services = ko.observable("");
  NOVA.vas_id = ko.observable("");

  NOVA.customisedServices = ko.observableArray([]);

  $.validator.addMethod("dollarsscents", function (value, element) {
      return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
    }, "Maximum 8 digit and 2 decimal place ");

    $("#valueAddedServicesForm").validate({
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
        // NOVA.leadVASInfoSave();
      }
    });

  $('button[name="previous"], button[name="next"], button[name="savedata"]').on('click', function (e) {
    e.preventDefault();
    if ($('#valueAddedServicesForm').valid()) {
      if($(this).attr('name') == 'previous') {
        NOVA.Previous();
      } else if($(this).attr('name') == 'next') {
        NOVA.leadVASInfoNext()
      } else{
        NOVA.leadVASInfoSave()
      }
    }
  });


  $("input:checkbox").click(function(){
    var $this = $(this);
    if($this.is(":checked")){
        NOVA.customisedServices.push($this.val())
    }else{
        NOVA.customisedServices.remove($this.val())
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

  NOVA.getleadVASDetail = function(data,e){
    var formdata = {
      'lead_id': NOVA.lead_id(),
    }
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/vas/details/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.invoice_by_mes(d.invoice_by_mes);
      NOVA.is_documents_collected(d.is_documents_collected);
      NOVA.need_special_documents(d.need_special_documents);
      NOVA.special_document_details(d.special_document_details);
      NOVA.customised_services(d.customised_services);
      NOVA.customised_other_services(d.customised_other_services);
      NOVA.vas_id(d.vas_id);
      var inputVals = d.customised_services.split(',');
      for(i=0; i<inputVals.length; i++) {
          NOVA.customisedServices.push(inputVals[i])
         $("input[type=checkbox]").filter(function () {
            return this.value == inputVals[i];
          }).prop("checked", true);
      }
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

  NOVA.leadVASInfoSave = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('invoice_by_mes', NOVA.invoice_by_mes());
    formdata.append('is_documents_collected', NOVA.is_documents_collected());
    formdata.append('need_special_documents', NOVA.need_special_documents());
    formdata.append('special_document_details', NOVA.special_document_details());
    formdata.append('customised_other_services', NOVA.customised_other_services());
    formdata.append('customised_services', ko.toJSON(NOVA.customisedServices()));
    formdata.append('vas_id', NOVA.vas_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/vas/details/create',
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

  NOVA.leadVASInfoNext = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('invoice_by_mes', NOVA.invoice_by_mes());
    formdata.append('is_documents_collected', NOVA.is_documents_collected());
    formdata.append('need_special_documents', NOVA.need_special_documents());
    formdata.append('special_document_details', NOVA.special_document_details());
    formdata.append('customised_other_services', NOVA.customised_other_services());
    formdata.append('customised_services', ko.toJSON(NOVA.customisedServices()));
    formdata.append('vas_id', NOVA.vas_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/vas/details/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/warehouse-management';
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
    formdata.append('invoice_by_mes', NOVA.invoice_by_mes());
    formdata.append('is_documents_collected', NOVA.is_documents_collected());
    formdata.append('need_special_documents', NOVA.need_special_documents());
    formdata.append('special_document_details', NOVA.special_document_details());
    formdata.append('customised_other_services', NOVA.customised_other_services());
    formdata.append('customised_services', ko.toJSON(NOVA.customisedServices()));
    formdata.append('vas_id', NOVA.vas_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/vas/details/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/inventory-management';
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
    NOVA.getleadVASDetail();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;