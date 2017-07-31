// var $searchResults = $('#search-results');
// set to hide from the start;
// $searchResults.hide();

$(document).ready(function(){
  //TEMP - DEMO ONLY
  // $.getJSON('https://cdn.irsc.edu/asset/5873e375c3f9de05491e1609', function(data){
  //   console.log(data);
  // });

  // //DEMO
  // var $cmUsers = null;
  // $.ajax({
  //   url: "js/cm-users.json",
  //   complete: function(jqXHR) {
  //     $cmUsers = JSON.parse(jqXHR.responseText).users;
  //     console.log($cmUsers);
  //   }
  // });

  // var courses = $.ajax({
  //   url: 'https://cdn.irsc.edu/asset/5875250ec3f9de05491e160b',
  //   complete: function(data){
  //     setCourses(data);
  //   }
  // });
  //
  // function setCourses(data) {
  //   courses =  data.responseJSON;
  // }

  // console.log(courses);


  // search functionalilty
  // $('input[name=search]').keyup(function(){
  //   if($(this).val().length) {
  //     $searchResults.show();
  //     // do api call to Bb to return users and search currently stored users
  //   } else {
  //     $searchResults.hide();
  //   }

    // searchUser($(this).val());
  // });

  // role swtich functionalilty
  // $('table input[type="checkbox"]').change(function(){
    // user = this.parentNode.parentNode.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML;
    //
    // if (!this.checked){
    //   role = 'Faculty-VCF';
    // } else {
    //   role = 'Faculty'
    // }
    //
    // this.parentNode.parentNode.previousSibling.previousSibling.innerHTML = role;
    //
    // switchRole(user, role == 'Faculty' ? 'F' : 'VCF');
  // });

}); // end of document ready
//
// function switchRole(user, role){
//   console.log(user, role);
// }
//
// function searchUser(searchValue){
//   console.log(searchValue);
// }
