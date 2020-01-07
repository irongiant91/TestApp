(function (window) {

  NOVA.lead_id = ko.observable("");
  NOVA.product_profile_id = ko.observable("");
  NOVA.product_description = ko.observable("");
  NOVA.sku_available = ko.observable("");
  NOVA.avg_product_weight = ko.observable("");
  NOVA.max_product_weight = ko.observable("");
  NOVA.product_range_start = ko.observable("");
  NOVA.product_range_end = ko.observable("");
  NOVA.is_temp_controlled_product = ko.observable("");
  NOVA.temp_value = ko.observable("");
  NOVA.is_humidity_controlled_product = ko.observable("");
  NOVA.humidity_value = ko.observable("");
  NOVA.is_shelflife_controlled = ko.observable("");
  NOVA.shelf_life = ko.observable("");
  NOVA.is_production_date_controlled = ko.observable("");
  NOVA.production_date = ko.observable("");
  NOVA.is_lotnum_controlled = ko.observable("");
  NOVA.lot_number = ko.observable("");
  NOVA.is_slnum_controlled = ko.observable("");
  NOVA.sl_number = ko.observable("");
  NOVA.is_stackable = ko.observable("");
  NOVA.stack_number = ko.observable("");
  NOVA.monitor_product_expiry = ko.observable("");
  NOVA.product_expiry = ko.observable("");
  NOVA.stoc_dispossal_procedure = ko.observable("");
  NOVA.product_recall_required = ko.observable("");
  NOVA.produc_recall_procedure = ko.observable("");


  $("#createProductProfile").validate({
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
      skuAvailable: {
        number: true
      },
      averageWeight: {
        number: true
      },
      maximumWeight: {
        number: true
      },
      fromValue: {
        number: true
      },
      toValue: {
        number: true
      },
    },
    submitHandler: function() {
      // NOVA.leadProductProfileSave();
    }
  });

  $('button[name="next"], button[name="savedata"]').on('click', function (e) {
    e.preventDefault();
    if ($('#createProductProfile').valid()) {
      if($(this).attr('name') == 'previous') {
        NOVA.Previous();
      } else if($(this).attr('name') == 'next') {
        NOVA.leadProductProfileNext()
      } else{
        NOVA.leadProductProfileSave()
      }
    }
  });

  $('.custom-control-input').on('change', function(){
    if($(this).val() == 'true') { 
        $('#productExpiry').daterangepicker({
          singleDatePicker: true,
          showDropdowns: true,
          autoUpdateInput: false,
          opens: "left",
          locale: {
              format: 'DD MMM YYYY'
          }
        }).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD MMM YYYY')).trigger("change");
        });
      $(this).parent().parent().find('.form-control').removeClass('d-none');
      $(this).parent().parent().find('.input-group').removeClass('d-none');
    } else {  
      $(this).parent().parent().find('.form-control').addClass('d-none');
      $(this).parent().parent().find('.input-group').addClass('d-none');
      $(this).parent().parent().find('.input-group').val('')
    }
  });

  NOVA.getproductProfiledetail = function(data,e){
    var formdata = {
      'lead_id': NOVA.lead_id(),
    }
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/product/profile/details/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.product_profile_id(d.product_profile_id);
      NOVA.product_description(d.product_description);
      NOVA.sku_available(d.sku_available);
      NOVA.avg_product_weight(d.avg_product_weight);
      NOVA.max_product_weight(d.max_product_weight);
      NOVA.product_range_start(d.product_range_start);
      NOVA.product_range_end(d.product_range_end);
      NOVA.is_temp_controlled_product(d.is_temp_controlled_product);
      NOVA.temp_value(d.temp_value);
      NOVA.is_humidity_controlled_product(d.is_humidity_controlled_product);
      NOVA.humidity_value(d.humidity_value);
      NOVA.is_shelflife_controlled(d.is_shelflife_controlled);
      NOVA.shelf_life(d.shelf_life);
      NOVA.is_production_date_controlled(d.is_production_date_controlled);
      NOVA.production_date(d.production_date);
      NOVA.is_lotnum_controlled(d.is_lotnum_controlled);
      NOVA.lot_number(d.lot_number);
      NOVA.is_slnum_controlled(d.is_slnum_controlled);
      NOVA.sl_number(d.sl_number);
      NOVA.is_stackable(d.is_stackable);
      NOVA.stack_number(d.stack_number);
      NOVA.monitor_product_expiry(d.monitor_product_expiry);
      NOVA.product_expiry(d.product_expiry);
      NOVA.stoc_dispossal_procedure(d.stoc_dispossal_procedure);
      $('#stocDispossalProcedure').val(d.stoc_dispossal_procedure)
      NOVA.product_recall_required(d.product_recall_required);
      NOVA.produc_recall_procedure(d.produc_recall_procedure);
      $('#producRecallProcedure').val(d.produc_recall_procedure);
      if(d.has_requirements == true){
        $('.has-requirement').prop("disabled", true)
      }else{
        $('.has-requirement').prop("disabled", false)
      }
      $('#productExpiry').daterangepicker({
          singleDatePicker: true,
          showDropdowns: true,
          autoUpdateInput: false,
          opens: "left",
          locale: {
              format: 'DD MMM YYYY'
          }
        }).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD MMM YYYY')).trigger("change");
        });
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.leadProductProfileSave = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('product_profile_id', NOVA.product_profile_id());
    formdata.append('product_description', NOVA.product_description());
    formdata.append('sku_available', NOVA.sku_available());
    formdata.append('avg_product_weight', NOVA.avg_product_weight());
    formdata.append('max_product_weight', NOVA.max_product_weight());
    formdata.append('product_range_start', NOVA.product_range_start());
    formdata.append('product_range_end', NOVA.product_range_end());
    formdata.append('is_temp_controlled_product', NOVA.is_temp_controlled_product());
    formdata.append('temp_value', NOVA.temp_value());
    formdata.append('is_humidity_controlled_product', NOVA.is_humidity_controlled_product());
    formdata.append('humidity_value', NOVA.humidity_value());
    formdata.append('is_shelflife_controlled', NOVA.is_shelflife_controlled());
    formdata.append('shelf_life', NOVA.shelf_life());
    formdata.append('is_production_date_controlled', NOVA.is_production_date_controlled());
    formdata.append('production_date', NOVA.production_date());
    formdata.append('is_lotnum_controlled', NOVA.is_lotnum_controlled());
    formdata.append('lot_number', NOVA.lot_number());
    formdata.append('is_slnum_controlled', NOVA.is_slnum_controlled());
    formdata.append('sl_number', NOVA.sl_number());
    formdata.append('is_stackable', NOVA.is_stackable());
    formdata.append('stack_number', NOVA.stack_number());
    formdata.append('monitor_product_expiry', NOVA.monitor_product_expiry());
    formdata.append('product_expiry', NOVA.product_expiry());
    formdata.append('stoc_dispossal_procedure', $('#stocDispossalProcedure').val());
    formdata.append('product_recall_required', NOVA.product_recall_required());
    formdata.append('produc_recall_procedure', $('#producRecallProcedure').val());
    $.ajax({
      method: 'POST',
      url: '/api/lead/product/profile/create',
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

  NOVA.leadProductProfileNext = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('product_profile_id', NOVA.product_profile_id());
    formdata.append('product_description', NOVA.product_description());
    formdata.append('sku_available', NOVA.sku_available());
    formdata.append('avg_product_weight', NOVA.avg_product_weight());
    formdata.append('max_product_weight', NOVA.max_product_weight());
    formdata.append('product_range_start', NOVA.product_range_start());
    formdata.append('product_range_end', NOVA.product_range_end());
    formdata.append('is_temp_controlled_product', NOVA.is_temp_controlled_product());
    formdata.append('temp_value', NOVA.temp_value());
    formdata.append('is_humidity_controlled_product', NOVA.is_humidity_controlled_product());
    formdata.append('humidity_value', NOVA.humidity_value());
    formdata.append('is_shelflife_controlled', NOVA.is_shelflife_controlled());
    formdata.append('shelf_life', NOVA.shelf_life());
    formdata.append('is_production_date_controlled', NOVA.is_production_date_controlled());
    formdata.append('production_date', NOVA.production_date());
    formdata.append('is_lotnum_controlled', NOVA.is_lotnum_controlled());
    formdata.append('lot_number', NOVA.lot_number());
    formdata.append('is_slnum_controlled', NOVA.is_slnum_controlled());
    formdata.append('sl_number', NOVA.sl_number());
    formdata.append('is_stackable', NOVA.is_stackable());
    formdata.append('stack_number', NOVA.stack_number());
    formdata.append('monitor_product_expiry', NOVA.monitor_product_expiry());
    formdata.append('product_expiry', NOVA.product_expiry());
    formdata.append('stoc_dispossal_procedure', $('#stocDispossalProcedure').val());
    formdata.append('product_recall_required', NOVA.product_recall_required());
    formdata.append('produc_recall_procedure', $('#producRecallProcedure').val());
    $.ajax({
      method: 'POST',
      url: '/api/lead/product/profile/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/logistics-information';
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
    NOVA.getproductProfiledetail();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;