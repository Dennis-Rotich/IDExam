import { useState } from "react";
import { 
  Search, ListFilter, MoreHorizontal, UserPlus, 
  Download, Mail, Shield, GraduationCap, Ban, 
  CheckCircle2, Clock, ChevronDown, UserCog, Trash2
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel
} from "../../components/ui/dropdown-menu";

// --- MOCK DATA ---
type Role = "Admin" | "Instructor" | "Student";
type Status = "Active" | "Suspended" | "Pending";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  lastActive: string;
  verified: boolean;
}

const MOCK_USERS: UserRecord[] = [
  { id: "u1", name: "Jaylen Brooks", email: "j.brooks@student.tahini.edu", role: "Student", status: "Active", lastActive: "2 mins ago", verified: true },
  { id: "u2", name: "Dr. Sarah Okonkwo", email: "s.okonkwo@tahini.edu", role: "Instructor", status: "Active", lastActive: "15 mins ago", verified: true },
  { id: "u3", name: "Admin User", email: "sysadmin@tahini.edu", role: "Admin", status: "Active", lastActive: "Just now", verified: true },
  { id: "u4", name: "Priya Nair", email: "p.nair@student.tahini.edu", role: "Student", status: "Active", lastActive: "1 hour ago", verified: true },
  { id: "u5", name: "Marcus Webb", email: "m.webb@student.tahini.edu", role: "Student", status: "Suspended", lastActive: "2 days ago", verified: false },
  { id: "u6", name: "Prof. James Velez", email: "j.velez@tahini.edu", role: "Instructor", status: "Active", lastActive: "3 hours ago", verified: true },
  { id: "u7", name: "Sarah Chen", email: "s.chen@student.tahini.edu", role: "Student", status: "Pending", lastActive: "Never", verified: false },
  { id: "u8", name: "David Kim", email: "d.kim@student.tahini.edu", role: "Student", status: "Active", lastActive: "5 mins ago", verified: true },
];

// --- HELPER FUNCTIONS ---
function getRoleBadge(role: Role) {
  switch (role) {
    case "Admin": return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-medium px-2 py-0 text-[10px] uppercase tracking-wider"><Shield className="w-3 h-3 mr-1"/> Admin</Badge>;
    case "Instructor": return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-medium px-2 py-0 text-[10px] uppercase tracking-wider"><UserCog className="w-3 h-3 mr-1"/> Instructor</Badge>;
    case "Student": return <Badge variant="outline" className="bg-muted text-muted-foreground border-border font-medium px-2 py-0 text-[10px] uppercase tracking-wider"><GraduationCap className="w-3 h-3 mr-1"/> Student</Badge>;
  }
}

function getStatusColor(status: Status) {
  switch (status) {
    case "Active": return "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "Suspended": return "text-red-500 dark:text-red-400 bg-red-500/10 border-red-500/20";
    case "Pending": return "text-amber-600 dark:text-amber-500 bg-amber-500/10 border-amber-500/20";
  }
}

