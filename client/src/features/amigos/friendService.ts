import  axios  from 'axios';

const BACKEND_DOMAIN = "http://localhost:8000"
const FRIENDS_API = `${BACKEND_DOMAIN}/friends/api/v1/`
const FETCH_FRIENDS = `${FRIENDS_API}see_friends/`
const ARE_FRIENDS = `${FRIENDS_API}are_friends/`
const REMOVE_FRIEND = `${FRIENDS_API}unfriend/`
const SEND_FRIEND_REQUEST = `${FRIENDS_API}friend_request/`
const FRIEND_REQUEST_STATUS = `${FRIENDS_API}friend_request_exists/`
const CANCEL_FRIEND_REQUEST = `${FRIENDS_API}cancel_friend_request/`
const SEE_FRIEND_REQUESTS = `${FRIENDS_API}see_friend_requests/`
const DECLINE_FRIEND_REQUEST = `${FRIENDS_API}decline_friend_request/`
const ACCEPT_FRIEND_REQUEST = `${FRIENDS_API}accept_friend_request/`



const fetchFriends = async ( friendsData: any ) =>
{
    const config = {
        params: {
            user: friendsData.user,
            see_user: friendsData.see_user
        }

    }
    const response = await axios.get(FETCH_FRIENDS, config)
    return response.data
}

const areFriends = async ( friendsData: any ) =>
{
    const config = {
        params: {
            user: friendsData.user,
            see_user: friendsData.see_user
        }
    }

    const response = await axios.get(ARE_FRIENDS, config)
    return response.data
}

const removeFriend = async ( friendsData: any ) =>
{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }

    }
    const response = await axios.post(REMOVE_FRIEND, friendsData, config)
    return response.data
}

const sendFriendRequest = async ( friendsData: any ) =>
{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }

    }
    const response = await axios.post(SEND_FRIEND_REQUEST, friendsData, config)
    return response.data
}

const friendRequestStatus = async ( friendsData: any ) =>
{
    const config = {
        params: {
            user: friendsData.user,
            receiver: friendsData.receiver
        }
    }

    const response = await axios.get(FRIEND_REQUEST_STATUS, config)
    return response.data
}

const cancelFriendRequest = async ( friendsData: any ) =>
{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }

    }
    const response = await axios.post(CANCEL_FRIEND_REQUEST, friendsData, config)
    return response.data
}

const fetchFriendRequests = async ( friendsData: any ) =>
{
    const config = {
        params: {
            user: friendsData.user,
        }
    }

    const response = await axios.get(SEE_FRIEND_REQUESTS, config)
    return response.data
}

const declineFriendRequest = async ( friendsData: any ) =>
{
    const config = {
        params: {
            user: friendsData.user,
            friend_request_id: friendsData.friend_request
        }
    }

    const response = await axios.get(DECLINE_FRIEND_REQUEST, config)
    return response.data
}

const acceptFriendRequest = async ( friendsData: any ) =>
{
    const config = {
        params: {
            user: friendsData.user,
            friend_request_id: friendsData.friend_request
        }
    }

    const response = await axios.get(ACCEPT_FRIEND_REQUEST, config)
    return response.data
}

const friendService = { fetchFriends, areFriends, removeFriend, sendFriendRequest, friendRequestStatus, cancelFriendRequest, fetchFriendRequests, declineFriendRequest, acceptFriendRequest }

export default friendService 




