(function (window) {

  NOVA.order_id = ko.observable('');
  NOVA.image_url = ko.observable('');
  NOVA.report_id = ko.observable('');

  NOVA.incidents_list = ko.observableArray([]);   

  NOVA.getIncidents = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/incidents/list/get',
      data: {'order_id': NOVA.order_id()},
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.incidents_list([]);
      for (var i = 0; i < d.data.length; i++) {
        NOVA.incidents_list.push(d.data[i]);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.enlargeImage = function(data) {
    NOVA.image_url(data.image)
    $('#enlargeModal').modal('show');
  }

  NOVA.deleteBtn = function (data) {
    $("#confirmModal").modal('show')
    NOVA.report_id(data.incident_id);
  }
  
  NOVA.deleteIncident = function(data){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('incident_id',NOVA.report_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/delete/incident/report',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      $("#confirmModal").modal('hide')
      NOVA.showToast(d);
      NOVA.getIncidents();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      $("#confirmModal").modal('hide')
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      $('#errorModal').on('hidden.bs.modal', function () {
        location.reload();
      })
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

})(this);