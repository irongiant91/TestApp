(function (window){

	NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.role_id = ko.observable('');
  NOVA.pages_list = ko.observableArray([]);
  NOVA.rolesList = ko.observableArray([]);

	NOVA.search = function() {
    NOVA.current_page(1);
    NOVA.getRoles();
  }

  NOVA.getRoleDetail = function(data) {
  	location.href = '/admin/edit/role-management/'+data.role_id;
  }

  NOVA.changeStatus = function(data) {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    
    formdata.append('role_id', data.role_id);
    formdata.append('status', data.status);

    $.ajax({
      method: 'POST',
      url: '/api/admin/role/status/change',
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
      NOVA.getRoles();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  } 

  NOVA.deleteRole = function(data) {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    
    formdata.append('role_id', NOVA.role_id());

    $.ajax({
      method: 'POST',
      url: '/api/admin/role/delete',
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
      NOVA.showToast(d)
      NOVA.getRoles();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.getRoles = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/roles/list/get',
      data:{'search_term':$('#search-input').val(),'page_number': NOVA.current_page()},
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.rolesList([]);
      for(var i = 0; i < d.data.length; i++) {
        NOVA.rolesList.push(d.data[i]);
      }
      NOVA.page_count(d.page_count);
      NOVA.refreshPagination();
      NOVA.pageSearch('');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
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
      NOVA.getProperties();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getProperties();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getProperties();
  };

  NOVA.getFirstPage = function(){
    NOVA.current_page(1);
    NOVA.getProperties();
  }
  NOVA.getLastPage = function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getProperties();
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
    NOVA.getRoles();
  };

  NOVA.confirmdelete = function(data){
    $("#confirmModal").modal('show')
    NOVA.role_id(data.role_id)
  }

  $('#navItemAdmin').addClass('active');

})(this);
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    ko.applyBindings(NOVA);
    NOVA.getRoles();
  }
}
document.onreadystatechange = init;