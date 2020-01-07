(function (window) {
  NOVA = {}
  NOVA.data = ko.observableArray([]);
  
  NOVA.getCookie = function (name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

NOVA.MovieGet = function(){
  var csrftoken = NOVA.getCookie('csrftoken');
  $.ajax({
    method: 'GET',
    url: '/api/movie/list/get',
    beforeSend: function (xhr, settings) {
      xhr.setRequestHeader('X-CSRFToken', csrftoken);
    }
  })
    .done(function (d, textStatus, jqXHR) {
      console.log(d.data);
      d.data.forEach(x => {
        console.log(x)
        NOVA.data.push(x)
      });
    })
    .fail(function (jqXHR, textStatus, errorThrown) {

    })
    .always(function () {

    })

}

})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.MovieGet();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;

