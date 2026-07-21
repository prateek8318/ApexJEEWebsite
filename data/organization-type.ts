type OrganizationType = {
    uuid: string;
    label: string;
    value: string;
};

export const organizationTypes: OrganizationType[] = [
    {
        uuid: "a16491c4-8b80-4faf-8015-763d48cba3db",
        label: "B2B",
        value: "B2B",
    },
    {
        uuid: "a16491c4-8b89-4937-9b55-fa61f943927e",
        label: "B2C",
        value: "B2C",
    },
    {
        uuid: "a16491c4-8b8c-49c7-81bf-dd8a8e9ffd6d",
        label: "Software",
        value: "SOFTWARE",
    },
    {
        uuid: "a16491c4-8b8e-4779-a7bc-1260d496ab6f",
        label: "Others",
        value: "OTHERS",
    },
    {
        uuid: "a16491c4-8b91-4310-8f7c-7ed4c10f2716",
        label: "Marketplace",
        value: "MARKETPLACE",
    },
];
