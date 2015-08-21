$(function(){

	var faden = function(elem){
		elem.fadeIn(300);
	};
	var fadet = function(elem){
		elem.fadeIn(300);
	};


	//listeners for user option icons


	$('.js-usrIconPncl').on('mouseover',function(){
		$('.js-usrTxtPncl').fadeIn(200);
	});
	$('.js-usrIconPncl').on('mouseout',function(){
		$('.js-usrTxtPncl').fadeOut(0)
	});
	$('.js-usrIconPncl').on('click',function(e){
		e.preventDefault();
		$('body').css('overflow','hidden');
		$('#modalBlock').fadeIn(0);
		$('#newPost').fadeIn(200)
	});

	$('.js-usrIconBook').on('mouseover',function(){
		$('.js-usrTxtBook').fadeIn(200);
	});
	$('.js-usrIconBook').on('mouseout',function(){
		$('.js-usrTxtBook').fadeOut(0)
	});

	$('.js-usrIconWrench').on('mouseover',function(){
		$('.js-usrTxtWrench').fadeIn(200);
	});
	$('.js-usrIconWrench').on('mouseout',function(){
		$('.js-usrTxtWrench').fadeOut(0)
	});
	$('.js-usrIconWrench').on('click',function(e){
		e.preventDefault();
		$('body').css('overflow','hidden');
		$('#modalBlock').fadeIn(0);
		$('#settings').fadeIn(200)
	});

	$('.js-usrIconSO').on('mouseover',function(){
		$('.js-usrTxtSO').fadeIn(200);
	});
	$('.js-usrIconSO').on('mouseout',function(){
		$('.js-usrTxtSO').fadeOut(0)
	});



	//signup btn modal opener and closer
	$('#signupBtn').on('click',function(e){
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
		var email = $('#emailinpt').val();
		var pass = $('#passinpt').val();
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
	
	var offset=0
	$('#loadMoar').on('click',function(e){
		e.preventDefault();
		offset +=8;
		var posts = $.ajax({
			url: '/more',
			method:'GET',
			data:{offset:offset}
		}).done(function(){
			console.log(posts);
			for(i=0;i<posts.responseJSON.postsSort.length;i++){
			var npdiv = ('<div class="css-mainPagePostDiv"><div class="column-group vw-hack"><div class="all-10 vote"><h4>Total vote</h4><h4>'+posts.responseJSON.ratings[i]+'</h4></div><div class="all-50 css-text"><a href="/posts/'+posts.responseJSON.postsSort[i].id+'/show">'+posts.responseJSON.postsSort[i].text+'</a><span class="author">'+posts.responseJSON.postsSort[i].user.name+'</span></div><div class="all-20 css-text"><p>'+posts.responseJSON.postsSort[i].usersFor.length+' agree.</p><p>'+posts.responseJSON.postsSort[i].usersAgainst.length+' disagree.</p><p>'+posts.responseJSON.postsSort[i].messages.length+' messages.</p></div><div class="all-10 goToLink"><a href="/posts/'+posts.responseJSON.postsSort[i].id+'/show"><i class="fa fa-arrow-right"></i></a></div></div><div class="column-group vw-hack"><div class="all-10"></div><div class="css-tags all-90">');
				for(j=0;j<posts.responseJSON.postsSort[i].tags.length;j++){
			npdiv = npdiv.concat('<a href="/tags/'+posts.responseJSON.postsSort[i].tags[j].id+'">#'+posts.responseJSON.postsSort[i].tags[j].name+'</a>');
			};
			npdiv = npdiv.concat('</div></div></div>');
			$('#mainPagePostCol').append(npdiv);
		};
		});

	});

});
