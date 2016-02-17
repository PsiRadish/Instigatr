# Instigatr
A debate app.

##Original Contributors:
[PsiRadish](https://github.com/PsiRadish)  
[sorenrehkopf](https://github.com/sorenrehkopf)  
[candlewoodtoby](https://github.com/candlewoodtoby)  
[mustafa206](https://github.com/mustafa206)  
  
I (PsiRadish) have since modified much of the work by soren, candlewoodtoby, and mustafa206 on my own.  Go to [this branch](https://github.com/PsiRadish/Instigatr/tree/original-team-effort) to see the project before these modifications.  

##Explanations of technologies used:
  1. CSS
    + Ink-grid: CSS framework provides layout grid system
    + Compass: CSS authoring framework
    + SASS: CSS extension language
  2. Socket.io - chat messaging plug-in
  3. node.js
  4. NYT API
  5. jQuery
  6. jQuery custom content scroller plug-in
  7. postGreSQL
  8. Express.js
  9. Sequelize  
  
##General approach taken:
  The team conducted its first meeting brainstorming ideas until finally deciding on a debate app concept.
  We then produced wireframes, model diagrams, a development roadmap and code skeleton. Each member was assigned a
  specific section of the web application to work on for the duration of development. Team met frequently to integrate
  and merge their respective sections of code and to work out any conflicts.  
  
##Installation instructions for dependencies:
  1. npm install
  2. sequelize db:create
  3. sequelize db:migrate  
  
##User stories:
  This web application enables users to post public messages on any topic and provides a forum to engage in further debate on
  any particular posting. A news column automatically lists news articles relavant to a posting. A search bar for additional
  news queries is provided to allow users to delve deeper into their subject of interest.  
  
##Wireframes:
  https://generalassembly.mybalsamiq.com/projects/wdisea03/page%202 & https://generalassembly.mybalsamiq.com/projects/wdisea03/page%203  
  
##Description of any unsolved problems or hurdles team had to overcome:  
+ John:  
    I worked on integrating the New York Times(NYT) API and Alchemy API. After much testing, I decided against integrating the Alchemy API
    because it would only take a small number of queries before exceeding the daily call transaction limit resulting in the Alchemy API
    closing off requests and becoming non-responsive to the app. I also grappled with how to integrate the NYT API. I discovered that integrating
    the API calls on the front end resulted in exposing private keys to the outside world so had to scrap and rewrite the API calls on the backend.
    Then i discovered that I could not make the API calls on a separate controller of my creation but rather needed to integrate API calls with a controller
    that was created by another team member. Further complications arose when the render page for news API calls subsequent to the intial
    news API call had to executed via ajax. Also had to grapple with how to render news search results on .ejs file and creating a sorting algorithm
    for extracting .jpg thumbnails for display adjacent to news articles.  
    
+ Soren:  
    There were definitely some dificulties with coordinating the team efforts. Technology-wise there weren't a whole lot of hurdles that I personally encountered. The biggest thing was the troubles with Git and Git-hub that Kyle and Mustafa had. The most complicated part was the relationships between all our different models, and making sure the correct ones were included on the correct pages.  
    
+ Kyle:  
    *Git:* Did the first few merges poorly, and ended up with two of every middleware, which was probably the cause of some login problems we were having at the time.
    Towards the end, my git repository also got corrupted, causing git command-line to hang and GitHub for Windows to crash at the sight of it. Conveniently, this
    was shortly after I'd pushed to GitHub, so I didn't lose anything when wiping out the local repo and recloning. Inconveniently, I really would have rather spent that
    time sleeping.  
    
    *Socket.IO + Express.js:* Getting these two to talk to each other (instead of merely co-habitating on the same server) can be a bit of an ordeal; the details of which
    change significantly with version number. Once I finally searched specifically for the versions we use, I found a method that worked, but some time was still wasted
    trying to adapt old methods to the present.  
    
    *Chat Queue:* Implementing this required spending a long time deep in code before there was anything to test 'back on the surface'. And you can't talk underwater. Ask
    me how its going and my answer would be little more articulate than "blub blub blub".
      

