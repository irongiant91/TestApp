(function (window) {

	NOVA.workflow_id = ko.observable('');
  NOVA.module_id = ko.observable('');
	NOVA.description = ko.observable('');
	NOVA.workflowName = ko.observable('');
	NOVA.selectedModule = ko.observable('');
	NOVA.workflow_created = ko.observable(true);
	NOVA.button_active_status = ko.observable(false);
	NOVA.button_type = ko.observable(false);
	NOVA.moduleTypes = ko.observableArray([]);
  NOVA.workflowTriggers = ko.observableArray([]);
  NOVA.editMode = ko.observable(false);

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
        NOVA.editMode(false);
        $('#saveBtn').addClass('d-none');
        $('#editBtn').removeClass('d-none');
        $('.workflow-action').removeClass('d-none');
        NOVA.saveWorkflow();
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

  var trigger_action = function () {
    this.selected_trigger = ko.observable();
    this.selected_trigger_name = ko.observable();
    this.selected_action = ko.observable();
    this.action_by_id = ko.observable();
    this.selected_action_type = ko.observable();
    this.selected_action_by_id = ko.observable();
    this.selected_notice_user = ko.observable();
    this.selected_email = ko.observable();
    this.is_saved = ko.observable(false);
    this.selected_stage_id = ko.observable();
    this.repeating_type = ko.observable(false);

    this.trigger_list = ko.observableArray([]);
    this.action_list = ko.observableArray([]);
    this.action_by_list = ko.observableArray([]);
    this.stages_list = ko.observableArray([]);
    this.notice_to_list = ko.observableArray([]);

    this.fill = function (d) {
      this.selected_trigger('' || d.selected_trigger);
      this.selected_trigger_name('' || d.selected_trigger_name);
      this.selected_action('' || d.selected_action);
      this.action_by_id('' || d.action_by_id);
      this.selected_action_type('' || d.selected_action_type);
      this.selected_action_by_id('' || d.selected_action_by_id);
      this.repeating_type('' || d.repeating_type);
      this.selected_email('' || d.selected_email);
      this.selected_notice_user('' || d.selected_notice_user);
      this.selected_stage_id('' || d.selected_stage_id);

      for(var i=0;i<d.trigger_list.length;i++){
        var trigger_item1 = new trigger_item();
        trigger_item1.fill(d.trigger_list[i]);
        this.trigger_list.push(trigger_item1);
      }

      for(var i=0;i<d.action_list.length;i++){
        var action_item1 = new action_item();
        action_item1.fill(d.action_list[i]);
        this.action_list.push(action_item1);
      }

      for(var i=0;i<d.action_by_list.length;i++){
        var action_by_item1 = new action_by_item();
        action_by_item1.fill(d.action_by_list[i]);
        this.action_by_list.push(action_by_item1);
      }

      for(var i=0;i<d.stages_list.length;i++){
        var stage_item1 = new stage_item();
        stage_item1.fill(d.stages_list[i]);
        this.stages_list.push(stage_item1);
      }

      for(var i=0;i<d.notice_to_list.length;i++){
        var notice_to_item1 = new notice_to_item();
        notice_to_item1.fill(d.notice_to_list[i]);
        this.notice_to_list.push(notice_to_item1);
      }
      
    }
  }

  var trigger_item = function () {
    this.trigger_id = ko.observable('');
    this.trigger_name = ko.observable('');

    this.fill = function (d) {
      this.trigger_id('' || d.trigger_id);
      this.trigger_name('' || d.trigger_name);
    }
  };

  var action_item = function () {
    this.action_id = ko.observable('');
    this.action_name = ko.observable('');
    this.action_type = ko.observable('');

    this.fill = function (d) {
      this.action_id('' || d.action_id);
      this.action_name('' || d.action_name);
      this.action_type('' || d.action_type);
    }
  };

  var action_by_item = function () {
    this.action_by_id = ko.observable('');
    this.action_by_name = ko.observable('');

    this.fill = function (d) {
      this.action_by_id('' || d.action_by_id);
      this.action_by_name('' || d.action_by_name);
    }
  };

  var stage_item = function () {
    this.stage_id = ko.observable('');
    this.stage_name = ko.observable('');

    this.fill = function (d) {
      this.stage_id('' || d.stage_id);
      this.stage_name('' || d.stage_name);
    }
  };

  var notice_to_item = function () {
    this.notice_to_id = ko.observable('');
    this.notice_to_name = ko.observable('');

    this.fill = function (d) {
      this.notice_to_id('' || d.notice_to_id);
      this.notice_to_name('' || d.notice_to_name);
    }
  };

  function validateEmail(value) {
    var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return (regex.test(value)) ? true : false;
  }

  function validateEmails(string) {
    var result = string.replace(/\s/g, "").split(/,/);
    for(var i = 0;i < result.length;i++) {
      if(!validateEmail(result[i])) {
        return false;
      }
    }
    return true;
  }

   NOVA.emailFieldEntry = function(data,event){
    var email = $(event.currentTarget).val()
    data.selected_email(email)
    //console.log('rth',ko.toJS(NOVA.workflowTriggers()))
    if (email != ''){
      if(validateEmails(email)) {
       NOVA.button_active_status(true); 
      }
    }
    NOVA.buttonVisibile();
  };

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
      NOVA.moduleTypes([]);
      for(var i=0;i<d.length;i++){
        NOVA.moduleTypes.push(d[i]);
      }
      NOVA.getworkFlowDetails();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      // NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
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
      $('#addNewStep').removeClass('d-none')
      $('#SaveStep').removeClass('d-none');
      NOVA.module_id(d.module_id);
      NOVA.workflowName(d.name);
      NOVA.description(d.description);
      // NOVA.status(d.status);
      $('#selectModule').val(d.module_id).trigger('change');
      $('#moduleType').trigger('change');
      NOVA.getworkTriggerOptions();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.saveWorkflow = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('workflow_id', NOVA.workflow_id());
    formdata.append('workflow_name', NOVA.workflowName());
    formdata.append('module_id', NOVA.selectedModule());
    formdata.append('description', NOVA.description());
    $.ajax({
      method: 'POST',
      url: '/api/admin/workflow/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
    	// alert(1111111);
      // window.location = '/settings/workflow/edit/'+d.workflow_id
      // $('.workflow-action').removeClass('d-none');
      // $('#SaveStep').removeClass('d-none');
      // $('#saveWorkflow').attr("disabled","disabled");
      // NOVA.button_type(false);
      NOVA.workflow_created(true);
      NOVA.workflow_id(d.workflow_id);
      NOVA.showErrorModal(d.msg);
      NOVA.getworkTriggerOptions();
      // NOVA.getworkFlowDetails();
      // $('#addNewStep').removeClass('d-none')
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      $('#errorModal').on('hidden.bs.modal', function () {
        location.reload();
       })
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.getworkTriggerOptions = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = {
      'workflow_id': NOVA.workflow_id()
    }
    $.ajax({
      method: 'GET',
      url: '/api/admin/workflow/trigger/options/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      //console.log(d)
      NOVA.workflowTriggers([]);
      for(var i=0;i<d.length;i++){
        var trigger_action1 = new trigger_action();
        trigger_action1.fill(d[i]);
        NOVA.workflowTriggers.push(trigger_action1);
      }
      //console.log(ko.toJS(NOVA.workflowTriggers));
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.triggerChangeEvent = function(index,data,e){
    NOVA.button_active_status(false);
    array_length = NOVA.workflowTriggers().length
    if(index == 0 && array_length > 1){
      NOVA.workflowTriggers.splice(index + 1,array_length);
    }
    data.selected_action_type('')
    data.action_list.removeAll();
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = {
      'workflow_id': NOVA.workflow_id(),
      'trigger_id': data.selected_trigger()
    }
    $.ajax({
      method: 'GET',
      url: '/api/admin/workflow/action/options/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      for(var i=0;i<d.length;i++){
        data.action_list.push(d[i]);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.actionChangeEvent = function(index,data,e){
  	// //console.log(ko.toJS(data));
    data.selected_action_by_id('');
    data.selected_notice_user('');
    data.selected_email('');
    data.selected_stage_id('');
    data.action_by_list.removeAll();
    data.notice_to_list.removeAll();
    data.stages_list.removeAll();
    // NOVA.workflowTriggers()[index].action_by_list.push({'action_by_id': 1,'action_by_name': 'sreekanth'})
    NOVA.button_active_status(false);
    // //console.log('test',ko.toJS(NOVA.workflowTriggers()[index]))
    array_length = NOVA.workflowTriggers().length
    if(index == 0 && array_length > 1){
      NOVA.workflowTriggers.splice(index + 1,array_length);
    }else{
      if(array_length > 1){
        NOVA.workflowTriggers.splice(index + 2,array_length);
      }
    }
    array_length = NOVA.workflowTriggers().length
    NOVA.button_type(false);
    //console.log('this far 1');
    data.selected_action_type('');
    $.each(data.action_list(),function(index, value){
      if(value.action_id == data.selected_action()){
        data.selected_action_type(value.action_type);
      }
    });
    //console.log(ko.toJS(data));
    if (array_length == 1){
    	// var approveOrReject = data.action_list().find(item => item.action_name === "Approve/ Reject");
    	//console.log(approveOrReject);
      if(data.selected_action_type() == 'Action By (User)'){
        NOVA.button_type(true);
        //console.log('this far 2');
      }
    }else{
    	//console.log(ko.toJS(NOVA.workflowTriggers()[array_length - 2]));
    	// var approveOrReject = NOVA.workflowTriggers()[array_length - 2].action_list().find(item => item.action_name === "Approve/ Reject");
      if (NOVA.workflowTriggers()[array_length - 2].selected_action_type() == 'Action By (User)'){
        //console.log(3,array_length)
        NOVA.button_type(true);
        //console.log('this far 3');
      }
    }
    // alert(data.selected_action_type())
    if(data.selected_action_type() == 'Action By (User)'){
      var type = 'Action By (User)'
      NOVA.getActionByUser(data.selected_trigger(),index,type);
      //console.log('this far 4');
    }
    if(data.selected_action_type() == 'Notice To (User)'){
      var type = 'Notice To (User)'
      NOVA.getActionByUser(data.selected_trigger(),index,type);
      //console.log('this far 5');
    }
    if(data.selected_action_type() == 'Stages dropdown'){
      var type = 'Stages dropdown'
      NOVA.getActionByUser(data.selected_trigger(),index,type);
      //console.log('this far 6');
    }
    NOVA.buttonVisibile();
  };

  NOVA.stageChangeEvent = function(data,e){
    NOVA.buttonVisibile();
  };

  NOVA.actionByChangeEvent = function(index,data,e){
    NOVA.buttonVisibile(); 
  };

  NOVA.noticeToChangeEvent = function(index,data,e){
    NOVA.buttonVisibile();
  };

  NOVA.getActionByUser = function (trigger_id,index,type){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = {
      'workflow_id': NOVA.workflow_id(),
      'trigger_id': trigger_id
    }
    $.ajax({
      method: 'GET',
      url: '/api/admin/workflow/trigger/users/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.workflowTriggers()[index].action_by_list.removeAll();
      NOVA.workflowTriggers()[index].notice_to_list.removeAll();
      if(type == 'Action By (User)'){
        for(var i=0;i<d.username_lst.length;i++){
          NOVA.workflowTriggers()[index].action_by_list.push(d.username_lst[i])
        }
      }else if(type == 'Notice To (User)'){
        for(var i=0;i<d.username_lst.length;i++){
          NOVA.workflowTriggers()[index].notice_to_list.push(d.username_lst[i])
        }
      }else{
        for(var i=0;i<d.stages_list.length;i++){
          NOVA.workflowTriggers()[index].stages_list.push(d.stages_list[i])
        }
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.buttonVisibile = function(){
    NOVA.button_active_status(false);
    $.each(NOVA.workflowTriggers(),function(index, value){
      NOVA.button_active_status(false);
      if(value.selected_action_by_id() != '' && value.selected_action_by_id() != undefined){
        // console.log('1',ko.toJS(NOVA.workflowTriggers()))
        NOVA.button_active_status(true);
      }
      if(value.selected_email() != '' && value.selected_email() != undefined && validateEmails(value.selected_email())){
        // console.log('2',ko.toJS(NOVA.workflowTriggers()))
        NOVA.button_active_status(true);
      }
      if(value.selected_notice_user() != '' && value.selected_notice_user() != undefined){
        // console.log('3',ko.toJS(NOVA.workflowTriggers()))
        NOVA.button_active_status(true);
      }
      if(value.selected_stage_id() != '' && value.selected_stage_id() != undefined){
        // console.log('4',ko.toJS(NOVA.workflowTriggers()))
        NOVA.button_active_status(true);
      }
      if(value.selected_action_type() == 'No Action'){
        // console.log('5',ko.toJS(NOVA.workflowTriggers()))
        NOVA.button_active_status(true);
      }
      if (NOVA.button_active_status() == false){
        return NOVA.button_active_status()
      }
    });
  };

  NOVA.deleteStep =function(index,data, e){
    array_length = NOVA.workflowTriggers().length
    NOVA.workflowTriggers.splice(index,array_length);
    if (NOVA.workflowTriggers().length > 1){
      NOVA.button_type(true);
    }
    else{
      NOVA.button_type(false);
      NOVA.getworkTriggerOptions();
    }
    NOVA.buttonVisibile();
  };

  NOVA.saveStep = function(data,e){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('workflow_id', NOVA.workflow_id());
    formdata.append('workflow_items', ko.toJSON(NOVA.workflowTriggers()));
    $.ajax({
      method: 'POST',
      url: '/api/admin/workflow/items/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      window.location = '/admin/workflow'
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.addNewStep = function(data,e){
    $('#SaveStep').removeClass('d-none');
    NOVA.button_type(false);
    NOVA.button_active_status(false);
    var trigger_action1 = new trigger_action();
    var trigger_action2 = new trigger_action();
    NOVA.workflowTriggers.push(trigger_action1);
    NOVA.workflowTriggers.push(trigger_action2);

    array_length = NOVA.workflowTriggers().length
    //console.log(array_length)
    //console.log(NOVA.workflowTriggers()[array_length - 3].selected_trigger())
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = {
      'workflow_id': NOVA.workflow_id(),
      'trigger_id': NOVA.workflowTriggers()[array_length - 3].selected_trigger()
    }
    $.ajax({
      method: 'GET',
      url: '/api/admin/workflow/trigger/action/options/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
    	//console.log(d)
      NOVA.workflowTriggers()[array_length - 2].trigger_list.push(d.trigger_dct1);
      NOVA.workflowTriggers()[array_length - 1].trigger_list.push(d.trigger_dct2);
      NOVA.workflowTriggers()[array_length - 2].selected_trigger(d.triggerid1);
      NOVA.workflowTriggers()[array_length - 1].selected_trigger(d.triggerid2);
      NOVA.workflowTriggers()[array_length - 2].selected_trigger_name(d.triggername1);
      NOVA.workflowTriggers()[array_length - 1].selected_trigger_name(d.triggername2);
      for(var i=0;i<d.action_list1.length;i++) {
        NOVA.workflowTriggers()[array_length - 2].action_list.push(d.action_list1[i]);
      }
      for(var i=0;i<d.action_list2.length;i++) {
        NOVA.workflowTriggers()[array_length - 1].action_list.push(d.action_list2[i]);
      }
      for(var i=0;i<d.stages_list.length;i++) {
        NOVA.workflowTriggers()[array_length - 2].stages_list.push(d.stages_list[i]);
        NOVA.workflowTriggers()[array_length - 1].stages_list.push(d.stages_list[i]);
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

  NOVA.editBtnClick = function(){
    NOVA.editMode(true)
    $('#editBtn').addClass('d-none');
    $('#saveBtn').removeClass('d-none');
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
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

})(this);
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    ko.applyBindings(NOVA);
    var docUrlArr = document.URL.split('/');
    var id = docUrlArr[docUrlArr.length - 1];
    NOVA.workflow_id(id);
    NOVA.getmoduleTypes();
  }
}
document.onreadystatechange = init;