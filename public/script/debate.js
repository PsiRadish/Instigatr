$(function()
{
    $(".scroll").mCustomScrollbar(
    {
        axis:"y", // vertical
        theme: "minimal-dark",
        scrollInertia: 1
    });

    // $('.search-news').on('mouseover',function(){
    //     $(this).animate({'opacity':'1.0'},400);
    // });

    // $('.search-news').on('mouseout',function(){
    //     $(this).animate({'opacity':'0.7'},400);
    // });

    //news search button listener
    $('#newsSrchBtn').on('click',function(e){
        e.preventDefault();
        var srchTrm = $('#srchTrm').val();
        var news = $.ajax({
            url:'/posts/news',
            method:'GET',
            data: {'q':srchTrm}
        }).done(function(){
            console.log(news.responseJSON)
            var imgOne = ""
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
        socket.on('startChat_Response', function(userId, side)
        {
            // console.log('Received startChat_Response', chatData);
            console.log('userId', userId);
            
            if (userId)
            {
                // $('#choices').css('visibility', 'visible');
                $('#choices').removeClass("disabled");
                choiceShift(side);
                
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
                    if (e.keyCode === 13 && !e.shiftKey)
                    {
                        socket.emit('newMessage', chatBox.val());
                        chatBox.val('');
                        return false;
                    }
                    return true;
                });
                
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
                // RESPONSE
                socket.on('choseSide_Response', function(side)
                {
                    choiceShift(side);
                });
                
                $('.enter-queue').on('click', function(e)
                {
                    
                });
            }
            else
            {
                $('#chat-box').attr('disabled', 'disabled');
                $('#chat-box').text("You are not logged in.");
                $('#choices').addClass("disabled");
            }
            
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
                $('#chat-box').removeAttr('disabled');
                $('#chat-box').text("");
            }
            else if (side == 'against')
            {
                $('#choices').addClass('side-chosen-against');
                $('#choices').removeClass('side-chosen-for');
                
                // console.log("enablin'");
                $('#chat-box').removeAttr('disabled');
                $('#chat-box').text("");
            }
            else if (side == null)
            {
                $('#choices').removeClass('side-chosen-for side-chosen-against');
                $('#chat-box').attr('disabled', 'disabled');
                $('#chat-box').text("You have not taken a side.");
            }
        }
    }
});
