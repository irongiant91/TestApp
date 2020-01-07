(function (window) {

  NOVA.search_term = ko.observable('');
  NOVA.page_count = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.current_page = ko.observable(1);
  NOVA.job_type_id = ko.observable('');
  NOVA.jobtype_id = ko.observable('');
  NOVA.name_sort = ko.observable('false');
  NOVA.name_sort_order = ko.observable('ascending');

  NOVA.jobtype_List = ko.observableArray([]);
  NOVA.filtervtypeList = ko.observableArray([]);
  NOVA.pages_list = ko.observableArray([]);
  NOVA.VehicleTypes_list = ko.observableArray([]);

  NOVA.getVehicleTypes = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/vehicle/types/get',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.VehicleTypes_list([]);
      $('[data-toggle="tooltip"]').tooltip();
      for(var i=0; i<d.data.length; i++){
        NOVA.VehicleTypes_list.push(d.data[i]);
      }
      NOVA.getjtList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };


  NOVA.getjtList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/job/type/list/get',
      data: {
        'page_number': NOVA.current_page(),
        'search_term':NOVA.search_term(),
        'filtervtypeList': ko.toJSON(NOVA.filtervtypeList()),
        'name_sort_order': NOVA.name_sort_order(),
      },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {

      NOVA.jobtype_List([]);
      for(var i=0; i<d.data.length; i++){
        NOVA.jobtype_List.push(d.data[i]);
      }
      NOVA.page_count(d.page_count);
      NOVA.refreshPagination();
      NOVA.pageSearch('');
      if(NOVA.jobtype_List().length) {
        $('.card-data-empty').addClass('d-none');
      }
      else{
        $('.card-data-empty').removeClass('d-none');
      }
      $('[data-toggle="tooltip"]').each(function() {
        if($(this).attr('title') != '') {
          $(this).tooltip({ boundary: 'window' })
        } else {
          var vals = $(this).parent().find('.forTollTip').html();
          $(this).attr('title',vals)
          $(this).tooltip({ boundary: 'window' })
        } 
      })
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
      NOVA.getjtList();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getjtList();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getjtList();
  };

  NOVA.getFirstPage= function(){
    NOVA.current_page(1);
    NOVA.getjtList();
  };

  NOVA.getLastPage= function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getjtList();
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
    NOVA.getjtList();
  }

  NOVA.searchKey = function(){
    NOVA.current_page(1);
    NOVA.search_term($('#search-input').val());
    NOVA.getjtList();
  };

  NOVA.vehicleTypeFilter = function(data,e){
    item_selected = $(e.currentTarget).is(':checked')
    if (item_selected == true){
      NOVA.filtervtypeList.push(data.id)
    }else{
      NOVA.filtervtypeList.remove(data.id)
    }
    NOVA.getjtList();
  };

  NOVA.clickNameSort = function(){
    if(NOVA.name_sort_order() == 'descending'){
      NOVA.name_sort_order('ascending');
    }else{
      NOVA.name_sort_order('descending');
    }
    NOVA.getjtList();
  };

  NOVA.statusChange = function(data,e){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('job_type_id', data.id);
    formdata.append('status', data.status);
    $.ajax({
      method: 'POST',
      url: '/api/admin/jobtype/status/change',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d.msg)
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.getjtList();
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.detailRedirect = function(data,e){
    window.open('/admin/jobtype/edit/'+data.id);
  }

  $('#navItemAdmin').addClass('active');
  

  NOVA.deleteJobtype = function(data,e){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('job_type_id', NOVA.jobtype_id());
    $.ajax({
      method: 'POST',
      url: '/api/admin/jobtype/delete',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $("#confirmModal").modal('hide')
      NOVA.showToast(d.msg)
      NOVA.getVehicleTypes();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.confirmdeleteJobtype = function(data){
    $("#confirmModal").modal('show')
    NOVA.jobtype_id(data.id)
  }
  
})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    NOVA.getVehicleTypes();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;