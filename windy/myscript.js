
$(function() {
  var rotation = 0;



  $('a').on('click', function(e) {
    // e.preventDefault();
    var href = $(this).attr('href');
    chrome.runtime.sendMessage({goToPage: href}, function(response) {
      console.log(response.farewell);
    });
  })

  $('*').each(function(index, el) {
    $(el).mouseenter(function(e) {
      e.stopPropagation();
      $(this).addClass('rotate');
      $(this).css('display', 'block');
      // $(this).css('transform-origin', 'top left');
      $(this).data("rotation", 0);
    });
    $(el).mouseleave(function(e) {
      e.stopPropagation();
      $(this).removeClass('rotate');
      // $(this).css('display', 'inline');
    });
  });


  setInterval(function() {
    $('.rotate').each(function(index, el) {
      var curr_r = $(el).data('rotation');
      curr_r += 15;
      $(el).data('rotation', curr_r);
      $(el).css('transform', 'rotate('+curr_r+'deg)')
    })
  }, 100);


  // $('a').hover(function(e) {
  //   rotation++;
  //   // console.log('jere');
  //   $(this).css("display", "block");
  //   $(this).css("transform", "rotate(" + rotation + "deg)");
  // })
});





