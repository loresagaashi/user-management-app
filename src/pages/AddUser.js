import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addLocalUser, setSort } from "../users/fetchUser";
import { isValidEmail } from "../utils/Utils";
import { TextField, Button, Paper } from "@material-ui/core";

export default function AddUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [touched, setTouched] = useState({});

  const onSubmit = (e) => {
    e.preventDefault();
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setTouched({ name: true, email: true });
      return;
    }
    const payload = {
      ...form,
      company: form.company ? { name: form.company } : undefined,
    };
    dispatch(addLocalUser(payload));
    dispatch(setSort({ field: "none", direction: "asc" }));
    navigate("/");
  };

  const validate = (values) => {
    const errs = {};
    if (!values.name) errs.name = "Name is required";
    if (!values.email) {
      errs.email = "Email is required";
    } else if (!isValidEmail(values.email)) {
      errs.email = "Enter a valid email";
    }
    return errs;
  };

  const errors = validate(form);

  return (
    <Paper style={{ padding: 16 }}>
      <form onSubmit={onSubmit} noValidate>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          onBlur={() => setTouched({ ...touched, name: true })}
        />
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
          onBlur={() => setTouched({ ...touched, email: true })}
        />
        <TextField
          fullWidth
          label="Company (optional)"
          margin="normal"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <div className="mt-3 d-flex gap-2">
          <Button type="submit" color="primary" variant="contained">Add</Button>
          <Button onClick={() => navigate("/")}>Cancel</Button>
        </div>
      </form>
    </Paper>
  );
}
