$(function()
{
    $(".scroll").mCustomScrollbar(
    {
        axis:"y", // vertical
        theme: "minimal-dark",
        scrollInertia: 0.1
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
            var yourSide = $('#hows-my-arguing');
            
            var chatOutput = $('#chat-output');
            var chatBox = $('#chat-box-container');
            
            debatePage.height(viewHeight - navHeight);
            var contentHeight = debatePage.outerHeight();
            
            // console.log(contentHeight);
            // console.log(postStuff.outerHeight(), choices.outerHeight(), yourSide.outerHeight());
            
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
        socket.on('startChat_Response', function(chatData)
        {
            // console.log('Received startChat_Response', chatData);
            console.log('chatData.userId', chatData.userId);
            var userId = chatData.userId;
            
            if (!userId)
            {
                console.log("disablin'");
                $('#chat-box').attr('disabled', 'disabled');
                $('#chat-box').text("You are not logged in.");
            }
            else
            {
                console.log("enablin'");
                $('#chat-box').removeAttr('disabled');
                $('#chat-box').text("");
            }
            
            ///////////////////////
            // Block newline on Enter and send text to socket.io, unless Shift is held
            ///////////////////////
            var chatBox = $('#chat-box');
            
            chatBox.keydown(function(e)
            {   // enter key without shift held
                if (e.keyCode === 13 && !e.shiftKey)
                {
                    e.preventDefault(); // no newline
                }
            });
            chatBox.keyup(function(e)
            {
                e = e || event;
                // enter key without shift held
                if (e.keyCode === 13 && !e.shiftKey && chatData)
                {
                    socket.emit('newMessage', postId, chatBox.val());
                    chatBox.val('');
                    return false;
                }
                return true;
            });
            
            
            $('#side-for .choose-side').on('click', function(e)
            {
                e.preventDefault();
                $(this).blur();
                $('#choices').addClass('side-chosen-for');
                
                socket.emit('choseSide', postId, "for");
            });
            $('#side-against .choose-side').on('click', function(e)
            {
                e.preventDefault();
                $(this).blur();
                $('#choices').addClass('side-chosen-against');
                
                socket.emit('choseSide', postId, "for");
            });
            $('.change-mind').on('click', function(e)
            {
                e.preventDefault();
                $('#choices').removeClass('side-chosen-for side-chosen-against');
            });
            
            socket.on('chatUpdate', function(authorName, content, side)
            {
                // console.log('Update data:', update);
                var chatOutput = $('#chat-output .mCSB_container');
                
                var newChatItem = $('<li class="new debate-message message-'+side+'">');
                var h6 = $('<h6 class="author">').text(authorName);
                newChatItem.append(h6);
                newChatItem.append($('<span>'+content+'</span>'));
                
                console.log(newChatItem);
                
                chatOutput.append(newChatItem);
                
                setTimeout(function()
                {
                    newChatItem.removeClass('new');
                }, 10);
            });        
        });
    }
});
