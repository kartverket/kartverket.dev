import {
    Button,
} from '@backstage/ui';

type Props = {
    yamlContent: string; // the entity data you generate (could also be string)
};

export const DownloadButton = ({ yamlContent }: Props) => {
    const handleDownload = () => {
        // Create a blob and a temporary link
        const blob = new Blob([yamlContent], { type: 'text/yaml' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'catalog-info.yaml'; // 👈 filename
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
    };

    return (
        <Button onClick={handleDownload} variant="primary" isDisabled={yamlContent.length === 0}>
            Download File
        </Button>
    );
};