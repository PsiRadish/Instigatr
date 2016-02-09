$(function()
{
    if ($('#debate-page').length) // check we're on a debate page
    {
        // console.log('debate-page');
        
        $("#chat-output").mCustomScrollbar(
        {
            axis:"y", // vertical
            theme: "minimal-dark",
            scrollInertia: 1
        });
        $("#results-news-headlines").mCustomScrollbar(
        {   // TODO: fix bottom of scroll being slightly cut off
            axis:"y", // vertical
            theme: "minimal-dark",
            scrollInertia: 1
        });
        
        // up and downvote functionality
        $('#up-vote-button').on('click',function(e){
            e.preventDefault();
            var id = $('#pId').val();
            var val = 1;
            var vote = $.ajax({
                url:'/posts/vote',
                method:'GET',
                data:{'val':val,'postId':id}
            }).done(function(){
                // console.log(id);
                // console.log(vote);
                $('#up-vote-button').addClass('green');
                $('#down-vote-button').removeClass('red');
            });
        });
        $('#down-vote-button').on('click',function(e){
            e.preventDefault();
            var id = $('#pId').val();
            var val = -1;
            var vote = $.ajax({
                url:'/posts/vote',
                method:'GET',
                data:{'val':val,'postId':id}
            }).done(function(){
                // console.log(vote);
                $('#up-vote-button').removeClass('green');
                $('#down-vote-button').addClass('red');
            });
        });
        
        //news search button listener
        $('#news-search-button').on('click',function(e)
        {
            e.preventDefault();
            var searchTerm = $('#news-search-term').val();
            var response = $.ajax(
            {
                url: '/posts/news',
                method: 'GET',
                data: { q: searchTerm }
            }).done(function()
            {
                // Back-end responds with html for a whole new page containing the results of the news search.
                // Append this response to an empty div in memory, so se can use jQuery find to just get #js-news-listings out.
                var newsListingsHTML = $('<div/>').append(response.responseText).find('#js-news-listings').html();
                
                $('#js-news-listings').html(newsListingsHTML); // replace #js-news-listings in DOM with the new #js-news-listings from back-end
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
            
            var aboveNewsResults = $('#above-news-results');
            var newsResults = $('#results-news-headlines');
            
            debatePage.height(viewHeight - navHeight);
            // console.log("debatePage.height()", debatePage.height());
            var contentHeight = debatePage.outerHeight();
            
            // console.log("contentHeight", contentHeight);
            
            // var freeSpace = contentHeight - (postStuff.outerHeight() + choices.outerHeight() + yourSide.outerHeight());
            // console.log(freeSpace);
            // var vertMargin = Math.max(freeSpace / 2, 0);
            
            // postStuff.css("margin-bottom", vertMargin.toString()+"px");
            // choices.css("margin-bottom", vertMargin.toString()+"px");
            
            chatOutput.height(contentHeight - chatBox.outerHeight(true));
            newsResults.height(contentHeight - aboveNewsResults.outerHeight(true));
            
            if (e === 'init')
            {
                chatOutput.mCustomScrollbar("update");
                chatOutput.mCustomScrollbar("scrollTo", "bottom");
                
                newsResults.mCustomScrollbar("update");
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
            console.log('Received startChat_Response', userId, side);
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
            socket.on('champUpdate', function(championFor, championAgainst)
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
