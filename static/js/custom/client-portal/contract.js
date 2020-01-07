(function (window) {
  
  NOVA.current_page = ko.observable(1);
  NOVA.start_date_sort=ko.observable('false');
  NOVA.end_date_sort=ko.observable('false');
  NOVA.selectedsortByStartDate = ko.observable('ascending');
  NOVA.selectedsortByEndDate = ko.observable('ascending');
  NOVA.page_count = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.toEmail = ko.observable('');
  NOVA.last_page = ko.observable('');
  NOVA.contract_id = ko.observable();
  
  NOVA.filterstatusList = ko.observableArray([]);
  NOVA.Status_list = ko.observableArray([{name: 'Running'},{name: 'Upcoming'},{name: 'Expired'}
  ]);
  NOVA.contracts_list = ko.observableArray([]);
  NOVA.pages_list = ko.observableArray([]);

  NOVA.contractsListGet = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/clientportal/contract/list/get',
      data: {
        'page_number': NOVA.current_page(),
        'search_term' : $('#search-input').val(),
        'start_date_sort' : NOVA.start_date_sort(),
        'start_date_sort_order' : NOVA.selectedsortByStartDate(),
        'end_date_sort' : NOVA.end_date_sort(),
        'end_date_sort_order' : NOVA.selectedsortByEndDate(),
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

  NOVA.sortByStartDate = function(){
    NOVA.start_date_sort('true');
    NOVA.end_date_sort('false');
    if(NOVA.selectedsortByStartDate() == 'ascending'){
      NOVA.selectedsortByStartDate('descending')
      NOVA.contractsListGet()
    }else{
      NOVA.selectedsortByStartDate('ascending');
      NOVA.contractsListGet()
    }
  }

  NOVA.sortByEndDate = function(){
    NOVA.start_date_sort('false');
    NOVA.end_date_sort('true');
    if(NOVA.selectedsortByEndDate() == 'ascending'){
      NOVA.selectedsortByEndDate('descending')
      NOVA.contractsListGet()
    }else{
      NOVA.selectedsortByEndDate('ascending');
      NOVA.contractsListGet()
    }
  }

   NOVA.statusFilter = function(data,e){
    item_selected = $(e.currentTarget).is(':checked')
    if (item_selected == true){
      NOVA.filterstatusList.push(data.name)
    }else{
      NOVA.filterstatusList.remove(data.name)
    }
    console.log(NOVA.filterstatusList())
    NOVA.contractsListGet();
  };

  NOVA.docViewer = function(data){
    $("#pdfWrapperModal").modal('show');
    NOVA.contract_id(data.contract_id);
    PDFObject.embed(data.doc, "#pdfWrapper");
  }

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

  NOVA.sendMail = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('contract_id', NOVA.contract_id());
    formdata.append('email', NOVA.toEmail());
    $.ajax({
      method: 'POST',
      url: '/api/clientportal/send/client/contract',
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

/*  
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
  */

  })(this);
  
  function init() {
    if (document.readyState == "interactive") {
      NOVA.hideLoading();
      ko.applyBindings(NOVA);
      NOVA.contractsListGet();
      NOVA.getAppLogo();
    }
  }
  document.onreadystatechange = init;