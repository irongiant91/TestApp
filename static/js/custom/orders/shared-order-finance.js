(function (window) {

  NOVA.order_id = ko.observable();
  NOVA.client_id = ko.observable();
  NOVA.total_disbursement = ko.observable();
  NOVA.total_expense = ko.observable();
  NOVA.search_term = ko.observable();
  NOVA.pages_list = ko.observableArray([]);
  NOVA.finance_list = ko.observableArray([]);
  NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.total_disbursement = ko.observable('');
  NOVA.total_expense = ko.observable('');
  NOVA.receipt_url = ko.observable('');
  NOVA.order_type = ko.observable('');
  NOVA.source = ko.observable('');
    

  NOVA.getorderFinances = function(){
    if(NOVA.source() == 'order'){
      var url = '/api/order/finance/list/get'
    }else{
      var url = '/api/order/recurring/finance/list/get'
    }
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: url,
      data: {'order_id': NOVA.order_id(),
         'search_term': NOVA.search_term(),
         'page_number': NOVA.current_page(),
        },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.finance_list([]);
      for (var i = 0; i < d.data.length; i++) {
        NOVA.finance_list.push(d.data[i]);
      }
      NOVA.page_count(d.page_count);
      NOVA.total_disbursement(d.total_disbursement);
      NOVA.total_expense(d.total_expense);
      NOVA.refreshPagination();
      NOVA.pageSearch('');
      NOVA.client_id(d.client_id)
      NOVA.order_type(d.order_type);
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
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
      NOVA.getorderFinances();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getorderFinances();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getorderFinances();
  };

  NOVA.getFirstPage = function(){
    NOVA.current_page(1);
    NOVA.getorderFinances();
  }

  NOVA.getLastPage = function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getorderFinances();
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
    NOVA.getorderFinances();
  }

  NOVA.searchKey = function(){
    NOVA.current_page(1)
    NOVA.search_term($('#search-input').val());
    NOVA.getorderFinances();
 }
  


  NOVA.receiptViewer = function(data){
    NOVA.receipt_url(data.receipt)
    $('#enlargeModal').modal('show')
  }
  
})(this);