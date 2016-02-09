$(function(){

	var faden = function(elem){
		elem.fadeIn(300);
	};
	var fadet = function(elem){
		elem.fadeIn(300);
	};
	
	function positionFooter()
	{
		var inkGridHeight = $('.ink-grid').height();
		var footerHeight = $('.js-footerSelect').height();
		var windowHeight = $(window).height();
		
		if ((inkGridHeight + footerHeight) < windowHeight)
		{
			var marginTop = windowHeight - (inkGridHeight + footerHeight);
			$('.js-footerSelect').css('margin-top', marginTop);
		}
		else
		{
			$('.js-footerSelect').css('margin-top', 0);
		}
	}
	positionFooter();
    // do it again on resize
    $(window).resize(positionFooter);

	//listeners for user option icons
	$('.js-user-create-post').on('mouseover',function(){
		$('.js-usrTxtPncl').fadeIn(200);
	});
	$('.js-user-create-post').on('mouseout',function(){
		$('.js-usrTxtPncl').fadeOut(0)
	});
	$('.js-user-create-post').on('click',function(e){
		e.preventDefault();
		$('body').css('overflow','hidden');
		$('#modalBlock').fadeIn(0);
		$('#newPost').fadeIn(200)
	});

	$('.js-user-my-posts').on('mouseover',function(){
		$('.js-usrTxtBook').fadeIn(200);
	});
	$('.js-user-my-posts').on('mouseout',function(){
		$('.js-usrTxtBook').fadeOut(0)
	});

	$('.js-user-account').on('mouseover',function(){
		$('.js-usrTxtWrench').fadeIn(200);
	});
	$('.js-user-account').on('mouseout',function(){
		$('.js-usrTxtWrench').fadeOut(0)
	});
	$('.js-user-account').on('click',function(e){
		e.preventDefault();
		$('body').css('overflow','hidden');
		$('#modalBlock').fadeIn(0);
		$('#settings').fadeIn(200);
	});

	$('.js-user-signout').on('mouseover',function(){
		$('.js-usrTxtSO').fadeIn(200);
	});
	$('.js-user-signout').on('mouseout',function(){
		$('.js-usrTxtSO').fadeOut(0)
	});



	//signup link modal opener and closer
	$('#signup-link').on('click',function(e){
		e.preventDefault();
		$('body').css('overflow','hidden');
		$('#modalBlock').fadeIn(0);
		$('#signup').fadeIn(200);
	});

	$('.sUClose').on('click',function(e){
		e.preventDefault();
		$('#modalBlock').fadeOut(200);
		$('body').css('overflow','auto');
		$('#signup').fadeOut(200);
		$('#newPost').fadeOut(200);
		$('#settings').fadeOut(200);
	});

	$('#loginBtn').on('click',function(e){
		var email = $('#email-input').val();
		var pass = $('#password-input').val();
		e.preventDefault();
		var lgin = $.ajax({
			url:"/auth/login",
			method: 'POST',
			data:{'email':email, 'password':pass}
		}).done(function(){
			console.log(lgin)
			if(lgin.responseJSON){
			document.location.reload();
		}else{
			if(email&&pass){
			console.log('what?');
			$('#alert').html('<h3>Invalid email and password combo.</h3>');
			$('#alert').fadeIn(400).delay(2000);
			$('#alert').fadeOut(700);
			}else{
			$('#alert').html('<h3>Enter both an email and a password.</h3>');
			$('#alert').fadeIn(400).delay(2000);
			$('#alert').fadeOut(700);
			};
		};
		});
	});

	$('#sUBtn').on('click',function(e){
		var email = $('#suEmail').val();
		var pass = $('#suPass').val();
		var pas2 = $('#suPas2').val();
		var name = $('#suName').val();
		e.preventDefault();
		var sup = $.ajax({
			url:"/auth/signup",
			method: 'POST',
			data:{'email':email, 'password':pass,'password2':pas2, 'name':name}
		}).done(function(){
			console.log(sup)
			if(sup.responseJSON){
				if(sup.responseJSON.errors){
					$('#errNot').text(sup.responseJSON.errors[0].message);
				}else{
					$('#modalBlock').fadeOut(0);
					$('body').css('overflow','auto');
					$('#signup').fadeOut(0);
					$('#alert').html('<h3>You are signed up and may now login!</h3>');
					$('#alert').fadeIn(400).delay(2000);
					$('#alert').fadeOut(700);
				};
			}else{
			$('#errNot').text(sup.responseText);
			};
		});
	});

	$('#postInpt').on('keydown',function(e){
		var left = 600 - $(this).val().length;
		if(left>=0){
		$('#charNot').text(left+" characters left.")
		}else{
			if(e.keyCode!==8){
			e.preventDefault();
			}
		}
	})
    
	//hiding about link ON about page
	if (window.location.pathname == "/about") {
		$('#aboutLink').hide();
	}
	
	var offset = 0;
	$('#loadMoar').on('click',function(e)
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
