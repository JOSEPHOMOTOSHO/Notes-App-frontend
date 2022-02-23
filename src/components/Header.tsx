import { useContext, useState, useEffect } from "react";
import { Context } from "../UserContext";
import { makeStyles } from "@mui/styles";
import { styled, alpha } from "@mui/material/styles";
import "@fontsource/noto-sans";
import "@fontsource/poppins";
import Badge from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
// import React from 'react';
const useStyles = makeStyles({
  headerWrapper: {
    // width: "100%",
    // position:"fixed",
    // top: 0,
    // zIndex: 2,
    background: "#F8F8F8",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "62px",
  },
  logo: {
    marginLeft: "55px",
    textTransform: "uppercase",
    color: "#32A05F",
    fontFamily: "poppins",
    fontSize: "18px",
    letterSpacing: "1.5px",
  },
  xd: {
    textTransform: "uppercase",
    color: "black",
  },
  headerSearch: {},
  read: {
    backgroundColor: "#ebebeb",
  },
  search: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: "40px",
  },
});
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: "white",
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "342px !important",
    height: "25px !important",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
interface userdet {
  firstName: string;
  lastName: string;
  email: string;
  about: string;
  location: string;
  id: string;
  gender: string;
  avatar: string;
}
interface NotesDetails {
  _id: string;
  id: string;
  updatedAt: string;
  title: string;
  body: string;
  tags: string[];
}
const tname = "notes";
const Header: React.FC = () => {
  let userDetails = window.localStorage.getItem("user")!;
  let Det: userdet = JSON.parse(userDetails).user;
  const [notifications, setNotification] = useState("0");
  const [searchInput, setSearchInput] = useState("");
  const [opened, setOpened] = useState("");
  const [notificationArray, setNotificationArray] = useState([]);
  const { noteLists, handleSetNoteLists, active } = useContext(Context);
  const [info, setInfo] = useState([]);
  useEffect(() => {
    const userDetails = window.localStorage.getItem("user") as any;
    const { user } = JSON.parse(userDetails as any);
    const userId = user._id;
    const { token } = JSON.parse(userDetails as any); //typings
    axios
      .post(
        "https://notesxdapi.herokuapp.com/notes/search",
        { sort: searchInput },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res: any) => {
        //verify typings
        console.log("jy");
        console.log(res.data);
        if (res.data.message) {
          setInfo([]);
        }
        let rees = res.data.filter((obj: any) => obj.createdBy === userId);
        console.log(rees);
        console.log(res.data.message);
        setInfo(rees);
        let months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        let ret = info.map((val: NotesDetails) => {
          let fg: string = val.updatedAt;
          return {
            id: val._id,
            date: `${months[parseInt(fg.split("-")[1]) - 1]
              .substring(0, 3)
              .toUpperCase()} ${fg.split("-")[2].substring(0, 2)}`,
            title: val.title,
            body: val.body,
            tags: val.tags,
          };
        });
        handleSetNoteLists!(ret);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [searchInput]);

  const openNotification = (id: string) => {
    axios
      .get(`https://notesxdapi.herokuapp.com/notes/getNot/${id}`, {
        headers: {
          authorization: JSON.parse(userDetails).token,
        },
      })
      .then((res) => console.log(res));
  };
  const searchItem = (searchValue: string) => {
    setSearchInput(searchValue);
    if (searchInput !== "") {
      const filteredData = info.filter((item: any) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });
    } else {
      // setFilteredResults([])
      console.log(info);
      // handleSetNoteLists!(info)
    }
  };
  useEffect(() => {
    const getFolders = async () => {
      // let newId:{token?:string,id?:string} = {...Id}
      // let tokens = newId.token
      let logs = await axios({
        method: "GET",
        // withCredentials : true,
        headers: {
          authorization: JSON.parse(userDetails).token,
        },
        url: "https://notesxdapi.herokuapp.com/notes/getNotification",
      });
      console.log(logs.data, "12");
      let data;
      data = "0";
      if (Array.isArray(logs.data)) {
        data = logs.data.length as number;
      }

      let notificationArr: { _id: string; content: string; opened: boolean }[] =
        logs.data as { _id: string; content: string; opened: boolean }[];
      console.log(notificationArr);
      let filteredLogs: any = Array.isArray(notificationArr)
        ? notificationArr?.filter(
            (val: { opened: boolean }) => val.opened === false
          )
        : [];
      let filteredLogsNum = filteredLogs.length.toString();
      setNotification(filteredLogsNum);
      console.log(notifications);
      setNotificationArray(filteredLogs.reverse());
    };
    getFolders();
  }, []);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //notifications
  const [text, setText] = useState(false);
  const showText = () => {
    setText(true);
  };
  const hideText = () => {
    setText(false);
  };
  return (
    <>
      <div className={classes.headerWrapper}>
        <h3 className={classes.logo}>
          {tname}
          <span className={classes.xd}>.xd</span>
        </h3>
        <div className={classes.search}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onChange={(e) => searchItem(e.target.value)}
              placeholder="SEARCH"
              inputProps={{ poppins: "search" }}
            />
          </Search>
          <Tooltip title="Notifications">
            <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
              <Badge badgeContent={notifications} color="error">
                <NotificationsNoneIcon color="action" sx={{ fontSize: 30 }} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {notificationArray.map(
              (val: { _id: string; content: string; opened: boolean }) => {
                return (
                  <Accordion
                    style={
                      val.opened
                        ? { width: "20rem", backgroundColor: "#ebebeb" }
                        : { width: "20rem" }
                    }
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography
                        onClick={() => {
                          openNotification(val._id);
                        }}
                      >
                        {val.content.substring(0, 32)}...
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{val.content}</Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              }
            )}
          </Menu>
        </div>
      </div>
    </>
  );
};
export default Header;
