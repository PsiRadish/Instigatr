$(function()
{
    $(".scroll").mCustomScrollbar(
    {
        axis:"y", // vertical
        theme: "minimal-dark",
        scrollInertia: 0
    });
    $(".chat-scroll").mCustomScrollbar(
    {
        axis:"y", // vertical
        theme: "minimal-dark",
        scrollInertia: 0
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
            
            console.log(contentHeight);
            console.log(postStuff.outerHeight(), choices.outerHeight(), yourSide.outerHeight());
            
            var freeSpace = contentHeight - (postStuff.outerHeight() + choices.outerHeight() + yourSide.outerHeight());
            console.log(freeSpace);
            var vertMargin = Math.max(freeSpace / 2, 0);
            
            postStuff.css("margin-bottom", vertMargin.toString()+"px");
            choices.css("margin-bottom", vertMargin.toString()+"px");
            
            chatOutput.height(contentHeight - chatBox.outerHeight());
        }
        sizeChat();
        // do it again on resize
        $(window).resize(sizeChat);
        
        
        $('#side-for .choose-side').on('click', function(e)
        {
            e.preventDefault();
            $(this).blur();
            $('#choices').addClass('side-chosen-for');
            
            document.activeElement = null;
        });
        $('#side-against .choose-side').on('click', function(e)
        {
            e.preventDefault();
            $(this).blur();
            $('#choices').addClass('side-chosen-against');
            
            document.activeElement = null;
        });
        $('.change-mind').on('click', function(e)
        {
            e.preventDefault();
            $('#choices').removeClass('side-chosen-for side-chosen-against');
        });
        
        
        // $('#news-column').on('click',function(){
        //     var srchTrm = $('#chat-box').val();
        //     var url = "https://access.alchemyapi.com/calls/data/GetNews\?apikey\=3034db537d09ce6a56b42eb54f8dd1c6745dbd8f&outputMode=json&start=now-7d&end=now&maxResults=2&q.enriched.url.enrichedTitle.keywords.keyword.text="+srchTrm+"&return=enriched.url.url,enriched.url.title"
        //     var rslts = $.get(url,function(){
        //     }).done(function(rslts){
        //         console.log(rslts);
        //         $('#news-column').append(rslts);
        //     });
        // });
        
        var userData = $.ajax(
        {
            url: '/userData',
            method: 'GET'
        }).done(function(userData)
        {
            console.log(userData);
            
            if (!userData)
            {
                $('#chat-box').attr('disabled', 'Not logged in, buddy.');
            }
            
            var socket = io();
            
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
                if (e.keyCode === 13 && !e.shiftKey && userData)
                {
                    var postId = parseInt(window.location.pathname.split('/')[2]);
                    
                    socket.emit('newMessage', {content: chatBox.val(), userId: userData.id, postId: postId});
                    chatBox.val('');
                    return false;
                }
                return true;
            });
            
            socket.on('chatUpdate', function(update)
            {
                console.log('Update data:', update);
                
                var chatOutput = $('#chat-output .mCSB_container');
                
                var newChatItem = $('<li class="new debate-message message-'+update.side+'">');
                var h6 = $('<h6 class="author">').text(update.authorName);
                newChatItem.append(h6);
                newChatItem.append($('<span>'+update.content+'</span>'));
                
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