export function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | Role>("All");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const filteredUsers = MOCK_USERS.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const toggleUserSelection = (id: string) => {
    const newSet = new Set(selectedUsers);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedUsers(newSet);
  };

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left px-2">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">View, filter, and manage all platform accounts and permissions.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="secondary" className="bg-muted/50 hover:bg-muted text-foreground h-9 rounded-full px-5 text-sm w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button className="bg-foreground text-background hover:bg-foreground/90 h-9 rounded-full px-5 text-sm w-full sm:w-auto">
            <UserPlus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </div>
      </div>

      {/* FILTERS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-b border-border pb-4">
        
        {/* Role Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto">
          {["All", "Student", "Instructor", "Admin"].map((role) => {
            const isActive = roleFilter === role;
            return (
              <Button 
                key={role} onClick={() => setRoleFilter(role as any)} variant={isActive ? "default" : "secondary"}
                className={`rounded-full h-9 px-4 shrink-0 text-sm font-medium transition-colors ${
                  isActive ? "bg-foreground text-background hover:bg-foreground/90" : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent hover:border-border"
                }`}
              >
                {role} {role === "All" && <span className="ml-1.5 opacity-60 text-[10px]">{MOCK_USERS.length}</span>}
              </Button>
            );
          })}
        </div>

        {/* Search & Bulk Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          
          {selectedUsers.size > 0 ? (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
              <span className="text-sm font-medium text-blue-500 mr-2">{selectedUsers.size} Selected</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="h-9 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/20">
                    Bulk Actions <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                  <DropdownMenuItem className="cursor-pointer hover:bg-muted"><Mail className="w-4 h-4 mr-2 text-muted-foreground"/> Email Selected</DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-muted"><UserCog className="w-4 h-4 mr-2 text-muted-foreground"/> Change Role</DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"><Ban className="w-4 h-4 mr-2"/> Suspend Users</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name or email..." className="pl-9 bg-muted/30 border-transparent focus-visible:ring-1 focus-visible:ring-border h-9 text-sm rounded-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground">
                <ListFilter className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* USER LIST */}
      <div className="w-full text-sm">
        
        {/* List Header */}
        <div className="flex items-center justify-between py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 border-b border-border/50 pb-3">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-5 shrink-0 flex justify-center">
              <Checkbox 
                checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0} 
                onCheckedChange={handleSelectAll}
                className="border-muted-foreground data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
              />
            </div>
            <div>User Details</div>
          </div>
          <div className="hidden md:flex items-center gap-6 shrink-0 pl-4">
            <span className="w-24 text-left">Role</span>
            <span className="w-24 text-left">Status</span>
            <span className="w-32 text-left">Last Active</span>
            <div className="w-8 text-right"></div>
          </div>
        </div>

        {/* List Body */}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, idx) => (
            <div key={user.id} className={`flex items-center justify-between py-3 px-4 transition-colors rounded-md ${idx % 2 === 0 ? "bg-muted/10" : "bg-transparent"} hover:bg-muted/30 ${selectedUsers.has(user.id) ? "bg-blue-500/5 hover:bg-blue-500/10" : ""}`}>
              
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-5 shrink-0 flex justify-center">
                  <Checkbox 
                    checked={selectedUsers.has(user.id)} 
                    onCheckedChange={() => toggleUserSelection(user.id)}
                    className="border-muted-foreground/50 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                  />
                </div>
                
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground shrink-0 border border-border">
                    {user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate font-medium text-foreground flex items-center gap-1.5">
                      {user.name} 
                      {user.verified && <CheckCircle2 className="w-3 h-3 text-blue-500" />}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 pl-4">
                <span className="hidden md:inline-block w-24 text-left">
                  {getRoleBadge(user.role)}
                </span>
                
                <span className="hidden md:flex items-center w-24 text-left">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </span>
                
                <span className="hidden md:flex items-center gap-1.5 w-32 text-left text-muted-foreground text-xs font-mono">
                  <Clock className="w-3.5 h-3.5" /> {user.lastActive}
                </span>
                
                <div className="w-8 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted rounded-full">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                      <DropdownMenuLabel className="text-muted-foreground text-xs uppercase tracking-wider">Manage User</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer hover:bg-muted"><UserCog className="mr-2 h-4 w-4 text-muted-foreground" /> View Profile</DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                      
                      {/* Role Promotion/Demotion based on current role */}
                      {user.role === "Student" && <DropdownMenuItem className="cursor-pointer hover:bg-muted"><Shield className="mr-2 h-4 w-4 text-muted-foreground" /> Promote to Instructor</DropdownMenuItem>}
                      {user.role === "Instructor" && <DropdownMenuItem className="cursor-pointer hover:bg-muted"><GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" /> Demote to Student</DropdownMenuItem>}
                      
                      <DropdownMenuSeparator className="bg-border" />
                      {user.status === "Active" ? (
                        <DropdownMenuItem className="text-amber-600 dark:text-amber-500 focus:bg-amber-500/10 focus:text-amber-600 cursor-pointer">
                          <Ban className="mr-2 h-4 w-4" /> Suspend Account
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-500 cursor-pointer">
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Restore Account
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Search className="h-8 w-8 mb-3 opacity-20" />
            <p>No users found matching your filters.</p>
          </div>
        )}
      </div>

    </div>
  );
}