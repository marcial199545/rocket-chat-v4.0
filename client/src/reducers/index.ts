import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import contacts from "./contacts";
import messages from "./messages";
import sockets from "./sockets";
import groups from "./groups";
export default combineReducers({ alert, auth, contacts, messages, sockets, groups });
