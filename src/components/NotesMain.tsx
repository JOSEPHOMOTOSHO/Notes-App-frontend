import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { format, render, cancel, register } from "timeago.js";
import { makeStyles } from "@mui/styles";
import MainHeader from "./MainHeader";
import Badge from "@mui/material/Badge";
import axios from "axios";
import { Markup } from "interweave";
import Avatar from "@mui/material/Avatar";
import "@fontsource/noto-sans";
import "@fontsource/poppins";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ReplyIcon from "@mui/icons-material/Reply";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { height } from "@mui/system";
interface det {
  title?: string;
  createdBy?: dat;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  likes?: string[];
  tags?: [];
  folderId?: string;
  fileUpload?: [];
  softDelete?: boolean;
  collaboratorId?: [];
  body?: string;
  comment?: Comm[];
}
interface Comm {
  _id?: string;
  id?: string;
  comment?: string;
  commenter?: dat;
  createdAt?: string;
  updatedAt?: string;
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
interface CommentArr {
  img?: string;
  name?: string;
  title?: string;
  date?: string;
  read?: string;
}
const useStyles = makeStyles({
  wrapper: {
    position: "relative",
  },
  notes_container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    margin: "3rem auto",
    marginBottom: "10rem",
  },
  notes_header: {
    lineHeight: "40px",
  },
  notes_subheader: {
    lineHeight: "30px",
  },
  user: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // width:'390px'
  },
  comments: {
    display: "flex",
    alignItems: "center",
    marginLeft: "10rem",
  },
  text_image: {},
  main_text: {},
  text_footer: {
    background: "#32A05F",
    height: "10vh",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    top: "90%",
    width: "100%",
  },
  logo: {
    marginLeft: "55px",
    textTransform: "uppercase",
    color: "white",
    fontFamily: "poppins",
    fontSize: "20px",
    letterSpacing: "1.5px",
    cursor: "pointer",
    // position:'absolute',
    // bottom:'0px',
  },
  xd: {
    textTransform: "uppercase",
    color: "black",
    cursor: "pointer",
  },
  footer_nav: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "1rem",
  },
  sidebarModal: {
    position: "fixed",
    top: "0",
    left: "0%",
    background: "rgba(0,0,0,0.5)",
    width: "100%",
    zIndex: 150,
    height: "100vh",
  },
  hideSidebar: {
    display: "none",
  },
  sideContain: {
    width: "25%",
    position: "absolute",
    left: "75%",
    height: "100vh",
    overflow: "scroll",
    background: "white",
  },
  sidebarHeader: {
    marginTop: "3rem",
    marginLeft: "2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sidebar_nav: {
    marginTop: "3rem",
    marginLeft: "1.5rem",
    display: "flex",
    alignItems: "center",
    borderBottom: "0.5px solid grey",
  },
  comment_card: {
    borderBottom: "0.2px solid grey",
  },
  details: {},
  userInfo: {
    display: "flex",
    alignItems: "center",
    marginLeft: "1rem",
    marginTop: "1rem",
  },
  reply: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginRight: "1rem",
  },
});
const details = [
  {
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWVuJTIwcG9ydHJhaXR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    name: "Blake shelton",
    title:
      "My first ride to the moon, it is a rhapsody of adventures,it is a rhapsody of adventures,it is a rhapsody of adventures,...",
    date: "Oct 15",
    read: "3 days ago",
  },
  {
    img: "https://i.pinimg.com/564x/1f/61/67/1f61674487536e82d188cc8910040d1e.jpg",
    name: "Elton John",
    title:
      "Node js: antagonizing asynchronousity in javascript?? : learning Ajax XHR",
    date: "May 12",
    read: "6 days ago",
  },
  {
    img: "https://i.pinimg.com/564x/8f/ef/d8/8fefd8952c5406016e1389e2d0beb788.jpg",
    name: "Zara larson",
    title:
      "Node js: antagonizing asynchronousity in javascript?? : learning Ajax XHR",
    date: "Sep 12",
    read: "40 minutes ago",
  },
  {
    img: "https://i.pinimg.com/564x/38/46/cc/3846cc646b917d000845a5a81cf92cfa.jpg",
    name: "Mary Jane",
    title:
      "Developmennt journey at decagon, flipped learning and fast paced execution",
    date: "Feb,7",
    read: "2 days ago",
  },
];
const Notesmanin: React.FC = () => {
  let initialComments: CommentArr[] = [];
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [avatar, setAvatar] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [like, setLike] = useState(0);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState("");
  const [liked, setLiked] = useState(
    "https://img.icons8.com/pastel-glyph/64/000000/facebook-like--v2.png"
  );

  const [comments, setComments] = useState(initialComments);
  let commentInput = useRef<HTMLDivElement | null>(null);
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
  let userDetails = window.localStorage.getItem("user")!;
  useEffect(() => {
    setToken(JSON.parse(userDetails).token);
  }, [userDetails]);
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => {
    setSidebar(true);
  };
  const cancelSidebar = () => {
    setSidebar(false);
  };
  const { id }: { id: string } = useParams();

  const handleLike = () => {
    //  console.log('gi')
    axios
      .get(`https://notesxdapi.herokuapp.com/notes/addlike/${id}`, {
        headers: {
          authorization: JSON.parse(userDetails).token,
        },
        // withCredentials : true,
      })
      .then((res) => {
        let data: det = res.data as det;
        // console.log(data!.likes!.length)
        setLike(data!.likes!.length);
      });
  };
  const handleEnter = async (e: any) => {
    if (e.keyCode === 13) {
      const detail = { comment: e.target.value };
      let logs: any = await axios
        .request({
          method: "POST",
          // withCredentials : true,
          data: detail,
          headers: {
            authorization: JSON.parse(userDetails).token,
          },
          url: `https://notesxdapi.herokuapp.com/notes/addcomment/${id}`,
        })
        .catch((err) => {
          console.log("tyjyg");
        });
      console.log(logs);
      let data: det = logs.data.updatedNotecomments as det;
      let commentsArray: CommentArr[] | undefined = data.comment?.map((val) => {
        let dt = Date.parse(val.updatedAt!);
        return {
          img: val.commenter!.avatar,
          name: `${val.commenter!.firstName} ${val.commenter!.lastName}`,
          title: val.comment,
          date: `${months[parseInt(val.updatedAt!.split("-")[1]) - 1]
            .substring(0, 3)
            .toUpperCase()} ${val.updatedAt!.split("-")[2].substring(0, 2)}`,
          read: format(dt),
        };
      });
      setComments(commentsArray!.reverse());
      let bn: any = commentInput.current as any;
      bn.value = "";
    }
  };
  useEffect(() => {
    axios
      .get(`https://notesxdapi.herokuapp.com/notes/getanote/${id}`)
      .then((res) => {
        console.log(res);
        let details: det = res.data as det;
        let writerName = `${details.createdBy?.firstName} ${details.createdBy?.lastName}`;
        let noteDate = `${months[parseInt(details.updatedAt!.split("-")[1]) - 1]
          .substring(0, 3)
          .toUpperCase()} ${details.updatedAt!.split("-")[2].substring(0, 2)}`;
        let noteTime = `${
          (details.body!.replace(/(<([^>]+)>)/gi, "").length / 200) | 0
        } mins`;
        let writerImage = details.createdBy?.avatar;
        let noteTitle = details.title;
        let noteBody = details.body;
        let likes = details.likes?.length;

        setName(writerName);
        setDate(noteDate);
        setTime(noteTime);
        setAvatar(writerImage!);
        setTitle(noteTitle!);
        setBody(noteBody!);
        setLike(likes!);
        console.log(id);
        console.log(details.likes);
        if (token) {
          let id: string = JSON.parse(userDetails).user._id;
          if (details.likes?.includes(id)) {
            setLiked(
              "https://img.icons8.com/ios-glyphs/30/000000/facebook-like--v2.png"
            );
          }
        }

        let noteComments: CommentArr[] | undefined = details.comment?.map(
          (val) => {
            let dt = Date.parse(val.updatedAt!);
            return {
              img: val.commenter!.avatar,
              name: `${val.commenter!.firstName} ${val.commenter!.lastName}`,
              title: val.comment,
              date: `${months[parseInt(val.updatedAt!.split("-")[1]) - 1]
                .substring(0, 3)
                .toUpperCase()} ${val
                .updatedAt!.split("-")[2]
                .substring(0, 2)}`,
              read: format(dt),
            };
          }
        );
        console.log(noteComments);
        setComments(noteComments!.reverse());
      });
  }, []);
  const classes = useStyles();
  const tname = "notes";
  const count = "23";
  return (
    <div className={classes.wrapper}>
      <div className={sidebar ? classes.sidebarModal : classes.hideSidebar}>
        <div className={classes.sideContain}>
          <div className={classes.sidebarHeader}>
            <h3
              style={{
                fontSize: "20px",
                letterSpacing: "0.5px",
                fontFamily: "poppins",
              }}
            >
              Comments({comments.length})
            </h3>
            <CloseIcon
              style={{ marginRight: "1rem", cursor: "pointer" }}
              onClick={cancelSidebar}
            />
          </div>
          <TextField
            id="outlined-basic"
            inputRef={commentInput}
            label="Comments"
            variant="outlined"
            style={{ width: "90%", marginLeft: "1rem", marginTop: "1rem" }}
            onKeyDown={(e) => {
              console.log(commentInput);
              handleEnter(e);
            }}
          />
          <div className={classes.sidebar_nav}>
            <p
              style={{
                fontSize: "16px",
                fontFamily: "poppins",
                marginRight: "0.5rem",
              }}
            >
              Most relevant
            </p>
            <ExpandMoreIcon />
          </div>
          {comments.map((el, index) => (
            <div className={classes.comment_card} key={index}>
              <div className={classes.userInfo}>
                <Avatar
                  alt="Remy Sharp"
                  src={el.img}
                  style={{ marginRight: "0.5rem" }}
                />
                <div className={classes.details}>
                  <p
                    style={{
                      fontSize: "15px",
                      fontFamily: "poppins",
                      lineHeight: "2px",
                      color: "#32A05F",
                    }}
                  >
                    {el.name}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      fontFamily: "poppins",
                      lineHeight: "2px",
                      color: "grey",
                    }}
                  >
                    {el.read}
                  </p>
                </div>
                {/* <AttachmentIcon style={{marginLeft:'9rem'}}/> */}
              </div>
              <p
                style={{
                  fontSize: "14px",
                  fontFamily: "poppins",
                  lineHeight: "1.2rem",
                  marginLeft: "1rem",
                  marginTop: "0.5rem",
                  marginBottom: "0.3rem",
                }}
              >
                {el.title}
              </p>
              {/* <div className={classes.reply}>
                        <ReplyIcon />
                        <p>Reply</p>
                     </div> */}
            </div>
          ))}
        </div>
      </div>
      <MainHeader />
      <div className={classes.notes_container}>
        <div className={classes.notes_header}>
          <h2
            style={{
              color: "black",
              fontSize: "40px",
              fontFamily: "poppins",
              letterSpacing: "1px",
            }}
          >
            {title}
          </h2>
        </div>
        <div className={classes.notes_subheader}>
          {/* <h3 style={{color:'grey', fontSize:'20px', fontFamily:'poppins', letterSpacing:'1px'}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic voluptatum doloremque maiores sit dolore voluptatem!</h3>  */}
        </div>
        <div className={classes.user} style={{ marginRight: "50rem" }}>
          <Avatar alt="Travis Howard" src={avatar} />
          <div style={{ display: "flex", alignItems: "center" }}>
            <p
              style={{
                marginRight: "0.5rem",
                marginLeft: "0.5rem",
                color: "#32A05F",
                fontSize: "12px",
              }}
            >
              {name}
            </p>
            <p style={{ marginRight: "0.5rem", fontSize: "13px" }}>{date}</p>
            <p style={{ fontSize: "14px" }}>{time} read</p>
          </div>
          {/* {token ? (
                   <>
                   <CommentIcon  style={{marginLeft:'0.5rem', cursor:'pointer'}} onClick={showSidebar}/>
                   <img src={liked} width='30px' onClick={()=>handleLike()} height='30px' alt='like'style={{marginLeft:'6px', cursor:'pointer', marginRight:'4px', marginBottom:'6px'}}/>
                   <div >{(like>0) ? like : ''}</div>
                   </>
                   ) : (<></>)} */}

          {/* <FavoriteIcon style={{marginLeft:'1rem', cursor:'pointer'}}/> */}
          {/* <Badge badgeContent={4} color="success">
                    <FavoriteIcon style={{cursor:'pointer'}} color="action" sx={{ fontSize:30}}/>
                 </Badge> */}
        </div>
        {/* content */}
        <div
          style={{
            color: "black",
            fontSize: "16px",
            textAlign: "justify",
            fontFamily: "poppins",
            fontStyle: "cursive",
            letterSpacing: "1px",
          }}
        >
          <Markup content={body} />
        </div>
        {/* <div className={classes.text_image} style={{marginTop:'2rem', marginBottom:'2rem'}}>
                    <img src="https://cdn.pixabay.com/photo/2021/09/25/18/21/witch-6655568_960_720.jpg" alt="text_image" />
                </div>
                <div className={classes.main_text} style={{margin:'0 6rem'}}>
                 <p style={{color:'black', fontSize:'16px', fontFamily:'poppins', fontStyle:'cursive', letterSpacing:'1px'}}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta deleniti explicabo aliquid possimus, officia quidem earum corrupti blanditiis repellat atque neque numquam nihil quia quas, id perferendis beatae exercitationem repudiandae aspernatur cumque. Odit voluptas ea ducimus alias. Ea debitis facere laborum magni eum, doloribus eaque enim animi aperiam tenetur quibusdam libero, amet velit assumenda perspiciatis similique earum laboriosam minima explicabo? Quae accusantium modi amet, incidunt nisi eius doloribus, omnis obcaecati ipsum ipsa temporibus aspernatur vel ducimus tenetur voluptates odit hic dolorum neque rem! Asperiores, voluptas! Voluptates explicabo iste, eos obcaecati illum amet ad, deserunt, aperiam et similique veniam fugiat placeat!</p>
                 <p style={{color:'black', fontSize:'16px', fontFamily:'poppins', fontStyle:'cursive', letterSpacing:'1px'}}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta deleniti explicabo aliquid possimus, officia quidem earum corrupti blanditiis repellat atque neque numquam nihil quia quas, id perferendis beatae exercitationem repudiandae aspernatur cumque. Odit voluptas ea ducimus alias. Ea debitis facere laborum magni eum, doloribus eaque enim animi aperiam tenetur quibusdam libero, amet velit assumenda perspiciatis similique earum laboriosam minima explicabo? Quae accusantium modi amet, incidunt nisi eius doloribus, omnis obcaecati ipsum ipsa temporibus aspernatur vel ducimus tenetur voluptates odit hic dolorum neque rem! Asperiores, voluptas! Voluptates explicabo iste, eos obcaecati illum amet ad, deserunt, aperiam et similique veniam fugiat placeat!</p>
                 <p style={{color:'black', fontSize:'16px', fontFamily:'poppins', fontStyle:'cursive', letterSpacing:'1px'}}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta deleniti explicabo aliquid possimus, officia quidem earum corrupti blanditiis repellat atque neque numquam nihil quia quas, id perferendis beatae exercitationem repudiandae aspernatur cumque. Odit voluptas ea ducimus alias. Ea debitis facere laborum magni eum, doloribus eaque enim animi aperiam tenetur quibusdam libero, amet velit assumenda perspiciatis similique earum laboriosam minima explicabo? Quae accusantium modi amet, incidunt nisi eius doloribus, omnis obcaecati ipsum ipsa temporibus aspernatur vel ducimus tenetur voluptates odit hic dolorum neque rem! Asperiores, voluptas! Voluptates explicabo iste, eos obcaecati illum amet ad, deserunt, aperiam et similique veniam fugiat placeat!</p>
                </div> */}
      </div>
      <div className={classes.text_footer}>
        <h3 className={classes.logo}>
          {tname}
          <span className={classes.xd}>.xd</span>
        </h3>
        <div className={classes.footer_nav}>
          <p
            style={{
              color: "white",
              fontSize: "16px",
              fontFamily: "poppins",
              fontStyle: "cursive",
              letterSpacing: "1px",
              marginRight: "0.7rem",
            }}
          >
            About
          </p>
          <p
            style={{
              color: "white",
              fontSize: "16px",
              fontFamily: "poppins",
              fontStyle: "cursive",
              letterSpacing: "1px",
              marginRight: "0.7rem",
            }}
          >
            Privacy Policy
          </p>
          <p
            style={{
              color: "white",
              fontSize: "16px",
              fontFamily: "poppins",
              fontStyle: "cursive",
              letterSpacing: "1px",
            }}
          >
            Help
          </p>
        </div>
      </div>
    </div>
  );
};
export default Notesmanin;
