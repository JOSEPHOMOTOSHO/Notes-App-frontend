import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import { Context } from "../UserContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios, { AxiosResponse } from "axios";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#EAEAEA",
  //   border: '1px solid #000',
  //   boxShadow: 0,
  p: 4,
};
interface det {
  title?: string;
  createdBy?: dat;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  tags?: [];
  folderId?: string;
  fileUpload?: [];
  softDelete?: boolean;
  collaboratorId?: [];
  body?: string;
}
interface dat {
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  avatar?: string;
  gender?: string;
  about?: string;
  location?: string;
}
export default function InviteModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setWarningMsg("");
  };
  const {
    noteLists,
    handleOnEdit,
    tabMemory,
    handleTabMemory,
    active,
    onEdit,
    collabs,
    handleCollabs,
  } = useContext(Context);
  const [email, setemail] = useState("");
  const [warningMessage, setWarningMsg] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  // useEffect(()=>{
  async function userEmail(event: SyntheticEvent) {
    event.preventDefault();
    let id = onEdit;
    let userDetails = window.localStorage.getItem("user")!;
    if (!email) {
      setShowWarning(true);
      setWarningMsg("Email is Required");
      //submit user details
    } else {
      const details = {
        email,
      };
      let apiRes: AxiosResponse<unknown, any>;
      try {
        apiRes = await axios.post(
          `https://notesxdapi.herokuapp.com/notes/invite/${id}`,
          details,
          {
            headers: {
              authorization: JSON.parse(userDetails).token,
            },
          }
        );
        let apiResult: { details: det } = apiRes.data as { details: det };
        const newCollab = apiResult.details.collaboratorId;
        handleCollabs!(newCollab!);
        setShowWarning(false);
        setWarningMsg("Collaborator Successfully Added");
        handleClose();
      } catch (err: any) {
        apiRes = err.response;
        console.log(apiRes, "12345");
        setShowWarning(true);
        setWarningMsg(err.response.data.message);
      } finally {
        // console.log(apiRes);
      }
    }
  }
  // },)
  return (
    <div>
      <span style={{ padding: "0 0 0 5px", color: "#32A05F" }}>
        <a onClick={() => handleOpen()}>Invite Collaborator</a>
      </span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CloseIcon style={{ float: "right" }} onClick={handleClose} />
          {showWarning ? (
            <h5
              style={{
                paddingTop: "10px",
                display: "flex",
                justifyContent: "center",
                color: "red",
                fontSize: "14px",
              }}
            >
              {warningMessage}
            </h5>
          ) : (
            <h5
              style={{
                paddingTop: "10px",
                display: "flex",
                justifyContent: "center",
                color: "#32A05F",
                fontSize: "14px",
              }}
            >
              {warningMessage}
            </h5>
          )}
          <form
            style={{ marginTop: "2%", fontFamily: "poppins" }}
            onSubmit={userEmail}
          >
            <TextField
              margin="normal"
              size="small"
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setemail(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#32A05F", float: "right" }}
              sx={{ mt: 3, mb: 2 }}
            >
              Invite
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
