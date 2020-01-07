(function (window) {
  
  NOVA.client_id = ko.observable();
  NOVA.contract_id = ko.observable();
  NOVA.search_term = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.page_count = ko.observable('');
  NOVA.current_page = ko.observable(1);
  NOVA.last_page = ko.observable('');
  NOVA.toEmail = ko.observable('');
  NOVA.selectedsortByClient = ko.observable('ascending');
  NOVA.selectedsortByCreatedDate = ko.observable('ascending');
  NOVA.selectedsortByStartDate = ko.observable('ascending');
  NOVA.selectedsortByEndDate = ko.observable('ascending');
  NOVA.selectedsortByRevenue = ko.observable('ascending');
  NOVA.selectedsortByExpense = ko.observable('ascending');
  NOVA.selectedsortByPandL = ko.observable('ascending');

  NOVA.client_sort=ko.observable('false');
  NOVA.created_date_sort=ko.observable('false');
  NOVA.start_date_sort=ko.observable('false');
  NOVA.end_date_sort=ko.observable('false');
  NOVA.revenue_sort=ko.observable('false');
  NOVA.expense_sort=ko.observable('false');
  NOVA.pl_sort=ko.observable('false');
  NOVA.pages_list = ko.observableArray([]);
  NOVA.contracts_list = ko.observableArray([]);
  NOVA.versionhistory_list = ko.observableArray([]);
  NOVA.filterstatusList = ko.observableArray([]);

  NOVA.Status_list = ko.observableArray([
    {
      name: 'Running'
    },
    {
      name: 'Upcoming'
    },
    {
      name: 'Expired'
    }
  ]);

  $('#toEmail').on('click', function() {
      $('#emailInput').removeClass('d-none');
    })

    $.validator.addMethod("emailRegex", function(value, element) {
      return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test( value );
    });

    mailForm = $("#mailForm").validate({
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
      toEmail: {
        required: true,
        emailRegex: true
      }
    },
    messages: {
      toEmail: {
        required: "Please enter mail ID",
        emailRegex: "Please enter valid email"
      }
    },
    submitHandler: function() {
      NOVA.sendMail();
    }
  });
  
  $(document).on('click', '.history-btn', function() {
    var getSection = $(this).attr('gohsection');
    if($('[hsection="'+getSection+'"]').hasClass('d-none')){
      $('[hsection="'+getSection+'"]').removeClass('d-none');
    } else {
      $('[hsection="'+getSection+'"]').addClass('d-none');
    }
  })

  NOVA.priceList = function(){
    window.location.href="/client/"+NOVA.client_id()+"/price-list"
  }
  
  NOVA.contractsListGet = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/client/all/contract/list/get',
      data: {
        'page_number': NOVA.current_page(),
        'search_term' : $('#search-input').val(),
        'client_sort' : NOVA.client_sort(),
        'client_sort_order' : NOVA.selectedsortByClient(),
        'created_date_sort' : NOVA.created_date_sort(),
        'created_date_sort_order' : NOVA.selectedsortByCreatedDate(),
        'start_date_sort' : NOVA.start_date_sort(),
        'start_date_sort_order' : NOVA.selectedsortByStartDate(),
        'end_date_sort' : NOVA.end_date_sort(),
        'end_date_sort_order' : NOVA.selectedsortByEndDate(),
        'revenue_sort' : NOVA.revenue_sort(),
        'revenue_sort_order' : NOVA.selectedsortByRevenue(),
        'expense_sort' : NOVA.expense_sort(),
        'expense_sort_order' : NOVA.selectedsortByExpense(),
        'pl_sort' : NOVA.pl_sort(),
        'pl_sort_order' : NOVA.selectedsortByPandL(),
        'filterstatusList': ko.toJSON(NOVA.filterstatusList())
      },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.contracts_list([]);
      for(var i=0; i<d.data.length; i++){
        NOVA.contracts_list.push(d.data[i]);
      }
      NOVA.page_count(d.page_count);
      NOVA.refreshPagination();
      NOVA.pageSearch('');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

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
      NOVA.contractsListGet();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.contractsListGet();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.contractsListGet();
  };

  NOVA.getFirstPage= function(){
    NOVA.current_page(1);
    NOVA.contractsListGet();
  };
  
  NOVA.getLastPage= function(){
    NOVA.current_page(NOVA.last_page());
    NOVA.contractsListGet();
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
    NOVA.contractsListGet();
  }

  NOVA.search = function(){
    NOVA.contractsListGet()
  }

  NOVA.sortByCompany = function(){
    NOVA.client_sort('true');
    NOVA.created_date_sort('false');
    NOVA.start_date_sort('false');
    NOVA.end_date_sort('false');
    NOVA.revenue_sort('false');
    NOVA.expense_sort('false');
    NOVA.pl_sort('false');
    if(NOVA.selectedsortByClient() == 'ascending'){
      NOVA.selectedsortByClient('descending')
      NOVA.contractsListGet()
    }else{
      NOVA.selectedsortByClient('ascending');
      NOVA.contractsListGet()
    }
  }

  NOVA.sortByCreatedDate = function(){
    NOVA.client_sort('false');
    NOVA.created_date_sort('true');
    NOVA.start_date_sort('false');
    NOVA.end_date_sort('false');
    NOVA.revenue_sort('false');
    NOVA.expense_sort('false');
    NOVA.pl_sort('false');
    if(NOVA.selectedsortByCreatedDate() == 'ascending'){
      NOVA.selectedsortByCreatedDate('descending')
      NOVA.contractsListGet()
    }else{
      NOVA.selectedsortByCreatedDate('ascending');
      NOVA.contractsListGet()
    }
  }

  NOVA.sortByStartDate = function(){
    NOVA.client_sort('false');
    NOVA.created_date_sort('false');
    NOVA.start_date_sort('true');
    NOVA.end_date_sort('false');
    NOVA.revenue_sort('false');
    NOVA.expense_sort('false');
    NOVA.pl_sort('false');
    if(NOVA.selectedsortByStartDate() == 'ascending'){
      NOVA.selectedsortByStartDate('descending')
      NOVA.contractsListGet()
    }else{
      NOVA.selectedsortByStartDate('ascending');
      NOVA.contractsListGet()
    }
  }

  NOVA.sortByEndDate = function(){
    NOVA.client_sort('false');
    NOVA.created_date_sort('false');
    NOVA.start_date_sort('false');
    NOVA.end_date_sort('true');
    NOVA.revenue_sort('false');
    NOVA.expense_sort('false');
    NOVA.pl_sort('false');
    if(NOVA.selectedsortByEndDate() == 'ascending'){
      NOVA.selectedsortByEndDate('descending')
      NOVA.contractsListGet()
    }else{
      NOVA.selectedsortByEndDate('ascending');
      NOVA.contractsListGet()
    }
  }

  NOVA.sortByRevenue = function(){
    NOVA.client_sort('false');
    NOVA.created_date_sort('false');
    NOVA.start_date_sort('false');
    NOVA.end_date_sort('false');
    NOVA.revenue_sort('true');
    NOVA.expense_sort('false');
    NOVA.pl_sort('false');
    if(NOVA.selectedsortByRevenue() == 'ascending'){
      NOVA.selectedsortByRevenue('descending')
      NOVA.contractsListGet()
    }else{
      NOVA.selectedsortByRevenue('ascending');
      NOVA.contractsListGet()
    }
  }

  NOVA.sortByExpense = function(){
    NOVA.client_sort('false');
    NOVA.created_date_sort('false');
    NOVA.start_date_sort('false');
    NOVA.end_date_sort('false');
    NOVA.revenue_sort('false');
    NOVA.expense_sort('true');
    NOVA.pl_sort('false');
    if(NOVA.selectedsortByExpense() == 'ascending'){
      NOVA.selectedsortByExpense('descending')
      NOVA.contractsListGet()
    }else{
      NOVA.selectedsortByExpense('ascending');
      NOVA.contractsListGet()
    }
  }

  NOVA.sortByPandL = function(){
    NOVA.client_sort('false');
    NOVA.created_date_sort('false');
    NOVA.start_date_sort('false');
    NOVA.end_date_sort('false');
    NOVA.revenue_sort('false');
    NOVA.expense_sort('false');
    NOVA.pl_sort('true');
    if(NOVA.selectedsortByPandL() == 'ascending'){
      NOVA.selectedsortByPandL('descending')
      NOVA.contractsListGet()
    }else{
      NOVA.selectedsortByPandL('ascending');
      NOVA.contractsListGet()
    }
  }

  NOVA.statusFilter = function(){
    NOVA.contractsListGet()
  }

  NOVA.statusFilter = function(data,e){
    item_selected = $(e.currentTarget).is(':checked')
    if (item_selected == true){
      NOVA.filterstatusList.push(data.name)
    }else{
      NOVA.filterstatusList.remove(data.name)
    }
    NOVA.contractsListGet();
  };

  NOVA.docViewer = function(data){
    $("#pdfWrapperModal").modal('show');
    NOVA.contract_id(data.contract_id);
    PDFObject.embed(data.doc, "#pdfWrapper");
  }

  NOVA.versionHistory = function(data){
    NOVA.versionhistory_list([]);
    NOVA.versionhistory_list.push(data.previous_versions)
  }

  NOVA.revenueDetails = function(data){
    window.location = '/client/'+data.client_id+'/contract/'+data.contract_id+'/detail'
  }

  NOVA.versionDetails = function(data){
    window.location = '/client/'+data.client_id+'/contract/'+data.contract_id+'/detail'
  }

  NOVA.sendMail = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('contract_id', NOVA.contract_id());
    formdata.append('email', NOVA.toEmail());
    $.ajax({
      method: 'POST',
      url: '/api/client/send/contract',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d);
      NOVA.toEmail('');
      $('#emailInput').addClass('d-none');
       $('#pdfWrapperModal').modal('hide');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  })(this);
  
  function init() {
    if (document.readyState == "interactive") {
      NOVA.hideLoading();
      $('#navItemContracts').addClass('active');
      ko.applyBindings(NOVA);
      NOVA.contractsListGet();
      NOVA.getAppLogo();
    }
  }
  document.onreadystatechange = init;