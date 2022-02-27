import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Context } from "../UserContext";
import copy from "copy-to-clipboard";
import { styled } from "@mui/material/styles";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function LongMenu() {
  const {
    handleOnEdit,
    handleTabMemory,
    onEdit,
    handleSetNoteLists,
    noteLists,
  } = useContext(Context);
  const [opene, setOpen] = useState(false);
  const [msg, setMsg] = useState("");

  let userDetails = window.localStorage.getItem("user")!;
  const actions = [
    { icon: <FileCopyIcon onClick={() => handleCopy()} />, name: "Copy" },
  ];

  const [act, setAct] = useState(actions);

  useEffect(() => {
    axios
      .get(`https://notesxdapi.herokuapp.com/notes/${onEdit}`, {
        headers: {
          authorization: JSON.parse(userDetails).token,
        },
      })
      .then((res: any) => {
        console.log(res.data.softDelete);
        if (!res.data.softDelete) {
          actions[1] = {
            icon: <DeleteIcon onClick={() => handleDelete()} />,
            name: "Delete",
          };

          setAct(actions);
        } else {
          actions[1] = {
            icon: <DeleteForeverIcon onClick={() => handlePermDelete()} />,
            name: "Delete Permenently",
          };
          actions[2] = {
            icon: <RestoreFromTrashIcon onClick={() => handleRestore()} />,
            name: "Restore",
          };
          setAct(actions);
        }
        console.log(actions, "ytfhv");
      });
  }, [onEdit]);

  const handleDelete = () => {
    axios
      .get(`https://notesxdapi.herokuapp.com/notes/delete/${onEdit}`, {
        headers: {
          authorization: JSON.parse(userDetails).token,
        },
      })
      .then((res) => setMsg("Note Deleted Sucessfully!"))
      .catch((res) => setMsg("Note Already deleted"));
    let allHistory = window.localStorage.getItem("tabHistory");
    let parsedallHistory = JSON.parse(allHistory!);
    let filteredHistory = parsedallHistory.filter(
      (val: { id: string; title: string }) => val.id !== onEdit
    );
    if (filteredHistory.length === 0) {
      handleOnEdit!("");
    } else {
      handleOnEdit!(filteredHistory[0]);
    }
    window.localStorage.setItem("tabHistory", JSON.stringify(filteredHistory));
    handleTabMemory!(filteredHistory);
    let newList = noteLists?.filter((val) => val.id !== onEdit);
    console.log(newList);
    handleSetNoteLists!(newList!);
    setOpen(true);
  };

  const handleRestore = () => {
    axios
      .get(`https://notesxdapi.herokuapp.com/notes/restoredelete/${onEdit}`, {
        headers: {
          authorization: JSON.parse(userDetails).token,
        },
      })
      .then((res) => setMsg("Note Restored Succesfully!"))
      .catch((res) => setMsg("Note was not deleted"));
    let allHistory = window.localStorage.getItem("tabHistory");
    let parsedallHistory = JSON.parse(allHistory!);
    let filteredHistory = parsedallHistory.filter(
      (val: { id: string; title: string }) => val.id !== onEdit
    );
    if (filteredHistory.length === 0) {
      handleOnEdit!("");
    } else {
      handleOnEdit!(filteredHistory[0]);
    }
    window.localStorage.setItem("tabHistory", JSON.stringify(filteredHistory));
    handleTabMemory!(filteredHistory);
    let newList = noteLists?.filter((val) => val.id !== onEdit);
    console.log(newList);
    handleSetNoteLists!(newList!);
    setOpen(true);
  };
  const handlePermDelete = () => {
    axios
      .get(`https://notesxdapi.herokuapp.com/notes/permanentdelete/${onEdit}`, {
        headers: {
          authorization: JSON.parse(userDetails).token,
        },
      })
      .then((res) => setMsg("Note Deleted Permanently!"))
      .catch((res) => setMsg("Note has to deleted first"));
    let newList = noteLists?.filter((val) => val.id !== onEdit);
    console.log(newList);
    handleSetNoteLists!(newList!);
    setOpen(true);
  };
  const handleCopy = () => {
    copy(`http://xdnotes.herokuapp.com/notes/${onEdit}`);
    setMsg("Link Copied sucessfully!");
    setOpen(true);
  };
  const handleClosed = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    size: "small",
    sx: { bgcolor: "black" },
    position: "absolute",
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(15),
      right: theme.spacing(2),
      // left: theme.spacing(2),
    },
  }));

  console.log(actions, "jhvmh");

  return (
    <div>
      <Snackbar open={opene} autoHideDuration={1700} onClose={handleClosed}>
        <Alert onClose={handleClosed} severity="success" sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>
      <StyledSpeedDial
        ariaLabel="SpeedDial playground example"
        icon={<SpeedDialIcon />}
        direction={"down"}
        FabProps={{ size: "small", color: "inherit" }}
      >
        {act.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </StyledSpeedDial>
    </div>
  );
}
