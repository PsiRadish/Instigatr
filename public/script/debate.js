$(function()
{
    $(".scroll").mCustomScrollbar(
    {
        axis:"y", // vertical and horizontal scrollbar
        theme: "minimal-dark",
        scrollInertia: 0
    });
    
    $('#choices').on('click', function(e)
    {
        $clicked = $(e.target);
        
        if ($clicked.is('#side-for .choose-side'))
        {
            $(this).addClass('side-chosen-for');
        }
        else if ($clicked.is('#side-against .choose-side'))
        {
            $(this).addClass('side-chosen-against');
        }
        else if ($clicked.is('.change-mind'))
        {
            $(this).removeClass('side-chosen-for side-chosen-against');
        }
    });
    
    function sizeChat(e)
    {
        var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var navHeight = $('nav').outerHeight();
        
        console.log('viewHeight', viewHeight);
        console.log('navHeight', navHeight);
        
        var debatePage = $('#debate-page');
        var chatOutput = $('#chat-output');
        var chatBox = $('#chat-box-container');
        
        debatePage.height(viewHeight - navHeight);
        console.log("debate page height", debatePage.outerHeight());
        console.log("chatbox height", chatBox.outerHeight());
        chatOutput.height(debatePage.outerHeight() - chatBox.outerHeight());
        console.log("chat output height", chatOutput.outerHeight());
    }

    $('#news-column').on('click',function(){
        var srchTrm = $('#chat-box').val();
        var url = "https://access.alchemyapi.com/calls/data/GetNews\?apikey\=3034db537d09ce6a56b42eb54f8dd1c6745dbd8f&outputMode=json&start=now-7d&end=now&maxResults=2&q.enriched.url.enrichedTitle.keywords.keyword.text="+srchTrm+"&return=enriched.url.url,enriched.url.title"
        var rslts = $.get(url,function(){
        }).done(function(rslts){
            console.log(rslts);
        })
    })

    
    sizeChat();
    
    // do it again on resize
    $(window).resize(sizeChat);
})
