var TotalRaw = 0;
var TotalThrottled = 0;

// function throttledEventListener(obj, type, listener)
function throttledEventListener(obj, type, listener, timeout) // ([object,] type, listener function)
{   TotalRaw++;
    timeout = timeout || 100;
    
    var running = false;
    
    function throttler(e)
    {   TotalRaw++;
        if (running) return;
        running = true;
        
        window.setTimeout(dispatch, timeout);
        
        function dispatch()
        {
            // obj.dispatchEvent(new CustomEvent(name));
            listener.call(obj, e);
            running = false;
        }
    }
    
    obj.addEventListener(type, throttler);
};

throttledEventListener(window, "resize", function(e)
{
    TotalThrottled++;
});
