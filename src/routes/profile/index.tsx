import React from 'react'
import { auth } from '../../firebase'

const Profile = () => {
  return (
    <div>
      {auth.currentUser!.email}
    </div>
  )
}

export default Profile
