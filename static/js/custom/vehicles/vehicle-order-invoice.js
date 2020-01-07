(function (window) {
  NOVA.vehicle_id = ko.observable('');

  NOVA.redirectToJob= function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id();
  }

  NOVA.redirectToDocuments = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/documents';
  }

  NOVA.redirectToInvoices = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/invoices';
  }

  NOVA.redirectToFinances = function (){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/finances';
  }

  NOVA.redirectToStops = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/stops';
  }

  NOVA.redirectToIncident = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/incidents';
  }

  NOVA.invoiceDetail = function(data){
    if(data.order_id == '' && data.type == "Dummy Cumulative"){
      window.location = '/vehicle/'+NOVA.order_id()+'/invoices/'+data.invoice_id+'/generate-cumulative-invoice/'+data.start_date+'/'+data.end_date;
    }else if(data.order_id != '' && data.type == "Dummy"){
      window.location = '/order/'+NOVA.order_id()+'/dummy-invoice/'+data.invoice_id+'/order-detail'
    }else if(data.order_id != '' && data.type == "Netsuite"){
      window.location = '/order/'+NOVA.order_id()+'/invoice/'+data.invoice_id+'/order-detail-netsuite'
    }else{
      window.location = '/vehicle/order/'+data.orderid+'/netsuite-cummalative/'+data.invoice_id+'/invoice-detail'
    }
  };

})(this);

function init() {
  if (document.readyState == "interactive") {
  ko.applyBindings(NOVA);
  NOVA.hideLoading();
  var docUrlArr = document.URL.split('/');
  var order_id = docUrlArr[docUrlArr.length - 2];
  NOVA.order_id(order_id);
  var vehicle_id = docUrlArr[docUrlArr.length - 4];
  NOVA.vehicle_id(vehicle_id);
  NOVA.getInvoiceGenerateButtonStatus();
  NOVA.getInvoices();
  NOVA.getTypesStatus()
  NOVA.getAppLogo();
  }
}

document.onreadystatechange = init;