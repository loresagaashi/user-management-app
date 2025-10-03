import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchUsers,
  selectUsersFilteredSorted,
  selectSearch,
  selectSort,
  setSearch,
  setSort,
  deleteUser,
  addLocalUser,
  updateUser,
} from "../users/fetchUser.js";
import { Typography, Button, TextField, TableRow, TableCell, IconButton, TablePagination, Paper } from "@material-ui/core";
import { Done as DoneIcon, Close as CloseIcon } from "@material-ui/icons";
import SearchBar from "../components/SearchBar.js";
import BasicTable from "../components/BasicTable.js";
import ConfirmDialog from "../components/ConfirmDialog.js";

export default function UsersList() {
  const dispatch = useDispatch();
  const users = useSelector(selectUsersFilteredSorted);
  const search = useSelector(selectSearch);
  const sort = useSelector(selectSort);
  const status = useSelector((s) => s.users.status);
  const error = useSelector((s) => s.users.error);

  const [addForm, setAddForm] = useState({ name: "", email: "", company: "" });
  const [addTouched, setAddTouched] = useState({});
  const [adding, setAdding] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", company: "" });
  const [editTouched, setEditTouched] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setPage(0);
  }, [search, sort]);

  useEffect(() => {
    if (status === "idle") dispatch(fetchUsers());
  }, [dispatch, status]);

  const columns = [
    {
      title: "Name",
      field: "name",
      sortable: true,
      render: (row) =>
        editingId === row.id ? (
          <TextField
            size="small"
            variant="standard"
            value={editForm.name}
            placeholder="Name"
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            onBlur={() => setEditTouched({ ...editTouched, name: true })}
            error={editTouched.name && !editForm.name}
          />
        ) : (
          row.name
        ),
    },
    {
      title: "Email",
      field: "email",
      sortable: true,
      render: (row) =>
        editingId === row.id ? (
          <TextField
            size="small"
            variant="standard"
            value={editForm.email}
            placeholder="Email"
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            onBlur={() => setEditTouched({ ...editTouched, email: true })}
            error={editTouched.email && !editForm.email}
          />
        ) : (
          row.email
        ),
    },
    {
      title: "Company",
      field: "company.name",
      sortable: true,
      render: (row) =>
        editingId === row.id ? (
          <TextField
            size="small"
            variant="standard"
            value={editForm.company}
            placeholder="Company"
            onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
          />
        ) : (
          row?.company?.name || row?.company || ""
        ),
    },
    {
      title: "Actions",
      field: "_actions",
      render: (row) => {
        if (editingId === row.id) {
          const onSave = () => {
            const hasErrors = !editForm.name || !editForm.email;
            if (hasErrors) {
              setEditTouched({ name: true, email: true });
              return;
            }
            const changes = {
              name: editForm.name,
              email: editForm.email,
              company: editForm.company ? { name: editForm.company } : undefined,
            };
            dispatch(updateUser({ id: row.id, changes }));
            setEditingId(null);
            setEditForm({ name: "", email: "", company: "" });
            setEditTouched({});
          };
          const onCancel = () => {
            setEditingId(null);
            setEditForm({ name: "", email: "", company: "" });
            setEditTouched({});
          };
          return (
            <div>
              <IconButton color="primary" aria-label="done" onClick={onSave}>
                <DoneIcon />
              </IconButton>
              <IconButton aria-label="cancel" onClick={onCancel}>
                <CloseIcon />
              </IconButton>
            </div>
          );
        }
        return (
          <div className="d-flex gap-2">
            <Button size="small" color="primary" component={Link} to={`/users/${row.id}`}>
              Details
            </Button>
            <Button
              size="small"
              color="default"
              onClick={() => {
                // Enter edit mode with current row values
                setAdding(false);
                setEditingId(row.id);
                setEditForm({
                  name: row.name || "",
                  email: row.email || "",
                  company: row?.company?.name || row?.company || "",
                });
                setEditTouched({});
              }}
            >
              Edit
            </Button>
            <Button size="small" color="secondary" onClick={() => setSelectedUser(row)}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const handleRequestSort = (field) => {
    const mappedField = field === "company.name" ? "company" : field;
    const nextDir = sort.field === mappedField && sort.direction === "asc" ? "desc" : "asc";
    dispatch(setSort({ field: mappedField, direction: nextDir }));
  };

  const currentSortFieldForUI = sort.field === "company" ? "company.name" : sort.field;

  const pagedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <Typography variant="h5" style={{ padding: "8px 0" }}>Users</Typography>
      <div className="d-flex flex-wrap gap-2 mb-3 align-items-end">
        <SearchBar
          placeholder="Search by name or email"
          value={search}
          onChange={(val) => dispatch(setSearch(val))}
          onClear={() => dispatch(setSearch(""))}
        />
        <Button variant="contained" color="primary" size="small" style={{ marginLeft: 12 }} onClick={() => setAdding(true)}>
          Add
        </Button>
      </div>

      {status === "loading" && <Typography>Loading...</Typography>}
      {status === "failed" && <Typography color="error">{error}</Typography>}
      <div style={{ height: 500, maxWidth: 960, margin: "0 auto" }}>
        <BasicTable
          data={pagedUsers}
          columns={columns}
          tableContainerProps={{ style: { height: "100%" }, component: Paper, elevation: 1 }}
          rowsCellProps={{}}
          sortField={currentSortFieldForUI}
          sortDirection={sort.direction}
          onRequestSort={handleRequestSort}
          renderPrependRow={() => {
            if (!adding) return null;
            const errors = {
              name: !addForm.name ? "Required" : "",
              email: !addForm.email ? "Required" : "",
            };
            const onSubmitInline = (e) => {
              e && e.preventDefault();
              if (errors.name || errors.email) {
                setAddTouched({ name: true, email: true });
                return;
              }
              const payload = {
                name: addForm.name,
                email: addForm.email,
                company: addForm.company ? { name: addForm.company } : undefined,
              };
              dispatch(addLocalUser(payload));
              dispatch(setSort({ field: "none", direction: "asc" }));
              setAddForm({ name: "", email: "", company: "" });
              setAddTouched({});
              setAdding(false);
            };
            const onCancelInline = () => {
              setAddForm({ name: "", email: "", company: "" });
              setAddTouched({});
              setAdding(false);
            };
            return (
              <TableRow>
                <TableCell>
                  <form onSubmit={onSubmitInline}>
                    <TextField
                      size="small"
                      variant="standard"
                      placeholder="Name"
                      value={addForm.name}
                      onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                      onBlur={() => setAddTouched({ ...addTouched, name: true })}
                      error={addTouched.name && Boolean(errors.name)}
                    />
                  </form>
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    variant="standard"
                    placeholder="Email"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    onBlur={() => setAddTouched({ ...addTouched, email: true })}
                    error={addTouched.email && Boolean(errors.email)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    variant="standard"
                    placeholder="Company"
                    value={addForm.company}
                    onChange={(e) => setAddForm({ ...addForm, company: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={onSubmitInline} aria-label="done">
                    <DoneIcon />
                  </IconButton>
                  <IconButton onClick={onCancelInline} aria-label="cancel">
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          }}
        />
      </div>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <TablePagination
          component="div"
          count={users.length}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </div>
      <ConfirmDialog
        open={Boolean(selectedUser)}
        title={"Confirm Delete"}
        content={selectedUser ? `Delete user "${selectedUser.name}"?` : ""}
        confirmText="Delete"
        onConfirm={() => {
          if (selectedUser) {
            dispatch(deleteUser(selectedUser.id));
          }
          setSelectedUser(null);
        }}
        onCancel={() => setSelectedUser(null)}
      />
    </div>
  );
}
