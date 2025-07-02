import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getMyMessages, searchUser } from '../../features/chat/chatSlice';
import { RootState } from '../../app/store';
import moment from 'moment';
import { toast } from 'react-hot-toast';

function Message()
{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, isStaff, isError, isLoading } = useSelector( ( state: RootState ) => state.auth );
  const { message } = useSelector( ( state: RootState ) => state.chat );
  const [messages, setMessages] = useState( [] );
  const [newSearches, setSearches] = useState( { search: '' } );

  const handleChange = ( evt ) =>
  {
    setSearches( {
      ...newSearches,
      [evt.target.name]: evt.target.value,
    } );
  };

  const SearchUser = async () =>
  {
    try
    {
      const search = await dispatch( searchUser( newSearches.username ) );
      console.log( search.payload );
      navigate( '/search/' + newSearches.username );
    } catch ( error )
    {
      console.log( error );
      toast.error( 'El usuario no existe' );
    }
  };

  async function getUserMessages( userId: number )
  {
    const myMessages = await dispatch( getMyMessages( userId ) );
    return myMessages;
  }

  useEffect( () =>
  {
    try
    {
      getUserMessages( userInfo.id ).then( ( res ) =>
      {
        setMessages( ( prevState ) => res.payload );
      } );
    } catch ( error )
    {
      console.log( error );
    }
  }, [] );

  return (
    <div>
      <main className="content mt-24">
        <div className="container mx-auto bg-white p-3 rounded-lg">
          <h1 className="text-2xl mb-6 text-gray-900">Messages</h1>
          <div className="flex">
            <div className="w-1/3 ">
              <div className="px-4 hidden md:block">
                <div className="flex items-center">
                  <div className="flex-grow mr-2">
                    <input
                      type="text"
                      className="form-input my-3 px-4 py-2 text-gray-900 rounded-md bg-gray-100 focus:outline-none focus:bg-white"
                      placeholder="Search..."
                      onChange={handleChange}
                      name="username"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600" onClick={SearchUser}>
                    <i className="fas fa-search"></i>Search
                  </button>
                </div>
              </div>
              {messages.map( ( message ) => (
                <Link
                  to={'/inbox/' + ( message.sender === userInfo.id ? message.receiver : message.sender ) + '/'}
                  className="block border-b border-gray-200 p-3 hover:bg-gray-100 relative">
                  <div className="flex items-center text-gray-900">
                    <div className="flex-grow-1">
                      {message.sender === userInfo.id &&
                        ( message.receiver_profile.name !== null ? message.receiver_profile.name : message.receiver.username )}
                      {message.sender !== userInfo.id && message.sender_profile.name}
                      <div className="text-sm text-gray-500">
                        <span className="fas fa-circle text-green-500 mr-1"></span>
                        {message.message}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 absolute bottom-0 right-0">
                      {moment.utc( message.date ).local().startOf( 'seconds' ).fromNow()}
                    </span>
                  </div>
                </Link>
              ) )}
            </div>
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10 mt-3">
            <Link to="/dashboard">Regresar</Link>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Message;
