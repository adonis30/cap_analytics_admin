"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/Popover";
import { Input } from "../components/ui/Input";
import { XCircle, ChevronDown, PlusCircle } from "lucide-react";
import Select, { components } from "react-select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";

const CustomOption = (props) => (
  <components.Option {...props}>
    <input type="checkbox" checked={props.isSelected} readOnly className="mr-2" />
    {props.label}
  </components.Option>
);

const MultiSelect = ({
  options,
  onValueChange,
  defaultValue = [],
  placeholder = "Select options",
  maxCount = 3,
  modalPopover = false,
  className,
  onCreateNewItem,
  createCategory,
  createFundingType,
  createFundingRound,
  createFundingInstrument,
  ...props
}) => {
  const [selectedValues, setSelectedValues] = useState(
    options.filter((option) => defaultValue.includes(option.value))
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const triggerRef = useRef(null);
  const [triggerWidth, setTriggerWidth] = useState(0);

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [isPopoverOpen]);

  const handleSelectChange = (selectedOptions) => {
    setSelectedValues(selectedOptions);
    onValueChange(selectedOptions.map((option) => option.value));
  };

  const handleClear = () => {
    setSelectedValues([]);
    onValueChange([]);
  };

  return (
    <div>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            {...props}
            onClick={() => setIsPopoverOpen((prev) => !prev)}
            className={`flex w-full p-2 rounded-lg border border-gray-300 shadow-md min-h-10 items-center justify-between hover:bg-gray-50 ${className}`}
          >
            {selectedValues.length > 0 ? (
              <div className="flex flex-wrap items-center select-none">
                {selectedValues.slice(0, maxCount).map((option) => (
                  <Badge key={option.value} className="flex items-center mr-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {option.label}
                    <XCircle className="ml-2 h-4 w-4 cursor-pointer text-red-600" onClick={() => handleSelectChange(selectedValues.filter((v) => v.value !== option.value))} />
                  </Badge>
                ))}
                {selectedValues.length > maxCount && (
                  <Badge className="flex items-center bg-transparent text-gray-600 border-gray-300 px-2 py-1 rounded-full">
                    {`+ ${selectedValues.length - maxCount} more`}
                  </Badge>
                )}
              </div>
            ) : (
              <span className="ml-2 text-gray-400">{placeholder}</span>
            )}
            <ChevronDown className="h-4 mx-2 cursor-pointer text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-4 bg-white border border-gray-200 shadow-lg rounded-lg" style={{ width: triggerWidth }}>
          <Select
            isMulti
            value={selectedValues}
            onChange={handleSelectChange}
            options={options}
            placeholder={placeholder}
            className="react-select-container"
            classNamePrefix="react-select"
            components={{ MultiValue: () => null, Option: CustomOption }}
          />
          <div className="flex items-center justify-between mt-4">
            <Button variant="secondary" size="sm" onClick={handleClear} className="h-9 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center">
              <XCircle className="mr-2 h-4 w-4" /> Clear
            </Button>
            {(onCreateNewItem || createCategory || createFundingType || createFundingInstrument || createFundingRound) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center px-4 py-2">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add new item
                  </Button>
                </AlertDialogTrigger>
              </AlertDialog>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MultiSelect;
