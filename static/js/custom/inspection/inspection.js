(function (window) {
  NOVA.search_term = ko.observable('');
  NOVA.page_count = ko.observable('');
  NOVA.inspection_id = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.current_page = ko.observable(1);

  NOVA.pages_list = ko.observableArray([]);
  NOVA.inspectionHistoryList = ko.observableArray([]);

  NOVA.device_list = ko.observableArray([]);
  NOVA.filterdeviceList= ko.observableArray([]);
  NOVA.name_list = ko.observableArray([]);
  NOVA.filterNameList = ko.observableArray([]);
  NOVA.status_list = ko.observableArray([]);
  NOVA.filterStatusList = ko.observableArray([]);

  NOVA.date_sort = ko.observable('false');
  NOVA.date_sort_order = ko.observable('ascending');

  NOVA.getInspectionhistoryList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/inspection/history/list/get',
      data: {
        'page_number': NOVA.current_page(),
        'search_term':NOVA.search_term(),
        'filterdeviceList': ko.toJSON(NOVA.filterdeviceList()),
        'filterNameList': ko.toJSON(NOVA.filterNameList()),
        'filterStatusList': ko.toJSON(NOVA.filterStatusList()),
        'date_sort': NOVA.date_sort(),
        'date_sort_order': NOVA.date_sort_order(),
      },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.inspectionHistoryList([]);
      for(var i=0; i<d.data.length; i++){
        NOVA.inspectionHistoryList.push(d.data[i]);
      }
      NOVA.page_count(d.page_count);
      NOVA.refreshPagination();
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
      NOVA.getInspectionhistoryList();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getInspectionhistoryList();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getInspectionhistoryList();
  };

  NOVA.getFirstPage= function(){
    NOVA.current_page(1);
    NOVA.getInspectionhistoryList();
  };

  NOVA.getLastPage= function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getInspectionhistoryList();
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
    NOVA.getInspectionhistoryList();
  }


  NOVA.inspectionDetails = function(data,e){
    window.open('/inspection-report/'+data.id+'/detail');
  };

  NOVA.getInspFilterList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/inspection/filter/list/get',      
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.device_list([]);
      for(var i=0; i<d.registration_id_lst.length; i++){
        NOVA.device_list.push(d.registration_id_lst[i]);
      }

      NOVA.name_list([]);
      for(var i=0; i<d.name_lst.length; i++){
        NOVA.name_list.push(d.name_lst[i]);
      }

      NOVA.status_list([]);
      for(var i=0; i<d.status_lst.length; i++){
        NOVA.status_list.push(d.status_lst[i]);
      }
      NOVA.getInspectionhistoryList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }


  NOVA.statusFilter = function(data,e){
    item_selected = $(e.currentTarget).is(':checked')
    if (item_selected == true){
      NOVA.filterStatusList.push(data.name)
    }else{
      NOVA.filterStatusList.remove(data.name)
    }
    NOVA.getInspectionhistoryList();
  };

  NOVA.deviceFilter = function(data,e){
    item_selected = $(e.currentTarget).is(':checked')
    if (item_selected == true){
      NOVA.filterdeviceList.push(data.registration_id)
    }else{
      NOVA.filterdeviceList.remove(data.registration_id)
    }
    NOVA.getInspectionhistoryList();
  };

  NOVA.inspectorFilter = function(data,e){
    item_selected = $(e.currentTarget).is(':checked')
    if (item_selected == true){
      NOVA.filterNameList.push(data.inspector_name)
    }else{
      NOVA.filterNameList.remove(data.inspector_name)
    }
    NOVA.getInspectionhistoryList();
  };


  NOVA.sortDate = function(){
    NOVA.date_sort('true');
    if(NOVA.date_sort_order() == 'descending'){
      NOVA.date_sort_order('ascending');
    }else{
      NOVA.date_sort_order('descending');
    }
    NOVA.getInspectionhistoryList();
  }

  NOVA.searchKey = function(){
    NOVA.current_page(1);
    NOVA.search_term($('#search-input').val());
    NOVA.getInspectionhistoryList();
  };

})(this);
 
  function init() {    
    $('#inspections').addClass('active')
    if (document.readyState == "interactive") {
      NOVA.hideLoading();
      NOVA.getAppLogo();
      NOVA.getInspFilterList();
      ko.applyBindings(NOVA);
    }
  }

document.onreadystatechange = init;