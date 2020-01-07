(function (window) {
  NOVA.client_id = ko.observable('');

  NOVA.redirectToJob= function(){
    window.location = '/client/'+NOVA.client_id()+'/orders/'+NOVA.order_id();
  }

  NOVA.redirectToDocuments = function(){
    window.location = '/client/'+NOVA.client_id()+'/orders/'+NOVA.order_id()+'/documents';
  }

  NOVA.redirectToInvoices = function(){
    window.location = '/client/'+NOVA.client_id()+'/invoice/'+NOVA.order_id()+'/order';
  }

  NOVA.redirectToFinances = function (){
    window.location = '/client/'+NOVA.client_id()+'/finance/'+NOVA.order_id()+'/order';
  }

  NOVA.redirectToStops = function(){
    window.location = '/client/'+NOVA.client_id()+'/stops/'+NOVA.order_id()+'/order';
  }

  NOVA.redirectToIncident = function(){
    window.location = '/client/'+NOVA.client_id()+'/incident/'+NOVA.order_id()+'/order';
  }

  NOVA.invoiceDetail = function(data){
    if(data.order_id == '' && data.type == "Dummy Cumulative"){
      window.location = '/client/'+NOVA.order_id()+'/invoices/'+data.invoice_id+'/generate-cumulative-invoice/'+data.start_date+'/'+data.end_date;
    }else if(data.order_id != '' && data.type == "Dummy"){
      window.location = '/order/'+NOVA.order_id()+'/dummy-invoice/'+data.invoice_id+'/order-detail'
    }else if(data.order_id != '' && data.type == "Netsuite"){
      window.location = '/order/'+NOVA.order_id()+'/invoice/'+data.invoice_id+'/order-detail-netsuite'
    }else{
      window.location = '/client/order/'+data.orderid+'/netsuite-cummalative/'+data.invoice_id+'/invoice-detail'
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
  var client_id = docUrlArr[docUrlArr.length - 4];
  NOVA.client_id(client_id);
  NOVA.getInvoiceGenerateButtonStatus();
  NOVA.getInvoices();
  NOVA.getTypesStatus()
  NOVA.getAppLogo();
  }
}

document.onreadystatechange = init;