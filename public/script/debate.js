$(function()
{
    $(".scroll").mCustomScrollbar(
    {
        axis:"y", // vertical
        theme: "minimal-dark",
        scrollInertia: 1
    });
    
    if ($('#debate-page'))
    {
        function sizeChat(e)
        {
            var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            var navHeight = $('nav').outerHeight();
            
            // console.log('viewHeight', viewHeight);
            // console.log('navHeight', navHeight);
            
            var debatePage = $('#debate-page');
            
            var postStuff = $('#post-stuff');
            var choices = $('#choices');
                choices.height($('#headings-roll').outerHeight(true) + $('#wanna-join-left').outerHeight(true));
            var yourSide = $('#hows-my-arguing');
            
            var chatOutput = $('#chat-output');
            var chatBox = $('#chat-box-container');
            
            debatePage.height(viewHeight - navHeight);
            var contentHeight = debatePage.outerHeight();
            
            var freeSpace = contentHeight - (postStuff.outerHeight() + choices.outerHeight() + yourSide.outerHeight());
            // console.log(freeSpace);
            var vertMargin = Math.max(freeSpace / 2, 0);
            
            postStuff.css("margin-bottom", vertMargin.toString()+"px");
            choices.css("margin-bottom", vertMargin.toString()+"px");
            
            chatOutput.height(contentHeight - chatBox.outerHeight());
        }
        sizeChat();
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
            console.log('userId', userId);
            
            $('#champ-for .author').html(championFor || '...');
            $('#champ-against .author').html(championAgainst || '...');
            
            if (userId)
            {
                // $('#choices').css('visibility', 'visible');
                $('#choices').removeClass("disabled");
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
                    
                    socket.emit('enterQueue');
                });
                // SERVER - LINE UPDATE
                socket.on('updateQueue', function(placeInLine)
                {
                    
                });
                
                // SERVER - YOUR TURN
                socket.on('becomeChampion', function()
                {
                    enableChatBox();
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
                $('#choices').addClass("disabled");
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
                    chatOutput[0].scrollTop = chatOutput[0].scrollHeight;
                }, 10);
            });
        });
        
        function choiceShift(side)
        {
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
