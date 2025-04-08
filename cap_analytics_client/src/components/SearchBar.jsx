import { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";

const SearchBar = ({ onTextChange, onSearch }) => {
  const [query, setQuery] = useState("");

  // Debounce the text change function to optimize performance
  const debouncedTextChange = debounce((value) => {
    if (onTextChange) {
      onTextChange(value);
    }
  }, 300);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedTextChange(value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search..."
      value={query}
      onChange={handleChange}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon
              onClick={handleSearch}
              sx={{
                cursor: "pointer",
                color: "gray",
                transition: "color 0.3s",
                "&:hover": { color: "black" },
              }}
            />
          </InputAdornment>
        ),
      }}
      sx={{
        borderRadius: "8px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          "& fieldset": { borderColor: "transparent" },
          "&:hover fieldset": { borderColor: "#bdbdbd" },
          "&.Mui-focused fieldset": { borderColor: "#1976d2" },
        },
      }}
    />
  );
};

export default SearchBar;
