(function (window) {
  NOVA.search_term = ko.observable('');
  NOVA.page_count = ko.observable('');
  NOVA.inspection_id = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.current_page = ko.observable(1);

  NOVA.pages_list = ko.observableArray([]);
  NOVA.inspectionConfigList = ko.observableArray([]);

  NOVA.getInspectionConfigurationList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/inspection/configured/inspection/list/get',
      data: {
        'page_number': NOVA.current_page(),
        'search_term':NOVA.search_term(),
      },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.inspectionConfigList([]);
      for(var i=0; i<d.data.length; i++){
        NOVA.inspectionConfigList.push(d.data[i]);
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
      NOVA.getInspectionConfigurationList();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getInspectionConfigurationList();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getInspectionConfigurationList();
  };

  NOVA.getFirstPage= function(){
    NOVA.current_page(1);
    NOVA.getInspectionConfigurationList();
  };

  NOVA.getLastPage= function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getInspectionConfigurationList();
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
    NOVA.getInspectionConfigurationList();
  }

  NOVA.searchKey = function(){
    NOVA.current_page(1);
    NOVA.search_term($('#search-input').val());
    NOVA.getInspectionConfigurationList();
  };


  NOVA.inspectionDetails = function(data,e){
    window.open('/inspection-edit/'+data.id);
  };

  NOVA.runInspection = function(data,e){
    window.open('/inspection-run/'+data.id+'/create');
  };

  NOVA.viewCummulative = function(data,e){
    window.open('/inspection-run/'+data.id+'/view-cumalative');
  };


})(this);
 
  function init() {    
    $('#navItemInspection').addClass('active');
    if (document.readyState == "interactive") {
      NOVA.hideLoading();
      NOVA.getAppLogo();
      NOVA.getInspectionConfigurationList();
      ko.applyBindings(NOVA);
    }
  }

document.onreadystatechange = init;