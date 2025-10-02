import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  search: "",
  sort: { field: "none", direction: "asc" },
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const { data } = await axios.get("https://jsonplaceholder.typicode.com/users");
  return data;
});

const fetchUser = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    addLocalUser: {
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
      prepare(user) {
        return { payload: { id: nanoid(), ...user } };
      },
    },
    updateUser(state, action) {
      const { id, changes } = action.payload;
      const idx = state.items.findIndex((u) => String(u.id) === String(id));
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...changes };
      }
    },
    deleteUser(state, action) {
      const id = action.payload;
      state.items = state.items.filter((u) => String(u.id) !== String(id));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setSearch, setSort, addLocalUser, updateUser, deleteUser } = fetchUser.actions;

export const selectUsersRaw = (state) => state.users.items;
export const selectSearch = (state) => state.users.search;
export const selectSort = (state) => state.users.sort;

export const selectUsersFilteredSorted = (state) => {
  const q = selectSearch(state).toLowerCase();
  const sort = selectSort(state);
  const users = selectUsersRaw(state).filter((u) => {
    const name = (u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });
  const dir = sort.direction === "asc" ? 1 : -1;
  const field = sort.field;
  if (field === "none") {
    return users;
  }
  const getFieldValue = (obj) => {
    if (field === "company") {
      const c = obj.company;
      if (!c) return "";
      return (typeof c === "string" ? c : c.name || "").toString().toLowerCase();
    }
    return (obj?.[field] || "").toString().toLowerCase();
  };
  users.sort((a, b) => {
    const av = getFieldValue(a);
    const bv = getFieldValue(b);
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
  return users;
};

export default fetchUser.reducer;
