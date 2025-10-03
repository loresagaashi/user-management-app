import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import axios from "axios";
import { loadLocalUsers, saveLocalUsers, loadDeletedIds, saveDeletedIds } from "../utils/storage";

const initialLocalUsersRaw = loadLocalUsers() || [];
const initialDeletedIds = loadDeletedIds();
const initialLocalUsers = initialLocalUsersRaw
  .map((u) => ({
    ...u,
    isLocal: true,
  }))
  .filter((u) => !initialDeletedIds.includes(String(u.id)));
const initialState = {
  items: initialLocalUsers,
  status: "idle",
  error: null,
  search: "",
  sort: { field: "none", direction: "asc" },
  deletedIds: initialDeletedIds,
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
        const newUser = {
          ...action.payload,
          isLocal: true,
        };
        if (!state.deletedIds.includes(String(newUser.id))) {
          state.items.unshift(newUser);
        }
        const locals = state.items.filter((u) => u.isLocal);
        saveLocalUsers(locals);
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
        if (state.items[idx]?.isLocal) {
          const locals = state.items.filter((u) => u.isLocal);
          saveLocalUsers(locals);
        }
      }
    },
    deleteUser(state, action) {
      const id = action.payload;
      const idStr = String(id);
      state.items = state.items.filter((u) => String(u.id) !== idStr);
      if (!state.deletedIds.includes(idStr)) {
        state.deletedIds.push(idStr);
        saveDeletedIds(state.deletedIds);
      }
      const locals = state.items.filter((u) => u.isLocal);
      saveLocalUsers(locals);
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
        const deleted = new Set(state.deletedIds.map(String));
        const localUsers = state.items.filter((u) => u.isLocal && !deleted.has(String(u.id)));
        const remote = (action.payload || [])
          .filter((ru) => !deleted.has(String(ru.id)))
          .filter((ru) => !localUsers.some((lu) => String(lu.id) === String(ru.id)));
        state.items = [...localUsers, ...remote];
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
  const q = (selectSearch(state) || "").toLowerCase();
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
