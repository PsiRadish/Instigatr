
function checkMobile()
{
    var agent = navigator.userAgent || navigator.vendor || window.opera;
    
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(agent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agent.substr(0, 4)));
    
}
MOBILE = checkMobile();

$(document).ready(function()
{
	var faden = function(elem)
	{
		elem.fadeIn(300);
	};
	var fadet = function(elem)
	{
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
    
    function collapseCheck()
    {
    	// if (window.getComputedStyle(document.querySelector('body'), '::after').getPropertyValue('content').replace(/"/g, '') == "collapse")
    	
    	var navButton = $('#nav-button');
    	var navMenu = $('#nav-menu');
    	var globalNav = $('#global-nav');
    	var brand = $('#brand');
    	
    	// set navbar to its un-collapsed state
    	navButton.addClass("hide-all");
    	navMenu.removeClass("submenu");
    	
    	// navbar and brand button should be same height; if not navbar must have wrapped and needs to collapse
    	if (globalNav.outerHeight() > brand.outerHeight())
    	{
    		navButton.removeClass("hide-all");
    		navMenu.addClass("submenu");
    		
    		// while we're here, set max-width on hamburger menu so it can't overflow the screen
    		navMenu.css('max-width', (globalNav.width() - brand.outerWidth()) + "px");
    	}
    	else
    	{
    		// clear inline max-width
    		navMenu.removeAttr('style');
    	}
    }
    collapseCheck();
    // do it again on resize
    $(window).resize(collapseCheck);
    
    // listener for buttons that open click-menus
    var justOpened = null; // for communicating with other listeners
    $('.click-menu-button').click(function(event)
	{
		event.preventDefault();
		
		var wrapper = $(this).closest('.click-menu-wrapper');
		
		if (!wrapper.is('.click-menu-open')) // not already open
		{
			wrapper.addClass("click-menu-open");
			
			justOpened = wrapper[0]; // let the topmost listener for this click know NOT to close this menu
		}
	});
	// listener for elements inside click-menus that should cause the menu to close when clicked
	$('.submenu.click-menu .click-menu-clear').click(function()
	{		
		$(this).closest('.click-menu-wrapper').removeClass("click-menu-open");
	});
	// listener for ALL clicks, closes open click menus if the click was outside them
	$(document).click(function(event)
	{
		clickTarget = event.target;
		
		$('.click-menu-wrapper.click-menu-open').each(function()
		{
			if (this == justOpened) // let's NOT close this menu on the same click that opened it
			{
				justOpened = null;
				return;
			}
			
			var wrapper = $(this);
			var menu = wrapper.find('.submenu.click-menu');
			
			if (menu.find(clickTarget).length == 0) // clickTarget not a child of menu
			{
				wrapper.removeClass("click-menu-open");
			}
		});
		
	});
	// }, true); // useCapture
	
	function positionModal()
	{
		var modalShowing = $('.modal-view.modal-showing');
		
		if (modalShowing.length)
		{
			var windowHeight = $(window).height();
			var modalHeight = $(modalShowing).outerHeight();
			
			var marginTop = Math.max((windowHeight - modalHeight) / 2, 0) + "px";
			
			modalShowing.css('margin-top', marginTop);
		}
	}
	positionModal();
    // do it again on resize
    $(window).resize(positionModal);
	
	function showModal(modalSelector)
	{
		$('body').css('overflow', 'hidden');
		$('#modal-block').fadeIn(0);
		$(modalSelector).fadeIn(200).addClass("modal-showing");
		positionModal();
	}
	
	function hideModals()
	{
		$('#modal-block').fadeOut(200);
		$('body').css('overflow', 'auto');
		$('#signup').fadeOut(200).removeClass("modal-showing");
		$('#new-post').fadeOut(200).removeClass("modal-showing");
		$('#settings').fadeOut(200).removeClass("modal-showing");
	}
	
	
	//listeners for user option icons
	// $('.js-user-create-post').on('mouseover', function()
	// {
	// 	$('.js-usrTxtPncl').fadeIn(200);
	// });
	// $('.js-user-create-post').on('mouseout', function()
	// {
	// 	$('.js-usrTxtPncl').fadeOut(0)
	// });
	$('.js-user-create-post').on('click', function(e)
	{
		e.preventDefault();
		// $('body').css('overflow', 'hidden');
		// $('#modal-block').fadeIn(0);
		// $('#new-post').fadeIn(200);
		showModal('#new-post');
	});
	
	// $('.js-user-my-posts').on('mouseover', function()
	// {
	// 	$('.js-usrTxtBook').fadeIn(200);
	// });
	// $('.js-user-my-posts').on('mouseout', function()
	// {
	// 	$('.js-usrTxtBook').fadeOut(0)
	// });
	
	// $('.js-user-account').on('mouseover', function()
	// {
	// 	$('.js-usrTxtWrench').fadeIn(200);
	// });
	// $('.js-user-account').on('mouseout', function()
	// {
	// 	$('.js-usrTxtWrench').fadeOut(0)
	// });
	$('.js-user-account').on('click', function(e)
	{
		e.preventDefault();
		// $('body').css('overflow', 'hidden');
		// $('#modal-block').fadeIn(0);
		// $('#settings').fadeIn(200);
		showModal('#settings');
	});
	
	// $('.js-user-signout').on('mouseover', function()
	// {
	// 	$('.js-usrTxtSO').fadeIn(200);
	// });
	// $('.js-user-signout').on('mouseout', function()
	// {
	// 	$('.js-usrTxtSO').fadeOut(0)
	// });	
	
	//signup link modal opener and closer
	$('#signup-link').on('click', function(e)
	{
		e.preventDefault();
		// $('body').css('overflow', 'hidden');
		// $('#modal-block').fadeIn(0);
		// $('#signup').fadeIn(200);
		showModal('#signup');
	});
	
	$('.close-ui').on('click', function(e)
	{
		e.preventDefault();
		// $('#modal-block').fadeOut(200);
		// $('body').css('overflow', 'auto');
		// $('#signup').fadeOut(200).removeClass("modal-showing");
		// $('#new-post').fadeOut(200).removeClass("modal-showing");
		// $('#settings').fadeOut(200).removeClass("modal-showing");
		hideModals();
	});
	
	$('#login-button').on('click', function(e)
	{
		var email = $('#email-input').val();
		var pass = $('#password-input').val();
		e.preventDefault();
		var auth = $.ajax(
		{
			url: "/auth/login",
			method: 'POST',
			data: {'email': email, 'password': pass}
		}).done(function()
		{
			// console.log(auth);
			if (auth.responseJSON)
			{
    			document.location.reload();
    		}
    		else
    		{
    			if (email && pass)
    			{
        			// console.log('what?');
        			$('#alert').html('<h3>Invalid email and password combo.</h3>');
        			$('#alert').fadeIn(400).delay(2000);
        			$('#alert').fadeOut(700);
    			}
    			else
    			{
        			$('#alert').html('<h3>Enter both an email and a password.</h3>');
        			$('#alert').fadeIn(400).delay(2000);
        			$('#alert').fadeOut(700);
    			};
    		};
		});
	});
	
	$('#signup-submit-button').on('click', function(e)
	{
		var email = $('#signup-input-email').val();
		var pass = $('#signup-input-pass').val();
		var pass2 = $('#signup-input-pass2').val();
		var name = $('#signup-input-name').val();
		e.preventDefault();
		var signup = $.ajax(
		{
			url: "/auth/signup",
			method: 'POST',
			data: {'email': email, 'password': pass, 'password2': pass2, 'name': name}
		}).done(function()
		{
			// console.log(signup);
			if (signup.responseJSON)
			{
				if (signup.responseJSON.errors)
				{
					// $('#signup-errors').text(signup.responseJSON.errors[0].message);
					$('#signup-errors').html("<p>" + signup.responseJSON.errors[0].message + "</p>");
				}
				else
				{
					// $('#modal-block').fadeOut(0);
					// $('body').css('overflow', 'auto');
					// $('#signup').fadeOut(0);
					hideModals();
					$('#alert').html('<h3>You are signed up and may now login.</h3>');
					$('#alert').fadeIn(400).delay(2000);
					$('#alert').fadeOut(700);
				};
			}
			else
			{
				// $('#signup-errors').text(signup.responseText);
				$('#signup-errors').html("<p>" + signup.responseText + "</p>");
			};
		});
	});
	
	$('#post-input').on('keydown', function(e) // TODO: Change to a more reliable event
	{
		var left = 600 - $(this).val().length;
		if (left >= 0)
		{
			$('#char-count').text(left+" characters left.")
		}
		// Prevent typing further characters once limit is reached
		// else if (e.keyCode !== 8 && e.keyCode !== 46) // backspace and delete permitted
		// {
		// 	e.preventDefault();
		// }
	});
    
	//hiding about link ON about page
	if (window.location.pathname == "/about") 
	{
		$('#aboutLink').hide();
	}

});
