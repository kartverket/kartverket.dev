import { Box, Card } from '@backstage/ui';
import Link from '@material-ui/core/Link';
import Divider from '@mui/material/Divider';

export const InfoBox = () => {
  return (
    <Card>
      <Box px="2rem">
        <h2>Edit or Generate Catalog-info.yaml</h2>
        <Divider sx={{ marginY: '1.5rem' }} />
        <p>
          This form helps you create or edit catalog-info.yaml files used by
          Kartverket.dev to discover and manage software components in the
          catalog. Enter a GitHub repository URL to add it to the developer
          portal, or provide a link to an existing catalog-info.yaml file to
          edit it using this form.
        </p>
        <p>
          Once the form is completed with the correct entities, click{' '}
          <em>Create Pull Request</em> to propose changes or additions to the
          catalog-info.yaml file in the relevant repository. The changes will
          take effect only after the pull request is merged and Kartverket.dev
          updates its catalog.
        </p>
        <Divider />
        <h3>What are Entities in Kartverket.dev?</h3>
        Kartverket.dev is built using Backstage, which defines a set of entities
        used to build the software catalog. These entities are seperated into
        three groups: core entities, ecosystem entities, and organizational
        entites. Core entities include Component, API, and Resource. Ecosystem
        entities include System and Domain. Organizational entites include Group
        and User. Below is a brief explanation of the core entities.
        <h4>Component</h4>A Component is a piece of software, such as service,
        library, and website. It could for Components often correspond to a
        repository.
        {/* , but a monorepo can contain multiple components. */}
        Components can provide APIs that other components consume, and often
        depend on APIs and resources.
        <h4>API</h4>
        An API entity describes an API that a component provides and that other
        components consume. Public APIs are the primary ways which components
        interact. The API specification should be included in the API entity and
        the file path to this document should be added to the API entity, with
        the file path poibtubg to the API definition so that Kartverket.dev can
        provide detailed information.
        <h4>Resource</h4>
        Resource entities represent shared shared resources that a component
        requires during runtime, such as object storage or other cloud services.
        <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
          <Link
            href="https://backstage.io/docs/features/software-catalog/"
            target="_blank"
            rel="noreferrer"
          >
            Learn more about entities and the Backstage catalog.
          </Link>
        </div>
      </Box>
    </Card>
  );
};
