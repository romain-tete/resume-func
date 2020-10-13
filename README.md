# Resume app REST API backend

This is a very straightforward Azure Functions project that implements CRUD operations for the [resume app](https://github.com/romain-tete/resume) resources.

# Notice

This is ran behind an Azure API Management instance. The main reason is the JWT validation that it performs. The functions in this project assume that the token has been validated and can be trusted at this point.
