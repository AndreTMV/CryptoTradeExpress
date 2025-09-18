//import  axios  from 'axios';
//
//const BACKEND_DOMAIN = "http://localhost:8000"
//const FRIENDS_API = `${BACKEND_DOMAIN}/friends/api/v1/`
//const FETCH_FRIENDS = `${FRIENDS_API}see_friends/`
//const ARE_FRIENDS = `${FRIENDS_API}are_friends/`
//const REMOVE_FRIEND = `${FRIENDS_API}unfriend/`
//const SEND_FRIEND_REQUEST = `${FRIENDS_API}friend_request/`
//const FRIEND_REQUEST_STATUS = `${FRIENDS_API}friend_request_exists/`
//const CANCEL_FRIEND_REQUEST = `${FRIENDS_API}cancel_friend_request/`
//const SEE_FRIEND_REQUESTS = `${FRIENDS_API}see_friend_requests/`
//const DECLINE_FRIEND_REQUEST = `${FRIENDS_API}decline_friend_request/`
//const ACCEPT_FRIEND_REQUEST = `${FRIENDS_API}accept_friend_request/`
//
//
//
//const fetchFriends = async ( friendsData: any ) =>
//{
//    const config = {
//        params: {
//            user: friendsData.user,
//            see_user: friendsData.see_user
//        }
//
//    }
//    const response = await axios.get(FETCH_FRIENDS, config)
//    return response.data
//}
//
//const areFriends = async ( friendsData: any ) =>
//{
//    const config = {
//        params: {
//            user: friendsData.user,
//            see_user: friendsData.see_user
//        }
//    }
//
//    const response = await axios.get(ARE_FRIENDS, config)
//    return response.data
//}
//
//const removeFriend = async ( friendsData: any ) =>
//{
//    const config = {
//        headers: {
//            'Content-Type': 'application/json'
//        }
//
//    }
//    const response = await axios.post(REMOVE_FRIEND, friendsData, config)
//    return response.data
//}
//
//const sendFriendRequest = async ( friendsData: any ) =>
//{
//    const config = {
//        headers: {
//            'Content-Type': 'application/json'
//        }
//
//    }
//    const response = await axios.post(SEND_FRIEND_REQUEST, friendsData, config)
//    return response.data
//}
//
//const friendRequestStatus = async ( friendsData: any ) =>
//{
//    const config = {
//        params: {
//            user: friendsData.user,
//            receiver: friendsData.receiver
//        }
//    }
//
//    const response = await axios.get(FRIEND_REQUEST_STATUS, config)
//    return response.data
//}
//
//const cancelFriendRequest = async ( friendsData: any ) =>
//{
//    const config = {
//        headers: {
//            'Content-Type': 'application/json'
//        }
//
//    }
//    const response = await axios.post(CANCEL_FRIEND_REQUEST, friendsData, config)
//    return response.data
//}
//
//const fetchFriendRequests = async ( friendsData: any ) =>
//{
//    const config = {
//        params: {
//            user: friendsData.user,
//        }
//    }
//
//    const response = await axios.get(SEE_FRIEND_REQUESTS, config)
//    return response.data
//}
//
//const declineFriendRequest = async ( friendsData: any ) =>
//{
//    const config = {
//        params: {
//            user: friendsData.user,
//            friend_request_id: friendsData.friend_request
//        }
//    }
//
//    const response = await axios.get(DECLINE_FRIEND_REQUEST, config)
//    return response.data
//}
//
//const acceptFriendRequest = async ( friendsData: any ) =>
//{
//    const config = {
//        params: {
//            user: friendsData.user,
//            friend_request_id: friendsData.friend_request
//        }
//    }
//
//    const response = await axios.get(ACCEPT_FRIEND_REQUEST, config)
//    return response.data
//}
//
//const friendService = { fetchFriends, areFriends, removeFriend, sendFriendRequest, friendRequestStatus, cancelFriendRequest, fetchFriendRequests, declineFriendRequest, acceptFriendRequest }
//
//export default friendService 
//

