// Client facing scripts here

$(document).ready(() => {
  $("#target").click(function(e) {
    if (confirm('Are you sure you want to delete this map!')) {
      return
    } else {
      e.preventDefault();
    }
  });
});
