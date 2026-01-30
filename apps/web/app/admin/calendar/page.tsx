'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  Users,
  Video,
  Check,
  AlertCircle,
  Repeat,
  Copy,
  Settings,
  Home,
  FileText,
  Zap,
  Hammer,
  TrendingUp,
} from 'lucide-react';

// Types
interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  isBooked: boolean;
  bookedBy?: {
    name: string;
    email: string;
    service: string;
  };
  isRecurring: boolean;
  recurringRule?: {
    frequency: 'daily' | 'weekly';
    daysOfWeek: number[];
    endDate: string;
  };
}

interface DaySchedule {
  date: Date;
  slots: TimeSlot[];
}

// Mock data generator
const generateMockSchedule = (startDate: Date): DaySchedule[] => {
  const days: DaySchedule[] = [];
  const mockBookings = [
    { name: 'John Smith', email: 'john@example.com', service: 'Electrical' },
    { name: 'Sarah Johnson', email: 'sarah@example.com', service: 'Carpentry' },
    { name: 'Mike Wilson', email: 'mike@example.com', service: 'Renovation' },
  ];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const slots: TimeSlot[] = [];

    if (!isWeekend) {
      const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      times.forEach((time, idx) => {
        const isBooked = Math.random() > 0.6;
        slots.push({
          id: `${date.toISOString()}-${time}`,
          date: date.toISOString().split('T')[0],
          startTime: time,
          endTime: `${parseInt(time) + 1}:00`,
          duration: 60,
          isBooked,
          bookedBy: isBooked ? mockBookings[Math.floor(Math.random() * mockBookings.length)] : undefined,
          isRecurring: false,
        });
      });
    }

    days.push({ date, slots });
  }

  return days;
};

// Time slot options
const timeOptions = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00',
];

