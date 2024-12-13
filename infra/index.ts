import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const service = new gcp.cloudrun.Service("express-assignment", {
    location: "asia-south1",
    template: {
        spec: {
            containers: [{
                image: "gcr.io/assignment-444606/express-assignment:latest",
            }],
        },
    },
});

const topic = new gcp.pubsub.Topic("rate-limit-events");

export const url = service.statuses.apply(statuses => statuses[0].url);
console.log('url: ', url);
