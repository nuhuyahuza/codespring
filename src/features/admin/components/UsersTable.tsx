import { useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

interface UsersTableProps {
  users: User[];
  onEditUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onToggleUserStatus: (userId: string, isActive: boolean) => void;
}

export function UsersTable({
  users,
  onEditUser,
  onDeleteUser,
  onToggleUserStatus,
}: UsersTableProps) {
  const [pageSize, setPageSize] = useState(10);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
    { field: 'role', headerName: 'Role', width: 120 },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Switch
          checked={params.row.isActive}
          onCheckedChange={(checked) => onToggleUserStatus(params.row.id, checked)}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      width: 180,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams<User>) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditUser(params.row.id)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteUser(params.row.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-[600px] w-full">
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        rowsPerPageOptions={[5, 10, 20, 50]}
        checkboxSelection
        disableSelectionOnClick
        className="bg-background"
      />
    </div>
  );
} 