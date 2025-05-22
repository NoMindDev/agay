"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Calendar, X, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

const logEntry = [
  {
    id: 1,
    date: new Date(),
    // actualDate: new Date(2025, 3, 9, 18, 0), // Oct 30, 2025, 6:00 PM
    user_name: " ",
    user_email: " ",
    event: "Search",
    description: 'Searched for "User details"',
    resource_link: " ",
    resource_name: " ",
  },
  // {
  //   id: 2,
  //   date: "Today, 2:00 AM",
  //   actualDate: new Date(2025, 3, 9, 2, 0), // Oct 30, 2025, 2:00 AM
  //   user: {
  //     name: "John",
  //     avatar: "/nlcs-logo.png?height=32&width=32",
  //     initials: "J",
  //   },
  //   event: "Chatbot",
  //   description: 'Asked bot, "Hello, what is your name?"',
  //   resource: { type: "conversation", label: "Move to conversation" },
  // },
  // Add other entries as needed...
];

// Filter options
const filterOptions = [
  { id: "search", label: "Search" },
  { id: "chatbot", label: "Chatbot" },
  { id: "download", label: "Download" },
];

export default function LogsPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [dateRangeText, setDateRangeText] = useState("Select Date Range");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [logEntries, setLogEntries] = useState(logEntry);
  // Prevent the user from selecting dates after today
  const today = new Date();
  useEffect(() => {
    const fetchLogs = async () => {
      console.log("Fetching logs...");
      const res = await fetch("/api/logs");
      if (!res.ok) {
        console.error("Failed to fetch logs");
        return;
      }
      const data = await res.json();
      console.log(data.data, "logs data");
      setLogEntries(data.data);
      // handle response if needed
    };
    fetchLogs();
  }, []);
  // Update the date range text when the date range changes
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setDateRangeText(
        `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
      );
    } else {
      setDateRangeText("Select Date Range"); // Reset the text when no date is selected
    }
  }, [dateRange]);

  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      setActiveFilters(activeFilters.filter((id) => id !== filterId));
    } else {
      setActiveFilters([...activeFilters, filterId]);
    }
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter((id) => id !== filterId));
  };

  const filteredLogs = logEntries.filter((log) => {
    // Filter by event type
    const eventTypeMatch = activeFilters.length
      ? activeFilters.includes(log.event.toLowerCase())
      : true; // If no filters are applied, return true

    // Filter by date range
    let dateMatch = true;
    if (dateRange?.from && dateRange?.to) {
      const from = new Date(dateRange.from);
      const to = new Date(dateRange.to);

      // Normalize "from" to start of the day
      from.setHours(0, 0, 0, 0);

      // Normalize "to" to end of the day
      to.setHours(23, 59, 59, 999);

      dateMatch = log.date >= from && log.date <= to;
    }

    return eventTypeMatch && dateMatch;
  });

  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Date Range Picker */}
        <div className="mb-6">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto text-left justify-start"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRangeText}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={today} // Start the calendar on today
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  if (range?.from && range?.to) {
                    setIsCalendarOpen(false);
                  }
                }}
                disabled={{ after: today }} // Disable dates after today
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                Filter
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Filter by event</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filterOptions.map((filter) => (
                <DropdownMenuCheckboxItem
                  key={filter.id}
                  checked={activeFilters.includes(filter.id)}
                  onCheckedChange={() => toggleFilter(filter.id)}
                >
                  {filter.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {activeFilters.map((filterId) => {
            const filter = filterOptions.find((f) => f.id === filterId);
            if (!filter) return null;

            return (
              <Badge
                key={filterId}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                {filter.label}
                <button
                  onClick={() => removeFilter(filterId)}
                  className="ml-1 rounded-full hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>

        {/* Logs Table */}
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Date</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Event</TableHead>
                <TableHead className="max-w-[300px]">
                  Event Description
                </TableHead>
                <TableHead>Resource </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-black">
                      {entry.date instanceof Date
                        ? format(entry.date, "yyyy-MM-dd")
                        : format(new Date(entry.date), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell className="text-black">
                      {/* <Avatar className="h-8 w-8">
                        {entry.user_name ? (
                          <AvatarImage
                            src={entry.user.avatar}
                            alt={entry.user.name}
                          />
                        ) : null}
                        <AvatarFallback>{entry.user.initials}</AvatarFallback>
                      </Avatar> */}
                      {entry.user_name}
                    </TableCell>
                    <TableCell className="text-black">
                      {entry.user_email}
                    </TableCell>
                    <TableCell className="text-black">{entry.event}</TableCell>
                    <TableCell className="max-w-[300px] truncate text-black">
                      {entry.description}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={entry.resource_link}
                        target="_blank"
                        className="text-blue-500 hover:underline"
                      >
                        {entry.resource_name}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No logs found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Realtime audit logs
        </div>
      </div>
    </div>
  );
}
