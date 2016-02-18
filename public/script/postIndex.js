$(function()
{
	function positionTags()
	{
		$('.debate-tags').each(function()
		{
			var marginTop = this.offsetHeight * -1;
			this.style.marginTop = marginTop+'px';
		});
	}
	positionTags();
    // do it again on resize
    $(window).resize(positionTags);

	var postOffset = 0;
	$('#load-more').on('click',function(e)
	{
		e.preventDefault();
		
		postOffset += 8;
		
		var response = $.ajax(
		{
			url: '/more',
			method:'GET',
			data: {offset: postOffset}
		}).done(function()
		{
			// console.log(posts);
			// for (i = 0; i < posts.responseJSON.postsSort.length; i++)
			// {
			// 	var npdiv = ('<div class="css-debate-card"><div class="column-group vw-hack"><div class="all-10 vote"><h4>Total vote</h4><h4>' + posts.responseJSON.ratings[i] + '</h4></div><div class="all-50 post css-text"><a href="/posts/'+posts.responseJSON.postsSort[i].id+'/show">'+posts.responseJSON.postsSort[i].text+'</a><span class="author">'+posts.responseJSON.postsSort[i].user.name+'</span></div><div class="all-20 css-text"><p>'+posts.responseJSON.postsSort[i].usersFor.length+' agree.</p><p>'+posts.responseJSON.postsSort[i].usersAgainst.length+' disagree.</p><p>' + posts.responseJSON.postsSort[i].messages.length + ' messages.</p></div><div class="all-10 go-to-link"><a href="/posts/' + posts.responseJSON.postsSort[i].id + '/show"><i class="fa fa-arrow-right"></i></a></div></div><div class="column-group vw-hack"><div class="all-10"></div><div class="debate-tags all-90">');
				
			// 	for (j = 0; j < posts.responseJSON.postsSort[i].tags.length; j++)
			// 	{
			// 		npdiv = npdiv.concat('<a href="/tags/'+posts.responseJSON.postsSort[i].tags[j].id+'">#'+posts.responseJSON.postsSort[i].tags[j].name+'</a>');
			// 	};
				
			// 	npdiv = npdiv.concat('</div></div></div>');
			// 	$('#post-index-column').append(npdiv);
			// }
			
			// Back-end responds with html for a whole new page listing the additional posts.
            // Append this response to an empty div in memory, so we can use jQuery find to just get #post-index-column out.
            var morePostsHTML = $('<div/>').append(response.responseText).find('#post-index-column').html();
            
            $('#post-index-column').append(morePostsHTML); // add contents of #post-index-column from back-end to #post-index-column in DOM
            
            positionTags();
		});
		
	});

});
