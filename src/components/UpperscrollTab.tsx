import React, {
  useContext,
  SyntheticEvent,
  useEffect,
  useState,
  useRef,
  SetStateAction,
} from "react";
import { Context } from "../UserContext";
import { Box, Tab, Tabs, TextField, Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Dropdown from "./Dropdown";
import axios from "axios";
import Modals from "./Modals";
import InviteModal from "./InviteModal";
import SendMail from "./SendMail";
import CloseIcon from "@mui/icons-material/Close";
// import jwt from 'jsonwebtoken'
import jwt from "jsonwebtoken";
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
const UpperScroll = () => {
  let gen: det = { tags: [], collaboratorId: [] };
  let sub: dat = {};
  const [value, setValue] = useState(0);
  const [general, setGeneral] = useState(gen);
  const [subGeneral, setSubGeneral] = useState(sub);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const {
    noteLists,
    handleOnEdit,
    tabMemory,
    handleTabMemory,
    active,
    onEdit,
    tags,
    handleTags,
    collabs,
    handleCollabs,
  } = useContext(Context);
  const titleText = useRef(null);
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };
  let userDetails = window.localStorage.getItem("user")!;
  let id = onEdit;
  let data: det;
  let crtBy: dat;
  let tag: [];
  let collab: [];
  useEffect(() => {
    const getNotes = async () => {
      try {
        let logs = await axios({
          method: "GET",
          // withCredentials : true,
          headers: {
            authorization: JSON.parse(userDetails).token,
          },
          url: `https://notesxdapi.herokuapp.com/notes/${id}`,
        });
        console.log(logs.data, "123456789");
        data = logs.data as det;
        console.log(data.title, "data");
        setTitle(data.title!);
        setGeneral(data);
        tag = data.tags as [];
        handleTags!(tag);
        collab = data.collaboratorId as [];
        handleCollabs!(collab);
        crtBy = data.createdBy as dat;
        setSubGeneral(crtBy);
        let times = general.updatedAt!.split("T")[1].substring(0, 5);
        let hrs = general.updatedAt!.split("T")[1].substring(0, 2);
        let mins = general.updatedAt!.split("T")[1].substring(3, 5);
        if (parseInt(times.substring(0, 2)) > 12) {
          times = `${parseInt(hrs) - 12}:${mins}PM`;
        } else {
          times = `${hrs}:${mins}AM`;
        }
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
        setDate(
          `${months[parseInt(general.updatedAt!.split("-")[1]) - 1].substring(
            0,
            3
          )} ${general.updatedAt!.split("-")[2].substring(0, 2)}, ${
            general.updatedAt!.split("-")[0]
          } at`
        );
        setTime(`${times}`);
        //   console.log('title', lName)
      } catch (err) {
        console.log(err, "wertyuiert");
      }
    };
    getNotes();
  }, [onEdit]);
  function handleCloseTab(tabId: string) {
    let allHistory = window.localStorage.getItem("tabHistory");
    let parsedallHistory = JSON.parse(allHistory!);
    let filteredHistory = parsedallHistory.filter(
      (val: { id: string; title: string }) => val.id !== tabId
    );
    if (filteredHistory.length === 0) {
      handleOnEdit!("");
    } else {
      handleOnEdit!(filteredHistory[0]);
    }
    window.localStorage.setItem("tabHistory", JSON.stringify(filteredHistory));
    handleTabMemory!(filteredHistory);
  }
  // const handleTit = () =>{
  //   if(titleText.current!){
  //     // handleTitle!(titleText.value)
  //   }
  // }
  // handleTitle!(titles)
  // console.log(titles, title, "vvvvvv")
  // console.log(titleText!.current, "vvvvvv")
  // onChange={(e)=>handleTitle!(e.target.value)}
  return (
    <div
      style={{ display: "flex", flexDirection: "column", marginBottom: "1rem" }}
    >
      <div style={{ width: "inherit", height: "10%" }}>
        <Box
          sx={{ width: "55%", bgcolor: "#EAEAEA", position: "absolute" }}
          style={{ zIndex: 6 }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            indicatorColor="primary"
            scrollButtons={false}
            aria-label="scrollable prevent tabs example"
          >
            {tabMemory!
              .reverse()
              .filter(
                (thing, index, self) =>
                  index ===
                  self.findIndex(
                    (t) => t.id === thing.id && t.title === thing.title
                  )
              )
              .map((val) => {
                //   return ( <Tab label={val.title}   onClick={()=> {handleOnEdit!(val.id)}} />)
                return (
                  <Tab
                    label={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginRight: "9px", fontSize: "14px" }}>
                          {val.title.length < 10
                            ? val.title
                            : val.title.substring(0, 9) + "..."}{" "}
                        </div>
                        <CloseIcon
                          style={{ color: "#707070", alignItems: "center" }}
                          onClick={() => {
                            handleCloseTab(val.id);
                          }}
                        />
                      </div>
                    }
                    onClick={() => {
                      handleOnEdit!(val.id);
                    }}
                  />
                );
              })}
          </Tabs>
        </Box>
        <div
          style={{
            display: "flex",
            marginLeft: "690px",
            flexDirection: "row",
            marginTop: "5rem",
          }}
        >
          {/* <SendMail /> */}
          <Dropdown />
        </div>
      </div>
      <div
        style={{
          width: "inherit",
          height: "30%",
          overflow: "scroll",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          paddingLeft: "40px",
        }}
      >
        <div key={general.title} style={{ width: "95%", marginBottom: "1rem" }}>
          {/* <TextField ref={titleText}  key={general.updatedAt ? 'notLoadedYet' : 'loaded'} size="small" sx={{fontSize:'2.5rem'}} placeholder="Untitled" fullWidth  variant="standard"  defaultValue={title} onChange={(e)=>console.log(e.target.value, titleText!.current)}/> */}
          <TextField
            key={general.title ? "notLoadedYet" : "loaded"}
            size="small"
            onChange={(e) => setTitle(e.target.value)}
            sx={{ fontSize: "2.5rem" }}
            placeholder="Untitled"
            fullWidth
            variant="standard"
            defaultValue={general.title}
          />
        </div>
        <div style={{ padding: "15px 0", display: "flex" }}>
          <span
            style={{
              padding: "0 55px 0 0",
              color: "#707070",
              fontFamily: "poppins",
              fontSize: "12px",
            }}
          >
            Created by
          </span>
          <Avatar
            alt="Remy Sharp"
            src={subGeneral.avatar}
            sx={{ width: "25px", height: "25px" }}
          />
          <span
            style={{
              padding: "0 0 0 5px",
              fontSize: "13px",
              fontFamily: "poppins",
            }}
          >{`${subGeneral.firstName || ""} ${subGeneral.lastName || ""}`}</span>
        </div>
        <div style={{ padding: "0 0 15px 0", display: "flex" }}>
          <span
            style={{
              padding: "0 47px 0 0",
              display: "flex",
              fontFamily: "poppins",
              color: "#707070",
              fontSize: "12px",
            }}
          >
            Collaborator
          </span>
          {collabs!.length <= 1
            ? collabs!.map((el, index) => (
                <div key={index} style={{ display: "flex" }}>
                  <Avatar
                    sx={{ width: "25px", height: "25px" }}
                    alt="Remy Sharp"
                    src={el.avatar}
                  />
                  <span
                    style={{
                      padding: "0 0 0 5px",
                      fontSize: "13px",
                      fontFamily: "poppins",
                    }}
                  >{`${el.firstName} ${el.lastName}`}</span>
                </div>
              ))
            : collabs!.length > 1 && collabs!.length < 7
            ? collabs!.map((el, index) => (
                <div key={index} style={{ display: "flex" }}>
                  <Avatar
                    sx={{ width: "25px", height: "25px" }}
                    alt="Remy Sharp"
                    src={el.avatar}
                  />
                </div>
              ))
            : collabs!.slice(0, 6).map((el, index) => (
                <div key={index} style={{ display: "flex" }}>
                  <Avatar
                    sx={{ width: "25px", height: "25px" }}
                    alt="Remy Sharp"
                    src={el.avatar}
                  />
                  <span
                    style={{
                      padding: "0 0 0 5px",
                      fontSize: "13px",
                      fontFamily: "poppins",
                    }}
                  >{`+${general.collaboratorId!.length - 6}`}</span>
                </div>
              ))}
          <InviteModal />
        </div>
        <div style={{ padding: "0 0 15px 0" }}>
          <span
            style={{
              padding: "20px 46px 20px 0",
              color: "#707070",
              fontFamily: "poppins",
              fontSize: "12px",
            }}
          >
            Last Updated
          </span>
          <span
            style={{ fontFamily: "poppins", fontSize: "12px" }}
          >{`${date} ${time}`}</span>
        </div>
        <div
          style={{
            padding: "0 0 20px 0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              padding: "0 90px 0 0",
              color: "#707070",
              fontFamily: "poppins",
              fontSize: "12px",
            }}
          >
            Tags
          </span>
          <div style={{ display: "flex" }}>
            {tags!.length <= 5 ? (
              tags!.map((el: string, index) => (
                <div key={index}>
                  <Button
                    style={{
                      padding: "0 5px 0 0",
                      fontFamily: "poppins",
                      fontSize: "12px",
                      color: "#32A05F",
                      backgroundColor: "#15812c33",
                      marginRight: "7px",
                    }}
                    disabled
                  >{`#${el}`}</Button>
                </div>
              ))
            ) : (
              <>
                {tags!.slice(0, 5).map((el: string, index) => (
                  <div key={index}>
                    <Button
                      style={{
                        padding: "0 5px 0 0",
                        fontFamily: "poppins",
                        fontSize: "12px",
                        color: "#32A05F",
                        backgroundColor: "#15812c33",
                        marginRight: "7px",
                      }}
                      disabled
                    >{`#${el}`}</Button>
                  </div>
                ))}
                <span
                  style={{
                    padding: "0 5px 0 0",
                    fontFamily: "poppins",
                    fontSize: "12px",
                    marginRight: "5px",
                    color: "#707070",
                  }}
                >{`+${tags!.length - 5}`}</span>
              </>
            )}
          </div>
          <Modals tagx={tags} title={title} />
        </div>
        <div
          style={{ width: "97%", height: "1px", backgroundColor: "#231F20" }}
        />
      </div>
    </div>
  );
};
export default UpperScroll;
