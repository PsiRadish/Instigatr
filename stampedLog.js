// Kyle Fiegener
// Adds `stampedLog` method to console.
// Behaves the same as regular console.log, except output is prepended with timestamp and filename+linenumber of where
// console.

(function()
{
    'use strict';
    
    // var fileRegex = /Error\s*at Error \(native\)\s*.+\s*.+(\\|\/)([^)\n\r]+)(?=\)?\s)/ ;
    var fileRegex = /Error\s*at Error \(native\)\s*.+\s*.+(\\|\/)([^)\n\r]+)(?=\)?\s)/ ;
    
    function setupStampedLog()
    {
        function stampedLog()
        {
            // if (process.env.NODE_ENV)
            
            var stackTrace = Error().stack;
            
            var argsArray = [];
            for (var i = 0; i < arguments.length; i++)
            {
                argsArray.push(arguments[i]);
            }
            
            var stampedArguments = [new Date().toLocaleTimeString(), fileRegex.exec(stackTrace)[2]].concat(argsArray);
            
            console.log.apply(console, stampedArguments);
        }
        
        console.stampedLog = stampedLog;
    }
    
    setupStampedLog();
}());

// function requestLog(req, res, next)
// {
//     // var requestFileRegex = /IncomingMessage\.req\.log.+\s+.+(\\|\/)([^\n\r]+)/;
//     req.log = function()
//     {
//         var stackTrace = Error().stack;
//         res.send("<pre>"+stackTrace+"</pre>");
        
//         var argsArray = [];
//         for (var i = 0; i < arguments.length; i++)
//         {
//             argsArray.push(arguments[i]);
//         }
        
//         var stampedArguments = [new Date().toLocaleTimeString(), req.method+":"+req.url, fileRegex.exec(stackTrace)[2]].concat(argsArray);
        
//         console.log.apply(console, stampedArguments);
//     };
    
//     next();
// }

// module.exports = requestLog;
