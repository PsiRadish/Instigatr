# Instigatr
Debate app


1. Explanations of technologies used:
    (1) CSS
      a. Ink-grid: CSS framework provides layout grid system
      b. Compass: CSS authoring framework
      c. SASS: CSS extension language
    (2) Socket.io - chat messaging plug-in
    (3) node.js
    (4) NYT API
    (5) jQuery
    (6) jQuery custom content scroller plug-in
    (7) postGreSQL
    (8) express
    (9) sequelize


2. General approach taken:
    The team conducted its first meeting brainstorming ideas until finally deciding on a debate app concept.
    We then produced wireframes, model diagrams, a development roadmap and code skeleton. Each member was assigned a
    specific section of the web application to work on for the duration of development. Team met frequently to integrate
    and merge their respective sections of code and to work out any conflicts.

3. Installation instructions for dependencies:
    (1) npm install
    (2) sequelize db:create
    (3) sequelize db:migrate

4. Link to user stories:
    This web application enables users to post public messages on any topic and provides a forum to engage in further debate on
    any particular posting. A news column automatically lists news articles relavant to a posting. A search bar for additional
    news queries is provided to allow users to delve deeper into their subject of interest.


5. Link to wireframes:


6. Description of any unsolved problems or hurdles team had to overcome:
  (1) John:
      I worked on integrating the New York Times(NYT) API and Alchemy API. After much testing, I decided against integrating the Alchemy API
      because it would only take a small number of queries before exceeding the daily call transaction limit resulting in the Alchemy API
      closing off requests and becoming non-responsive to the app. I also grappled with how to integrate the NYT API. I discovered that integrating
      the API calls on the front end resulted in exposing private keys to the outside world so had to scrap and rewrite the API calls on the backend.
      Then i discovered that I could not make the API calls on a separate controller of my creation but rather needed to integrate API calls with a controller
      that was created by another team member. Further complications arose when the render page for news API calls subsequent to the intial
      news API call had to executed via ajax. Also had to grapple with how to render news search results on .ejs file and creating a sorting algorithm
      for extracting .jpg thumbnails for display adjacent to news articles.

  (2) Soren:
      There were definitely some dificulties with coordinating the team efforts. Technology-wise there weren't a whole lot of hurdles that I personally encountered. The biggest thing was the troubles with Git and Git-hub that Kyle and Mustafa had. The most complicated part was the relationships between all our different models, and making sure the correct ones were included on the correct pages.



