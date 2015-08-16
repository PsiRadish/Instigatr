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
        var vertMargin = freeSpace / 2;
        
        postStuff.css("margin-bottom", vertMargin.toString()+"px");
        choices.css("margin-bottom", vertMargin.toString()+"px");
        
        chatOutput.height(contentHeight - chatBox.outerHeight());
        
    }
    
    sizeChat();
    
    // do it again on resize
    $(window).resize(sizeChat);
});
