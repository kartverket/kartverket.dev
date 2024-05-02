This docker compose file can be used to try out the oauth2-proxy auth provider.

We run with azure on kubernetes, but for local testing create your own [github app](https://github.com/settings/developers).    
The end result should be the same, as far as backstage is considered.

You'll need to provide your own github client ID and secret and them to oauth2-proxy-alpha-config.yaml.    
I couldn't get env variables to work with oauth2-proxy, so make sure you don't commit your secrets.

Github app configuration:
![github-app-config.png](assets%2Fgithub-app-config.png)


To run oauth2-proxy with backstage, you need to add this to your app-config.local.yaml file:
```yaml
backend:  
  baseUrl: http://localhost:4180

auth:
  environment: development
  providers:
    oauth2Proxy:
      development: {}
```

You also need to modify a user in `../test_data/org.yaml`, just replace a users email with your github email.
```yaml
apiVersion: backstage.io/v1alpha1
kind: User
metadata:
  annotations:
    backstage.io/managed-by-location: msgraph:default/b04417ae-af62-4f55-9f8e-e64f7d7c1581
    backstage.io/managed-by-origin-location: msgraph:default/b04417ae-af62-4f55-9f8e-e64f7d7c1581
    graph.microsoft.com/user-id: 05c9dcb8-f3ed-4145-962f-8c52284d4309
    microsoft.com/email: Alison.Fields@kartverket.dev #THIS ONE, replace with myemail@kartverket.no
  etag: 23ba759d-9eee-4b0c-b37c-28b1229568b8
  name: Alison.Fields_kartverket.dev
  namespace: default
  uid: d9842878-1acf-48d1-a88f-d45efe131fa3
spec:
  memberOf: []
  profile:
    displayName: Alison Fields
    email: Alison.Fields@kartverket.dev
    picture: https://i.imgur.com/yWbRMvf.jpeg
```


After doing this you can `docker compose up` in this directory, and `yarn dev` on the project root.

You should then be able to login on `localhost:4180`