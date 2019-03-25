//alert('Single Update!');


var user = $('#user');
var path = window.location.pathname; 
var pieces = path.split('/');  //splitting at the / and storing as pieces 
//console.log(path);
//console.log(pieces);
var id = pieces[2];
//console.log(id);
//console.log(chirps.userName);

//get user for id 
//chirp.userName

function getChirp() {
    $.ajax({
        method: 'GET',
        url: '/api/chirps/' + id
    }).then(function(chirp) {
        $('#chirp-message').val(chirp.message);


        //var $chirptoedit = $('#chirptoedit')
        //$chirptoedit.text(chirp.message);
        //$user.text(chirp.userName);
    }, function(err) {
       console.log(err);
});
}

getChirp();

$('#update-button').click(function() {
    var payload = {
        message: $('chirp-message').val()  //get what's currently in box
    };
    $.ajax({
        method: 'PUT',
        url: '/api/chirps/' + id,
        contentType: 'application/json',
        data: JSON.stringify(payload)
    }).then(function() {
        window.history.back(); //as if we clicked the back button..we update then go back
    }, function(err) {
        console.log(err)
    })
});


// display user name not in editable format  
 
//  which chirp to get from api?
//  poplate input box with message to edit 
//  change message, click update button will cause an api call to update chirp
//     when successful, nav back to single page for this chirp



// function getUser() {
//     $.ajax({
//         method: 'GET',
//         url: '/api/chirps/' + id
//     }).then(function(chirp) {
//         var $user = $('#chirptoedit');
//         $user.text(chirp.message);
//         $chirp.appendTo($chirpdiv);
//     }, function(err) {
//     console.log(err);
// });
// }
// }