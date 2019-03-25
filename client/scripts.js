var $chirpButton = $('#chirpbtn');
var $chirpField = $('#chirpfield');
var $chirpList = $('#chirplist');
var $userSelectBtn = $('#userselectbtn');
var $userDiv = $('#userdiv');

$chirpField.on('input', function() {
    var isEmpty = $chirpField.val().length === 0;  //returns true or false
    $chirpButton.prop('disabled', isEmpty);
});

$chirpButton.click(postChirp);  //when clicked run this function
//$userSelectBtn.click(getUsers);



function postChirp() {
    var chirp = {
        message: $chirpField.val(), //gets whatever is typed in chirpField
        userid: $userSelectBtn.val() // here, you would select the select box using JQuery and get its current value///value of select box
    }; 
    $.ajax({
        method: 'POST',
        url: '/api/chirps',
        contentType: 'application/json',
        data: JSON.stringify(chirp)
    }).then(function(success) {
        //successfully posted new data to the server
        //get them all again to add to in case others added chirps
        $chirpField.val('');
        $chirpButton.prop('disabled', true);
        getChirps();
    }, function(err) {   //if rejects will skip above and run 
        console.log(err);
    });         
}

function getChirps() { 
    $.ajax({
        method: 'GET',
        url: '/api/chirps'  //leave off the domain name to make it any
    }).then(function(chirps){
        $chirpList.empty();
        for(var i = 0; i < chirps.length; i++) {
            addChirpDiv(chirps[i]);
     }
    }, function(err) {
        console.log(err);
    });
}
getChirps();    

function deleteChirp(id) {
    $.ajax({
        method: 'DELETE', 
        url: '/api/chirps/' + id
    }).then(function(){
        getChirps();
    }, function(err) {
        console.log(err);
    });
}   

function addChirpDiv(chirp) {  //moved this out to take care of loop problem and closure
            var $chirpdiv = $('<div class="chirp"></div>');  //cretes div
            var $message = $('<p></p>');
            var $user = $('<h4></h4>');
            var $timestamp = $('<h5></h5>');
            var $deletebtn = $('<button class="deletebtn fancy-button red">Delete Chirp</button>');
            var $link = $('<a></a>');
            $link.attr('href', '/chirps/' + chirp.id); 
            $deletebtn.click(function() {
                deleteChirp(chirp.id);
            });
            


            $message.text(chirp.message);
            $user.text(chirp.userName);
            $timestamp.text(new Date(chirp.timestamp).toLocaleString());
            
            //$chirpdiv.text(success[i].title); //puts text of chirp in div
            //$('body').append($chirpdiv); //puts div in body
            $message.appendTo($chirpdiv);
            $user.appendTo($chirpdiv);
            $timestamp.appendTo($chirpdiv);
            $deletebtn.appendTo($chirpdiv);

            $chirpdiv.appendTo($link);
            $link.appendTo($chirpList);
}


function getUsers() {
 $.ajax({
        method: 'GET',
        url: '/api/users'  //leave off the domain name to make it any
    }).then(function(users){  
        for(var i = 0; i < users.length; i++) {
            var $userBtn = $('<option value="' + users[i].id + '">' + users[i].name + '</option>');
            $userSelectBtn.append($userBtn);
        }
    }, function(err) {
        console.log(err);
    });
}
getUsers();  



