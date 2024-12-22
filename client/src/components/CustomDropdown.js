import React, { useState, useRef, useEffect } from "react";
import "../pages/Search.css";

const CustomDropdown = ({
  options = [],
  onSelect,
  dropdownHeader,
  multiple,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    if (multiple) {
      setSelectedOptions((prevSelected) => {
        const isSelected = prevSelected.includes(option.value);
        if (isSelected) {
          return prevSelected.filter((value) => value !== option.value);
        } else {
          return [...prevSelected, option.value];
        }
      });
      onSelect(option);
    } else {
      setSelectedOptions((prevSelected) => {
        const isSelected = prevSelected.includes(option.value);
        if (isSelected) {
          return prevSelected.filter((value) => value !== option.value);
        } else {
          return [option.value];
        }
      });
      onSelect(option);
    }
  };

  const generateDropdownHeader = () => {
    if (selectedOptions.length > 0) {
      const labels = selectedOptions
        .slice(0, 3)
        .map(
          (value) => options.find((option) => option.value === value)?.label
        );
      return labels.join(", ") + (selectedOptions.length > 3 ? ", ..." : "");
    }
    return dropdownHeader;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      className="custom-dropdown"
      ref={dropdownRef}
      onMouseEnter={toggleDropdown}
      onMouseLeave={toggleDropdown}
    >
      <div className="dropdown-header">
        {generateDropdownHeader()}
        {}
      </div>
      {isOpen && (
        <div className="dropdown-list">
          <div className="dropdown-list-scroll">
            {options.map((option) => (
              <div
                key={option.value}
                className={`dropdown-option ${
                  selectedOptions.includes(option.value) ? "selected" : ""
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
