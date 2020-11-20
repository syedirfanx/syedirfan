$(document).ready(function() {
  autoPlayYouTubeModal();
});

function autoPlayYouTubeModal() {
  var trigger = $('.trigger');
  trigger.click(function(e) {
    e.preventDefault();
    var theModal = $(this).data("target");
    var videoSRC = $(this).attr("src");
    var videoSRCauto = videoSRC + "?autoplay=1";
    $(theModal + ' iframe').attr('src', videoSRCauto);
    $(theModal).on('hidden.bs.modal', function(e) {
      $(theModal + ' iframe').attr('src', '');
    });
  });
};