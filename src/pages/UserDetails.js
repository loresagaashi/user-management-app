import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button, CardActions } from "@material-ui/core";
import { fetchUsers } from "../users/fetchUser";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = useSelector((s) => s.users.status);
  const user = useSelector((s) => s.users.items.find((u) => String(u.id) === String(id)));

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <Typography>Loading...</Typography>;
  }

  if (!user) {
    return <Typography>User not found. Go back to <Button color="primary" component={Link} to="/">list</Button>.</Typography>;
  }

  const address = user.address;

  return (
    <div style={{ maxWidth: 640, margin: "40px auto" }}>
      <div className="mb-3">
        <Button variant="outlined" color="primary" onClick={() => navigate("/")}>Back</Button>
      </div>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>{user.name}</Typography>
          <Typography color="textSecondary">{user.email}</Typography>
          <Typography>Phone: {user.phone}</Typography>
          <Typography>Website: {user.website}</Typography>
          {address && (
            <Typography>
              Address: {address.suite}, {address.street}, {address.city} {address.zipcode}
            </Typography>
          )}
          {!address && user?.company && (
            <Typography>Company: {user.company?.name || user.company}</Typography>
          )}
        </CardContent>
        <CardActions style={{ justifyContent: "flex-end" }}>
          <Button color="primary" onClick={() => navigate("/")}>Back to list</Button>
        </CardActions>
      </Card>
    </div>
  );
}
