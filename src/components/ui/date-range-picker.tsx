'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { format, startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from 'date-fns';
import { DateRange, DatePreset } from '@/types';
import { Button } from './button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './select';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (dateRange: DateRange) => void;
  className?: string;
}

// Predefined date presets for quick selection
const DATE_PRESETS: DatePreset[] = [
  {
    label: 'Today',
    value: 'today',
    getDateRange: () => ({
      startDate: format(startOfDay(new Date()), 'yyyy-MM-dd'),
      endDate: format(endOfDay(new Date()), 'yyyy-MM-dd')
    })
  },
  {
    label: 'Yesterday',
    value: 'yesterday',
    getDateRange: () => {
      const yesterday = subDays(new Date(), 1);
      return {
        startDate: format(startOfDay(yesterday), 'yyyy-MM-dd'),
        endDate: format(endOfDay(yesterday), 'yyyy-MM-dd')
      };
    }
  },
  {
    label: 'Last 7 days',
    value: 'last7days',
    getDateRange: () => ({
      startDate: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd')
    })
  },
  {
    label: 'Last 30 days',
    value: 'last30days',
    getDateRange: () => ({
      startDate: format(subDays(new Date(), 29), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd')
    })
  },
  {
    label: 'This month',
    value: 'thismonth',
    getDateRange: () => ({
      startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    })
  },
  {
    label: 'Last month',
    value: 'lastmonth',
    getDateRange: () => {
      const lastMonth = subMonths(new Date(), 1);
      return {
        startDate: format(startOfMonth(lastMonth), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(lastMonth), 'yyyy-MM-dd')
      };
    }
  },
  {
    label: 'This year',
    value: 'thisyear',
    getDateRange: () => ({
      startDate: format(startOfYear(new Date()), 'yyyy-MM-dd'),
      endDate: format(endOfYear(new Date()), 'yyyy-MM-dd')
    })
  },
  {
    label: 'Last year',
    value: 'lastyear',
    getDateRange: () => {
      const lastYear = subYears(new Date(), 1);
      return {
        startDate: format(startOfYear(lastYear), 'yyyy-MM-dd'),
        endDate: format(endOfYear(lastYear), 'yyyy-MM-dd')
      };
    }
  }
];

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('last30days');
  const [startDate, setStartDate] = useState(value.startDate);
  const [endDate, setEndDate] = useState(value.endDate);

  // Initialize with default preset (last 30 days)
  useEffect(() => {
    if (!value.startDate || !value.endDate) {
      const defaultPreset = DATE_PRESETS.find(p => p.value === 'last30days');
      if (defaultPreset) {
        const range = defaultPreset.getDateRange();
        onChange(range);
      }
    }
  }, []);

  // Check if current range matches any preset
  useEffect(() => {
    const matchingPreset = DATE_PRESETS.find(preset => {
      const presetRange = preset.getDateRange();
      return presetRange.startDate === value.startDate && presetRange.endDate === value.endDate;
    });
    
    if (matchingPreset) {
      setSelectedPreset(matchingPreset.value);
      setIsCustom(false);
    } else {
      setIsCustom(true);
      setSelectedPreset('custom');
    }
  }, [value]);

  const handlePresetChange = (presetValue: string) => {
    if (presetValue === 'custom') {
      setIsCustom(true);
      setSelectedPreset('custom');
      return;
    }

    const preset = DATE_PRESETS.find(p => p.value === presetValue);
    if (preset) {
      const range = preset.getDateRange();
      onChange(range);
      setSelectedPreset(presetValue);
      setIsCustom(false);
    }
  };

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      onChange({ startDate, endDate });
    }
  };

  const formatDateRange = () => {
    if (!value.startDate || !value.endDate) return 'Select date range';
    
    const start = new Date(value.startDate);
    const end = new Date(value.endDate);
    
    if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
      return format(start, 'MMM d, yyyy');
    }
    
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  };

  const getDisplayText = () => {
    // If it's a preset, show the preset label
    if (!isCustom && selectedPreset !== 'custom') {
      const preset = DATE_PRESETS.find(p => p.value === selectedPreset);
      return preset ? preset.label : 'Select range';
    }
    // If it's custom, show the formatted date range
    return formatDateRange();
  };

  return (
    <div className={`${className}`}>
      <div className="space-y-3">
        {/* Beautiful Date Range Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Date Range</label>
          </div>
          
          <Select value={selectedPreset} onValueChange={handlePresetChange}>
            <SelectTrigger className="min-w-[280px] bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 p-4 rounded-xl shadow-sm h-16">
              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <div className="font-medium text-gray-900 text-base">
                    {!isCustom && selectedPreset !== 'custom' 
                      ? DATE_PRESETS.find(p => p.value === selectedPreset)?.label || 'Select range'
                      : 'Custom Range'
                    }
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {formatDateRange()}
                  </div>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-500 ml-3" />
              </div>
            </SelectTrigger>
            
            <SelectContent className="w-80">
              {DATE_PRESETS.map((preset) => (
                <SelectItem key={preset.value} value={preset.value} className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{preset.label}</span>
                      <span className="text-xs text-gray-500">
                        {preset.getDateRange().startDate === preset.getDateRange().endDate 
                          ? format(new Date(preset.getDateRange().startDate), 'MMM d, yyyy')
                          : `${format(new Date(preset.getDateRange().startDate), 'MMM d')} - ${format(new Date(preset.getDateRange().endDate), 'MMM d, yyyy')}`
                        }
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
              <SelectItem value="custom" className="p-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Custom Range</span>
                    <span className="text-xs text-gray-500">Pick specific dates</span>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Inputs */}
        {isCustom && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  max={endDate || format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={startDate}
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Button
                onClick={handleCustomDateChange}
                size="sm"
                disabled={!startDate || !endDate}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Apply Range
              </Button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPreset('last30days');
                  handlePresetChange('last30days');
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { DATE_PRESETS }; 