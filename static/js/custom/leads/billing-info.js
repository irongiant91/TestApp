(function (window) {

  NOVA.lead_id = ko.observable("");
  NOVA.company_name = ko.observable("");
  NOVA.billing_address = ko.observable("");
  NOVA.contact_name = ko.observable("");
  NOVA.designation = ko.observable("");
  NOVA.email = ko.observable("");
  NOVA.phone = ko.observable("");
  NOVA.fax = ko.observable("");
  NOVA.lead_won = ko.observable("");
  NOVA.billing_id = ko.observable("");
  NOVA.has_requirements = ko.observable("");


  $.validator.addMethod("emailRegex", function(value, element) {
      return /^$|^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test( value );
    });

    $.validator.addMethod("phoneRegex", function(value, element) {
      return /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/.test( value );
    });

    $.validator.addMethod("alpha", function(value, element) {
      if(value.charAt(0) != ' ') {
        if(this.optional(element) || /^[a-zA-Z\s]*$/i.test(value))  {
          return true;
        }
      }
    })

  $("#billingInformationForm").validate({
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
      email: {
        emailRegex: true
      },
      tel: {
        phoneRegex: true,
        minlength: 6
      },
      fax: {
        phoneRegex: true,
        minlength: 6
      }
    },
    messages: {
      email: {
        emailRegex: "Please enter a valid email"
      },
      tel: {
        minlength: "Please enter a minimum of 6 digits",
        phoneRegex: "Please enter a valid contact number"
      },
      fax: {
        minlength: "Please enter a minimum of 6 digits",
        phoneRegex: "Please enter a valid fax number"
      }
    },
    submitHandler: function() {
      // NOVA.leadbillingInfoSave();
    }
  });

  $('button[name="previous"], button[name="publish"], button[name="savedata"]').on('click', function (e) {
    e.preventDefault();
    if ($('#billingInformationForm').valid()) {
      if($(this).attr('name') == 'previous') {
        NOVA.Previous();
      } else if($(this).attr('name') == 'publish') {
        NOVA.leadrequirementGatheringPublish()
      } else{
        NOVA.leadbillingInfoSave()
      }
    }
  });

  NOVA.getbillingInfoDetail = function(data,e){
    var formdata = {
      'lead_id': NOVA.lead_id(),
    }
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/billing/info/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.company_name(d.company_name);
      NOVA.billing_address(d.billing_address);
      NOVA.contact_name(d.contact_name);
      NOVA.designation(d.designation);
      NOVA.email(d.email);
      NOVA.phone(d.phone);
      NOVA.fax(d.fax);
      NOVA.billing_id(d.billing_id);
      NOVA.has_requirements(d.has_requirements);
      NOVA.lead_won(d.lead_won);
      if(d.has_requirements == true){
        $('.has-requirement').prop("disabled", true)
        $('#publish-button').addClass('d-none')
        $('#edit-button').removeClass('d-none')
      }else{
        $('.has-requirement').prop("disabled", false)
        $('#edit-button').addClass('d-none')
        $('#publish-button').removeClass('d-none')
      }
      if (d.lead_won){
        $('#edit-button').addClass('d-none')
        $('#publish-button').addClass('d-none')
      }
      $('#billingAddress').val(d.billing_address)
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.leadbillingInfoSave = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('company_name', NOVA.company_name());
    formdata.append('billing_address', $('#billingAddress').val());
    formdata.append('contact_name', NOVA.contact_name());
    formdata.append('designation', NOVA.designation());
    formdata.append('email', NOVA.email());
    formdata.append('phone', NOVA.phone());
    formdata.append('fax', NOVA.fax());
    formdata.append('billing_id', NOVA.billing_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/billing/details/create',
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
      NOVA.getbillingInfoDetail();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.leadrequirementGatheringPublish = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('company_name', NOVA.company_name());
    formdata.append('billing_address', $('#billingAddress').val());
    formdata.append('contact_name', NOVA.contact_name());
    formdata.append('designation', NOVA.designation());
    formdata.append('email', NOVA.email());
    formdata.append('phone', NOVA.phone());
    formdata.append('fax', NOVA.fax());
    formdata.append('billing_id', NOVA.billing_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/requirement/gathering/publish',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showErrorModal(d.msg);
      NOVA.getbillingInfoDetail();
      $('#errorModal').on('hidden.bs.modal', function (e) {
        window.location.href = '/lead/details/' + NOVA.lead_id();
      });
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
    formdata.append('company_name', NOVA.company_name());
    formdata.append('billing_address', $('#billingAddress').val());
    formdata.append('contact_name', NOVA.contact_name());
    formdata.append('designation', NOVA.designation());
    formdata.append('email', NOVA.email());
    formdata.append('phone', NOVA.phone());
    formdata.append('fax', NOVA.fax());
    formdata.append('billing_id', NOVA.billing_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/billing/details/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      // NOVA.showErrorModal(d.msg);
      window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/warehouse-management';
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.requirementEdit = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/requirement/gathering/edit',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $('#edit-button').addClass('d-none')
      $('.has-requirement').prop("disabled", false)
      $('#publish-button').removeClass('d-none')
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
    NOVA.getbillingInfoDetail();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;