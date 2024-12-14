import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const service = new gcp.cloudrun.Service("express-app", {
    location: "asia-south1",
    template: {
        spec: {
            containers: [{
                image: "gcr.io/assignment-444606/express-app:v2",
            }],
        },
    },
});

// const topic = new gcp.pubsub.Topic("projects/assignment-444606/topics/rate-limit-event");
export const url = service.statuses.apply(statuses => statuses[0].url);
console.log('url: ', url);
