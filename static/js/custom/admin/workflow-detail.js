(function (window) {

	NOVA.module_id = ko.observable('');
  NOVA.workflow_id = ko.observable('');
  NOVA.workflow_name = ko.observable('');
  NOVA.description = ko.observable('');
  NOVA.status = ko.observable('');
  NOVA.selectedModule = ko.observable('');
  NOVA.is_deletable = ko.observable('');
  
  NOVA.workflowTriggers = ko.observableArray([]);
  NOVA.moduleTypes = ko.observableArray([]);

  createWorkflowValidator = $("#createWorkflow").validate({
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
      workflowName: {
        required: true
      },
      selectModule: {
        required: true,
      },
      description: {
        required: true,
      },
    },
    messages: {
      workflowName: {
        required: "Please enter workflow name"
      },
      selectModule: {
        required: "Please select module",
      },
      description: {
        required: "Please enter description",
      },
    },
    submitHandler: function() {
      $('.workflow-action').removeClass('d-none');
    }
  });

   $('.searchonly').select2({
    width: '100%',
    placeholder: 'Select'
  });

  $('.workflow-action .form-control').on('change', function(){
    if($('.select-trigger').val()!='' && $('.select-action').val()!='' && $('.select-stage').val()!='') {
      $('.save-workflow').prop('disabled', false);
    }else {
      $('.save-workflow').prop('disabled', true);
    }
  });


	NOVA.getmoduleTypes = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/module/types/options/get',
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
    	console.log(d)
      NOVA.moduleTypes([]);
      for(var i=0;i<d.length;i++){
        NOVA.moduleTypes.push(d[i]);
      }
      NOVA.getworkFlowDetails();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

	NOVA.getworkFlowDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = {
      'workflow_id': NOVA.workflow_id()
    }
    $.ajax({
      method: 'GET',
      url: '/api/admin/workflow/details/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
    	console.log(d);
    	// $('selectModule').val(d.module_id).trigger('change');
    	$('#selectModule').val(d.module_id).trigger('change');
      console.log(d.workflowitem_lst)
      NOVA.workflowTriggers([]);
      $('#addNewStep').removeClass('d-none')
      NOVA.module_id(d.module_name);
      NOVA.workflow_name(d.name);
      NOVA.description(d.description);
      NOVA.is_deletable(d.is_deletable);
      NOVA.status(d.status);
      for(var i=0;i<d.workflowitem_lst.length;i++){
        NOVA.workflowTriggers.push(d.workflowitem_lst[i]);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.deleteBtnClick = function(){
    $('#confirmModal').modal('show');
  }

  NOVA.deleteWorkFlow = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('workflow_id', NOVA.workflow_id());
    $.ajax({
      method: 'POST',
      url: '/api/admin/workflow/delete',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $('#confirmModal').modal('hide');      
      NOVA.showToast(d)
      window.location = '/admin/workflow'
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#confirmModal').modal('hide');      
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };
})(this);
function init() {
  if (document.readyState == "interactive") {
    ko.applyBindings(NOVA);
    var docUrlArr = document.URL.split('/');
    var id = docUrlArr[docUrlArr.length - 1];
    NOVA.workflow_id(id);
    NOVA.getmoduleTypes();
  }
}
document.onreadystatechange = init;