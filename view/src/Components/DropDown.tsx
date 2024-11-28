import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import format_feature from "../utils/formatFeatures";

interface SingleLevelDropdownMenuProps {
  buttonLabel: string;
  titles: string[];
  setTitle: (title: string) => void;
}

export const SingleLevelDropdownMenu = ({
  buttonLabel,
  titles,
  setTitle,
}: SingleLevelDropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex items-center justify-between px-2 py-1 rounded-lg bg-orange-200 text-white font-medium text-sm shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-150 ease-in-out"
        onClick={handleToggle}
      >
        {buttonLabel}
        <span className="ml-2">{open ? <FaChevronUp /> : <FaChevronDown />}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-full max-w-[200px]">
          <ul className="w-full max-h-48 overflow-y-auto rounded-md shadow-lg bg-white border border-gray-200 p-2">
            {titles.map((title, index) => (
              <li
                key={index}
                className="relative flex items-center gap-2 py-2 text-sm text-gray-700 rounded-md hover:bg-orange-100 cursor-pointer transition-colors duration-150"
                onClick={() => {
                  setTitle(title);
                  setOpen(false);
                }}
              >
                {format_feature(title)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
