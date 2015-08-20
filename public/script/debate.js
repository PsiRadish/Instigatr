$(function()
{
    if ($('#debate-page').length)
    {
        // console.log('debate-page');
        
        $("#chat-output").mCustomScrollbar(
        {
            axis:"y", // vertical
            theme: "minimal-dark",
            scrollInertia: 1
        });
        $("#results-news-headlines").mCustomScrollbar(
        {
            axis:"y", // vertical
            theme: "minimal-dark",
            scrollInertia: 1
        });


    //up and downvote functionality
    $('#upVoteBtn').on('click',function(e){
        e.preventDefault();
        var id = $('#pId').val();
        var val = 1;
        var vote = $.ajax({
            url:'/posts/vote',
            method:'GET',
            data:{'val':val,'postId':id}
        }).done(function(){
            console.log(id);
            console.log(vote);
        });
    });
    $('#downVoteBtn').on('click',function(e){
        e.preventDefault();
        var id = $('#pId').val();
        var val = -1;
        var vote = $.ajax({
            url:'/posts/vote',
            method:'GET',
            data:{'val':val,'postId':id}
        }).done(function(){
            console.log(vote);
        });
    });



        //news search button listener
        $('#newsSrchBtn').on('click',function(e){
            e.preventDefault();
            var srchTrm = $('#srchTrm').val();
            var news = $.ajax({
                url:'/posts/news',
                method:'GET',
                data: {'q':srchTrm}
            }).done(function(){
                // console.log(news.responseJSON);
                var imgOne = "";
                if(news.responseJSON.response.docs[0].multimedia[0]){
                    imgOne = "<img src='http://graphics8.nytimes.com/"+news.responseJSON.response.docs[0].multimedia[0].url+"'>"
                }
                $('#newsListings').html('<div class="thumbNail all-20">'+imgOne+'</div><div class="article all-80"><p><a href="'+news.responseJSON.response.docs[0].web_url+'" target="_blank"><b>'+ news.responseJSON.response.docs[0].headline.main +'</b><br>'+news.responseJSON.response.docs[0].snippet+'</a></p></div>');
                for(i=1;i<8;i++){
                    var img =""
                    if(news.responseJSON.response.docs[i].multimedia[0]){
                        var img = "<img src='http://graphics8.nytimes.com/"+news.responseJSON.response.docs[i].multimedia[0].url+"'>"
                    };
                    $('#newsListings').append('<div class="thumbNail all-20">'+img+'</div><div class="article all-80"><p><a href="'+news.responseJSON.response.docs[i].web_url+'" target="_blank"><b>'+ news.responseJSON.response.docs[i].headline.main +'</b><br>'+news.responseJSON.response.docs[i].snippet+'</a></p></div>');
                }
            });
        });
        
        function sizeChat(e)
        {
            var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            var navHeight = $('nav').outerHeight();
            
            // console.log('viewHeight', viewHeight);
            // console.log('navHeight', navHeight);
            
            var debatePage = $('#debate-page');
            
            var postStuff = $('#post-stuff');
            var choices = $('#choices');
                choices.height($('#headings-roll').outerHeight(true) + $('#wanna-join-for').outerHeight(true));
            var yourSide = $('#hows-my-arguing');
            
            var chatOutput = $('#chat-output');
            var chatBox = $('#chat-box-container');
            
            debatePage.height(viewHeight - navHeight);
            var contentHeight = debatePage.outerHeight();
            
            var freeSpace = contentHeight - (postStuff.outerHeight() + choices.outerHeight() + yourSide.outerHeight());
            // console.log(freeSpace);
            var vertMargin = Math.max(freeSpace / 2, 0);
            
            // postStuff.css("margin-bottom", vertMargin.toString()+"px");
            // choices.css("margin-bottom", vertMargin.toString()+"px");
            
            chatOutput.height(contentHeight - chatBox.outerHeight());
            if (e === 'init')
            {
                chatOutput.mCustomScrollbar("update");
                chatOutput.mCustomScrollbar("scrollTo", "bottom");
            }
        }
        sizeChat('init');
        // do it again on resize
        $(window).resize(sizeChat);
        
        // var userData = $.ajax(
        // {
        //     url: '/userData',
        //     method: 'GET'
        // }).done(function(userData)
        // {
            // console.log("userData keys", Object.keys(userData));
        
        var socket = io();
        
        var postId = parseInt(window.location.pathname.split('/')[2]);
        
        socket.emit('startChat', postId);
        socket.on('startChat_Response', function(userId, side, championFor, championAgainst)
        {
            // console.log('Received startChat_Response', chatData);
            // console.log('userId', userId);
            
            $('#champ-for .author').html(championFor || '...');
            $('#champ-against .author').html(championAgainst || '...');
            
            if (userId)
            {
                // $('#choices').css('visibility', 'visible');
                $('#must-be-logged-in').removeClass("disabled");
                choiceShift(side);
                
                // CLIENT - CHOSE WHAT SIDE THEY ARE ON
                $('#side-for .choose-side').on('click', function(e)
                {
                    e.preventDefault();
                    $(this).blur();
                    
                    socket.emit('choseSide', "for");
                });
                $('#side-against .choose-side').on('click', function(e)
                {
                    e.preventDefault();
                    $(this).blur();
                    
                    socket.emit('choseSide', "against");
                });
                $('.change-mind').on('click', function(e)
                {
                    e.preventDefault();
                    
                    socket.emit('choseSide', null);
                });
                // SERVER - CHOSE SIDE RESPONSE
                socket.on('choseSide_Response', function(side)
                {
                    choiceShift(side);
                });
                
                // CLIENT - WANT TO ENTER THE DEBATE
                $('.enter-queue').on('click', function(e)
                {
                    e.preventDefault();
                    // console.log('emit enterQueue');
                    socket.emit('enterQueue');
                });
                // SERVER - LINE UPDATE
                socket.on('updateQueue', function(placeInLine, side)
                {
                    if (side)
                    {
                        $('.wanna-join .queued').removeClass('hide-all');
                        $('.wanna-join .not-queued').addClass('hide-all');
                        $('.queued .ordinal').html(placeInLine);
                    }
                });
                
                // SERVER - YOUR TURN
                socket.on('becomeChampion', function(side)
                {
                    enableChatBox();
                    if (side)
                    {
                        $('.wanna-join .champion').removeClass('hide-all');
                        $('.wanna-join .queued, .wanna-join .not-queued').addClass('hide-all');
                    }
                });
                // SERVER - KICKED
                socket.on('kickedFromChampion', function()
                {   // TODO: An alert popin
                    disableChatBox('You have been kicked out of your position as speaker.');
                });
                
                // // CLIENT - UP CONFIDENCE IN SPEAKER
                // $('.vote-kudos').on('click', function(e)
                // {
                    
                // });
                // // CLIENT - DOWN CONFIDENCE IN SPEAKER
                // $('.vote-kick').on('click', function(e)
                // {
                    
                // });
                
                // CLIENT - COMMIT CHAT MESSAGE
                ///////////////////////
                // Block newline on Enter and send text to socket.io, unless Shift is held
                ///////////////////////
                var chatBox = $('#chat-box');
                
                chatBox.keydown(function(e)
                {
                    e = e || event;  // IE compatibility thing of unknownn relevance
                    // enter key without shift held
                    if (e.keyCode === 13 && !e.shiftKey)
                    {
                        e.preventDefault(); // no newline
                    }
                });
                chatBox.keyup(function(e)
                {
                    e = e || event;  // IE compatibility thing of unknownn relevance
                    // enter key without shift held
                    if (e.keyCode === 13 && !e.shiftKey)
                    {
                        socket.emit('newMessage', chatBox.val());
                        chatBox.val('');
                        return false;
                    }
                    return true;
                });
            }
            else
            {
                disableChatBox("You are not logged in.");
                $('#must-be-logged-in').addClass("disabled");
            }
            
            // SERVER - CHAMP UPDATE
            socket.on('updateChamp', function(championFor, championAgainst)
            {
                $('#champ-for .author').html(championFor || '...');
                $('#champ-against .author').html(championAgainst || '...');
            });
            
            // NEW CHAT MESSAGE
            socket.on('chatUpdate', function(authorName, content, side)
            {
                // console.log('Update data:', update);
                var chatOutput = $('#chat-output .mCSB_container');
                
                var newChatItem = $('<li class="new debate-message message-'+side+'">');
                var h6 = $('<h6 class="author">').html(authorName);
                newChatItem.append(h6);
                newChatItem.append($('<span>'+content+'</span>'));
                
                // console.log(newChatItem);
                
                chatOutput.append(newChatItem);
                
                setTimeout(function() // wait to remove 'new' class so transition triggers
                {
                    newChatItem.removeClass('new');
                    // chatOutput[0].scrollTop = chatOutput[0].scrollHeight;
                    $('#chat-output').mCustomScrollbar("update");
                    $('#chat-output').mCustomScrollbar("scrollTo", "bottom");
                }, 10);
            });
        });
        
        function choiceShift(side)
        {
            $('.wanna-join .queued, .wanna-join .champion').addClass('hide-all');
            $('.wanna-join .not-queued').removeClass('hide-all');
            
            if (side == 'for')
            {
                $('#choices').addClass('side-chosen-for');
                $('#choices').removeClass('side-chosen-against');
                
                // console.log("enablin'");
                // enableChatBox();
                disableChatBox("You must enter the queue to get your turn.");
                
            }
            else if (side == 'against')
            {
                $('#choices').addClass('side-chosen-against');
                $('#choices').removeClass('side-chosen-for');
                
                // console.log("enablin'");
                // enableChatBox();
                disableChatBox("You must enter the queue to get your turn.");
            }
            else if (side == null)
            {
                $('#choices').removeClass('side-chosen-for side-chosen-against');
                
                disableChatBox("You have not taken a side.");
            }
        }
        function enableChatBox()
        {
            $('#chat-box').removeAttr('disabled');
            $('#chat-box').html("");
        }
        function disableChatBox(message)
        {
            $('#chat-box').attr('disabled', 'disabled');
            $('#chat-box').html(message);
        }
    }
});
