
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addMonths, subMonths } from "date-fns";

interface CustomCalendarProps {
  onDateSelect?: (date: Date) => void;
  className?: string;
}

const CustomCalendar = ({ onDateSelect, className }: CustomCalendarProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      if (onDateSelect) {
        onDateSelect(selectedDate);
      }
    }
  };
  
  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentMonth(today);
    setDate(today);
    if (onDateSelect) {
      onDateSelect(today);
    }
  };
  
  return (
    <div className={`border rounded-lg p-4 bg-timeflow-gray border-timeflow-lightgray ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handlePrevMonth}
          className="text-gray-400 hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div>
          <h3 className="text-lg font-medium text-white text-center">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleTodayClick}
            className="text-xs text-gray-400 hover:text-white mt-1"
          >
            Today
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNextMonth}
          className="text-gray-400 hover:text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <CalendarComponent
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        className="bg-transparent pointer-events-auto"
      />
    </div>
  );
};

export default CustomCalendar;
