(function (window) {

  NOVA.redirectToJob= function(){
    window.location = '/order/'+NOVA.order_id();
  }

  NOVA.redirectToDocuments = function(){
    window.location = '/order/'+NOVA.order_id()+'/documents';
  }

  NOVA.redirectToFinances = function(){
    window.location = '/order/'+NOVA.order_id()+'/finance';
  }

  NOVA.redirectToStops = function(){
    window.location = '/order/'+NOVA.order_id()+'/stops';
  }

  NOVA.redirectToIncident = function(){
    window.location = '/order/'+NOVA.order_id()+'/incident'
  }

  NOVA.invoiceDetail = function(data){
    console.log(data)
    if(data.order_id == '' && data.type == "Dummy Cumulative"){
      window.location = '/client/'+NOVA.order_id()+'/invoices/'+data.invoice_id+'/generate-cumulative-invoice/'+data.start_date+'/'+data.end_date;
    }else if(data.order_id != '' && data.type == "Dummy"){
      window.location = '/order/'+NOVA.order_id()+'/invoice/'+data.invoice_id+'/order-dummy'
    }else if(data.order_id != '' && data.type == "Netsuite"){
      window.location = '/order/'+NOVA.order_id()+'/invoice/'+data.invoice_id+'/detail-netsuite'
    }else{
      window.location = '/order/'+NOVA.order_id()+'/netsuite-cummalative/'+data.invoice_id+'/invoice-detail'
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
  NOVA.getInvoiceGenerateButtonStatus();
  NOVA.getInvoices();
  NOVA.getTypesStatus()
  NOVA.getAppLogo();
  }
}

document.onreadystatechange = init;