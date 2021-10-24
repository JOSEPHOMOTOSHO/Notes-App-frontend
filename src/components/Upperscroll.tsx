import React, {useContext, SyntheticEvent, useEffect,useState} from 'react'
// mport {useContext, useState , useEffect} from 'react'
import { Context } from "../UserContext";
import { Box, Tab, Tabs, TextField, Button } from '@mui/material'
import Avatar from '@mui/material/Avatar';
import Dropdown from "./Dropdown"
import axios from 'axios';
import Modals from './Modals';
import InviteModal from './InviteModal';
import SendMail from './SendMail';
import CloseIcon from '@mui/icons-material/Close';
// import jwt from 'jsonwebtoken'
import jwt from 'jsonwebtoken';
interface  det {
  title?: string
  createdBy?: dat
  createdAt?: string
  updatedAt?: string
  id?: string
  tags?: []
  folderId?: string
  fileUpload?: []
  softDelete?: boolean
  collaboratorId?: []
  body?:string
}
interface dat {
  createdAt? : string
  updatedAt? : string
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  avatar?:string
  gender?: string
  about?: string
  location?: string
}
const UpperScroll = () => {
  let gen:det = {tags:[],collaboratorId:[]}
  let sub:dat={}
    const [value, setValue] = useState(0);
    const [general, setGeneral] = useState(gen)
    const [ subGeneral, setSubGeneral ] = useState(sub)
    const [ date, setDate ] = useState("")
    const [ title, setTitle ] = useState("")
    const { noteLists, handleOnEdit, tabMemory, handleTabMemory, active, onEdit} = useContext(Context);
 
  const handleChange = (event:any, newValue:any) => {
    setValue(newValue);
  };
  let userDetails = window.localStorage.getItem('user')!
  let id = onEdit
let data: det
let crtBy: dat
useEffect(()=>{
    const getNotes = async()=>{
      try{
       let logs = await axios({
          method : "GET",
          withCredentials : true,
          headers:{
              'authorization' : JSON.parse(userDetails).token
          },
          url : `https://notesxd.herokuapp.com/notes/${id}`,
      })
      console.log(logs.data, "123456789")
       data = logs.data as det
       console.log(data,"data")
       setGeneral(data)
       crtBy = data.createdBy as dat
      setSubGeneral(crtBy)
      let time = general.updatedAt!.split('T')[1].substring(0,5)
      let hrs = general.updatedAt!.split('T')[1].substring(0,2) 
      let mins = general.updatedAt!.split('T')[1].substring(3,5)
      if(parseInt(time.substring(0,2))>12){
            time = `${parseInt(hrs)-12}:${mins}PM`
      }else{
            time = `${hrs}:${mins}AM`
      }
      let  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
setDate(`${months[parseInt(general.updatedAt!.split('-')[1]) -1].substring(0,3)} ${general.updatedAt!.split('-')[2].substring(0,2)}, ${general.updatedAt!.split('-')[0]} at ${time}`)
    //   console.log('title', lName)
    }catch(err){
        console.log(err, "wertyuiert")
    } 
  }
    getNotes()
},[onEdit]) 

function handleCloseTab(tabId:string) {
let allHistory = window.localStorage.getItem('tabHistory')

let parsedallHistory = JSON.parse(allHistory!)

let filteredHistory = parsedallHistory.filter((val:{id:string, title:string})=> val.id !== tabId)

window.localStorage.setItem('tabHistory', JSON.stringify(filteredHistory))
handleTabMemory!(filteredHistory)

}


// const handleTitle = async (event:any) => {
//   // event.preventDefault();
//   setTitle(event);
//           const details = {
//             title
//           };
//         let apiRes = null
//         try{
//           apiRes = await axios.put(`https://notesxd.herokuapp.com/notes/editnote/${id}`, details, 
//               { headers:{
//                'authorization' : JSON.parse(userDetails).token
//               }
//             })
//         } catch (err:any) {
//           apiRes = err.response.data.message;
//         } finally {
//           console.log(apiRes);
//         } 
// };
    return (
        <div style={{display:"flex",  flexDirection:"column", marginBottom:'1rem'}}>
        <div style={{ width:"inherit", height:"10%"}}>
            <Box sx={{ width: "55%", bgcolor: '#EAEAEA', position:"absolute"}}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons={false}
        aria-label="scrollable prevent tabs example"
      >
            {
           tabMemory!.reverse().filter((thing, index, self) =>
           index === self.findIndex((t) => (
             t.id === thing.id && t.title === thing.title
           ))
           ).map(val=>{
                //   return ( <Tab label={val.title}   onClick={()=> {handleOnEdit!(val.id)}} />)


                  return (
                  <div style={{ display:"flex", flexDirection:"row",}}>
                  <Tab label={val.title}   onClick={()=> {handleOnEdit!(val.id)}}/>
                  <CloseIcon style={{float:"right",color:"#707070", marginTop:"12px"}}  onClick={()=> {handleCloseTab(val.id)}}/>
                  </div>)
                })
          }



        {/* <div style={{ display:"flex", flexDirection:"row",}}>
        <Tab label="Item One" />
        <CloseIcon style={{float:"right",color:"#707070", marginTop:"12px"}} />
        </div> */}
      </Tabs>  
    </Box> 
        <div style={{ display:"flex", marginLeft:"690px", flexDirection:"row", marginTop:"3rem"}}>
        <SendMail />
        <Dropdown />
        </div>
        </div>
        <div style={{ width:"inherit", height:"30%", overflow:"scroll", backgroundColor: 'white', display:"flex", flexDirection:"column", alignItems:"flex-start", paddingLeft:"40px" }}>
                <div style={{width:"95%", marginBottom:'1rem'}}>
                <TextField  key={general.updatedAt ? 'notLoadedYet' : 'loaded'} size="small" sx={{fontSize:'2.5rem'}} placeholder="Untitled" fullWidth  variant="standard" defaultValue={general.title} onChange={(e)=>setTitle(e.target.value)}/>
                </div>
                <div style={{padding:"15px 0", display:"flex"}}>
                <span style={{padding:"0 55px 0 0", color:'#707070', fontFamily:'poppins', fontSize:'12px'}}>Created by</span> 
                <Avatar alt="Remy Sharp" src={subGeneral.avatar} sx={{width:'25px', height:'25px'}} />
                <span style={{padding:"0 0 0 5px",fontSize:'13px', fontFamily:'poppins'}}>{`${subGeneral.firstName} ${subGeneral.lastName}`}</span>
                </div>
                <div style={{padding:"0 0 15px 0", display:"flex"}}>
                <span style={{padding:"0 47px 0 0", display:"flex", fontFamily:'poppins', color:'#707070', fontSize:'12px'}}>Collaborator</span>
                { general.collaboratorId!.length <= 1 ? 
                 general.collaboratorId!.map((el:dat,index)=>( 
                <div style={{display:"flex"}}>
                <Avatar sx={{width: '25px', height: '25px'}} alt="Remy Sharp" src={el.avatar} />
                <span style={{padding:"0 0 0 5px",fontSize:'13px', fontFamily:'poppins'}}>{`${el.firstName} ${el.lastName}`}</span>
                </div>
                 ))
                : general.collaboratorId!.length > 1 && general.collaboratorId!.length < 7 ? 
                  general.collaboratorId!.map((el:dat,index)=>( 
                 <div key={index} style={{display:"flex"}}>
                 <Avatar sx={{width: '25px', height: '25px'}} alt="Remy Sharp" src={el.avatar} />
                 </div>
                  ))
                :  
                  general.collaboratorId!.slice(0,6).map((el:dat,index)=>( 
                 <div key={index} style={{display:"flex"}}>
                 <Avatar sx={{width: '25px', height: '25px'}} alt="Remy Sharp" src={el.avatar} />
                 <span style={{padding:"0 0 0 5px",fontSize:'13px', fontFamily:'poppins'}}>{`+${general.collaboratorId!.length - 6}`}</span>
                 </div>
                  ))
                }
                <InviteModal />
                </div>
                {/* {general.collaboratorId!.map((el:dat,index)=>( 
                <div key={index} style={{display:"flex"}}>
                <Avatar sx={{width: '25px', height: '25px'}} alt="Remy Sharp" src={el.avatar} />
                <span style={{padding:"0 0 0 5px",fontSize:'13px', fontFamily:'poppins'}}>{`${el.firstName} ${el.lastName}`}</span>
                <InviteModal />
                </div>
                 ))}
                </div> */}
                <div style={{padding:"0 0 15px 0"}}>
                <span style={{padding:"20px 46px 20px 0", color:'#707070', fontFamily:'poppins', fontSize:'12px'}}>Last Updated</span><span style={{fontFamily:'poppins',  fontSize:'12px'}}>{date}</span>
                </div>
                <div style={{padding:"0 0 20px 0", display:"flex", alignItems:"center"}}>
                <span style={{padding:"0 90px 0 0", color:'#707070', fontFamily:'poppins', fontSize:'12px'}}>Tags</span>
                <div style={{display:"flex"}}>
                { general.tags!.length <= 6 ?  
                  general.tags!.map((el:string,index)=>( 
                    <Button style={{padding:"0 5px 0 0", fontFamily:'poppins', fontSize:'12px', color:"#32A05F", backgroundColor: "#15812c33", marginRight:"7px"}} disabled>{`#${el}`}</Button>
                  )) : <>
                  { general.tags!.slice(0,6).map((el:string,index)=>(
                      <Button style={{padding:"0 5px 0 0", fontFamily:'poppins', fontSize:'12px', color:"#32A05F", backgroundColor: "#15812c33", marginRight:"7px"}} disabled>{`#${el}`}</Button>
                  ))} 
                      <span style={{padding:"0 5px 0 0", fontFamily:'poppins', fontSize:'12px', marginRight:"5px", color:'#707070'}}>{`+${general.tags!.length - 6}`}</span>
                    </>
                } 
                </div>  
                 <Modals tagx={general.tags} title={title} />
                </div>
                <div style={{ width:"97%", height:"1px", backgroundColor:"#231F20",}}/>
        </div>
        </div>
    )
}
export default UpperScroll