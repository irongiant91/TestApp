(function (window) {
  
  NOVA.client_id = ko.observable();
  NOVA.contract_id = ko.observable();
  NOVA.search_term = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.page_count = ko.observable('');
  NOVA.current_page = ko.observable(1);
  NOVA.last_page = ko.observable('');
  NOVA.toEmail = ko.observable('');
  NOVA.pages_list = ko.observableArray([]);
  NOVA.contracts_list = ko.observableArray([]);
  NOVA.versionhistory_list = ko.observableArray([]);
  
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
      url: '/api/client/contract/list/get',
      data: {
        'page_number': NOVA.current_page(),
        'client_id' : NOVA.client_id(),
        'search_term' : $('#search-input').val()
      },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      console.log(d)
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
    window.location = '/client/'+NOVA.client_id()+'/contract-detail/'+data.contract_id
  }

  NOVA.versionDetails = function(data){
    window.location = '/client/'+NOVA.client_id()+'/contract-detail/'+data.contract_id
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
      $('#navItemClients').addClass('active');
      NOVA.hideLoading();
      ko.applyBindings(NOVA);
      var docUrlArr = document.URL.split('/');
      var client_id = docUrlArr[docUrlArr.length - 2];
      NOVA.client_id(client_id);
      NOVA.contractsListGet();
      NOVA.getAppLogo();
    }
  }
  document.onreadystatechange = init;