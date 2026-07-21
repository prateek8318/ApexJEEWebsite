import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table";

interface Activity {
    id: number;
    description: string;
    date: string;
}

const recentActivity: Activity[] = [
    { id: 1, description: "User John completed Mock Test 1", date: "2024-09-01" },
    { id: 2, description: "New video lecture added: Calculus", date: "2024-09-02" },
    { id: 3, description: "User Mary submitted doubt", date: "2024-09-03" },
    { id: 4, description: "Course updated", date: "2024-09-04" },
];

const ActivityTable: React.FC = () => {
    return (
        <Table className="bg-white/5 border border-border">
            <TableHeader>
                <TableRow className="group">
                    <TableHead className="text-muted-foreground group-hover:text-white transition-colors">
                        Activity
                    </TableHead>
                    <TableHead className="text-muted-foreground group-hover:text-white transition-colors">
                        Date
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {recentActivity.map((item) => (
                    <TableRow key={item.id} className="group hover:bg-[#0B1528] transition-colors">
                        <TableCell className="text-foreground group-hover:text-white transition-colors">
                            {item.description}
                        </TableCell>
                        <TableCell className="text-foreground group-hover:text-white transition-colors">
                            {item.date}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default ActivityTable;
