
//alert('single view!');
var $editbtn = $('#editbtn');
var $deletebtn = $('#deletebtn');
var $chirpdiv = $('#chirp');
var path = window.location.pathname; 
var pieces = path.split('/');  //splitting at the / and storing as pieces 
//console.log(path);
//console.log(pieces);
var id = pieces[2];
//console.log(id);

//ask for chirp matching id from the api and display it  
function getChirp() {
    $.ajax({
        method: 'GET',
        url: '/api/chirps/' + id
    }).then(function(chirp) {
        addChirpDiv(chirp);
        //var $chirp = $('<h1></h1>');
        //$chirp.text(chirp.userName);
        //$chirp.appendTo($chirpdiv);
    }, function(err) {
       console.log(err);
});
}

getChirp();

function addChirpDiv(chirp) {
            var $chirpdiv = $('<div class="chirp"></div>');  //cretes div
            var $message = $('<p></p>');
            var $user = $('<h4></h4>');
            var $timestamp = $('<h5></h5>');
            var $buttonBlock = $('<div class="button-block></div>');
            var $deletebtn = $('<button class="fancy-button red">Delete Chirp</button>');
            var $editButton = $('<button class="fancy-button">Update</button>');
            $editButton.click(function() {
                window.location.pathname = '/chirps/' + id + '/update';
            })
            $deletebtn.click(function() {
                if (confirm('Are you sure you want to delete this chirp?')) {
                    $.ajax({
                        method: 'DELETE',
                        url: '/api/chirps/' + id
                    }).then(function() {
                        //window.location.pathname = '/chirps/' + id + '/update';
                        window.location.replace('/chirps'); //can't go back because it's been deleted 
                    }), function(err) {
                        console.log(err);
                    }
                };
            });
            
            $message.text(chirp.message);
            $user.text(chirp.userName);
            $timestamp.text(new Date(chirp.timestamp).toLocaleString());
            

            $buttonBlock.append($editButton);
            $buttonBlock.append($deletebtn);
            //$chirpdiv.text(success[i].title); //puts text of chirp in div
            //$('body').append($chirpdiv); //puts div in body
            $message.appendTo($chirpdiv);
            $user.appendTo($chirpdiv);
            $timestamp.appendTo($chirpdiv);
            $buttonBlock.appendTo($chirpdiv);

            $chirpdiv.appendTo('#chirpList');

}

$deletebtn.click(confirmation); 
$editbtn.click(gotoChirp);

///chirps/id/update id= editbutton

function confirmation() {
var r = confirm("Do you want to delete?");
if (r == true) {
    deleteChirp(id);
} 
}
//when success, nav back to chirp list page


function deleteChirp(id) {
    $.ajax({
        method: 'DELETE', 
        url: '/api/chirps/' + id
    }).then(function(){
        gotoChirps();  //nav back to server page
    }, function(err) {
        console.log(err);
    });
}   

function gotoChirp() {
    window.location.pathname = '/chirps/' + id + '/update';
}
function gotoChirps() { 
    window.location.pathname = '/chirps';
}

// edit button tht links to /chirps/id of the chirp/update  
// ex  <a href=:"/chirps/id/update">...</a>



// delete buttong tht when clicked pops up confirmation asking if we should delete
// confirm- delete req sent to  server to delete chirp, 
// when successful, nav back to chirp list page 



