import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUsers, updateUser } from "../users/fetchUser";
import { TextField, Button, Paper, Typography } from "@material-ui/core";

export default function EditUser() {
  const { id } = useParams();
  const status = useSelector((s) => s.users.status);
  const user = useSelector((s) => s.users.items.find((u) => String(u.id) === String(id)));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const [form, setForm] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    company: user?.company?.name || user?.company || "",
  }));

  const disabled = useMemo(() => !form.name || !form.email, [form]);

  if (status === "loading") {
    return <Typography>Loading...</Typography>;
  }

  if (!user) {
    return <Typography>User not found.</Typography>;
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const changes = { ...form, company: form.company ? { name: form.company } : undefined };
    dispatch(updateUser({ id: user.id, changes }));
    navigate("/");
  };

  return (
    <Paper style={{ padding: 16 }}>
      <form onSubmit={onSubmit} noValidate>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          fullWidth
          label="Company"
          margin="normal"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <div className="mt-3 d-flex gap-2">
          <Button type="submit" color="primary" variant="contained" disabled={disabled}>Save</Button>
          <Button onClick={() => navigate("/")}>Cancel</Button>
        </div>
      </form>
    </Paper>
  );
}
