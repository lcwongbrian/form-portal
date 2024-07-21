## To start running the project:

1. In terminal, go to the directory under the folder "form-portal".
2. To add the endpoint of "form-api", create a ".env" in project directory with the environment variable "NEXT_PUBLIC_FORM_API_URL". If no specific endpoint of "portal-api" is assigned and "portal-api" is run locally, the default endpoint is http://localhost:8080 and the content of ".env" will be:

```bash
NEXT_PUBLIC_FORM_API_URL="http://localhost:8080"
```

3. Run command "npm install" to download all associated NPM packages.
4. Run command "npm run build" to to build the project.
5. Run command "npm start" to to start the UI. Browse to http://localhost:3000/ to view the website if the UI is hosted locally.
