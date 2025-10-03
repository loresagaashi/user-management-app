import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button, CardActions, CardHeader, Divider, Grid, Avatar, Link as MuiLink } from "@material-ui/core";
import { Email as EmailIcon, Phone as PhoneIcon, Language as LanguageIcon, Room as RoomIcon, Business as BusinessIcon } from "@material-ui/icons";
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
  const company = user.company
    ? typeof user.company === "string"
      ? { name: user.company }
      : user.company
    : null;
  const geo = address?.geo;

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("");

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <div className="mb-3">
        <Button variant="outlined" color="primary" onClick={() => navigate("/")}>Back</Button>
      </div>
      <Card>
        <CardHeader
          avatar={<Avatar aria-label="avatar">{getInitials(user.name)}</Avatar>}
          title={<Typography variant="h5">{user.name}</Typography>}
          subheader={user.username ? `@${user.username}` : null}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>Contact</Typography>
              {user.email && (
                <div className="d-flex align-items-center mb-1" style={{ gap: 8 }}>
                  <EmailIcon fontSize="small" color="action" />
                  <MuiLink href={`mailto:${user.email}`} style={{ wordBreak: "break-word" }}>{user.email}</MuiLink>
                </div>
              )}
              {user.phone && (
                <div className="d-flex align-items-center mb-1" style={{ gap: 8 }}>
                  <PhoneIcon fontSize="small" color="action" />
                  <MuiLink href={`tel:${user.phone}`} style={{ wordBreak: "break-word" }}>{user.phone}</MuiLink>
                </div>
              )}
              {user.website && (
                <div className="d-flex align-items-center mb-1" style={{ gap: 8 }}>
                  <LanguageIcon fontSize="small" color="action" />
                  <MuiLink href={`http://${user.website}`} target="_blank" rel="noreferrer" style={{ wordBreak: "break-word" }}>{user.website}</MuiLink>
                </div>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>Address</Typography>
              {address ? (
                <>
                  <div className="d-flex align-items-center mb-1" style={{ gap: 8 }}>
                    <RoomIcon fontSize="small" color="action" />
                    <Typography style={{ wordBreak: "break-word" }}>
                      {address.suite ? `${address.suite}, ` : ""}{address.street}, {address.city} {address.zipcode}
                    </Typography>
                  </div>
                  {geo?.lat && geo?.lng && (
                    <Typography variant="body2">
                      Coords: {geo.lat}, {geo.lng} — {" "}
                      <MuiLink
                        href={`https://www.google.com/maps?q=${encodeURIComponent(`${geo.lat},${geo.lng}`)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View on map
                      </MuiLink>
                    </Typography>
                  )}
                </>
              ) : (
                <Typography color="textSecondary">No address available</Typography>
              )}
            </Grid>

            {company && (
              <Grid item xs={12}>
                <Divider style={{ margin: "8px 0 12px" }} />
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>Company</Typography>
                <div className="d-flex align-items-center mb-1" style={{ gap: 8 }}>
                  <BusinessIcon fontSize="small" color="action" />
                  <Typography>{company.name}</Typography>
                </div>
                {company.catchPhrase && (
                  <Typography variant="body2" color="textSecondary">“{company.catchPhrase}”</Typography>
                )}
                {company.bs && (
                  <Typography variant="body2">Business: {company.bs}</Typography>
                )}
              </Grid>
            )}
          </Grid>
        </CardContent>
        <CardActions style={{ justifyContent: "flex-end" }}>
          <Button color="primary" onClick={() => navigate("/")}>Back to list</Button>
        </CardActions>
      </Card>
    </div>
  );
}

