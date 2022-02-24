import React, { SyntheticEvent, useContext, useState } from "react";
import { Context } from "../UserContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import axios from "axios";
import { useHistory } from "react-router-dom";
import UpperScroll from "./UpperscrollTab";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 4,
};
export default function Modals(props: any) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const {
    noteLists,
    handleOnEdit,
    tabMemory,
    handleTabMemory,
    active,
    onEdit,
    tags,
    handleTags,
  } = useContext(Context);
  const handleClose = () => {
    setOpen(false);
    setWarningMsg("");
  };
  const [tag, setTag] = useState("");
  const [warningMessage, setWarningMsg] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const history = useHistory();
  async function userTags(event: SyntheticEvent) {
    event.preventDefault();
    let userDetails = window.localStorage.getItem("user")!;
    let id = onEdit;
    if (!tags) {
      setWarningMsg("Please input your tag");
      setShowWarning(true);
    } else {
      const details = {
        title: props.title,
        tags: [...props.tagx, tag],
      };

      let apiRes = null;
      console.log(details, "details");
      try {
        apiRes = await axios.put(
          `https://notesxdapi.herokuapp.com/notes/editnote/${id}`,
          details,
          {
            headers: {
              authorization: JSON.parse(userDetails).token,
            },
          }
        );
        const newTags: never[] = details.tags as never[];
        handleTags!(newTags);
        console.log(apiRes, "ssssssss");
        setShowWarning(false);
        setWarningMsg("Tag added Successfully");

        let history = window.localStorage.getItem("tabHistory");
        let parsedHistory = JSON.parse(history!);
        // parsedHistory.push({
        //     id:noteId,
        //     title:noteTitle,
        // })
        parsedHistory = parsedHistory.map(
          (val: { id: string; title: string }) => {
            if (val.id === id) {
              return {
                id: id,
                title: props.title,
              };
            }
            return val;
          }
        );
        parsedHistory[0] = {
          id: id,
          title: props.title,
        };
        handleTabMemory!(parsedHistory);
        window.localStorage.setItem(
          "tabHistory",
          JSON.stringify(parsedHistory)
        );

        handleClose();
      } catch (err: any) {
        apiRes = err.response;
        setShowWarning(true);
        setWarningMsg(err.response.data.message);
      } finally {
        console.log(apiRes);
      }
    }
  }
  return (
    <div>
      <Button
        sx={{
          color: "#32A05F",
          fontFamily: "poppins",
          textTransform: "capitalize",
          fontSize: "12px",
        }}
        onClick={handleOpen}
      >
        Add Tags
      </Button>
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
              {" "}
              {warningMessage}{" "}
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
            onSubmit={userTags}
          >
            <TextField
              margin="normal"
              size="small"
              fullWidth
              label="Add Tags"
              name="email"
              onChange={(e) => setTag(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#32A05F", float: "right" }}
              sx={{ mt: 3, mb: 2 }}
            >
              ADD
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
