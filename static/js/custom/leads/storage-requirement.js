(function (window) {

  NOVA.lead_id = ko.observable("");
  NOVA.warehouse_type = ko.observable("");
  NOVA.warehouse_temperature = ko.observable("");
  NOVA.warehouse_humidity = ko.observable("");
  NOVA.warehouse_remarks = ko.observable("");
  NOVA.nonac_floorspace = ko.observable("");
  NOVA.ac_floorspace = ko.observable("");
  NOVA.need_officespace = ko.observable("");
  NOVA.officespace_requirement = ko.observable("");
  NOVA.need_cleanspace = ko.observable("");
  NOVA.cleanspace_requirement = ko.observable("");
  NOVA.cleanspace_class_type = ko.observable("");
  NOVA.need_surround_storage = ko.observable("");
  NOVA.surround_storage_requirement = ko.observable("");
  NOVA.pest_control_requirement = ko.observable("");
  NOVA.require_equipment_caliberation = ko.observable("");
  NOVA.equipment_caliberation_details = ko.observable("");
  NOVA.cleaniness_requirement = ko.observable("");
  NOVA.storage_type = ko.observable("");
  NOVA.estimated_inventory_value = ko.observable("");
  NOVA.estimated_sku_perpart = ko.observable("");
  NOVA.is_social_security_required = ko.observable("");
  NOVA.social_security_details = ko.observable("");
  NOVA.storage_requirement_id = ko.observable("");


  $.validator.addMethod("dollarsscents", function (value, element) {
      return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
  }, "Maximum 8 digit and 2 decimal place ");

  $("#storageRequirementForm").validate({
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
        requiredTemp: {
          number: true
        },
        requiredHumidity: {
          number: true
        },
        estimatedInventoryValue: {
          number: true,
          dollarsscents: true
        }
      },
      
      submitHandler: function() {
        // NOVA.leadstorageRequirmentInfoSave();
      }
  });

  $('button[name="previous"], button[name="next"], button[name="savedata"]').on('click', function (e) {
    e.preventDefault();
    if ($('#storageRequirementForm').valid()) {
      if($(this).attr('name') == 'previous') {
        NOVA.Previous();
      } else if($(this).attr('name') == 'next') {
        NOVA.leadstorageRequirmentInfoNext()
      } else{
        NOVA.leadstorageRequirmentInfoSave()
      }
    }
  });

  NOVA.getorderstorageRequirmentDetail = function(data,e){
    var formdata = {
      'lead_id': NOVA.lead_id(),
    }
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/storage/requiremet/info/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.warehouse_type(d.warehouse_type);
      NOVA.warehouse_temperature(d.warehouse_temperature);
      NOVA.warehouse_humidity(d.warehouse_humidity);
      NOVA.warehouse_remarks(d.warehouse_remarks);
      NOVA.nonac_floorspace(d.nonac_floorspace);
      NOVA.ac_floorspace(d.ac_floorspace);
      NOVA.need_officespace(d.need_officespace);
      NOVA.officespace_requirement(d.officespace_requirement);
      NOVA.need_cleanspace(d.need_cleanspace);
      NOVA.cleanspace_requirement(d.cleanspace_requirement);
      NOVA.cleanspace_class_type(d.cleanspace_class_type);
      NOVA.need_surround_storage(d.need_surround_storage);
      NOVA.surround_storage_requirement(d.surround_storage_requirement);
      NOVA.pest_control_requirement(d.pest_control_requirement);
      NOVA.require_equipment_caliberation(d.require_equipment_caliberation);
      NOVA.equipment_caliberation_details(d.equipment_caliberation_details);
      NOVA.cleaniness_requirement(d.cleaniness_requirement);
      NOVA.storage_type(d.storage_type);
      NOVA.estimated_inventory_value(d.estimated_inventory_value);
      NOVA.estimated_sku_perpart(d.estimated_sku_perpart);
      NOVA.is_social_security_required(d.is_social_security_required);
      NOVA.social_security_details(d.social_security_details);
      NOVA.storage_requirement_id(d.storage_requirement_id);
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

  NOVA.leadstorageRequirmentInfoSave = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('warehouse_type', NOVA.warehouse_type());
    formdata.append('warehouse_temperature', NOVA.warehouse_temperature());
    formdata.append('warehouse_humidity', NOVA.warehouse_humidity());
    formdata.append('warehouse_remarks', NOVA.warehouse_remarks());
    formdata.append('nonac_floorspace', NOVA.nonac_floorspace());
    formdata.append('ac_floorspace', NOVA.ac_floorspace());
    formdata.append('need_officespace', NOVA.need_officespace());
    formdata.append('officespace_requirement', NOVA.officespace_requirement());
    formdata.append('need_cleanspace', NOVA.need_cleanspace());
    formdata.append('cleanspace_requirement', NOVA.cleanspace_requirement());
    formdata.append('cleanspace_class_type', NOVA.cleanspace_class_type());
    formdata.append('need_surround_storage', NOVA.need_surround_storage());
    formdata.append('surround_storage_requirement', NOVA.surround_storage_requirement());
    formdata.append('pest_control_requirement', NOVA.pest_control_requirement());
    formdata.append('require_equipment_caliberation', NOVA.require_equipment_caliberation());
    formdata.append('equipment_caliberation_details', NOVA.equipment_caliberation_details());
    formdata.append('cleaniness_requirement', NOVA.cleaniness_requirement());
    formdata.append('storage_type', NOVA.storage_type());
    formdata.append('estimated_inventory_value', NOVA.estimated_inventory_value());
    formdata.append('estimated_sku_perpart', NOVA.estimated_sku_perpart());
    formdata.append('is_social_security_required', NOVA.is_social_security_required());
    formdata.append('social_security_details', NOVA.social_security_details());
    formdata.append('storage_requirement_id', NOVA.storage_requirement_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/storage/requirment/info/create',
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

  NOVA.leadstorageRequirmentInfoNext = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('warehouse_type', NOVA.warehouse_type());
    formdata.append('warehouse_temperature', NOVA.warehouse_temperature());
    formdata.append('warehouse_humidity', NOVA.warehouse_humidity());
    formdata.append('warehouse_remarks', NOVA.warehouse_remarks());
    formdata.append('nonac_floorspace', NOVA.nonac_floorspace());
    formdata.append('ac_floorspace', NOVA.ac_floorspace());
    formdata.append('need_officespace', NOVA.need_officespace());
    formdata.append('officespace_requirement', NOVA.officespace_requirement());
    formdata.append('need_cleanspace', NOVA.need_cleanspace());
    formdata.append('cleanspace_requirement', NOVA.cleanspace_requirement());
    formdata.append('cleanspace_class_type', NOVA.cleanspace_class_type());
    formdata.append('need_surround_storage', NOVA.need_surround_storage());
    formdata.append('surround_storage_requirement', NOVA.surround_storage_requirement());
    formdata.append('pest_control_requirement', NOVA.pest_control_requirement());
    formdata.append('require_equipment_caliberation', NOVA.require_equipment_caliberation());
    formdata.append('equipment_caliberation_details', NOVA.equipment_caliberation_details());
    formdata.append('cleaniness_requirement', NOVA.cleaniness_requirement());
    formdata.append('storage_type', NOVA.storage_type());
    formdata.append('estimated_inventory_value', NOVA.estimated_inventory_value());
    formdata.append('estimated_sku_perpart', NOVA.estimated_sku_perpart());
    formdata.append('is_social_security_required', NOVA.is_social_security_required());
    formdata.append('social_security_details', NOVA.social_security_details());
    formdata.append('storage_requirement_id', NOVA.storage_requirement_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/storage/requirment/info/create',
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


  NOVA.Previous = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('warehouse_type', NOVA.warehouse_type());
    formdata.append('warehouse_temperature', NOVA.warehouse_temperature());
    formdata.append('warehouse_humidity', NOVA.warehouse_humidity());
    formdata.append('warehouse_remarks', NOVA.warehouse_remarks());
    formdata.append('nonac_floorspace', NOVA.nonac_floorspace());
    formdata.append('ac_floorspace', NOVA.ac_floorspace());
    formdata.append('need_officespace', NOVA.need_officespace());
    formdata.append('officespace_requirement', NOVA.officespace_requirement());
    formdata.append('need_cleanspace', NOVA.need_cleanspace());
    formdata.append('cleanspace_requirement', NOVA.cleanspace_requirement());
    formdata.append('cleanspace_class_type', NOVA.cleanspace_class_type());
    formdata.append('need_surround_storage', NOVA.need_surround_storage());
    formdata.append('surround_storage_requirement', NOVA.surround_storage_requirement());
    formdata.append('pest_control_requirement', NOVA.pest_control_requirement());
    formdata.append('require_equipment_caliberation', NOVA.require_equipment_caliberation());
    formdata.append('equipment_caliberation_details', NOVA.equipment_caliberation_details());
    formdata.append('cleaniness_requirement', NOVA.cleaniness_requirement());
    formdata.append('storage_type', NOVA.storage_type());
    formdata.append('estimated_inventory_value', NOVA.estimated_inventory_value());
    formdata.append('estimated_sku_perpart', NOVA.estimated_sku_perpart());
    formdata.append('is_social_security_required', NOVA.is_social_security_required());
    formdata.append('social_security_details', NOVA.social_security_details());
    formdata.append('storage_requirement_id', NOVA.storage_requirement_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/storage/requirment/info/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/order-processing-shipment';
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

  $('#navItemLeads').addClass('active');

})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var lead_id = docUrlArr[docUrlArr.length - 3];
    NOVA.lead_id(lead_id);
    NOVA.getAppLogo();
    NOVA.getorderstorageRequirmentDetail();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;