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
