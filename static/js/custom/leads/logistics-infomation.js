(function (window) {

  NOVA.lead_id = ko.observable("");
  NOVA.preffered_warehouse = ko.observable("");
  NOVA.monthly_expenditure = ko.observable("");
  NOVA.is_officehours_ops = ko.observable("");
  NOVA.officehours_start = ko.observable("");
  NOVA.officehours_end = ko.observable("");
  NOVA.fullday_ops = ko.observable("");
  NOVA.after_hour_ops = ko.observable("");
  NOVA.staff_glove = ko.observable("");
  NOVA.contamination_control = ko.observable("");
  NOVA.need_product_skill = ko.observable("");
  NOVA.product_skill = ko.observable("");
  NOVA.record_retention_period = ko.observable("");
  NOVA.record_system_backup = ko.observable("");
  NOVA.has_legal_requirement = ko.observable("");
  NOVA.legal_requirement = ko.observable("");
  NOVA.advisory_notice = ko.observable("");
  NOVA.need_risk_tool = ko.observable("");
  NOVA.risk_mgmt_tool = ko.observable("");
  NOVA.logistics_info_id = ko.observable("");


  jQuery.validator.addMethod("dollarsscents", function (value, element) {
      return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
    }, "Maximum 8 digit and 2 decimal place ");
  
    $("#createLogisticsInformation").validate({
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
        logisticsExpenditure: {
          number: true,
          dollarsscents: true
        },
      },      
      submitHandler: function(e, o) {
        // NOVA.leadLogisticsInfoSave()
      }
    });

    $('button[name="previous"], button[name="next"], button[name="savedata"]').on('click', function (e) {
      e.preventDefault();
      if ($('#createLogisticsInformation').valid()) {
        if($(this).attr('name') == 'previous') {
          NOVA.Previous();
        } else if($(this).attr('name') == 'next') {
          NOVA.leadLogisticsInfoNext()
        } else{
          NOVA.leadLogisticsInfoSave()
        }
      }
    });

  /*$('.custom-control-input').on('change', function(){
    if($(this).val() == 'true') { 
      $(this).parent().parent().find('.form-control').removeClass('d-none');
      $(this).parent().parent().find('.input-group').removeClass('d-none');   
    } else {
      $(this).parent().parent().find('.form-control').addClass('d-none');
      $(this).parent().parent().find('.input-group').addClass('d-none');   
    }
  });*/


  NOVA.getLogisticsdetail = function(data,e){
    var formdata = {
      'lead_id': NOVA.lead_id(),
    }
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/lead/logistics/info/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.preffered_warehouse(d.preffered_warehouse);
      NOVA.monthly_expenditure(d.monthly_expenditure);
      NOVA.is_officehours_ops(d.is_officehours_ops);
      NOVA.officehours_start(d.officehours_start);
      NOVA.officehours_end(d.officehours_end);
      NOVA.fullday_ops(d.fullday_ops);
      NOVA.after_hour_ops(d.after_hour_ops);
      NOVA.staff_glove(d.staff_glove);
      $('#controlExpectation').val(d.contamination_control);
      NOVA.contamination_control(d.contamination_control);
      NOVA.need_product_skill(d.need_product_skill);
      NOVA.product_skill(d.product_skill);
      NOVA.record_retention_period(d.record_retention_period);
      NOVA.record_system_backup(d.record_system_backup);
      NOVA.has_legal_requirement(d.has_legal_requirement);
      NOVA.legal_requirement(d.legal_requirement);
      NOVA.advisory_notice(d.advisory_notice);
      NOVA.need_risk_tool(d.need_risk_tool);
      NOVA.risk_mgmt_tool(d.risk_mgmt_tool);
      NOVA.logistics_info_id(d.logistics_info_id);
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

  NOVA.leadLogisticsInfoNext = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('preffered_warehouse', NOVA.preffered_warehouse());
    formdata.append('monthly_expenditure', NOVA.monthly_expenditure());
    formdata.append('is_officehours_ops', NOVA.is_officehours_ops());
    formdata.append('officehours_start', NOVA.officehours_start());
    formdata.append('officehours_end', NOVA.officehours_end());
    formdata.append('fullday_ops', NOVA.fullday_ops());
    formdata.append('after_hour_ops', NOVA.after_hour_ops());
    formdata.append('staff_glove', NOVA.staff_glove());
    formdata.append('contamination_control', $('#controlExpectation').val());
    formdata.append('need_product_skill', NOVA.need_product_skill());
    formdata.append('product_skill', NOVA.product_skill());
    formdata.append('record_retention_period', NOVA.record_retention_period());
    formdata.append('record_system_backup', NOVA.record_system_backup());
    formdata.append('has_legal_requirement', NOVA.has_legal_requirement());
    formdata.append('legal_requirement', NOVA.legal_requirement());
    formdata.append('advisory_notice', NOVA.advisory_notice());
    formdata.append('need_risk_tool', NOVA.need_risk_tool());
    formdata.append('risk_mgmt_tool', NOVA.risk_mgmt_tool());
    formdata.append('logistics_info_id', NOVA.logistics_info_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/logistics/info/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/product-receiving';
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.leadLogisticsInfoSave = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('preffered_warehouse', NOVA.preffered_warehouse());
    formdata.append('monthly_expenditure', NOVA.monthly_expenditure());
    formdata.append('is_officehours_ops', NOVA.is_officehours_ops());
    formdata.append('officehours_start', NOVA.officehours_start());
    formdata.append('officehours_end', NOVA.officehours_end());
    formdata.append('fullday_ops', NOVA.fullday_ops());
    formdata.append('after_hour_ops', NOVA.after_hour_ops());
    formdata.append('staff_glove', NOVA.staff_glove());
    formdata.append('contamination_control', $('#controlExpectation').val());
    formdata.append('need_product_skill', NOVA.need_product_skill());
    formdata.append('product_skill', NOVA.product_skill());
    formdata.append('record_retention_period', NOVA.record_retention_period());
    formdata.append('record_system_backup', NOVA.record_system_backup());
    formdata.append('has_legal_requirement', NOVA.has_legal_requirement());
    formdata.append('legal_requirement', NOVA.legal_requirement());
    formdata.append('advisory_notice', NOVA.advisory_notice());
    formdata.append('need_risk_tool', NOVA.need_risk_tool());
    formdata.append('risk_mgmt_tool', NOVA.risk_mgmt_tool());
    formdata.append('logistics_info_id', NOVA.logistics_info_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/logistics/info/create',
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

  NOVA.Previous = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('preffered_warehouse', NOVA.preffered_warehouse());
    formdata.append('monthly_expenditure', NOVA.monthly_expenditure());
    formdata.append('is_officehours_ops', NOVA.is_officehours_ops());
    formdata.append('officehours_start', NOVA.officehours_start());
    formdata.append('officehours_end', NOVA.officehours_end());
    formdata.append('fullday_ops', NOVA.fullday_ops());
    formdata.append('after_hour_ops', NOVA.after_hour_ops());
    formdata.append('staff_glove', NOVA.staff_glove());
    formdata.append('contamination_control', $('#controlExpectation').val());
    formdata.append('need_product_skill', NOVA.need_product_skill());
    formdata.append('product_skill', NOVA.product_skill());
    formdata.append('record_retention_period', NOVA.record_retention_period());
    formdata.append('record_system_backup', NOVA.record_system_backup());
    formdata.append('has_legal_requirement', NOVA.has_legal_requirement());
    formdata.append('legal_requirement', NOVA.legal_requirement());
    formdata.append('advisory_notice', NOVA.advisory_notice());
    formdata.append('need_risk_tool', NOVA.need_risk_tool());
    formdata.append('risk_mgmt_tool', NOVA.risk_mgmt_tool());
    formdata.append('logistics_info_id', NOVA.logistics_info_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/logistics/info/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/product-profile';
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
    var docUrlArr = document.URL.split('/');
    var lead_id = docUrlArr[docUrlArr.length - 3];
    NOVA.lead_id(lead_id);
    NOVA.getAppLogo();
    NOVA.getLogisticsdetail();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;