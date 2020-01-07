(function (window) {

  NOVA.lead_id = ko.observable("");
  NOVA.need_replishment = ko.observable("");
  NOVA.replenish_from = ko.observable("");
  NOVA.replenish_frequency = ko.observable("");
  NOVA.monthly_shipment_num = ko.observable("");
  NOVA.monthly_shipment_volume = ko.observable("");
  NOVA.min_receipt_order = ko.observable("");
  NOVA.max_receipt_order = ko.observable("");
  NOVA.avg_receipt_order = ko.observable("");
  NOVA.min_receipt_lineitems = ko.observable("");
  NOVA.max_receipt_lineitems = ko.observable("");
  NOVA.avg_receipt_lineitems = ko.observable("");
  NOVA.has_std_packing = ko.observable("");
  NOVA.receiving_inspection_criteria = ko.observable("");
  NOVA.pr_info_id = ko.observable("");

  NOVA.packingdetailsList = ko.observableArray([]);

  var packing_item = function (){
    this.packing_id = ko.observable('');
    this.length = ko.observable('');
    this.width = ko.observable('');
    this.height = ko.observable('');
    this.fill = function (d) {
        this.packing_id('' || d.packing_id);
        this.length('' || d.length);
        this.width('' || d.width);
        this.height('' || d.height);
    }
  };


  $("#createProductReceiving").validate({
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
      shippmentNo: {
        number: true
      },
      volume: {
        number: true
      },
      averagePerDay: {
        number: true
      },
      maximumPerDay: {
        number: true
      },
      minimumPerDay: {
        number: true
      },
      averagePerReceipt: {
        number: true
      },
      maximumPerReceipt: {
        number: true
      },
      minimumPerReceipt: {
        number: true
      },
    },
    
    submitHandler: function() {
      // NOVA.leadproductReceivingInfoSave();
    }
  });

  $('button[name="previous"], button[name="next"], button[name="savedata"]').on('click', function (e) {
    e.preventDefault();
    if ($('#createProductReceiving').valid()) {
      if($(this).attr('name') == 'previous') {
        NOVA.Previous();
      } else if($(this).attr('name') == 'next') {
        NOVA.leadproductReceivingInfoNext()
      } else{
        NOVA.leadproductReceivingInfoSave()
      }
    }
  });

  $('.custom-control-input').on('change', function(){
    if($(this).val() == 'true') { 
      $(this).parent().parent().find('.form-control').removeClass('d-none');
      $(this).parent().parent().find('.input-group').removeClass('d-none');   
    } else {
      $(this).parent().parent().find('.form-control').addClass('d-none');
      $(this).parent().parent().find('.input-group').addClass('d-none');   
    }
  });

  $('[name="specialSKill"]').on('change', function(){
    if($('#specialSKillYes').is(':checked')) {
      $('#configureRatesTable').removeClass('d-none');
    } else {
      $('#configureRatesTable').addClass('d-none');
    }
  })

  NOVA.packing_detail_init = function(){
    var packing_item1 = new packing_item();
    d = {
      packing_id : '',
      length : '',
      width : '',
      height : '',
    }
    packing_item1.fill(d)
    NOVA.packingdetailsList.push(packing_item1);
  }


  NOVA.getproductReceivingDetail = function(data,e){
    var formdata = {
      'lead_id': NOVA.lead_id(),
    }
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/product/receiving/info/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.packingdetailsList([]);
      NOVA.need_replishment(d.need_replishment);
      NOVA.replenish_from(d.replenish_from);
      NOVA.replenish_frequency(d.replenish_frequency);
      NOVA.monthly_shipment_num(d.monthly_shipment_num);
      NOVA.monthly_shipment_volume(d.monthly_shipment_volume);
      NOVA.avg_receipt_order(d.avg_receipt_order);
      NOVA.max_receipt_order(d.max_receipt_order);
      NOVA.min_receipt_order(d.min_receipt_order);
      $('#inspectionCriteria').val(d.receiving_inspection_criteria);
      NOVA.avg_receipt_lineitems(d.avg_receipt_lineitems);
      NOVA.max_receipt_lineitems(d.max_receipt_lineitems);
      NOVA.min_receipt_lineitems(d.min_receipt_lineitems);
      NOVA.has_std_packing(d.has_std_packing);
      NOVA.receiving_inspection_criteria(d.receiving_inspection_criteria);
      NOVA.pr_info_id(d.pr_info_id);
      for(var i=0; i< d.packing_details.length; i++){
        var packing_item1 = new packing_item()
        packing_item1.fill(d.packing_details[i]);
        NOVA.packingdetailsList.push(packing_item1);
      }
      if(d.packing_details.length ==0){
        NOVA.packing_detail_init();
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

  NOVA.leadproductReceivingInfoNext = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('need_replishment', NOVA.need_replishment());
    formdata.append('replenish_from', NOVA.replenish_from());
    formdata.append('replenish_frequency', NOVA.replenish_frequency());
    formdata.append('monthly_shipment_num', NOVA.monthly_shipment_num());
    formdata.append('monthly_shipment_volume', NOVA.monthly_shipment_volume());
    formdata.append('min_receipt_order', NOVA.min_receipt_order());
    formdata.append('max_receipt_order', NOVA.max_receipt_order());
    formdata.append('avg_receipt_order', NOVA.avg_receipt_order());
    formdata.append('min_receipt_lineitems', NOVA.min_receipt_lineitems());
    formdata.append('max_receipt_lineitems', NOVA.max_receipt_lineitems());
    formdata.append('avg_receipt_lineitems', NOVA.avg_receipt_lineitems());
    formdata.append('has_std_packing', NOVA.has_std_packing());
    formdata.append('receiving_inspection_criteria', $('#inspectionCriteria').val());
    formdata.append('pr_info_id', NOVA.pr_info_id());
    formdata.append('packingdetails', ko.toJSON(NOVA.packingdetailsList()));
    $.ajax({
      method: 'POST',
      url: '/api/lead/product/receiving/info/create',
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

  NOVA.leadproductReceivingInfoSave = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('need_replishment', NOVA.need_replishment());
    formdata.append('replenish_from', NOVA.replenish_from());
    formdata.append('replenish_frequency', NOVA.replenish_frequency());
    formdata.append('monthly_shipment_num', NOVA.monthly_shipment_num());
    formdata.append('monthly_shipment_volume', NOVA.monthly_shipment_volume());
    formdata.append('min_receipt_order', NOVA.min_receipt_order());
    formdata.append('max_receipt_order', NOVA.max_receipt_order());
    formdata.append('avg_receipt_order', NOVA.avg_receipt_order());
    formdata.append('min_receipt_lineitems', NOVA.min_receipt_lineitems());
    formdata.append('max_receipt_lineitems', NOVA.max_receipt_lineitems());
    formdata.append('avg_receipt_lineitems', NOVA.avg_receipt_lineitems());
    formdata.append('has_std_packing', NOVA.has_std_packing());
    formdata.append('receiving_inspection_criteria', $('#inspectionCriteria').val());
    formdata.append('pr_info_id', NOVA.pr_info_id());
    formdata.append('packingdetails', ko.toJSON(NOVA.packingdetailsList()));
    $.ajax({
      method: 'POST',
      url: '/api/lead/product/receiving/info/create',
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

  NOVA.addNew = function(){
    NOVA.packing_detail_init();
  }

  NOVA.Previous = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('need_replishment', NOVA.need_replishment());
    formdata.append('replenish_from', NOVA.replenish_from());
    formdata.append('replenish_frequency', NOVA.replenish_frequency());
    formdata.append('monthly_shipment_num', NOVA.monthly_shipment_num());
    formdata.append('monthly_shipment_volume', NOVA.monthly_shipment_volume());
    formdata.append('min_receipt_order', NOVA.min_receipt_order());
    formdata.append('max_receipt_order', NOVA.max_receipt_order());
    formdata.append('avg_receipt_order', NOVA.avg_receipt_order());
    formdata.append('min_receipt_lineitems', NOVA.min_receipt_lineitems());
    formdata.append('max_receipt_lineitems', NOVA.max_receipt_lineitems());
    formdata.append('avg_receipt_lineitems', NOVA.avg_receipt_lineitems());
    formdata.append('has_std_packing', NOVA.has_std_packing());
    formdata.append('receiving_inspection_criteria', $('#inspectionCriteria').val());
    formdata.append('pr_info_id', NOVA.pr_info_id());
    formdata.append('packingdetails', ko.toJSON(NOVA.packingdetailsList()));
    $.ajax({
      method: 'POST',
      url: '/api/lead/product/receiving/info/create',
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
    NOVA.getproductReceivingDetail();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;