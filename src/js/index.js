import '../scss/index.scss';

(function($) {
  'use strict';

  var treveApi = 'https://api.treve.app/v0/subscriptions';
  var externalIP = 'unknown';

  $(document).ready(function() {
    $('#success-alert').hide();
    $('#already-subscribed-alert').hide();
    $('#error-alert').hide();

    $.getJSON('https://api.ipify.org?format=json', function(data) {
      externalIP = data.ip;
    });
  });

  var input = $('.validate-input .input100');

  $('.validate-form').on('submit', function() {
    var check = true;

    for (var i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }

    return check;
  });

  $('.validate-form .input100').each(function() {
    $(this).focus(function() {
      hideValidate(this);
    });
  });

  function validate(input) {
    if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
      if (
        $(input)
          .val()
          .trim()
          .match(
            /^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
          ) == null
      ) {
        return false;
      }
    } else {
      if (
        $(input)
          .val()
          .trim() == ''
      ) {
        return false;
      }
    }
  }

  function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass('alert-validate');
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
  }

  function processForm(e) {
    $.ajax({
      url: treveApi,
      dataType: 'json',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({ email: $('#email').val(), ip: externalIP }),
      success: function() {
        $('#email').val('');
        $('#success-alert').fadeIn();
        closeSuccessAlert();
      },
      error: function(jqXhr) {
        if (jqXhr.status === 409) {
          $('#already-subscribed-alert').fadeIn();
          $('#email').val('');
          closeAlreadySubscribedAlert();
          return;
        }
        $('#error-alert').fadeIn();
        closeErrorAlert();
      },
    });

    e.preventDefault();
  }

  $('#my-form').submit(processForm);

  function closeSuccessAlert() {
    window.setTimeout(function() {
      $('#success-alert').fadeOut(300);
    }, 7000);
  }

  function closeAlreadySubscribedAlert() {
    window.setTimeout(function() {
      $('#already-subscribed-alert').fadeOut(300);
    }, 7000);
  }

  function closeErrorAlert() {
    window.setTimeout(function() {
      $('#error-alert').fadeOut(300);
    }, 7000);
  }
})(jQuery);
