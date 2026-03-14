import { Plus, Search, MoreHorizontal, FileEdit, Trash } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

// Dummy data for visual layout
const EXAMS = [
  { id: "EX-101", title: "Data Structures Midterm", status: "Active", candidates: 45, date: "2026-03-15" },
  { id: "EX-102", title: "Algorithms Final", status: "Draft", candidates: 0, date: "TBD" },
  { id: "EX-103", title: "React Frontend Evaluation", status: "Completed", candidates: 120, date: "2026-02-28" },
];

export function ExamManager() {
  return (
    <div className="space-y-6 text-black text-left">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search exams..." className="pl-8" />
        </div>
        
        {/* Create Exam Modal */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="text-black sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Exam</DialogTitle>
              <DialogDescription>
                Set up a new examination instance. You can add questions later.
              </DialogDescription>
            </DialogHeader>
            <div className="text-black grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Exam Title</label>
                <Input id="title" placeholder="e.g. System Design Final" />
              </div>
              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">Duration (Minutes)</label>
                <Input id="duration" type="number" placeholder="120" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Instance</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Candidates</TableHead>
              <TableHead className="text-right">Scheduled Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {EXAMS.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell className="font-medium">{exam.id}</TableCell>
                <TableCell>{exam.title}</TableCell>
                <TableCell>
                  {/* Dynamic Badge Styling based on status */}
                  <Badge variant={exam.status === "Active" ? "default" : exam.status === "Draft" ? "secondary" : "outline"}>
                    {exam.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{exam.candidates}</TableCell>
                <TableCell className="text-right">{exam.date}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <FileEdit className="mr-2 h-4 w-4" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 focus:text-red-600">
                        <Trash className="mr-2 h-4 w-4" /> Delete Exam
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}