import api from "../../api/axiosInstance";
import type {
  FriendSummary,
  FriendRequestDTO,
  SimpleStatus,
  AreFriendsResponse,
  FriendRequestExistsResponse,
  FetchFriendsDTO,
  AreFriendsDTO,
  RemoveFriendDTO,
  SendFriendRequestDTO,
  FriendRequestStatusDTO,
  CancelFriendRequestDTO,
  FetchFriendRequestsDTO,
  AcceptDeclineDTO,
} from "./types";

const BASE = "/friends/api/v1";
const SEE_FRIENDS = `${BASE}/see_friends/`;
const ARE_FRIENDS = `${BASE}/are_friends/`;
const UNFRIEND = `${BASE}/unfriend/`;
const SEND_REQUEST = `${BASE}/friend_request/`;
const REQUEST_EXISTS = `${BASE}/friend_request_exists/`;
const CANCEL_REQUEST = `${BASE}/cancel_friend_request/`;
const SEE_REQUESTS = `${BASE}/see_friend_requests/`;
const DECLINE_REQUEST = `${BASE}/decline_friend_request/`;
const ACCEPT_REQUEST = `${BASE}/accept_friend_request/`;

// Helpers
const ensureArray = <T>(data: unknown): T[] => (Array.isArray(data) ? data as T[] : []);
const boolFromAreFriends = (data: AreFriendsResponse): boolean | null =>
  typeof (data as any)?.friends === "boolean" ? (data as any).friends : null;
const boolFromStatus = (data: FriendRequestExistsResponse): boolean =>
  typeof (data as any)?.status === "boolean" ? (data as any).status : false;

export const fetchFriends = async (params: FetchFriendsDTO): Promise<FriendSummary[]> => {
  const { data } = await api.get<FriendSummary[] | { status: string }>(SEE_FRIENDS, { params });
  return ensureArray<FriendSummary>(data);
};

export const areFriends = async (params: AreFriendsDTO): Promise<boolean | null> => {
  const { data } = await api.get<AreFriendsResponse>(ARE_FRIENDS, { params });
  return boolFromAreFriends(data);
};

export const removeFriend = async (payload: RemoveFriendDTO): Promise<SimpleStatus> => {
  const { data } = await api.post<SimpleStatus>(UNFRIEND, payload);
  return data;
};

export const sendFriendRequest = async (payload: SendFriendRequestDTO): Promise<SimpleStatus> => {
  const { data } = await api.post<SimpleStatus>(SEND_REQUEST, payload);
  return data;
};

export const friendRequestStatus = async (params: FriendRequestStatusDTO): Promise<boolean> => {
  const { data } = await api.get<FriendRequestExistsResponse>(REQUEST_EXISTS, { params });
  return boolFromStatus(data);
};

export const cancelFriendRequest = async (payload: CancelFriendRequestDTO): Promise<SimpleStatus> => {
  const { data } = await api.post<SimpleStatus>(CANCEL_REQUEST, payload);
  return data;
};

export const fetchFriendRequests = async (params: FetchFriendRequestsDTO): Promise<FriendRequestDTO[]> => {
  const { data } = await api.get<FriendRequestDTO[] | { status: string }>(SEE_REQUESTS, { params });
  return ensureArray<FriendRequestDTO>(data);
};

export const declineFriendRequest = async (params: AcceptDeclineDTO): Promise<SimpleStatus> => {
  const { data } = await api.get<SimpleStatus>(DECLINE_REQUEST, {
    params: { user: params.user, friend_request_id: params.friend_request },
  });
  return data;
};

export const acceptFriendRequest = async (params: AcceptDeclineDTO): Promise<SimpleStatus> => {
  const { data } = await api.get<SimpleStatus>(ACCEPT_REQUEST, {
    params: { user: params.user, friend_request_id: params.friend_request },
  });
  return data;
};

const friendService = {
  fetchFriends,
  areFriends,
  removeFriend,
  sendFriendRequest,
  friendRequestStatus,
  cancelFriendRequest,
  fetchFriendRequests,
  declineFriendRequest,
  acceptFriendRequest,
};

export default friendService;
