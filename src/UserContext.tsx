import { createContext, useState, useEffect } from "react";
import axios from "axios";

interface cont {
  noteLists?: NotesDetails[];
  onEdit?: string;
  handleOnEdit?: React.Dispatch<React.SetStateAction<string>>;
  active?: string;
  setActive?: React.Dispatch<React.SetStateAction<string>>;
  handleSetNoteLists?: React.Dispatch<React.SetStateAction<NotesDetails[]>>;
  tabMemory?: TabInterface[];
  handleTabMemory?: React.Dispatch<React.SetStateAction<TabInterface[]>>;
  tags?: string[];
  handleTags?: React.Dispatch<React.SetStateAction<never[]>>;
  collabs?: dat[];
  handleCollabs?: React.Dispatch<React.SetStateAction<never[]>>;
  title?: string;
  handleTitle?: React.Dispatch<React.SetStateAction<string>>;
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
interface NotesDetails {
  _id?: string;
  updatedAt?: string;
  id: string;
  date: string;
  title: string;
  body: string;
  tags: string[];
}
interface TabInterface {
  id: string;
  title: string;
}

let init: cont = {};
const Context = createContext(init);
let first: NotesDetails[] = [];
let tab: TabInterface[] = [];
function NameContextProvider(props: any) {
  const [name, setName] = useState(first);
  const [activeFolder, setActiveFolder] = useState("");
  const [activeEdit, setactiveEdit] = useState("");
  const [tabMemory, setTabMemory] = useState(tab);
  const [stat, setStat] = useState("");
  const [tags, setTags] = useState([]);
  const [collabs, setCollabs] = useState([]);
  const [title, setTitle] = useState("");

  const def = window.localStorage.getItem("tabHistory");
  const act = window.localStorage.getItem("activeFolder");

  useEffect(() => {
    async function setNotes(id: string) {
      let result: any = null;
      let userDetails = window.localStorage.getItem("user")!;
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
      try {
        result = await axios({
          method: "GET",
          headers: {
            authorization: JSON.parse(userDetails).token,
          },
          // withCredentials : true,
          url: `https://notesxdapi.herokuapp.com/notes/getAllNote/${id}`,
        });
        console.log(result.data);
        let ret = result.data.map((val: NotesDetails) => {
          let fg: string = val.updatedAt!;
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
        setName!(ret);
      } catch (err: any) {
        result = err.message;
      }
    }
    if (!act) {
      setActiveFolder("");
    } else {
      setNotes(act);
      setActiveFolder(act);
    }
    if (!def) {
      setactiveEdit("");
    } else {
      let parsedDef = JSON.parse(def!);
      let ans = parsedDef
        .reverse()
        .filter(
          (thing: { id: string; title: string }, index: number, self: []) =>
            index ===
            self.findIndex(
              (t: { id: string; title: string }) =>
                t.id === thing.id && t.title === thing.title
            )
        );
      setTabMemory(ans);
      if (ans.length > 0) {
        let first = ans[0].id;
        setactiveEdit(first);
      } else {
        setactiveEdit("");
      }
    }
  }, [def, act]);

  return (
    <Context.Provider
      value={{
        noteLists: name,
        handleSetNoteLists: setName,
        active: activeFolder,
        setActive: setActiveFolder,
        onEdit: activeEdit,
        handleOnEdit: setactiveEdit,
        tabMemory: tabMemory,
        handleTabMemory: setTabMemory,
        tags: tags,
        handleTags: setTags,
        collabs: collabs,
        handleCollabs: setCollabs,
        title: title,
        handleTitle: setTitle,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

// let expcontext = { NameContextProvider, Context };

export { NameContextProvider, Context };
