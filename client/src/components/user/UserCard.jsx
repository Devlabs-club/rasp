import React from 'react'

const UserCard = ({ user, setSelectedUser }) => {
  return (
    <div className='w-52 border border-gray-600' onClick={() => setSelectedUser(user)}>
      <div className="bg-gradient-to-br from-orange-300/100 to-orange-400/100">
        <img src={`/images/${user.email}.jpg`} alt={user.name} className='w-full object-cover border border-gray-600 mix-blend-multiply' />
      </div>
      
      <div className='flex flex-col gap-2 px-3 py-5'>
        <h2 className='text-lg font-semibold'>{user.name}</h2>
        <p>{user.relevantInfo}</p>
      </div>      
    </div>
  )
}

export default UserCard