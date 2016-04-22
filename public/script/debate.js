
$(function()
{
        var mCustomScrollbarElements = $("#chat-output, #results-news-headlines");
        
        if (MOBILE) // global defined in layout.js
        {
            // display scroll hint arrows on mobile in case browser doesn't show a scroll dragger
            $('.scrollhint').removeClass("hide-all");
            
            $('#chat-output').on("scroll", function()
            {
                var chatOutput = $('#chat-output');
                var topHints = $('.scrollhint.top');
                var bottomHints = $('.scrollhint.bottom');
                
                // if (chatOutput[0].scrollTop != chatOutput[0].scrollHeight) // not at the bottom
                if (chatOutput[0].scrollTop + chatOutput[0].clientHeight != chatOutput[0].scrollHeight) // not at the bottom
                {
                    if (chatOutput[0].scrollTop == 0) // at the top
                        topHints.addClass("scrollmaxed"); // hide scroll-up hints
                    
                    bottomHints.removeClass("scrollmaxed");
                }
                if (chatOutput[0].scrollTop != 0) // not at the top
                {
                    // if (chatOutput[0].scrollTop == chatOutput[0].scrollHeight) // at the bottom
                    if (chatOutput[0].scrollTop + chatOutput[0].clientHeight == chatOutput[0].scrollHeight) // at the bottom
                        bottomHints.addClass("scrollmaxed"); // hide scroll-down hints
                    
                    topHints.removeClass("scrollmaxed");
                }
                
                // console.log("chatOutput[0].scrollHeight", chatOutput[0].scrollHeight);
                // console.log("chatOutput[0].scrollTop", chatOutput[0].scrollTop);
                // console.log("chatOutput[0].clientHeight", chatOutput[0].clientHeight);
            });
            
            // Fullscreen button for mobile
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
                
                // show fullscreen button again if no longer fullscreen
                if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement)
                {
                    $("#fullscreen-button").removeClass("hide-all");
                    
                    setTimeout(function()
                    {
                        window.scrollTo(0, 0);
                    }, 10);
                }
                
                // console.log(debug);
            });
        }
        else
        {   // initialize spiffy scrollbars for desktop
            mCustomScrollbarElements.mCustomScrollbar(
            {
                axis: "y", // vertical
                theme: "minimal-dark",
                mouseWheel: { preventDefault: true }, // prevent whole window from scrolling when content can't scroll anymore
                scrollInertia: 0 // 1
            });
            /*mCustomScrollbarElements.each(function()
            {   // remove the "overflow: visible" that mCustomScrollbar sets in style attribute
                this.attributes.style.value = this.attributes.style.value.replace(" overflow: visible;", '');
            });*/
        }
        function scrollChatToBottom()
        {
            var chatOutput = $('#chat-output');
            
            if (!MOBILE) // mCustomScrollbar scroll
            {
                chatOutput.mCustomScrollbar("update");
                chatOutput.mCustomScrollbar("scrollTo", "bottom");
            }
            else // vanilla JS scroll
            {
                chatOutput[0].scrollTop = chatOutput[0].scrollHeight;
            }
        }
        
        function sizeThings(e)
        {
            var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            var navHeight = $('#global-nav').outerHeight();
            
            var debatePage = $('#debate-page');
            
            var argueSection = $('#argue-section');
            var chatOutput = $('#chat-output');
            var privilegeBox = $('#must-be-logged-in');
            
            var aboveNewsResults = $('#above-news-results');
            var newsResults = $('#results-news-headlines');
            
            debatePage.height(viewHeight - navHeight);
            var contentHeight = debatePage.outerHeight();
            
            // chatOutput.height(contentHeight - privilegeBox.outerHeight(true));
            chatOutput.height(argueSection.height() - privilegeBox.outerHeight());
            newsResults.height(contentHeight - aboveNewsResults.outerHeight(true));
            
            $('.scrollhint.left').css(
            {
                "left": argueSection[0].getClientRects()[0].left + "px",
                "margin-left": argueSection.outerWidth() / 10 - $('.scrollhint').width() + "px"
            });
            $('.scrollhint.right').css(
            {
                "left": argueSection[0].getClientRects()[0].right + "px",
                "margin-left": argueSection.outerWidth() / -10 + "px"
            });
            $('.scrollhint.bottom').css(
            {
                "top": privilegeBox[0].getClientRects()[0].top - $('.scrollhint').height() + "px"
            });
            
            if (e === 'init')
            {
                // chatOutput.mCustomScrollbar("update");
                // chatOutput.mCustomScrollbar("scrollTo", "bottom");
                scrollChatToBottom();
                
                if (!MOBILE) newsResults.mCustomScrollbar("update");
            }
        }
        sizeThings('init');
        // do it again on resize
        $(window).resize(sizeThings);        
        
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
                var chatAppend = (MOBILE) ? $('#chat-output') : $('#chat-output .mCSB_container');
                
                // TODO?: somehow generate the html via back-end template
                var newChatItem = $('<li class="new debate-message message-'+side+'">');
                var h6 = $('<h6 class="author">').html(authorName);
                newChatItem.append(h6);
                newChatItem.append($('<span>'+content+'</span>'));
                
                chatAppend.append(newChatItem);
                
                window.setTimeout(function() // wait to remove 'new' class so transition triggers
                {
                    newChatItem.removeClass('new');
                    scrollChatToBottom();
                }, 10);
            });
        });
        
        function choiceShift(side)
        {
            $('.wanna-join .queued, .wanna-join .champion').addClass('hide-all');
            $('.wanna-join .not-queued').removeClass('hide-all');
            
            if (side == 'for')
            {
                $('#choices').addClass('side-chosen-for').removeClass('side-chosen-against');
                $('#must-be-logged-in').addClass('side-chosen-for').removeClass('side-chosen-against');
                // $('#choices').removeClass('side-chosen-against');
                // $('#must-be-logged-in').removeClass('side-chosen-against');
                
                // console.log("enablin'");
                // enableChatBox();
                disableChatBox("You must enter the queue to get your turn.");
            
            }
            else if (side == 'against')
            {
                $('#choices').addClass('side-chosen-against').removeClass('side-chosen-for');
                $('#must-be-logged-in').addClass('side-chosen-against').removeClass('side-chosen-for');
                // $('#choices').removeClass('side-chosen-for');
                // $('#must-be-logged-in').removeClass('side-chosen-for');
                
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
            $('#chat-box').removeAttr('disabled').html("");
            $('#chat-form').removeClass('hide-all');
            $('#choices').addClass('hide-all');
            // $('#chat-box').html("");
            sizeThings();
        }
        function disableChatBox(message)
        {
            $('#chat-box').attr('disabled', 'disabled').html(message);
            $('#chat-form').addClass('hide-all');
            $('#choices').removeClass('hide-all');
            // $('#chat-box').html(message);
            sizeThings();
        }
});

