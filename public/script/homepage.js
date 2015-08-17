$(function(){

	var faden = function(elem){
		elem.fadeIn(300);
	};
	var fadet = function(elem){
		elem.fadeIn(300);
	};

	$('.js-usrIconPncl').on('mouseover',function(){
		$('.js-usrTxtPncl').fadeIn(200);
	});
	$('.js-usrIconPncl').on('mouseout',function(){
		$('.js-usrTxtPncl').fadeOut(0)
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
	$('.js-usrIconSO').on('mouseover',function(){
		$('.js-usrTxtSO').fadeIn(200);
	});
	$('.js-usrIconSO').on('mouseout',function(){
		$('.js-usrTxtSO').fadeOut(0)
	});
});