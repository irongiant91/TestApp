(function (window) {

	NOVA.workflowList = ko.observableArray([]);
	NOVA.statusList = ko.observableArray([]);
	NOVA.moduleList = ko.observableArray([]);
	NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.pages_list = ko.observableArray([]);
  NOVA.selectedStatus = ko.observableArray([]);
  NOVA.selectedModule = ko.observableArray([]);

  NOVA.filterModule = function(data) {
  	if (event.target.checked) {
        NOVA.selectedModule.push(data)
      } 
    else {
      if (NOVA.selectedModule().includes(data)) {
        var i = NOVA.selectedModule().indexOf(data)
        NOVA.selectedModule.splice(i, 1)
      }
    }
    NOVA.getWorkflow();
  }

  NOVA.statusFilter = function(data,e) {
    if (event.target.checked) {
        NOVA.selectedStatus.push(data)
      } 
    else {
      if (NOVA.selectedStatus().includes(data)) {
        var j = NOVA.selectedStatus().indexOf(data)
        NOVA.selectedStatus.splice(j, 1)
      }
    }
    NOVA.getWorkflow();
  }

  NOVA.search = function() {
    NOVA.current_page(1);
    NOVA.getWorkflow();
  }

  NOVA.workflowDetails = function(data,e){
    if(data.item_count > 0){
      // window.location = '/settings/workflow/details/'+data.id;
      window.open('/admin/workflow/detail/'+data.id);
    }else{
      // window.location = '/settings/workflow/edit/'+data.id;
      window.open('/admin/workflow/edit/'+data.id);
    }
  }

  NOVA.changeStatus = function(data){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    
    formdata.append('workflow_id', data.id);
    formdata.append('status', data.is_active);

    $.ajax({
      method: 'POST',
      url: '/api/admin/workflow/status/change',
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
      NOVA.getWorkflow();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.getModulesStatus = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/modules/status/get',
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.statusList([]);
      NOVA.moduleList([]);
      NOVA.moduleList(d.modules);
      NOVA.statusList(d.statuses);
      NOVA.getWorkflow();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

	NOVA.getWorkflow = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/workflow/list/get',
      data:{'search_term':$('#search-input').val(),'page_number': NOVA.current_page(),'selected_status': ko.toJSON(NOVA.selectedStatus()),'selected_module':ko.toJSON(NOVA.selectedModule())},
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.workflowList([]);
      for(var i = 0; i < d.data.length; i++) {
        NOVA.workflowList.push(d.data[i]);
      }
      NOVA.page_count(d.page_count);
      NOVA.refreshPagination();
      NOVA.pageSearch('')
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
      NOVA.getWorkflow();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getWorkflow();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getWorkflow();
  };

  NOVA.getFirstPage = function(){
    NOVA.current_page(1);
    NOVA.getWorkflow();
  }
  NOVA.getLastPage = function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getWorkflow();
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
    NOVA.getWorkflow();
  }

})(this);
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    ko.applyBindings(NOVA);
    NOVA.getModulesStatus();
  }
}
document.onreadystatechange = init;