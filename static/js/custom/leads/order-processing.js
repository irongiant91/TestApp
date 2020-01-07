(function (window) {

  NOVA.lead_id = ko.observable("");
  NOVA.order_receipt_time = ko.observable("");
  NOVA.order_transmission = ko.observable("");
  NOVA.min_daily_pickslip = ko.observable("");
  NOVA.max_daily_pickslip = ko.observable("");
  NOVA.avg_daily_pickslip = ko.observable("");
  NOVA.handling_required = ko.observable("");
  NOVA.handling_details = ko.observable("");
  NOVA.order_label = ko.observable("");
  NOVA.security_tape_sealing = ko.observable("");
  NOVA.need_repacking = ko.observable("");
  NOVA.repacking_details = ko.observable("");
  NOVA.need_relabeling = ko.observable("");
  NOVA.relabeling_details = ko.observable("");
  NOVA.picking_rule = ko.observable("");
  NOVA.deliver_order_number = ko.observable("");
  NOVA.deliver_order_volume = ko.observable("");
  NOVA.deliver_order_carton = ko.observable("");
  NOVA.deliver_order_weight = ko.observable("");
  NOVA.min_monthly_order = ko.observable("");
  NOVA.max_monthly_order = ko.observable("");
  NOVA.avg_monthly_order = ko.observable("");
  NOVA.avg_line_per_order = ko.observable("");
  NOVA.max_line_per_order = ko.observable("");
  NOVA.min_line_per_order = ko.observable("");
  NOVA.shipment_method = ko.observable("");
  NOVA.avg_shipment_ordersize = ko.observable("");
  NOVA.max_shipment_ordersize = ko.observable("");
  NOVA.min_shipment_ordersize = ko.observable("");
  NOVA.land_transport_mode = ko.observable("");
  NOVA.sea_transport_mode = ko.observable("");
  NOVA.air_transport_mode = ko.observable("");
  NOVA.courier_transport_mode = ko.observable("");
  NOVA.distribution_order = ko.observable("");
  NOVA.transport_service_provider_a = ko.observable("");
  NOVA.transport_service_provider_b = ko.observable("");
  NOVA.transport_service_provider_c = ko.observable("");
  NOVA.turnover_rate = ko.observable("");
  NOVA.export_sales_ratio = ko.observable("");
  NOVA.packing_condition = ko.observable("");
  NOVA.special_equipment = ko.observable("");
  NOVA.special_equipment_other = ko.observable("");
  NOVA.delivery_area = ko.observable("");
  NOVA.delivery_area_other = ko.observable("");
  NOVA.order_processing_id = ko.observable("");

  $("#createorderShipping").validate({
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
      averagePerDay: {
        number: true
      },
      maximumPerDay: {
        number: true
      },
      minimumPerDay: {
        number: true
      },
      deliveryOrder: {
        number: true
      },
      estimateVolume: {
        number: true
      },
      estimateWeight: {
        number: true
      },
      monthlyAverage: {
        number: true
      },
      monthlyMaximum: {
        number: true
      },
      monthlyMinimum: {
        number: true
      },
       lineAverage: {
        number: true
      },
      lineMaximum: {
        number: true
      },
      lineMinimum: {
        number: true
      },
      orderShipmentAve: {
        number: true
      },
      orderShipmentMax: {
        number: true
      },
      orderShipmentMin: {
        number: true
      },
      transportModeLand: {
        number: true
      },
      transportModeSea: {
        number: true
      },
      transportModeAir: {
        number: true
      },
      transportModeCourier: {
        number: true
      },
      providersA: {
        number: true
      },
      providersB: {
        number: true
      },
      providersc: {
        number: true
      },
      rate: {
        number: true
      },
      salesRatio: {
        number: true
      },
    },
    
    submitHandler: function() {
      // NOVA.leadorderInfoSave();
    }
  });

  $('button[name="previous"], button[name="next"], button[name="savedata"]').on('click', function (e) {
    e.preventDefault();
    if ($('#createorderShipping').valid()) {
      if($(this).attr('name') == 'previous') {
        NOVA.Previous();
      } else if($(this).attr('name') == 'next') {
        NOVA.leadorderInfoNext()
      } else{
        NOVA.leadorderInfoSave()
      }
    }
  });

  NOVA.getorderProcessingDetail = function(data,e){
    var formdata = {
      'lead_id': NOVA.lead_id(),
    }
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/order/processing/info/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.order_receipt_time(d.order_receipt_time);
      NOVA.order_transmission(d.order_transmission);
      NOVA.avg_daily_pickslip(d.avg_daily_pickslip);
      NOVA.max_daily_pickslip(d.max_daily_pickslip);
      NOVA.min_daily_pickslip(d.min_daily_pickslip);
      NOVA.handling_required(d.handling_required);
      NOVA.handling_details(d.handling_details);
      NOVA.order_label(d.order_label);
      NOVA.security_tape_sealing(d.security_tape_sealing);
      NOVA.need_repacking(d.need_repacking);
      NOVA.repacking_details(d.repacking_details);
      NOVA.need_relabeling(d.need_relabeling);
      NOVA.relabeling_details(d.relabeling_details);
      NOVA.picking_rule(d.picking_rule);
      NOVA.deliver_order_number(d.deliver_order_number);
      NOVA.deliver_order_volume(d.deliver_order_volume);
      NOVA.deliver_order_carton(d.deliver_order_carton);
      NOVA.deliver_order_weight(d.deliver_order_weight);
      NOVA.avg_monthly_order(d.avg_monthly_order);
      NOVA.max_monthly_order(d.max_monthly_order);
      NOVA.min_monthly_order(d.min_monthly_order);
      NOVA.avg_line_per_order(d.avg_line_per_order);
      NOVA.max_line_per_order(d.max_line_per_order);
      NOVA.min_line_per_order(d.min_line_per_order);
      NOVA.shipment_method(d.shipment_method);
      NOVA.avg_shipment_ordersize(d.avg_shipment_ordersize);
      NOVA.max_shipment_ordersize(d.max_shipment_ordersize);
      NOVA.min_shipment_ordersize(d.min_shipment_ordersize);
      NOVA.land_transport_mode(d.land_transport_mode);
      NOVA.sea_transport_mode(d.sea_transport_mode);
      NOVA.air_transport_mode(d.air_transport_mode);
      NOVA.courier_transport_mode(d.courier_transport_mode);
      NOVA.distribution_order(d.distribution_order);
      NOVA.transport_service_provider_a(d.transport_service_provider_a);
      NOVA.transport_service_provider_b(d.transport_service_provider_b);
      NOVA.transport_service_provider_c(d.transport_service_provider_c);
      NOVA.turnover_rate(d.turnover_rate);
      NOVA.export_sales_ratio(d.export_sales_ratio);
      NOVA.packing_condition(d.packing_condition);
      NOVA.special_equipment(d.special_equipment);
      NOVA.special_equipment_other(d.special_equipment_other);
      NOVA.delivery_area(d.delivery_area);
      NOVA.delivery_area_other(d.delivery_area_other);
      NOVA.order_processing_id(d.order_processing_id);
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

  NOVA.leadorderInfoSave = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('order_receipt_time', NOVA.order_receipt_time());
    formdata.append('order_transmission', NOVA.order_transmission());
    formdata.append('min_daily_pickslip', NOVA.min_daily_pickslip());
    formdata.append('max_daily_pickslip', NOVA.max_daily_pickslip());
    formdata.append('avg_daily_pickslip', NOVA.avg_daily_pickslip());
    formdata.append('handling_required', NOVA.handling_required());
    formdata.append('handling_details', NOVA.handling_details());
    formdata.append('order_label', NOVA.order_label());
    formdata.append('security_tape_sealing', NOVA.security_tape_sealing());
    formdata.append('need_repacking', NOVA.need_repacking());
    formdata.append('repacking_details', NOVA.repacking_details());
    formdata.append('need_relabeling', NOVA.need_relabeling());
    formdata.append('relabeling_details', NOVA.relabeling_details());
    formdata.append('picking_rule', NOVA.picking_rule());
    formdata.append('deliver_order_number', NOVA.deliver_order_number());
    formdata.append('deliver_order_volume', NOVA.deliver_order_volume());
    formdata.append('deliver_order_carton', NOVA.deliver_order_carton());
    formdata.append('deliver_order_weight', NOVA.deliver_order_weight());
    formdata.append('min_monthly_order', NOVA.min_monthly_order());
    formdata.append('max_monthly_order', NOVA.max_monthly_order());
    formdata.append('avg_monthly_order', NOVA.avg_monthly_order());
    formdata.append('avg_line_per_order', NOVA.avg_line_per_order());
    formdata.append('max_line_per_order', NOVA.max_line_per_order());
    formdata.append('min_line_per_order', NOVA.min_line_per_order());
    formdata.append('shipment_method', NOVA.shipment_method());
    formdata.append('min_shipment_ordersize', NOVA.min_shipment_ordersize());
    formdata.append('max_shipment_ordersize', NOVA.max_shipment_ordersize());
    formdata.append('avg_shipment_ordersize', NOVA.avg_shipment_ordersize());
    formdata.append('land_transport_mode', NOVA.land_transport_mode());
    formdata.append('sea_transport_mode', NOVA.sea_transport_mode());
    formdata.append('air_transport_mode', NOVA.air_transport_mode());
    formdata.append('courier_transport_mode', NOVA.courier_transport_mode());
    formdata.append('distribution_order', NOVA.distribution_order());
    formdata.append('transport_service_provider_a', NOVA.transport_service_provider_a());
    formdata.append('transport_service_provider_b', NOVA.transport_service_provider_b());
    formdata.append('transport_service_provider_c', NOVA.transport_service_provider_c());
    formdata.append('turnover_rate', NOVA.turnover_rate());
    formdata.append('export_sales_ratio', NOVA.export_sales_ratio());
    formdata.append('packing_condition', NOVA.packing_condition());
    formdata.append('special_equipment', NOVA.special_equipment());
    formdata.append('special_equipment_other', NOVA.special_equipment_other());
    formdata.append('delivery_area', NOVA.delivery_area());
    formdata.append('delivery_area_other', NOVA.delivery_area_other());
    formdata.append('order_processing_id', NOVA.order_processing_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/order/processing/info/create',
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
      NOVA.getorderProcessingDetail();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.leadorderInfoNext = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('order_receipt_time', NOVA.order_receipt_time());
    formdata.append('order_transmission', NOVA.order_transmission());
    formdata.append('min_daily_pickslip', NOVA.min_daily_pickslip());
    formdata.append('max_daily_pickslip', NOVA.max_daily_pickslip());
    formdata.append('avg_daily_pickslip', NOVA.avg_daily_pickslip());
    formdata.append('handling_required', NOVA.handling_required());
    formdata.append('handling_details', NOVA.handling_details());
    formdata.append('order_label', NOVA.order_label());
    formdata.append('security_tape_sealing', NOVA.security_tape_sealing());
    formdata.append('need_repacking', NOVA.need_repacking());
    formdata.append('repacking_details', NOVA.repacking_details());
    formdata.append('need_relabeling', NOVA.need_relabeling());
    formdata.append('relabeling_details', NOVA.relabeling_details());
    formdata.append('picking_rule', NOVA.picking_rule());
    formdata.append('deliver_order_number', NOVA.deliver_order_number());
    formdata.append('deliver_order_volume', NOVA.deliver_order_volume());
    formdata.append('deliver_order_carton', NOVA.deliver_order_carton());
    formdata.append('deliver_order_weight', NOVA.deliver_order_weight());
    formdata.append('min_monthly_order', NOVA.min_monthly_order());
    formdata.append('max_monthly_order', NOVA.max_monthly_order());
    formdata.append('avg_monthly_order', NOVA.avg_monthly_order());
    formdata.append('avg_line_per_order', NOVA.avg_line_per_order());
    formdata.append('max_line_per_order', NOVA.max_line_per_order());
    formdata.append('min_line_per_order', NOVA.min_line_per_order());
    formdata.append('shipment_method', NOVA.shipment_method());
    formdata.append('min_shipment_ordersize', NOVA.min_shipment_ordersize());
    formdata.append('max_shipment_ordersize', NOVA.max_shipment_ordersize());
    formdata.append('avg_shipment_ordersize', NOVA.avg_shipment_ordersize());
    formdata.append('land_transport_mode', NOVA.land_transport_mode());
    formdata.append('sea_transport_mode', NOVA.sea_transport_mode());
    formdata.append('air_transport_mode', NOVA.air_transport_mode());
    formdata.append('courier_transport_mode', NOVA.courier_transport_mode());
    formdata.append('distribution_order', NOVA.distribution_order());
    formdata.append('transport_service_provider_a', NOVA.transport_service_provider_a());
    formdata.append('transport_service_provider_b', NOVA.transport_service_provider_b());
    formdata.append('transport_service_provider_c', NOVA.transport_service_provider_c());
    formdata.append('turnover_rate', NOVA.turnover_rate());
    formdata.append('export_sales_ratio', NOVA.export_sales_ratio());
    formdata.append('packing_condition', NOVA.packing_condition());
    formdata.append('special_equipment', NOVA.special_equipment());
    formdata.append('special_equipment_other', NOVA.special_equipment_other());
    formdata.append('delivery_area', NOVA.delivery_area());
    formdata.append('delivery_area_other', NOVA.delivery_area_other());
    formdata.append('order_processing_id', NOVA.order_processing_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/order/processing/info/create',
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
  };


  NOVA.Previous = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('order_receipt_time', NOVA.order_receipt_time());
    formdata.append('order_transmission', NOVA.order_transmission());
    formdata.append('min_daily_pickslip', NOVA.min_daily_pickslip());
    formdata.append('max_daily_pickslip', NOVA.max_daily_pickslip());
    formdata.append('avg_daily_pickslip', NOVA.avg_daily_pickslip());
    formdata.append('handling_required', NOVA.handling_required());
    formdata.append('handling_details', NOVA.handling_details());
    formdata.append('order_label', NOVA.order_label());
    formdata.append('security_tape_sealing', NOVA.security_tape_sealing());
    formdata.append('need_repacking', NOVA.need_repacking());
    formdata.append('repacking_details', NOVA.repacking_details());
    formdata.append('need_relabeling', NOVA.need_relabeling());
    formdata.append('relabeling_details', NOVA.relabeling_details());
    formdata.append('picking_rule', NOVA.picking_rule());
    formdata.append('deliver_order_number', NOVA.deliver_order_number());
    formdata.append('deliver_order_volume', NOVA.deliver_order_volume());
    formdata.append('deliver_order_carton', NOVA.deliver_order_carton());
    formdata.append('deliver_order_weight', NOVA.deliver_order_weight());
    formdata.append('min_monthly_order', NOVA.min_monthly_order());
    formdata.append('max_monthly_order', NOVA.max_monthly_order());
    formdata.append('avg_monthly_order', NOVA.avg_monthly_order());
    formdata.append('avg_line_per_order', NOVA.avg_line_per_order());
    formdata.append('max_line_per_order', NOVA.max_line_per_order());
    formdata.append('min_line_per_order', NOVA.min_line_per_order());
    formdata.append('shipment_method', NOVA.shipment_method());
    formdata.append('min_shipment_ordersize', NOVA.min_shipment_ordersize());
    formdata.append('max_shipment_ordersize', NOVA.max_shipment_ordersize());
    formdata.append('avg_shipment_ordersize', NOVA.avg_shipment_ordersize());
    formdata.append('land_transport_mode', NOVA.land_transport_mode());
    formdata.append('sea_transport_mode', NOVA.sea_transport_mode());
    formdata.append('air_transport_mode', NOVA.air_transport_mode());
    formdata.append('courier_transport_mode', NOVA.courier_transport_mode());
    formdata.append('distribution_order', NOVA.distribution_order());
    formdata.append('transport_service_provider_a', NOVA.transport_service_provider_a());
    formdata.append('transport_service_provider_b', NOVA.transport_service_provider_b());
    formdata.append('transport_service_provider_c', NOVA.transport_service_provider_c());
    formdata.append('turnover_rate', NOVA.turnover_rate());
    formdata.append('export_sales_ratio', NOVA.export_sales_ratio());
    formdata.append('packing_condition', NOVA.packing_condition());
    formdata.append('special_equipment', NOVA.special_equipment());
    formdata.append('special_equipment_other', NOVA.special_equipment_other());
    formdata.append('delivery_area', NOVA.delivery_area());
    formdata.append('delivery_area_other', NOVA.delivery_area_other());
    formdata.append('order_processing_id', NOVA.order_processing_id());
    $.ajax({
      method: 'POST',
      url: '/api/lead/order/processing/info/create',
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
    NOVA.getorderProcessingDetail();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;