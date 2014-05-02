/* global io:true, $:true, window:true */
"use strict";

var socket = io.connect('http://localhost:8080');
socket.on('lines', function (lines) {
  for (var i = 0; i < lines.length; i++) {
    $('#console').append(lines[i] + "<br/>");
    $('#publishing').text(lines[i]);
  }
  $('#console').scrollTop($('#console')[0].scrollHeight);
});

socket.on('done', function () {
  $('#publishing').text('Done!');
  setTimeout(function () {
    $('#console').fadeOut(500);
    $('#publishing').fadeOut(500, function () {
      $('#thumb').fadeIn(2500);
    });
  }, 1500);
});

$(function () {
  $('#publish').click(function () {
    socket.emit('publish');
    $('#publish').hide();
    $('#console').show();
    $('#publishing').show();
    var winHeight = $(window).outerHeight();
    var consHeight = $('#console').outerHeight();
    var consTop = $('#console').position().top;
    var lowerPadding = 50;
    var diff = winHeight - (consTop + consHeight);
    var newHeight = consHeight + (diff - lowerPadding);
    $('#console').css({height: newHeight + 'px'});
  });
});
