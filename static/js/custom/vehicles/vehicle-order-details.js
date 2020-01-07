(function(window){

  NOVA.vehicle_id = ko.observable('');

  NOVA.editOrderBtnClick = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/edit';
  }

  NOVA.redirectToFinances = function (){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/finances';
  }
  
  NOVA.redirectToStops = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/stops';
  }

  NOVA.redirectToDocuments = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/documents';
  }

  NOVA.redirectToInvoices = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/invoices';
  }

  NOVA.reassignOrder = function(){
    window.open('/job/job-allocation-orders/?'+NOVA.orginalstartDate());
 }

 NOVA.redirectToIncident = function(){
  window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/incidents';
 }

 NOVA.sendNotification = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_id',NOVA.order_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/send/notification',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.showToast(d);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
 }

})(this);  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();    
    $('#navItemVehicles').addClass('active');
    NOVA.getAppLogo();
    var docUrlArr = document.URL.split('/');
    var id = docUrlArr[docUrlArr.length - 1];
    NOVA.order_id(id);
    var vehicle_id = docUrlArr[docUrlArr.length - 3];
    NOVA.vehicle_id(vehicle_id);
    NOVA.getOrderDetails();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;