---
id: shared_concepts
title: How the entity model is defined in Kartverket.
description: How we define and apply the entity model and the practices we encourage users to follow.
---

# Shared Concepts for Backstage
To build a clear architectural overview in Backstage for Kartverket, it is important that we use the same concepts consistently. This makes it easier for everyone to find and understand our systems. Here you will find the definitions we will use across teams. When you add documentation, check that you follow these.

## Entities

### Domain
A domain represents a high-level business area or product area. It is used to group systems that naturally belong together based on function, ownership, or business value.

**Examples**

- Payments
- Customer Management
- Analytics  
- Property Data  

### Subdomain
A subdomain is one or more subdivisions of a domain, used to structure large areas into more manageable parts. Subdomains group systems that solve related tasks or represent a clear business capability.

**Examples**

- Domain: Customer

    - Subdomain: Customer Management

    - Subdomain: Authentication

- Domain: Property Data

    - Subdomain: Data Sharing

    - Subdomain: Reporting

### System
A system is a collection of components that together solve a clearly defined purpose within a domain. A system may consist of multiple components that work together to deliver a functionality.

**Examples**

- The “Customer Portal” system consists of a web app, a backend API, and a data-processing job.

- The “Reporting Engine” system consists of several components for data processing and visualization.

### Component
A component is an independent part of a system — a service, library, or application. It usually has its own repository (unless in a monorepo) and can be run, built, and deployed independently.

**Examples**

- frontend-app (React)

- customer-service-api (Spring Boot backend)

**Types:**

- website, library, service, ops, documentation

### API
An API describes an interface that a component provides or consumes. APIs make it visible how systems and components communicate.

**Examples**

- `customer-service-api` provides a REST API for customer information

- `frontend-app` consumes the `customer-service-api` API

**Types:**

- openapi, asyncapi, graphql, wsdl, or a custom type.

**Note:**  
External APIs (for example Altinn, FREG) should not be registered as an API under the component, but as a Resource of type *external-api*. This makes it possible to model dependencies between internal components and external services. See the Resource section for details.

### Resource
A resource is an external or shared dependency that a system or component relies on, but which is not necessarily owned by the same team. This can be either technical infrastructure components or external integrations.

**Examples**

- Technical resource: internally hosted resources (databases, queues, storage, clusters)

- External integration: third-party or government services (Altinn, Digdir, Facebook API, BankID)  

### Other
**Groups** and **users** are fetched from Kartverket’s Entra ID. Groups are only fetched if they have the prefix *AAD - TF - TEAM*.

## Where should entities be defined in Kartverket?

### Domains / Subdomains
In a shared repository that centralizes entity definitions used across the organization.

### Systems
Systems are mainly defined in a shared centralized repository, but we do not want to restrict teams’ ability to define systems in their own repositories when useful.

### Resources
A combination of centralization and team-owned definitions. Platform resources will live in a centralized repository, while teams can add resources they use in their own repositories or directly in their designated area in the centralized repository.

### Components and APIs
Teams own these definitions and are responsible for placing them in a repository they own.

## Modeling Examples

### Example 1: Security Champion and the Developer Portal
This example is inspired by the Developer Portal, Kartverket.dev. The Developer Portal is defined as a system consisting of Kartverket.dev, which is modeled here as a component. Kartverket.dev integrates with the external resources GitHub (for data) and Microsoft Entra ID (for authentication and fetching users and groups).

Security Champion is a system that Kartverket.dev depends on. Security Champion consists of a backend component that provides an API consumed by a frontend Backstage plugin.

![modelleringseksempel1](../assets/modelleringseksempel1.png)


