
$(function()
{
    // if ($('#debate-page').length) // check we're on a debate page
    // {
        
        var mCustomScrollbarElements = $("#chat-output, #results-news-headlines");
        // initialize spiffy scrollbars
        mCustomScrollbarElements.mCustomScrollbar(
        {
            axis: "y", // vertical
            theme: "minimal-dark",
            scrollInertia: 1    // TODO: modify mCustomScrollbar to have separate mouse vs. touch scrollInertia settings
        });
        /*mCustomScrollbarElements.each(function()
        {   // remove the "overflow: visible" that mCustomScrollbar sets in style attribute for some unknown reason
            this.attributes.style.value = this.attributes.style.value.replace(" overflow: visible;", '');
        });*/
                
        function sizeThings(e)
        {
            var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            var navHeight = $('#global-nav').outerHeight();
            
            var debatePage = $('#debate-page');
            
            // var postStuff = $('#post-stuff');
            var choices = $('#choices');
                // choices.height($('#headings-roll').outerHeight(true) + $('#wanna-join-for').outerHeight(true));
            var yourSide = $('#hows-my-arguing');
            
            var argueSection = $('#argue-section');
          // console.log("argueSection.height() @31 =", argueSection.height(), argueSection.outerHeight());
            var chatOutput = $('#chat-output');
            var privilegeBox = $('#must-be-logged-in');
            
            var aboveNewsResults = $('#above-news-results');
            var newsResults = $('#results-news-headlines');
            
            debatePage.height(viewHeight - navHeight);
            var contentHeight = debatePage.outerHeight();
          // console.log(debatePage.height(), "vs", contentHeight);
            
          // console.log("argueSection.height() @41 =", argueSection.height(), argueSection.outerHeight());
            
          // console.log("privilegeBox.outerHeight() =", privilegeBox.outerHeight());
            
            // chatOutput.height(contentHeight - privilegeBox.outerHeight(true));
            chatOutput.height(argueSection.height() - privilegeBox.outerHeight());
            newsResults.height(contentHeight - aboveNewsResults.outerHeight(true));
            
            if (e === 'init')
            {
                chatOutput.mCustomScrollbar("update");
                chatOutput.mCustomScrollbar("scrollTo", "bottom");
                
                newsResults.mCustomScrollbar("update");
            }
        }
        sizeThings('init');
        // do it again on resize
        $(window).resize(sizeThings);
        
        
        // Fullscreen button for mobile
        if (MOBILE) // global defined in layout.js
        {
            $("#fullscreen-button").removeClass("hide-all");
            
            $("#fullscreen-button > a").click(function(e)
            {
                e.preventDefault();
                
                var doc = window.document;
                var docElement = doc.documentElement;
                
                var requestFullscreen = docElement.requestFullscreen || docElement.mozRequestFullScreen || docElement.webkitRequestFullScreen || docElement.msRequestFullscreen;
                
                if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement)
                {
                    requestFullscreen.call(docElement);
                    
                    $("#fullscreen-button").addClass("hide-all"); // hide button again
                }
            });
            
            $(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function()
            {
                var doc = window.document;
                
                var debug = "fullscreenchange";
                
                // show fullscreen button again if no longer fullscreen
                if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement)
                {
                    $("#fullscreen-button").removeClass("hide-all");
                    setTimeout(function()
                    {
                        window.scrollTo(0, 0);
                    }, 10);
                    
                    debug += " : off, button restored";
                }
                
                // fakeMessage(debug);
                console.log(debug);
            });
        }
        
        
        // get the postID from hidden input value
        var postId = parseInt($('#post-id').val());  // parseInt(window.location.pathname.split('/')[2]);
        
        // up and downvote functionality
        var upVoteButton = $('#up-vote-button');
        var downVoteButton = $('#down-vote-button');
        // listener for both buttons
        $('#up-vote-button, #down-vote-button').on('click', function(e)
        {
            e.preventDefault();
            var target = $(e.target);
            
            var val = null;
            
            // which button was clicked?
            if (target.closest(upVoteButton).length)        // up
            {
                val = 1;    // upvote value
                upVoteButton.addClass('green');
                downVoteButton.removeClass('red');
            }
            else if (target.closest(downVoteButton).length) // down
            {
                val = -1;   // downvote value
                upVoteButton.removeClass('green');
                downVoteButton.addClass('red');
            }
            
            var ajaxVote = $.ajax(
            {
                url: '/posts/vote',
                method: 'POST',
                data: {'val': val, 'postId': postId}
            }).done(function()
            {
                // console.log("New rating:", ajaxVote.responseJSON.newRating);
                if (ajaxVote.responseJSON.newRating !== undefined)
                {
                    $('#total-rating').text(ajaxVote.responseJSON.newRating);
                }
                else
                {
                    console.log(ajaxVote.responseText);
                }
            });
        });
        
        // news search button listener
        $('#news-search-button').on('click', function(e)
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
                // Append this response to an empty div in memory, so we can use jQuery find to just get #js-news-listings out.
                var newsListingsHTML = $('<div/>').append(response.responseText).find('#js-news-listings').html();
                
                $('#js-news-listings').html(newsListingsHTML); // replace #js-news-listings in DOM with the new #js-news-listings from back-end
            });
        });
        
        // initialize socket.io
        var socket = io();
        
        socket.emit('startChat', postId); // let the back-end know what debate we're here to see
        
        socket.on('startChat_Response', function(userId, side, championFor, championAgainst)
        {   // B
            // console.log('Received startChat_Response', userId, side);
            
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
                // SERVER - KICKED (not actually possible yet)
                socket.on('kickedFromChampion', function()
                {   // TODO: 1) actually implement kicking on the server side so this event can actually occur 2) An alert pop-in when kicked
                    disableChatBox('Your peers have voted to boot you from the speaker seat.');
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
                    e = e || event;  // IE compatibility measure of unknown relevance
                    
                    // enter key without shift held
                    if (e.keyCode === 13 && !e.shiftKey)
                    {
                        e.preventDefault(); // no newline
                        // wait for keyup to actually send the text through the socket
                    }
                });
                chatBox.keyup(function(e)
                {
                    e = e || event;  // IE compatibility measure of unknown relevance
                    
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
                var mCSB_chatOutput = $('#chat-output .mCSB_container');
                
                var newChatItem = $('<li class="new debate-message message-'+side+'">');
                var h6 = $('<h6 class="author">').html(authorName);
                newChatItem.append(h6);
                newChatItem.append($('<span>'+content+'</span>'));
                
                // console.log(newChatItem);
                
                mCSB_chatOutput.append(newChatItem);
                
                setTimeout(function() // wait to remove 'new' class so transition triggers
                {
                    newChatItem.removeClass('new');
                    // mCSB_chatOutput[0].scrollTop = mCSB_chatOutput[0].scrollHeight;
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
                $('#must-be-logged-in').addClass('side-chosen-for');
                $('#choices').removeClass('side-chosen-against');
                $('#must-be-logged-in').removeClass('side-chosen-against');
                
                // console.log("enablin'");
                // enableChatBox();
                disableChatBox("You must enter the queue to get your turn.");
            
            }
            else if (side == 'against')
            {
                $('#choices').addClass('side-chosen-against');
                $('#must-be-logged-in').addClass('side-chosen-against');
                $('#choices').removeClass('side-chosen-for');
                $('#must-be-logged-in').removeClass('side-chosen-for');
                
                // console.log("enablin'");
                // enableChatBox();
                disableChatBox("You must enter the queue to get your turn.");
            }
            else if (side == null)
            {
                $('#choices').removeClass('side-chosen-for side-chosen-against');
                $('#must-be-logged-in').removeClass('side-chosen-for side-chosen-against');
                
                disableChatBox("You have not taken a side.");
            }
        }
        function enableChatBox()
        {
            $('#chat-box').removeAttr('disabled');
            $('#chat-form').removeClass('hide-all');
            $('#choices').addClass('hide-all');
            $('#chat-box').html("");
            sizeThings();
        }
        function disableChatBox(message)
        {
            $('#chat-box').attr('disabled', 'disabled');
            $('#chat-form').addClass('hide-all');
            $('#choices').removeClass('hide-all');
            $('#chat-box').html(message);
            sizeThings();
        }
    // }
});

/*function fakeMessage(content)
{
    authorName = " DEBUG ";
    side = "for";
    
    // console.log('Update data:', update);
    var mCSB_chatOutput = $('#chat-output .mCSB_container');
    
    var newChatItem = $('<li class="new debate-message message-'+side+'">');
    var h6 = $('<h6 class="author">').html(authorName);
    newChatItem.append(h6);
    newChatItem.append($('<span>'+content+'</span>'));
    
    // console.log(newChatItem);
    
    mCSB_chatOutput.append(newChatItem);
    
    setTimeout(function() // wait to remove 'new' class so transition triggers
    {
        newChatItem.removeClass('new');
        // mCSB_chatOutput[0].scrollTop = mCSB_chatOutput[0].scrollHeight;
        $('#chat-output').mCustomScrollbar("update");
        $('#chat-output').mCustomScrollbar("scrollTo", "bottom");
    }, 10);
}*/
