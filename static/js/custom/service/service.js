(function (window) {
  NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.servicesList = ko.observableArray([]);
  NOVA.pages_list = ko.observableArray([]);
  NOVA.servicedByList = ko.observableArray([]);
  NOVA.cuteTracIds = ko.observableArray([]);
  NOVA.statusList = ko.observableArray([]);
  NOVA.selectedServicedBy = ko.observableArray([]);
  NOVA.selectedCuteTrac = ko.observableArray([]);
  NOVA.selectedStatus = ko.observableArray([]);
  NOVA.idSort = ko.observable('false');
  NOVA.idSortOrder = ko.observable('');
  NOVA.costSort = ko.observable('false');
  NOVA.costSortOrder = ko.observable('');
  NOVA.dateSort = ko.observable('false');
  NOVA.dateSortOrder = ko.observable('');

  NOVA.getServicesList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/inspection/get/services/list',
      data:{'search_term':$('#search-input').val(),
      'page_number': NOVA.current_page(),
      'selectedServicedBy':ko.toJSON(NOVA.selectedServicedBy()),
      'selectedCuteTrac':ko.toJSON(NOVA.selectedCuteTrac()),
      'selectedStatus':ko.toJSON(NOVA.selectedStatus()),
      'idSort': NOVA.idSort(),
      'idSortOrder': NOVA.idSortOrder(),
      'costSort': NOVA.costSort(),
      'costSortOrder': NOVA.costSortOrder(),
      'dateSort': NOVA.dateSort(),
      'dateSortOrder': NOVA.dateSortOrder(),
      },
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.servicesList([]);      
      for(i = 0; i < d.services_list.length; i++) {
        NOVA.servicesList.push(d.services_list[i]);
      }
      console.log(NOVA.servicesList())
      NOVA.page_count(d.page_count);
      NOVA.refreshPagination();
      NOVA.pageSearch('');
      if(NOVA.servicesList().length) {
        $('.card-data-empty').addClass('d-none');
      }
      else{
        $('.card-data-empty').removeClass('d-none');
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
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
      NOVA.getServicesList();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getServicesList();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getServicesList();
  };

  NOVA.getFirstPage= function(){
    NOVA.current_page(1);
    NOVA.getServicesList();
  };

  NOVA.getLastPage= function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getServicesList();
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
    NOVA.getServicesList();
  }

  NOVA.searchKey = function(){
    NOVA.current_page(1);
    NOVA.getServicesList();
  }

  NOVA.redirectToDetails = function(data, e){
    window.open('/vehicle/service/'+data.service_id);
  }

  NOVA.getServicesFilter = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/inspection/get/service/filters',
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.servicedByList([]);
      for(var i=0; i<d.servicedby_list.length; i++){
        NOVA.servicedByList.push(d.servicedby_list[i]);
      }
      NOVA.cuteTracIds([]);
      for(var i=0; i<d.cuteTracIds.length; i++){
        NOVA.cuteTracIds.push(d.cuteTracIds[i]);
      }
      NOVA.statusList([]);
      for(var i=0; i<d.status_list.length; i++){
        NOVA.statusList.push(d.status_list[i]);
      }      
      NOVA.getServicesList();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.filterServiceBy = function(data,e) {
    if (event.target.checked) {
      NOVA.selectedServicedBy.push(data)
    } 
    else {
      if (NOVA.selectedServicedBy().includes(data)) {
        var i = NOVA.selectedServicedBy().indexOf(data)
        NOVA.selectedServicedBy.splice(i, 1)
      }
    }
    NOVA.getServicesList();
  }

  NOVA.filterCuteTracId = function(data,e) {
    if (event.target.checked) {
      NOVA.selectedCuteTrac.push(data)
    } 
    else {
      if (NOVA.selectedCuteTrac().includes(data)) {
        var i = NOVA.selectedCuteTrac().indexOf(data)
        NOVA.selectedCuteTrac.splice(i, 1)
      }
    }
    NOVA.getServicesList();
  }

  NOVA.filterStatus = function(data,e) {
    if (event.target.checked) {
      NOVA.selectedStatus.push(data)
    } 
    else {
      if (NOVA.selectedStatus().includes(data)) {
        var i = NOVA.selectedStatus().indexOf(data)
        NOVA.selectedStatus.splice(i, 1)
      }
    }
    NOVA.getServicesList();
  }

  NOVA.sortServiceId = function() {
    NOVA.idSort('true');
    NOVA.costSort('false');
    NOVA.dateSort('false');
    if(NOVA.idSortOrder() == 'ascending'){
      NOVA.idSortOrder('descending')
    }else{
      NOVA.idSortOrder('ascending') 
    }
    NOVA.getServicesList();
  }

  NOVA.sortCost = function() {
    NOVA.costSort('true');
    NOVA.idSort('false');
    NOVA.dateSort('false');
    if(NOVA.costSortOrder() == 'ascending'){
      NOVA.costSortOrder('descending')
    }else{
      NOVA.costSortOrder('ascending')
    }
    NOVA.getServicesList();
  }

  NOVA.dateCost = function() {
    NOVA.dateSort('true');
    NOVA.idSort('false');
    NOVA.costSort('false');
    if(NOVA.dateSortOrder() == 'ascending'){
      NOVA.dateSortOrder('descending')
    }else{
      NOVA.dateSortOrder('ascending')
    }
    NOVA.getServicesList();
  }

})(this);
  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getServicesFilter();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;