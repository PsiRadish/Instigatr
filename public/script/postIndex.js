$(function()
{
	console.log("postIndex");
	
	function positionTags()
	{
		console.log("positionTags");
		
		$('.debate-tags').each(function()
		{
			var marginTop = this.offsetHeight * -1;
			console.log("each", marginTop);
			this.style.marginTop = marginTop+'px';
		})
	}
	positionTags();
    // do it again on resize
    $(window).resize(positionTags);

	var offset = 0;
	$('#load-more').on('click',function(e)
	{
		e.preventDefault();
		
		offset += 8;
		var posts = $.ajax(
		{
			url: '/more',
			method:'GET',
			data: {offset: offset}
		}).done(function()
		{
			// TODO: receive new HTML from back-end using existing templates instead of repeating everything here
			console.log(posts);
			for (i = 0; i < posts.responseJSON.postsSort.length; i++)
			{
				var npdiv = ('<div class="css-debate-card"><div class="column-group vw-hack"><div class="all-10 vote"><h4>Total vote</h4><h4>' + posts.responseJSON.ratings[i] + '</h4></div><div class="all-50 post css-text"><a href="/posts/'+posts.responseJSON.postsSort[i].id+'/show">'+posts.responseJSON.postsSort[i].text+'</a><span class="author">'+posts.responseJSON.postsSort[i].user.name+'</span></div><div class="all-20 css-text"><p>'+posts.responseJSON.postsSort[i].usersFor.length+' agree.</p><p>'+posts.responseJSON.postsSort[i].usersAgainst.length+' disagree.</p><p>' + posts.responseJSON.postsSort[i].messages.length + ' messages.</p></div><div class="all-10 go-to-link"><a href="/posts/' + posts.responseJSON.postsSort[i].id + '/show"><i class="fa fa-arrow-right"></i></a></div></div><div class="column-group vw-hack"><div class="all-10"></div><div class="debate-tags all-90">');
				
				for (j = 0; j < posts.responseJSON.postsSort[i].tags.length; j++)
				{
					npdiv = npdiv.concat('<a href="/tags/'+posts.responseJSON.postsSort[i].tags[j].id+'">#'+posts.responseJSON.postsSort[i].tags[j].name+'</a>');
				};
				
				npdiv = npdiv.concat('</div></div></div>');
				$('#post-index-column').append(npdiv);
			}
		});
		
	});

});
