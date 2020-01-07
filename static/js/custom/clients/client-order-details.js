(function(window){

  NOVA.client_id = ko.observable('');

  NOVA.editOrderBtnClick = function(){
    window.location = '/client/'+NOVA.client_id()+'/orders/edit/'+NOVA.order_id();
  }

  NOVA.redirectToFinances = function (){
    window.location = '/client/'+NOVA.client_id()+'/finance/'+NOVA.order_id()+'/order';
  }
  
  NOVA.redirectToStops = function(){
    window.location = '/client/'+NOVA.client_id()+'/stops/'+NOVA.order_id()+'/order';
  }

  NOVA.redirectToDocuments = function(){
    window.location = '/client/'+NOVA.client_id()+'/orders/'+NOVA.order_id()+'/documents';
  }

  NOVA.redirectToInvoices = function(){
    window.location = '/client/'+NOVA.client_id()+'/invoice/'+NOVA.order_id()+'/order';
  }

  NOVA.reassignOrder = function(){
    window.open('/job/job-allocation-orders/?'+NOVA.orginalstartDate());
 }

 NOVA.redirectToIncident = function(){
  window.location = '/client/'+NOVA.client_id()+'/incident/'+NOVA.order_id()+'/order';
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
    $('#navItemClients').addClass('active');
    NOVA.getAppLogo();
    var docUrlArr = document.URL.split('/');
    var id = docUrlArr[docUrlArr.length - 1];
    NOVA.order_id(id);
    var client_id = docUrlArr[docUrlArr.length - 3];
    NOVA.client_id(client_id);
    NOVA.getOrderDetails();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;