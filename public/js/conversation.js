$('document').ready(function(){

    getWatsonResponse('hello')

    $('#selfParagraph').hide()

    $("#messageInput").keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            var message = $('#messageInput').val()
            getWatsonResponse(message)
            $('#selfParagraph').show()
            $('#selfRequest').html(message)


        }
    });


    $("#basicModal").on('show.bs.modal', function (e) {
        var $invoker = $(e.relatedTarget);
        var title = ($invoker).attr('id')
        getMovieDetails(title)
    });

}) // closes document ready function

function getMovieDetails(title){
     $.ajax({
        url: "/getmovie?movie=" + title,
        dataType: "json",
        cache: "false",
        success: function(movie){
            $('#detailTitle').html(movie[0].title)
            $('#detailActors').html(movie[0].cast)
            $('#detailDirector').html(movie[0].director)
            movie[0].genre = movie[0].genre.join()
            movie[0].genre = movie[0].genre.split('').slice(0,1).join().toUpperCase() + movie[0].genre.split('').slice(1, movie[0].genre.length).join('')
            $('#detailGenre').html(movie[0].genre)
            $('#detailDuration').html(movie[0].duration)
            $('#detailRating').html(movie[0].rating)
            $('#detailImage').attr("src", movie[0].url)
        }
    });
}


function getWatsonResponse(message){
    $.ajax({
        url: "/message?msg=" + message,
        dataType: "json",
        cache: "false",
        success: function(result){
            $('#watsonResponse').html(result.watsonMessage)
            populateGrid(result.moviesList)
             setTimeout(function(){ 
                var path = "/" + result.filename
                var audio = new Audio(path); 
                audio.addEventListener('canplay', function() {
                    audio.volume = 0.5;
                    audio.play(); 
                })

                audio.addEventListener("ended", function(){
                    deleteFile(result.filename);
                });

                }, 2000);  
                
        }
    });
}

function deleteFile(file){
     $.ajax({
        url: "/delFile?file=" + file,
        dataType: "json",
        cache: "false",
        success: function(result){
            return
        }
     })
}


function populateGrid(moviesList){
    $('#moviesGrid a').remove()
    document.getElementById("moviesGrid").style.left = "-10%";
    document.getElementById("moviesGrid").style.opacity = "0";
    var div = $("#moviesGrid");
        div.animate({left: '0%', opacity: '1'}, "slow");
    moviesList.forEach(function(movie){
        movie.genre = movie.genre.join()
        movie.genre = movie.genre.split('').slice(0,1).join().toUpperCase() + movie.genre.split('').slice(1, movie.genre.length).join('')
        $('#moviesGrid').append('<a id="'+ movie.title  + '" class="gridItem" data-toggle="modal" data-target="#basicModal" href="#">'
                                    + '<div class="e" style="background-color:rgba(0,0,0,0.02);overflow: hidden;border-width: 1px;border-style: solid; padding: 12px;border-radius: 5px;margin:10px">'
                                        + '<div class="block-left"><h5 style="text-align:left;padding-left:10px;">'
                                            + '<b style="color:rgba(0,0,0,0.8)">Movie: </b>'+ movie.title +'<br><hr width="0%" style="margin:3px !important">'
                                            + '<b style="color:rgba(0,0,0,0.8)">Genre: </b>'+ movie.genre +'<br><hr width="0%" style="margin:3px !important">'
                                            + '<b style="color:rgba(0,0,0,0.8)">Duration: </b>'+ movie.duration
                                            + '</h5>'
                                        + '</div>'
                                        + '<div class="block-right" style="margin:-12px -25px 0px 0px">'
                                            + '<img  style="padding-right:5px" height="82" width="92px"  src="'+ movie.url +'"></img>'
                                        + '</div>'
                                    + '</div>'
                                + '</a>')  
    })
     //$('#moviesGrid').append('<a style="padding-right:13px;color:rgba(0,0,255,0.7);position: relative;bottom:10px" href="#">view more...</a>')
}
/*

*/
