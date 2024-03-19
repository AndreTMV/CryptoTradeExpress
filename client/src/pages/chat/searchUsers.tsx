import '../style/Message.css'
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom/'
import moment from 'moment';
import { getMyMessages, searchUser } from '../../features/chat/chatSlice';
import { useDispatch } from 'react-redux';
import {toast} from 'react-hot-toast'


function SearchUsers() {

  const [users, setUser] = useState([])
  const [profiles, setProfile] = useState([])
  let [newSearch, setnewSearch] = useState({search: "",});
  const [loading, setLoading] = useState(true);

  const username = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    SearchUser()
    console.log(users)
  }, [])

  const handleSearchChange = (event) => {
    setnewSearch({
      ...newSearch,
      [event.target.name]: event.target.value,
    });

  };


  const SearchUser = async () =>
    {
      try {
        const search = await dispatch(searchUser(username.username));
        await setUser(search.payload);
        navigate('/search/'+newSearch.username)
      } catch (error) {
        console.log(error)
        toast.error("No existe ese usuario")
        navigate('/inbox')
        
      }
    }


  return (
    <div>
      <div>
      <main className="content" style={{ marginTop: "150px" }}>
        <div className="container p-0 bg-white text-gray-900 rounded-lg p-3">
          <h1 className="h3 mb-3">Usuarios</h1>
          <div className="card">
            <div className="row g-0">
              <div className="col-12 col-lg-5 col-xl-3 border-right">
              <div className="px-4 ">
                <div className="flex items-center">
                  <div className="flex-grow mr-2">
                    <input
                      type="text"
                      className="form-input my-3 px-4 py-2 text-gray-900 rounded-md bg-gray-100 focus:outline-none focus:bg-white"
                      placeholder="Search..."
                      onChange={handleSearchChange}
                      name="username"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600" onClick={SearchUser}>
                    <i className="fas fa-search"></i>Buscar
                  </button>
                </div>
              </div>
                
                {users.map((user, index) => 
                  <Link 
                    to={"/inbox/" + user.id}
                    className="list-group-item list-group-item-action border-0 block border-b border-gray-200 p-3 hover:bg-gray-100 relative"
                  >

                    <small><div className="badge bg-success float-right text-white"></div></small>
                    <div className="d-flex align-items-start">
                    
                      <div className="flex-grow-1 ml-3">
                         {user.name}  

                        <div className="small">
                           <small><i className='fas fa-envelope'> Send Message</i></small>
                        </div>
                      </div>
                    </div>
                    </Link>
                )}
                
                <hr className="d-block d-lg-none mt-1 mb-0" />
              </div>
              
            </div>
          </div>
        </div>
      </main>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10 mt-3">
        <Link to="/inbox">Regresar</Link>
      </button>
    </div>
    </div>
  )
}

export default SearchUsers
