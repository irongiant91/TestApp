(function (window) {

    NOVA.clientList = ko.observableArray([]);
    NOVA.search_term = ko.observable('');
    NOVA.page_count = ko.observable('');
    NOVA.current_page = ko.observable('');
    NOVA.last_page = ko.observable('');
    NOVA.pages_list = ko.observableArray([]);
    NOVA.pageSearch = ko.observable('');
    NOVA.selectedsortByExpiry = ko.observable('ascending');
    NOVA.selectedsortByRevenue = ko.observable('ascending');
    NOVA.selectedsortByExpense = ko.observable('ascending');
    NOVA.selectedsortByPandL = ko.observable('ascending');
    NOVA.expiry_sort=ko.observable('false');
    NOVA.revenue_sort=ko.observable('false');
    NOVA.expense_sort=ko.observable('false');
    NOVA.pl_sort=ko.observable('false');
 

    NOVA.getClients = function(){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'GET',
        url: '/api/client/get/list/client',
        data: {'page_number': NOVA.current_page(), 'search_term':NOVA.search_term(),'expiry_sort':NOVA.expiry_sort(),'expiry_sort_order':NOVA.selectedsortByExpiry(),'revenue_sort':NOVA.revenue_sort(),'revenue_sort_order':NOVA.selectedsortByRevenue(),'expense_sort':NOVA.expense_sort(),'expense_sort_order':NOVA.selectedsortByExpense(),'expiry_sort_order':NOVA.selectedsortByExpiry(),'revenue_sort':NOVA.revenue_sort(),'revenue_sort_order':NOVA.selectedsortByRevenue(),'pl_sort':NOVA.pl_sort(),'pl_sort_order':NOVA.selectedsortByPandL()},
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      })
      .done( function (d, textStatus, jqXHR) {
        // console.log(d)
        NOVA.clientList([]);
        for(var i=0; i<d.clientdata.length; i++){
          NOVA.clientList.push(d.clientdata[i]);
        }
        NOVA.page_count(d.page_count);
        NOVA.last_page(d.page_count);
        NOVA.refreshPagination();
        NOVA.pageSearch('')
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function(){
        NOVA.hideLoading();
      })
    }
  

    NOVA.sortByExpiry = function(data,e){
        NOVA.expiry_sort('true')
        NOVA.revenue_sort('false')
        NOVA.expense_sort('false')
        NOVA.pl_sort('false')
        if(NOVA.selectedsortByExpiry() == 'ascending'){
          NOVA.selectedsortByExpiry('descending')
          NOVA.getClients();
        }else{
          NOVA.selectedsortByExpiry('ascending');
          NOVA.getClients();
        }
    }


    NOVA.sortByRevenue = function(data,e){
        NOVA.expiry_sort('false')
        NOVA.revenue_sort('true')
        NOVA.expense_sort('false')
        NOVA.pl_sort('false')
        if(NOVA.selectedsortByRevenue() == 'ascending'){
          NOVA.selectedsortByRevenue('descending')
          NOVA.getClients();
        }else{
          NOVA.selectedsortByRevenue('ascending');
          NOVA.getClients();
        }
    }

   
    NOVA.sortByExpense = function(data,e){
        NOVA.expiry_sort('false')
        NOVA.revenue_sort('false')
        NOVA.expense_sort('true')
        NOVA.pl_sort('false')
        if(NOVA.selectedsortByExpense() == 'ascending'){
          NOVA.selectedsortByExpense('descending')
          NOVA.getClients();
        }else{
          NOVA.selectedsortByExpense('ascending');
          NOVA.getClients();
        }
    }


    NOVA.sortByPandL = function(data,e){
        NOVA.expiry_sort('false')
        NOVA.revenue_sort('false')
        NOVA.expense_sort('false')
        NOVA.pl_sort('true')
        if(NOVA.selectedsortByPandL() == 'ascending'){
          NOVA.selectedsortByPandL('descending')
          NOVA.getClients();
        }else{
          NOVA.selectedsortByPandL('ascending');
          NOVA.getClients();
        }
    }



  
    NOVA.refreshPagination = function(){
      var max = NOVA.current_page() + 2;
      if(max > NOVA.page_count())
          max = NOVA.page_count();
      var min = max - 4;
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
        NOVA.getClients();
      }
    };
  
    NOVA.getNextPage = function(){
      if(NOVA.current_page() != NOVA.page_count()){
        NOVA.current_page(NOVA.current_page() + 1);
        NOVA.getClients();
      }
    };
  
    NOVA.onPageClick = function(pageno){
      NOVA.current_page(pageno);
      NOVA.getClients();
    };
  
    NOVA.getFirstPage= function(){
      NOVA.current_page(1);
      NOVA.getClients();
    };
    
    NOVA.getLastPage= function(){
      NOVA.current_page(NOVA.last_page());
      NOVA.getClients();
    };

    NOVA.pageSearchGo = function(data, e){
      if (NOVA.pageSearch() > NOVA.page_count()){
        NOVA.current_page(NOVA.page_count());
        NOVA.pageSearch(NOVA.page_count());
      }else{
        if (NOVA.pageSearch() != ''){
          NOVA.current_page(NOVA.pageSearch());
        }
      }
      NOVA.getClients();
    }
  
    NOVA.searchKey = function(){
       NOVA.current_page(1)
      NOVA.search_term($('#search-input').val());
      NOVA.getClients();
    }
  

    NOVA.detailPage=function(data){
      location.href='/client/'+data.id+'/detail';
    }



  })(this);
  
  function init() {
    if (document.readyState == "interactive") {
    NOVA.current_page(1)
      ko.applyBindings(NOVA);
      NOVA.getClients();
    }
  }
  
  document.onreadystatechange = init;