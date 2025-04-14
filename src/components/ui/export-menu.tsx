
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Printer, FileText, FileSpreadsheet } from "lucide-react";
import { exportData } from "@/utils/export-utils";

interface ExportMenuProps<T extends Record<string, any>> {
  data: T[];
  columns: { key: keyof T, label: string }[];
  filename: string;
  title: string;
}

export function ExportMenu<T extends Record<string, any>>({ 
  data, 
  columns, 
  filename, 
  title 
}: ExportMenuProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => exportData(data, columns, filename, 'pdf', title)}
        >
          <FileText className="h-4 w-4 mr-2" />
          <span>PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => exportData(data, columns, filename, 'excel', title)}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          <span>Excel</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => exportData(data, columns, filename, 'print', title)}
        >
          <Printer className="h-4 w-4 mr-2" />
          <span>Print</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
