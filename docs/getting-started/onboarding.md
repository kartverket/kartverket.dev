---
id: onboarding
title: Onboarding a new service
description: How to onboard a new service to the developer portal
---
## The catalog
In order to use the developer portal the first step to adding your service is to add it to the [catalog](/catalog). The catalog is a list of all the services that exist in Kartverket. 

Since the developer portal is based on Backstage we have configured it to scan all repositories belonging to the Kartverket organization for backstage configuration files.
You can read more about such files [here](https://backstage.io/docs/features/software-catalog/descriptor-format#kind-component).

To make it easier for you to add your service to the catalog we have created a [template](/create/templates/default/onboarding). 
This template will create a basic backstage configuration for you, and create a pull request in your repository.

After merging the pull request your service will be added to the catalog within 30 minutes.


![onboarding-template](../assets/onboarding-template.png)