function logWidths()
{
    console.log("document.documentElement.clientWidth", document.documentElement.clientWidth, "window.innerWidth", window.innerWidth);
    console.log("navWidth", $('#global-nav').outerWidth());
    
    console.log("debatePage width", $('#debate-page').outerWidth());
    
    console.log("argueSection width", $('#argue-section').outerWidth());
    console.log("chatOutput width", $('#chat-output').outerWidth());
    console.log("privilegeBox width", $('#must-be-logged-in').outerWidth());
}

/*function fakeMessage(content)
{
    authorName = " DEBUG ";
    side = "for";
    
    // console.log('Update data:', update);
    var chatAppend = (MOBILE) ? $('#chat-output') : $('#chat-output .mCSB_container');
    
    var newChatItem = $('<li class="new debate-message message-'+side+'">');
    var h6 = $('<h6 class="author">').html(authorName);
    newChatItem.append(h6);
    newChatItem.append($('<span>'+content+'</span>'));
    
    // console.log(newChatItem);
    
    chatAppend.append(newChatItem);
    
    window.setTimeout(function() // wait to remove 'new' class so transition triggers
    {
        newChatItem.removeClass('new');
        var chatOutput = $('#chat-output');
        
        if (!MOBILE) // mCustomScrollbar scroll
        {
            chatOutput.mCustomScrollbar("update");
            chatOutput.mCustomScrollbar("scrollTo", "bottom");
        }
        else // vanilla JS scroll
        {
            chatOutput[0].scrollTop = chatOutput[0].scrollHeight;
        }
    }, 10);
}*/
