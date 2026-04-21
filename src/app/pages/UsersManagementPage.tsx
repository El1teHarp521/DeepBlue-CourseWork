import { useAuth, UserRole, EmployeeSubRole, User } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Shield, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';

export function UsersManagementPage() {
  const { user: adminUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:3000/api/users');
    setUsers(await res.json());
  };

  useEffect(() => {
    if (adminUser?.role !== 'admin') navigate('/');
    fetchUsers();
  }, [adminUser]);

  const updateRole = async (id: string, role: UserRole) => {
    await fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ role })
    });
    fetchUsers();
  };

  const deleteUser = async (id: string) => {
    if (confirm('Удалить?')) {
      await fetch(`http://localhost:3000/api/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center gap-4 mb-10">
        <Shield className="w-10 h-10 text-primary" />
        <h1 className="text-3xl font-black uppercase">Управление отелем</h1>
      </div>
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="p-6 font-black uppercase text-xs">Имя / Почта</th>
              <th className="p-6 font-black uppercase text-xs">Роль</th>
              <th className="p-6 font-black uppercase text-xs text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-border hover:bg-secondary/20">
                <td className="p-6">
                  <div className="font-bold">{u.fullName}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </td>
                <td className="p-6">
                  <select value={u.role} onChange={(e) => updateRole(u.id, e.target.value as UserRole)} className="bg-background border rounded px-2 py-1 font-bold text-xs">
                    <option value="resident">Resident</option>
                    <option value="employee">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-6 text-right">
                  <Button variant="ghost" onClick={() => deleteUser(u.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}