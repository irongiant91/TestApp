(function (window) {
  NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.incident_uid = ko.observable('');
  NOVA.vehicle_id = ko.observable('');
  NOVA.issue_id = ko.observable('');
  NOVA.incident_remarks = ko.observable('');
  NOVA.idSortOrder = ko.observable('ascending');
  NOVA.idSort = ko.observable('false');
  NOVA.dateSortOrder = ko.observable('ascending');
  NOVA.dateSort = ko.observable('false');
  
  NOVA.incidentsList = ko.observableArray([]);
  NOVA.pages_list = ko.observableArray([]);
  NOVA.vehicles_list = ko.observableArray([]);
  NOVA.issues_list = ko.observableArray([]);
  NOVA.images_list = ko.observableArray([]);
  NOVA.files = ko.observableArray([]);
  NOVA.cuteTracIds = ko.observableArray([]);
  NOVA.issuesList = ko.observableArray([]);
  NOVA.createdByList = ko.observableArray([]);
  NOVA.selectedCuteTrac = ko.observableArray([]);
  NOVA.selectedIssue = ko.observableArray([]);
  NOVA.selectedCreatedBy = ko.observableArray([]);

  NOVA.getIncidentsList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/incidents/list',
      data:{'search_term':$('#search-input').val(),
            'page_number': NOVA.current_page(),
            'selectedCuteTrac':ko.toJSON(NOVA.selectedCuteTrac()),
            'selectedIssue':ko.toJSON(NOVA.selectedIssue()),
            'selectedCreatedBy':ko.toJSON(NOVA.selectedCreatedBy()),
            'idSort': NOVA.idSort(),
            'idSortOrder': NOVA.idSortOrder(),
            'dateSort': NOVA.dateSort(),
            'dateSortOrder': NOVA.dateSortOrder(),
      },
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.incidentsList([]);      
      for(i = 0; i < d.incidents_list.length; i++) {
        NOVA.incidentsList.push(d.incidents_list[i]);
      }
      
      NOVA.page_count(d.page_count);
      NOVA.refreshPagination();
      NOVA.pageSearch('');
      if(NOVA.incidentsList().length) {
        $('.card-data-empty').addClass('d-none');
      }
      else{
        $('.card-data-empty').removeClass('d-none');
      }
      NOVA.getIncidentUid();
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
      NOVA.getIncidentsList();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getIncidentsList();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getIncidentsList();
  };

  NOVA.getFirstPage= function(){
    NOVA.current_page(1);
    NOVA.getIncidentsList();
  };

  NOVA.getLastPage= function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getIncidentsList();
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
    NOVA.getIncidentsList();
  }

  NOVA.searchKey = function(){
    NOVA.current_page(1);
    NOVA.getIncidentsList();
  }

  NOVA.getIncidentUid = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/incident/uid',
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.incident_uid(d.data);
      NOVA.getVehiclesList();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.getVehiclesList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/vehicles/list',
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.vehicles_list([]);
      for(var i=0; i<d.vehicles_list.length; i++){
        NOVA.vehicles_list.push(d.vehicles_list[i]);
      }
      NOVA.getIssueTypes();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.getIssueTypes = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/issuetypes/list',
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.issues_list([]);
      for(var i=0; i<d.issues_list.length; i++){
        NOVA.issues_list.push(d.issues_list[i]);
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  /*NOVA.changeVehicelId = function(data, e){
    NOVA.vehicles_list().forEach(function(entry) {
      if(entry.id == data.id){
        NOVA.vehicle_id(entry.id);
        $('#vehicleId').val(entry.id).trigger('change');
        $('#vehicleRegNumber').val(entry.id).trigger('change');
      }
    })
  }*/
  
  NOVA.getBase64 = function(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  NOVA.setThumbnailWidth = function(){
    $('.thumbnail').each(function(el, i){
      let imgWidth = $(this).width();
    })
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  NOVA.uploadImage = function(data, e, file){
    NOVA.getBase64(file).then(function(data){
      NOVA.files.push(dataURLtoFile(data, file.name))
      NOVA.images_list.push({preview:data})
      NOVA.setThumbnailWidth();
      $('#uploadImage').val('');
    })
  }

  NOVA.removeImage = function(data, e, index){
    NOVA.images_list.remove(data);
    NOVA.files().splice(index(), 1);
  }

  NOVA.createIncident = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('incident_uid', NOVA.incident_uid());
    formdata.append('vehicle_id', NOVA.vehicle_id());
    formdata.append('issue_id', NOVA.issue_id());
    formdata.append('incident_remarks', NOVA.incident_remarks());
    if (NOVA.files().length){
      $.each(NOVA.files(), function(i, file) {
        formdata.append('images', file);
      });
    }
    $.ajax({
      method: 'POST',
      url: '/api/order/create/incident',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.showToast(d.msg);
      $("body").removeClass("sidebar-right-open");
      NOVA.getIncidentsList();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.redirectToDetails = function(data, e){
    window.open('/incident/detail/'+data.incident_id);
  }

  NOVA.getIncidentFilters = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/incident/filters',
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.cuteTracIds([]);
      for(var i=0; i<d.cuteTracIds.length; i++){
        NOVA.cuteTracIds.push(d.cuteTracIds[i]);
      }
      NOVA.issuesList([]);
      for(var i=0; i<d.issues_list.length; i++){
        NOVA.issuesList.push(d.issues_list[i]);
      }
      NOVA.createdByList([]);
      for(var i=0; i<d.createdby_list.length; i++){
        NOVA.createdByList.push(d.createdby_list[i]);
      }
      NOVA.getIncidentsList();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
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
    NOVA.getIncidentsList();
  }

  NOVA.filterIssue = function(data,e) {
    if (event.target.checked) {
      NOVA.selectedIssue.push(data)
    } 
    else {
      if (NOVA.selectedIssue().includes(data)) {
        var i = NOVA.selectedIssue().indexOf(data)
        NOVA.selectedIssue.splice(i, 1)
      }
    }
    NOVA.getIncidentsList();
  }

  NOVA.filterCreatedBy = function(data,e) {
    if (event.target.checked) {
      NOVA.selectedCreatedBy.push(data)
    } 
    else {
      if (NOVA.selectedCreatedBy().includes(data)) {
        var i = NOVA.selectedCreatedBy().indexOf(data)
        NOVA.selectedCreatedBy.splice(i, 1)
      }
    }
    NOVA.getIncidentsList();
  }

  NOVA.sortIncidentId = function() {
    NOVA.idSort('true');
    NOVA.dateSort('false');
    if(NOVA.idSortOrder() == 'ascending'){
      NOVA.idSortOrder('descending')
    }else{
      NOVA.idSortOrder('ascending') 
    }
    NOVA.getIncidentsList();
  }

  NOVA.sortCreatedDate = function() {
    NOVA.dateSort('true');
    NOVA.idSort('false');
    if(NOVA.dateSortOrder() == 'ascending'){
      NOVA.dateSortOrder('descending')
    }else{
      NOVA.dateSortOrder('ascending') 
    }
    NOVA.getIncidentsList();
  }

})(this);
  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getIncidentFilters();    
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;