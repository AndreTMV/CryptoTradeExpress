import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getMessages, sendMessage } from '../../features/chat/chatSlice';
import { RootState } from '../../app/store';
import moment from 'moment';

function MessageDetail() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState({ message: '' });
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { id } = useParams();
  const receiver_id: number = id;

  async function getAllMessages(senderId: number, receiverId: number) {
    const myMessages = await dispatch(getMessages({ senderId, receiverId }));
    console.log(myMessages.payload);
    return myMessages;
  }

  useEffect(() => {
    let interval = setInterval(() => {
      try {
        getAllMessages(userInfo.id, receiver_id).then((res) => {
          setMessage((prevState) => res.payload);
        });
      } catch (error) {
        console.log(error);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleChange = (evt) => {
    setNewMessage({
      ...newMessage,
      [evt.target.name]: evt.target.value,
    });
  };

  const SendMessage = () => {
    const formData = {
      user: userInfo.id,
      sender: userInfo.id,
      receiver: receiver_id,
      message: newMessage.message,
      is_read: false,
    };
    dispatch(sendMessage(formData));
    document.getElementById('text-input').value = '';
    setNewMessage({ message: '' });
  };
const formatDate = (date: string) => {
    const messageDate = moment.utc(date);
    const currentDate = moment();
    if (currentDate.diff(messageDate, 'days') > 2) {
      return messageDate.format('DD/MM/YYYY');
    } else {
      return messageDate.format('hh:mm A');
    }
  };
  return (
    <div>
      <main className="content mt-24">
        <div className="container mx-auto">
        <div className="flex-grow pl-3 bg-indigo-700 rounded-lg mb-4 flex flex-col justify-center items-center">
          <strong className="text-lg">{message.length > 0 && message[0].sender_profile.name}</strong>
          <div className="text-sm">
            <em>Online</em>
          </div>
        </div>
          <div className="card bg-white rounded-lg">
            <div className="flex">
              <div className="flex-1">
                <div className="border-b py-4 px-4 lg:hidden">
                  <div className="flex items-center">
                    <div className="w-10 h-10 relative">
                      <div className="absolute right-0 bottom-0 bg-green-500 border-2 border-white rounded-full w-3 h-3"></div>
                    </div>

                    <div>
                      <button className="btn btn-primary btn-lg mr-2">
                        <i className="fas fa-phone"></i>
                      </button>
                      <button className="btn btn-info btn-lg mr-2">
                        <i className="fas fa-video"></i>
                      </button>
                      <button className="btn btn-light border btn-lg">
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="chat-messages p-4">
                    {message.map((message, index) => (
                      <div className={`chat-message-${message.sender === userInfo.id ? 'left' : 'right'} pb-4`} key={index}>
                        <div className={`flex-shrink-1 bg-indigo-700 rounded-lg min-w-5 py-2 px-3 ${message.sender === userInfo.id ? 'ml-auto' : 'mr-auto'}`}>
                          <div>
                            {message.sender !== userInfo.id && (
                              <div className="font-semibold mb-1">{message.sender_profile.name}</div>
                            )}
                            <div className="text-white">{message.message}</div>
                            <div className="text-right text-xs text-gray-300">{formatDate(message.date)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-none py-3 px-4 border-t">
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="form-input flex-grow px-4 py-2 rounded-md bg-gray-100 focus:outline-none focus:bg-white text-gray-900"
                      placeholder="Type your message"
                      name="message"
                      value={newMessage.message}
                      onChange={handleChange}
                      id="text-input"
                    />
                    <button onClick={SendMessage} className="btn btn-primary ml-2 px-6 py-2 rounded-md bg-blue-500">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10 mt-3">
        <Link to="/inbox">Regresar</Link>
      </button>
    </div>
  );

}

export default MessageDetail;
