# campus_planner

 # demo video: https://youtu.be/B2UNcPTT2MQ
 # github pages link: https://bruno-shema.github.io/summative-campus_life_planner_UI/
 CampusPlanner is a responsive web application CampusPlanner is a platform that will help students organize their academic activities and tasks, track deadlines, and plan their time effectively . It provides a simple dashboard for managing campus activites, and keep track of either completed or pending tasks on a single platform.
 To develop it I used HTML for semantic page structure, CSS for styling, responsive layouts, flexbox, media queries, animations, and transactions, Javascript for application logic, DOM manipulation, event handling, filtering, sorting, data management, and for REGEX validations, I also used localStorage and JSON for persistent data storage, data import and export.

 1. campusPlanner's main Features : 
  - task and Event Management: Create, update, and delete plans for academic tasks and campus events.
  - Tasks completion Tracking: Mark tasks as completed or pending using checkboxes.
  - Search Functionality: Search records by title, description, category, and due date.
  - Sorting: Organize plans by title(depending on alphabetical order), due date, duration, creation date, or even completion status.
  - Filtering: Filter plans according to their completion status.
   - Responsive design : Acess the application on desktop, tablet, and mobile devices,
   - Data persistence: Store plans locally using browser's localStorage.
    - Data import and Export: Export plans as JSON, and import only valid JSON data.
campusPlanner also includes features like, input validation for validating user inputs, theme options to allow user choose between light/ dark theme, error handling, and also Interactive user interface.

 2. Project Structure :
 I organized the project into four main folders;  
 - M1 Specs & wirefrems/ : stores initial figma wireframes in both .pdf, .PNG, .fig formats
 - assets/ : for storing additional .html files
 - scripts/ : for storing javascript files
 - styles/ : for storing .css file
 - index.html file: the main backbone of the file.

 3. REGEX catalog:

     const title_pattern = /^(?!.* {2,})\S(?:.*\S)?$/;
 Purpose: First advenced regex pattern to help validate title elements when a user is adding a new record. This REGEX doesn't allow user to add any records that have recurring or trailing spaces, e.tc

    /^[1-9]\d*$/;

Purpose: I used this REGEX pattern to validate duration elements, This pattern is for saying that the duration value must only be numerical.

     /^\d{4}-(0[1-9]|1[0-2])-([1-9]|[12]\d|3[01])$/;

Purpose: This Regex Pattern was for validating date elements, to make sure that the user inserts valid date data.

    /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

Purpose: This regex was for validating tag elements to make sure that tag elements can only accept letters, spaces, and hyphens.

 4. Keyboard Navigation and a11y acessibility plan: 
  - For keyboard navigation: 
        . `TAB` : helps to move to the next element
        . `Shift + TAB `: Move to the previous element.
        . `Enter`: Access the Focused button or link.
        . `Space` : Activate buttons and checkboxes
        . `Arrow Keys`: to navigate dropdown elements, like select
   - For acessibility, I:
        . included a `skip-to-content` link to simplify navigation.
        . Visible focus indicators.
        . labels associated with form controls.
        . ARIA live for dynamic status messages
        . Light and Dark Theme considerations
        . Responsive Layouts
        . Used Semantic HTML elements like <header>, <nav>, <main>, <aside>, <footer> to improve accessibility.
5. How to run tests of different features:
    - first clone the repository using this code: 

        git clone https://github.com/Bruno-SHEMA/summative-campus_life_planner_UI.git

    - After cloning the project, open it in VS code or your other text editor
     - Install ` live server` extension if you don't already have it. This one will help you run a development server.
     - After installing the extension, click the ` Go live` button to open the index.html file.
      - Wait for the server to run, and open it in the web.

    - You can use keyboard navigation keys like `TAB` to move around
     - Access the `+schedule` button to add new schedule/task/event by entering the required information, you can also try to test its REGEX validations, like trying to input invalid data to test it.
     - Search for specific plans, use '^' to search for records that start with what you want.
     - Sort records and filter them based on what you want.
     - Edit or delete plans where necessary
      - use the settings page to import, export data
       - use the settings page to toggle between color themes' light or dark theme.

