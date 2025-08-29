import type { CatalogInfoForm } from '../model/types.ts';

export const validateCatalogInfoForm = (form: CatalogInfoForm): string[] => {
    const errors: string[] = [];

    if (!form.name) {
        errors.push('Name is required');
    }

    if (!form.owner) {
        errors.push('Owner is required');
    }

    if (!form.system) {
        errors.push('System is required');
    }

    if (!form.domain) {
        errors.push('Domain is required');
    }

    return errors;
};
