# Challenge 05. Application with ReactJS

In this challenge you will add new functionality to the application we developed throughout this module.

## Functionalities

### Catching Errors

Add a `try / catch` around the code present in the` handleSubmit` function present in the `Main` component and if a repository is not found in the Github API add a red border around the input where the user entered the name of the repository.

### Duplicate Repository

Before calling the API in the `handleSubmit` function, check to see if the repository is not duplicated, ie if it does not already exist in the state of` repositories`.

If so, it will trigger an error, and the code will fall into the `catch` of` try / catch` created in the previous functionality.

`` `js
throw new Error ('Duplicate Repository');
`` `

### State Filter

Add a state filter to the Issues listing we created in the repository detail. The state represents whether the issue is open, closed, or an option to display them all.

Request Examples:

`` `
https://api.github.com/repos/rocketseat/unform/issues?state=all
https://api.github.com/repos/rocketseat/unform/issues?state=open
https://api.github.com/repos/rocketseat/unform/issues?state=closed
`` `

You can find the documentation [at this link] (https://developer.github.com/v3/issues/#parameters-1);

### Pagination

Add pagination to the issues listed in the repository detail. The Github API lists a maximum of 30 issues per page and you can control the current page number by a parameter in the request address:

`` `
https://api.github.com/repos/rocketseat/unform/issues?page=2
`` `

Add only a next page and previous page button. The previous page button should be disabled on the first page.
