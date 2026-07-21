export const menuItems: MenuItem[] = [
    {
        uuid: "a143c376-ed88-440f-9c6f-e7b9cfdd2d1d",
        name: "Dashboard",
        src: "/dashboard",
        subMenus: []
    },
    {
        uuid: "a143c376-ed93-42ca-9b62-123ae0a66874",
        name: "Consent Records",
        src: "/consent-records",
        subMenus: []
    },
    {
        uuid: "a143c376-ed95-4e4f-916d-83b5cb5f8f8b",
        name: "Processing Inventory",
        src: "/processing-inventory",
        subMenus: [
            {
                uuid: "a143c376-ed99-4979-a481-70078da2794a",
                name: "Processing Category",
                src: "/processing-inventory/processing-category"
            },
            {
                uuid: "a143c376-ed9f-49b5-acf2-55f6e603eb25",
                name: "Processing Activities",
                src: "/processing-inventory/processing-activities"
            },
            {
                uuid: "a143c376-ed9a-4253-95b6-523cfba331d1",
                name: "Processing Purpose",
                src: "/processing-inventory/processing-purpose"
            }
        ]
    },
    {
        uuid: "a143c376-ed9a-4253-95b6-523cfba331d2",
        name: "Consent Template",
        src: "/consent-template",
        subMenus: []
    },
    {
        uuid: "a143c376-ed9a-4253-95b6-523cfba331d3",
        name: "Developers",
        src: "/developers",
        subMenus: []
    },
    {
        uuid: "a143c376-eda1-462b-a432-dc99f68466e1",
        name: "Settings",
        src: "/settings",
        subMenus: []
    }
];