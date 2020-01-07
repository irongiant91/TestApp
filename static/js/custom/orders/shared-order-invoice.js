(function (window) {

  NOVA.order_id = ko.observable();
  NOVA.client_id = ko.observable();
  NOVA.invoice_number = ko.observable();
  NOVA.invoice_amount = ko.observable();
  NOVA.search_term = ko.observable();
  NOVA.pages_list = ko.observableArray([]);
  NOVA.invoices_list = ko.observableArray([]);
  NOVA.typesList = ko.observableArray([]);
  NOVA.statusList = ko.observableArray([]);
  NOVA.type_filter= ko.observableArray([]);
  NOVA.status_filter= ko.observableArray([]);
  NOVA.generated_sort= ko.observable('')
  NOVA.amount_sort= ko.observable('')
  NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.order_type = ko.observable('');
  
  
  NOVA.getTypesStatus = function (){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/client/get/statustype',
      data: {'order_id': NOVA.order_id(),
             'source': 'order'},
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
      .done( function (d, textStatus, jqXHR) {
        NOVA.typesList([]);
        for (let i = 0; i < d.types_list.length; i++) {
          NOVA.typesList.push(d.types_list[i]);
        }
        NOVA.statusList([]);
        for (let i = 0; i < d.status_list.length; i++) {
          NOVA.statusList.push(d.status_list[i]);
        }
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function(){
        NOVA.hideLoading();
      })
  }
  
  NOVA.getInvoices = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/client/get/invoices',
      data: {'order_id': NOVA.order_id(),
             'search_term': NOVA.search_term(),
             'type_filter': ko.toJSON(NOVA.type_filter()),
             'status_filter': ko.toJSON(NOVA.status_filter()),
             'generated_sort': NOVA.generated_sort(),
             'amount_sort': NOVA.amount_sort(),
             'page_number': NOVA.current_page(),
             'source': 'order'
            },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.invoices_list([]);
      for (let i = 0; i < d.data.length; i++) {
        NOVA.invoices_list.push(d.data[i]);
      }
      NOVA.page_count(d.page_count);
      NOVA.refreshPagination();
      NOVA.pageSearch('');
      NOVA.order_type(d.order_type);
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.typeFilter = function(data,e){
    if (event.target.checked) {
      NOVA.type_filter.push(data)
    } 
    else {
      if (NOVA.type_filter().includes(data)) {
        var j = NOVA.type_filter().indexOf(data)
        NOVA.type_filter.splice(j, 1)
      }
    }
    NOVA.getInvoices();
  }

  NOVA.statusFilter = function(data,e){
    if (event.target.checked) {
      NOVA.status_filter.push(data)
    } 
    else {
      if (NOVA.status_filter().includes(data)) {
        var j = NOVA.status_filter().indexOf(data)
        NOVA.status_filter.splice(j, 1)
      }
    }
    NOVA.getInvoices();
  }

  NOVA.sortGeneratedOn = function(data, e){
    if(NOVA.generated_sort() == 'ascending'){
      NOVA.generated_sort('descending')
      NOVA.getInvoices();
    }else{
      NOVA.generated_sort('ascending');
      NOVA.getInvoices();
    }
  }

  NOVA.sortAmount = function(data, e){
    if(NOVA.amount_sort() == 'ascending'){
      NOVA.amount_sort('descending')
      NOVA.getInvoices();
    }else{
      NOVA.amount_sort('ascending');
      NOVA.getInvoices();
    }
  }

  NOVA.refreshPagination = function(){
    var max = NOVA.current_page() + 2;
    if(max > NOVA.page_count())
      max = NOVA.page_count();
    var min = max - 2;
    if(min < 1)
      min = 1;
    NOVA.pages_list([]);
    for(i=min;i<=max;i++){
      NOVA.pages_list.push(i);
    }
  };

  NOVA.getPrevPage = function(){
    if(NOVA.current_page() != 1){
      NOVA.current_page(NOVA.current_page() - 1);
      NOVA.getInvoices();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getInvoices();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getInvoices();
  };

  NOVA.getFirstPage = function(){
    NOVA.current_page(1);
    NOVA.getInvoices();
  }

  NOVA.getLastPage = function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getInvoices();
  }

  NOVA.pageSearchGo = function(data, e){
    if (NOVA.pageSearch() > NOVA.page_count()){
      NOVA.current_page(NOVA.page_count());
      NOVA.pageSearch(NOVA.page_count());
    }else{
      if (NOVA.pageSearch() != ''){
        NOVA.current_page(NOVA.pageSearch());
      }
    }
    NOVA.getInvoices();
  }
  
  NOVA.searchKey = function(){
      NOVA.current_page(1)
      NOVA.search_term($('#search-input').val());
      NOVA.getInvoices();
  }
  
  NOVA.uploadInvoice = function(e){
    if ( /\.(pdf)$/i.test($("#uploadNetsuiteInvoice")[0].files[0].name) === false ) {
      NOVA.showErrorModal("Invalid file format. Only PDF file formats are allowed");
    } else {
        var csrftoken = NOVA.getCookie('csrftoken');
        var formdata = new FormData();
        document1 = $("#uploadNetsuiteInvoice")[0].files[0];
        formdata.append('invoice_number', NOVA.invoice_number());
        formdata.append('invoice_amount', NOVA.invoice_amount());
        formdata.append('order_id', NOVA.order_id());
        formdata.append('invoice_doc',document1);
        $.ajax({
          method: 'POST',
          url: '/api/order/invoice/doc/upload',
          data: formdata,
          contentType: false,
          processData: false,
          beforeSend: function(xhr, settings) {
            NOVA.showLoading();
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
        })
        .done( function (d, textStatus, jqXHR) {
            window.location = '/order/'+NOVA.order_id()+'/invoice/'+d.order_invoice+'/detail-netsuite'
        })
        .fail( function (jqXHR, textStatus, errorThrown) {
          NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
        })
        .always(function(){
          NOVA.hideLoading();
        })
      }
  };

  NOVA.getInvoiceGenerateButtonStatus = function (){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/client/get/invoice/generate/status',
      data: {'order_id': NOVA.order_id()
      },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.client_id(d.client_id)
      if(d.has_pending_invoice == true || d.has_paid_invoice == true || d.order_completed == false){
        $('#generateDummyInvoice').attr("disabled","disabled");
      }
      if(d.has_paid_invoice == true || d.order_completed == false){
        $('#uploadInvoicebtn').prop("disabled","disabled")
      }
      if(d.order_payment_completed == true){
        $('#generateDummyInvoice').attr("disabled","disabled");
        $('#uploadInvoicebtn').prop("disabled","disabled");
      }

      /*if(d.has_pending_invoice == true){
        $('#generateDummyInvoice').attr("disabled","disabled");
      }
      if(d.has_paid_invoice == true){
        $('#uploadInvoicebtn').prop("disabled","disabled")
        $('#generateDummyInvoice').attr("disabled","disabled");
      }
      if(d.upload_invoice_btn_show == false){
        $('#uploadInvoicebtn').hide()
      }*/
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.uploadInvoicebtn = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/invoice/number/get',
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.invoice_number(d.invoice_number)
      $('#uploadInvoiceModal').modal('show')
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.generateDummyInvoiceClick = function(){
    window.location = '/order/'+NOVA.order_id()+'/dummy-invoice/generate'
  }

  NOVA.viewPriceList = function(){
    window.open('/client/'+NOVA.client_id()+'/price-list')
  }
  
})(this);