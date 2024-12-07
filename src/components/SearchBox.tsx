import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useLazyGetListingsQuery } from "src/store/slices/listingsApiSlice";
import { Box, Paper, Popper, Typography, Alert } from "@mui/material";
import { Listing } from "src/types/Listing";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  display: "flex",
  alignItems: "center",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  cursor: "pointer",
  padding: theme.spacing(0, 1),
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "240px",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1),
    width: "100%",
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.complex,
      easing: theme.transitions.easing.easeIn,
    }),
  },
}));

const SearchResults = styled(Paper)(({ theme }) => ({
  backgroundColor: "#141414",
  color: "white",
  maxHeight: "400px",
  overflowY: "auto",
  width: "300px",
  zIndex: 1500,
}));

const SearchResultItem = styled(Box)<{ selected?: boolean }>(({ theme, selected }) => ({
  padding: theme.spacing(1, 2),
  cursor: "pointer",
  backgroundColor: selected ? "rgba(255, 255, 255, 0.1)" : "transparent",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
}));

export default function SearchBox() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();
  
  const [triggerSearch, { data: searchResults, isLoading, error }] = useLazyGetListingsQuery();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSelectedIndex(-1);
    if (term.length >= 2) {
      console.log('Triggering search with term:', term);
      triggerSearch({ 
        page: 1,
        limit: 10,
        title: term
      }).then(result => {
        console.log('Search result:', result);
        if (result.error) {
          console.error('Search error in response:', result.error);
        }
      }).catch(err => {
        console.error('Search error:', err);
      });
      setAnchorEl(searchInputRef.current || null);
    } else {
      setAnchorEl(null);
    }
  };

  const handleClickSearchIcon = () => {
    if (!isFocused) {
      searchInputRef.current?.focus();
    }
  };

  const handleResultClick = (listing: Listing) => {
    console.log('Selected listing:', listing);
    setAnchorEl(null);
    setSearchTerm("");
    navigate(`/listing/${listing.id}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!searchResults?.data?.length) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.data.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        if (selectedIndex >= 0 && searchResults.data[selectedIndex]) {
          handleResultClick(searchResults.data[selectedIndex]);
        }
        break;
      case "Escape":
        setAnchorEl(null);
        searchInputRef.current?.blur();
        break;
    }
  };

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  return (
    <>
      <Search
        sx={
          isFocused ? { border: "1px solid white", backgroundColor: "black" } : {}
        }
      >
        <SearchIconWrapper onClick={handleClickSearchIcon}>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          inputRef={searchInputRef}
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          inputProps={{
            "aria-label": "search",
            onFocus: () => {
              setIsFocused(true);
            },
            onBlur: () => {
              setTimeout(() => {
                setIsFocused(false);
                setAnchorEl(null);
                setSelectedIndex(-1);
              }, 200);
            },
          }}
        />
      </Search>
      <Popper
        open={Boolean(anchorEl) && searchTerm.length >= 2}
        anchorEl={anchorEl}
        placement="bottom-start"
      >
        <SearchResults elevation={3}>
          {error ? (
            <SearchResultItem>
              <Alert severity="error" sx={{ backgroundColor: 'transparent' }}>
                Error loading results
              </Alert>
            </SearchResultItem>
          ) : isLoading ? (
            <SearchResultItem>
              <Typography>Loading...</Typography>
            </SearchResultItem>
          ) : searchResults?.data?.length ? (
            searchResults.data.map((listing, index) => (
              <SearchResultItem
                key={listing.id}
                selected={index === selectedIndex}
                onClick={() => handleResultClick(listing)}
              >
                <Typography variant="subtitle1">{listing.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {listing.city}, {listing.state}
                </Typography>
              </SearchResultItem>
            ))
          ) : (
            <SearchResultItem>
              <Typography>No results found</Typography>
            </SearchResultItem>
          )}
        </SearchResults>
      </Popper>
    </>
  );
}
