import React from "react";
import { Paper, InputBase, IconButton } from "@material-ui/core";
import { Search, Clear } from "@material-ui/icons";

export default function SearchBar({ value, onChange, placeholder = "Search...", onClear }) {
  return (
    <Paper
      component="form"
      onSubmit={(e) => e.preventDefault()}
      style={{ display: "flex", alignItems: "center", padding: "2px 8px", width: 320 }}
      variant="outlined"
    >
      <IconButton size="small" aria-label="search">
        <Search />
      </IconButton>
      <InputBase
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ marginLeft: 8, flex: 1 }}
        inputProps={{ "aria-label": placeholder }}
      />
      {value ? (
        <IconButton size="small" aria-label="clear" onClick={onClear}>
          <Clear />
        </IconButton>
      ) : null}
    </Paper>
  );
}