const durationOptions = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AdminCalendarPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);
    return monday;
  });

  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);

  // New slot form state
  const [newSlot, setNewSlot] = useState({
    startTime: '09:00',
    duration: 60,
    isRecurring: false,
    recurringDays: [] as number[],
    recurringEndDate: '',
  });

  useEffect(() => {
    setSchedule(generateMockSchedule(currentWeekStart));
  }, [currentWeekStart]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  const formatWeekRange = () => {
    const endOfWeek = new Date(currentWeekStart);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    return `${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(currentWeekStart)} - ${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(endOfWeek)}`;
  };

  const handleAddSlot = (date: Date) => {
    setSelectedDate(date);
    setIsAddingSlot(true);
  };

  const handleSaveNewSlot = () => {
    if (!selectedDate) return;

    // In production, this would call the API
    console.log('Saving new slot:', {
      date: selectedDate,
      ...newSlot,
    });

    // Reset form
    setIsAddingSlot(false);
    setSelectedDate(null);
    setNewSlot({
      startTime: '09:00',
      duration: 60,
      isRecurring: false,
      recurringDays: [],
      recurringEndDate: '',
    });

    // Refresh schedule
    setSchedule(generateMockSchedule(currentWeekStart));
  };

  const handleDeleteSlot = (slotId: string) => {
    // In production, this would call the API
    console.log('Deleting slot:', slotId);
    setSchedule(generateMockSchedule(currentWeekStart));
  };

  const handleCopyWeek = () => {
    // Copy current week's schedule to next week
    console.log('Copying week schedule');
    alert('Week schedule copied to next week');
  };

  const getTotalBookings = () => {
    return schedule.reduce((total, day) => {
      return total + day.slots.filter(s => s.isBooked).length;
    }, 0);
  };

  const getTotalSlots = () => {
    return schedule.reduce((total, day) => total + day.slots.length, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
      {/* Admin Header - Full width dark header with proper spacing for fixed nav */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-primary-900 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-white/60 hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <span className="text-white/60">Admin</span>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <span className="text-white font-medium">Calendar</span>
          </div>

          {/* Page Title */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold text-white mb-2">
                Calendar Management
              </h1>
              <p className="text-white/70 text-lg">
                Set your availability and manage consultation bookings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyWeek}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/20"
              >
                <Copy className="w-4 h-4" />
                Copy Week
              </button>
              <Link
                href="/admin/consultations"
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-navy-900 hover:bg-gold-400 rounded-xl font-medium transition-all"
              >
                <FileText className="w-4 h-4" />
                Consultations
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Floating above content */}
      <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-navy-900">{getTotalSlots()}</div>
                <div className="text-sm text-slate-500 font-medium">Total Slots</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-navy-900">{getTotalBookings()}</div>
                <div className="text-sm text-slate-500 font-medium">Booked</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-navy-900">{getTotalSlots() - getTotalBookings()}</div>
                <div className="text-sm text-slate-500 font-medium">Available</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-navy-900">
                  {getTotalSlots() > 0 ? Math.round((getTotalBookings() / getTotalSlots()) * 100) : 0}%
                </div>
                <div className="text-sm text-slate-500 font-medium">Utilization</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Calendar */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Week Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-6 bg-white rounded-2xl shadow-lg border border-slate-100 p-4"
        >
          <button
            onClick={() => navigateWeek('prev')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 transition-all text-slate-600 hover:text-navy-900"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Previous</span>
          </button>
          <div className="text-center">
            <h2 className="font-heading text-xl font-bold text-navy-900">
              {formatWeekRange()}
            </h2>
            <p className="text-sm text-slate-500">Week View</p>
          </div>
          <button
            onClick={() => navigateWeek('next')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 transition-all text-slate-600 hover:text-navy-900"
          >
            <span className="font-medium hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
        >
          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-gradient-to-r from-slate-50 to-slate-100">
            {schedule.map((day) => {
              const isToday = day.date.toDateString() === new Date().toDateString();
              const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
              return (
                <div
                  key={day.date.toISOString()}
                  className={`p-4 text-center border-r border-slate-200 last:border-r-0 ${
                    isToday ? 'bg-primary-100' : ''
                  }`}
                >
                  <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                    isToday ? 'text-primary-600' : isWeekend ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {daysOfWeek[day.date.getDay()]}
                  </div>
                  <div className={`text-2xl font-bold ${
                    isToday ? 'text-white bg-primary-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto' :
                    isWeekend ? 'text-slate-400' : 'text-navy-900'
                  }`}>
                    {day.date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-7">
            {schedule.map((day) => {
              const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
              const isToday = day.date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={day.date.toISOString()}
                  className={`min-h-[400px] p-3 border-r border-slate-100 last:border-r-0 ${
                    isWeekend ? 'bg-slate-50/50' : isToday ? 'bg-primary-50/30' : ''
                  }`}
                >
                  {isWeekend ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <X className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium">Weekend</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {day.slots.map((slot) => {
                        const serviceColor = slot.bookedBy?.service === 'Electrical' ? 'amber' :
                                            slot.bookedBy?.service === 'Carpentry' ? 'orange' : 'blue';
                        return (
                          <motion.div
                            key={slot.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            className={`p-3 rounded-xl text-sm transition-all cursor-pointer ${
                              slot.isBooked
                                ? `bg-gradient-to-r from-${serviceColor}-50 to-${serviceColor}-100 border-2 border-${serviceColor}-200 shadow-sm`
                                : 'bg-white border-2 border-slate-200 hover:border-primary-400 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-bold ${slot.isBooked ? `text-${serviceColor}-700` : 'text-slate-700'}`}>
                                {slot.startTime}
                              </span>
                              {!slot.isBooked && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSlot(slot.id);
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            {slot.isBooked && slot.bookedBy && (
                              <div className={`text-${serviceColor}-600`}>
                                <div className="font-semibold truncate text-xs">{slot.bookedBy.name}</div>
                                <div className="flex items-center gap-1 mt-1">
                                  {slot.bookedBy.service === 'Electrical' && <Zap className="w-3 h-3" />}
                                  {slot.bookedBy.service === 'Carpentry' && <Hammer className="w-3 h-3" />}
                                  {slot.bookedBy.service === 'Renovation' && <Home className="w-3 h-3" />}
                                  <span className="text-xs truncate">{slot.bookedBy.service}</span>
                                </div>
                              </div>
                            )}
                            {!slot.isBooked && (
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Available
                              </div>
                            )}
                          </motion.div>
                        );
                      })}

                      {/* Add Slot Button */}
                      <button
                        onClick={() => handleAddSlot(day.date)}
                        className="w-full p-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all flex items-center justify-center gap-2 group"
                      >
                        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Add Slot</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white border-2 border-slate-200"></div>
            <span className="text-slate-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200"></div>
            <span className="text-slate-600">Electrical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200"></div>
            <span className="text-slate-600">Carpentry</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200"></div>
            <span className="text-slate-600">Renovation</span>
          </div>
        </div>
      </div>

      {/* Add Slot Modal */}
      {isAddingSlot && selectedDate && (
        <div className="fixed inset-0 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
          >
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-semibold text-navy-900">
                  Add Availability Slot
                </h3>
                <button
                  onClick={() => setIsAddingSlot(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <p className="text-slate-500 text-sm mt-1">
                {formatDate(selectedDate)}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Time
                </label>
                <select
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  className="input-luxury"
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Duration
                </label>
                <select
                  value={newSlot.duration}
                  onChange={(e) => setNewSlot({ ...newSlot, duration: parseInt(e.target.value) })}
                  className="input-luxury"
                >
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Recurring Toggle */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newSlot.isRecurring}
                    onChange={(e) => setNewSlot({ ...newSlot, isRecurring: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-700">Make this recurring</span>
                    <p className="text-xs text-slate-500">Repeat this slot weekly</p>
                  </div>
                </label>
              </div>

              {/* Recurring Options */}
              {newSlot.isRecurring && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pl-8"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Repeat on
                    </label>
                    <div className="flex gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                        <button
                          key={day}
                          onClick={() => {
                            const dayNum = index + 1;
                            const newDays = newSlot.recurringDays.includes(dayNum)
                              ? newSlot.recurringDays.filter(d => d !== dayNum)
                              : [...newSlot.recurringDays, dayNum];
                            setNewSlot({ ...newSlot, recurringDays: newDays });
                          }}
                          className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                            newSlot.recurringDays.includes(index + 1)
                              ? 'bg-primary-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {day[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newSlot.recurringEndDate}
                      onChange={(e) => setNewSlot({ ...newSlot, recurringEndDate: e.target.value })}
                      className="input-luxury"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-6 bg-slate-50 rounded-b-2xl flex gap-3">
              <button
                onClick={() => setIsAddingSlot(false)}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewSlot}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Add Slot
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
