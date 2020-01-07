(function (window) { 

  NOVA.editing_config = ko.observable('');
  NOVA.emailConfigLst = ko.observableArray([]);

  $.validator.addMethod("emailRegex", function(value, element) {
    return /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/i.test( value );
  }, "Please enter valid email");

  NOVA.getEmailConfigList  =function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/email/config/list/get',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.emailConfigLst([]);
      for(var i=0; i< d.data.length; i++){
        NOVA.emailConfigLst.push(d.data[i]);
      }

      $('.email-config').each(function(){
        getId = $(this).attr('id');
        $("#"+getId).validate({
          ignore: "",
          errorElement: 'span',
          errorClass: 'error text-danger',
          errorPlacement: function(error, element) {
            if (element.parent().hasClass("input-group")) {
              error.appendTo( element.parent().parent());
            } else {
              error.appendTo( element.parent());
            }
          },
          submitHandler: function(e) {
            id_lst = ($(e).attr('id')).split('-')
            NOVA.editing_config(id_lst[1]);
            NOVA.emailConfigUpdate();
          }
        });
      });

      $('.assignTo').select2({
        tags: true,
        width: '100%',
      }).on('change', function (e, v) {
        if ($(e.currentTarget).find('option:checked').val() == '') {
          $(e.currentTarget).parent().find('span.error').show()
        } else {
          var getVal = $(this).val().join(',');
          $(this).parent().parent().find('.emailMultiple').val(getVal);
          $(e.currentTarget).parent().find('span.error').hide()
        }
      });

    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  $(document).on('click','.edit-button', function(){
    $(this).addClass('d-none');
    $(this).parent().find('.save-btn').removeClass('d-none');
    $(this).parent().parent().find('.assignTo').prop('disabled', false);
  });

 
  $.validator.addMethod("emailMulti", $.validator.methods.emailRegex, "Please select assign to valid email address");
  $.validator.addClassRules("emailMultiple", {
    emailMulti: true,
  });  

  NOVA.emailConfigUpdate = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('email_id', NOVA.editing_config());
    var recepient_emails = $('#assignTo-'+NOVA.editing_config()).val();
    formdata.append('recepient_emails', recepient_emails);
    $.ajax({
      method: 'POST',
      url: '/api/admin/update/email/config',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.getEmailConfigList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.statusChange = function(data, e){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('email_id', data.config_id);
    formdata.append('status', data.is_active);
    $.ajax({
      method: 'POST',
      url: '/api/admin/email/config/status/change',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.getEmailConfigList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }


})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    NOVA.getEmailConfigList();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;