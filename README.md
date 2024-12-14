# Pre-requisites
Need to install 
- Docker Desktop app
- Google Cloud CLI
- Pulumi CLI
- Need to create an project in Google Cloud Console for proceeding and need to enable billing as well for deploying express app as well.


# Getting started with React App
- The UI part is present on the " master " branch.
- Checkout to the "master" branch and enter the path for client folder( e.g - C:/usr/express-assignment/client)
- Run the command " yarn install "
- Then run yarn start to start the localhost for the UI part.
- For deploying the UI you need to push the changes to master branch it will get deployed through Vercel automatically.

# For the NodeJS server
- You need to switch to the " client " branch there you will see 2 folders, server and infra.
- server contains the express app code and the infra contains the pulumi related code.
- enter the path for server folder ( e.g - C:/usr/express-assignment/server)
- Run the command yarn start which will start the local development server
- If you want to deploy the express app you will need to create a docker image of the app first
- Command for creating the docker image " docker build -t gcr.io/[PROJECT_ID]/[IMAGE NAME]:[TAG] . "
- After creating the image then we need to push the docker image to the Google Container Registry (GCR) with the command " docker push gcr.io/[PROJECT_ID]/[IMAGE NAME]:[TAG] "

# For the Pulumi Server
- enter the path for infra folder ( e.g - C:/usr/express-assignment/infra)
- After the image is generated then you need to add the image name in the index.tsx file in the infra folder
- Then you will be asked if you want to update the changes, if we select yes then  the image will be deployed to the Google Cloud Run Service.


## Note
- Tried to implement the Cloud Firestore and Pub/Sub but got into some errors which I was unable to resolve.
- These concepts were new, so might be I made some rookie error in configuring the CLoud Firestore and Pub/Sub, will definitely improve these aspects as well.
- Got to learn about Pulumi, Google Cloud Run and Docker while completing this assignment will sureky explore these tech stacks further.
