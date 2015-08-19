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


});