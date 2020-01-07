(function (window) {

  NOVA.stageList = ko.observableArray([]);
  NOVA.closureStages = ko.observableArray([]);
  NOVA.defaultStagesList = ko.observableArray([]);
  NOVA.stageName = ko.observable('');
  NOVA.index = ko.observable('');
  NOVA.stageId = ko.observable('');
  NOVA.newStageName = ko.observable('');
  NOVA.totalLength = ko.observable('');
  NOVA.stageNameEdit = ko.observable('');

  $( "#lead-channel-list" ).sortable({
    items: "li:not(.disabled)",
    handle: ".drag-handle",
    start: function (e, ui) {
      console.log(ui.item.attr('id').match(/\d+/)[0])
      // OFM.from_position(ui.item.attr('id').match(/\d+/)[0])
    },
    stop: function (event, ui) {
      NOVA.index(ui.item.index() + 1);
      NOVA.stageId(ui.item.attr('id').match(/\d+/)[0]);
      console.log(NOVA.stageId());
      NOVA.updateStageIndex();
      // OFM.to_position(ui.item.attr('id').match(/\d+/)[0])
    },
  });

  $(document).on('keyup', '.lead-stage-input', function(event) {
    var _this = $(this);
    // var num = $(event.target).val().match(/^[a-z0-9]/);
    // console.log(num)
    // var getVal = $(this).val();
    // $(this).val(getVal.trim());
    if(_this.val() != '' && $(event.target).val().charAt(0) != ' ') {
      _this.closest('li').find('.lead-stage-save').prop('disabled', false)
    } else {
      _this.closest('li').find('.lead-stage-save').prop('disabled', true)
    }
  })

  

  

  $(document).on('click', '.lead-stage-edit', function() {
    $('.input-wrp').addClass('d-none');
    $('.lead-stage-save').addClass('d-none');
    $('span.label').removeClass('d-none');
    $('.lead-stage-edit').removeClass('d-none');
    var _this = $(this);
    _this.closest('li').find('.input-wrp').removeClass('d-none').find('input').focus();
    _this.closest('li').find('.lead-stage-save').removeClass('d-none');
    _this.closest('li').find('span.label').addClass('d-none');
    _this.closest('li').find('.lead-stage-edit').addClass('d-none');
  })

  $('.add-lead-stage-btn').on('click', function() {
    $('.lead-channel-list').removeClass('read-only-layout');
    $('.lead-stage-input').focus();
  })


  NOVA.getLeadStages = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/lead/stages/get',
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.stageList([]);
      for(var i=0; i<d.stages_list.length; i++){
        NOVA.stageList.push(d.stages_list[i]);
      }
      NOVA.closureStages([]);
      for(var i=0; i< d.closure_stages.length; i++){
        NOVA.closureStages.push(d.closure_stages[i]);
      }
      NOVA.defaultStagesList([]);
      for(var i=0; i< d.default_stages_list.length; i++){
        NOVA.defaultStagesList.push(d.default_stages_list[i]);
      }
      NOVA.totalLength(d.all_stages_list.length);
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.createStage = function() {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();

    formdata.append('stage_name', NOVA.stageName());

    $.ajax({
      method: 'POST',
      url: '/api/admin/lead/stage/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.getLeadStages();
      NOVA.stageName('');
      NOVA.showToast(d);
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.updateStageIndex = function() {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();

    formdata.append('end_index', NOVA.index());
    formdata.append('stage_id', NOVA.stageId());

    $.ajax({
      method: 'POST',
      url: '/api/admin/stage/index/update',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.getLeadStages();
      NOVA.stageName('');
      NOVA.showToast(d);
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.editStage = function(data) {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();

    formdata.append('stage_name', NOVA.stageName());
    formdata.append('stage_id', data.stage_id);

    $.ajax({
      method: 'POST',
      url: '/api/admin/lead/stage/edit',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.getLeadStages();
      NOVA.showToast(d);
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.deleteStage = function(data) {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();

    formdata.append('stage_id', data.stage_id);

    $.ajax({
      method: 'POST',
      url: '/api/admin/lead/stage/delete',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.getLeadStages();
      NOVA.showToast(d);
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.getEditData = function(data){
    NOVA.stageName(data.stage_name);
  }

  $('#navItemAdmin').addClass('active');

})(this);
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    ko.applyBindings(NOVA);
    NOVA.getLeadStages();
  }
}
document.onreadystatechange = init;