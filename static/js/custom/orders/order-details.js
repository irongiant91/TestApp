(function(window){
  NOVA.editOrderBtnClick = function(){
    window.location = '/order/edit/'+NOVA.order_id();
  }

  NOVA.redirectToDocuments = function(){
    window.location = '/order/'+NOVA.order_id()+'/documents';
  }

  NOVA.redirectToInvoices = function(){
    window.location = '/order/'+NOVA.order_id()+'/invoice';
  }

  NOVA.redirectToFinances = function(){
    window.location = '/order/'+NOVA.order_id()+'/finance';
  }

  NOVA.redirectToStops = function(){
    window.location = '/order/'+NOVA.order_id()+'/stops';
  }

  NOVA.reassignOrder = function(){
   window.open('/job/job-allocation-orders/?'+NOVA.orginalstartDate());
 }

 NOVA.redirectToIncident = function(){
  window.location = '/order/'+NOVA.order_id()+'/incident'
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
    ko.applyBindings(NOVA);
    var docUrlArr = document.URL.split('/');
    var id = docUrlArr[docUrlArr.length - 1];
    NOVA.order_id(id);
    NOVA.getOrderDetails();
  }
}

document.onreadystatechange = init;