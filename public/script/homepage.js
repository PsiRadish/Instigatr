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


});