import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  SvgIcon,
} from "@material-ui/core";
import PlaylistAddSharpIcon from "@material-ui/icons/PlaylistAddSharp";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { database } from "../../firebase";
import { ROOT_FLUX } from "../../hooks/useFlux";
import { useSelector } from "react-redux";

export default function AddFluxButton({ type }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { uid } = useSelector(({ user }) => user.data);
  const { flux } = useSelector(({ fluxes }) => fluxes);

  function openDialog() {
    setOpen(true);
    setName("");
  }

  function closeDialog() {
    setOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    closeDialog();

    //construct path
    const path = [...flux.path];
    if (flux !== ROOT_FLUX) {
      path.push({ name: flux.name, id: flux.id });
    }

    try {
      await database.fluxes.add({
        name: name,
        balance: 0,
        totalBalance: 0,
        type: type,
        parentId: flux.id,
        path: path,
        userId: [uid],
        createdAt: new Date(),
      });
    } catch (error) {
      console.log(error);
    }
    //create flux in firebase
  }

  return (
    <>
      <Button onClick={openDialog}>
        <SvgIcon component={PlaylistAddSharpIcon} />
      </Button>
      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
          Flux
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText>Add a new flux</DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}