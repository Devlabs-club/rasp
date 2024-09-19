import React from 'react'

const UserCard = ({ user }) => {
  return (
    <div className='w-52 border border-gray-600'>
      <img src={user.photo} alt={user.name} className='w-full h-20 border border-gray-600 bg-neutral-900' />
      <div className='flex flex-col gap-2 px-3 py-5'>
        <h2 className='text-lg font-semibold'>{user.name}</h2>
        <p>{user.relevantInfo}</p>
      </div>      
    </div>
  )
}

export default UserCard