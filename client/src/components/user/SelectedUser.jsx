import React from 'react'

const UserCard = ({ user }) => {
  return (
    <div className={`w-[500px] border border-gray-600 sticky left-0 top-10`}>
      <img src={user.photo} alt={user.name} className='w-full h-52 border border-gray-600 bg-neutral-900' />
      <div className='flex flex-col'>
        <div className='flex flex-col gap-1 border border-gray-600 px-3 py-4'>
            <h2 className='text-lg font-semibold flex gap-2 items-center'>{user.name} <span className="text-base font-normal text-neutral-400">{user.about.gender} | {user.about.campus} campus</span></h2>
            <p className='text-neutral-400'>- {user.about.major} | {user.about.standing} | <a href={`mailto:${user.email}`} className='underline'>{user.email}</a></p>
        </div>
        
        <div className='flex flex-col gap-1 border border-gray-600 px-3 py-4'>
            <h2 className='text-lg font-semibold flex gap-2 items-center'>about</h2>
            <p>{user.about.bio}</p>
        </div>

        <div className='px-3 py-4 flex flex-col gap-2 border border-gray-600'>
            <h2 className='text-lg font-semibold flex gap-2 items-center'>skills</h2>
            <div className="text-neutral-200 flex flex-wrap gap-2">
                {user.about.skills.map((value, index) => <span className='text-neutral-300 px-2 py-1 text-sm rounded-md bg-neutral-700' key={index}>{value}</span>)}
            </div>
        </div>

        <div className='px-3 py-4 flex flex-col gap-2 border border-gray-600'>
            <h2 className='text-lg font-semibold flex gap-2 items-center'>hobbies</h2>
            <div className="text-neutral-200 flex flex-wrap gap-2">
                {user.about.hobbies.map((value, index) => <span className='text-neutral-300 px-2 py-1 text-sm rounded-md bg-neutral-700' key={index}>{value}</span>)}
            </div>
        </div>
        
        <div className='px-3 py-4 flex flex-col gap-2 border border-gray-600'>
            <h2 className='text-lg font-semibold flex gap-2 items-center'>socials</h2>
            <div className="text-neutral-200 flex flex-wrap gap-2">
                {user.about.socials.map((value, index) => <a href={value} className='text-neutral-300 px-2 py-1 text-sm rounded-md bg-neutral-700' key={index}>{value.split('/')[2].split('.')[0]}</a>)}
            </div>
        </div>
        
        <p></p>
      </div>      
    </div>
  )
}

export default UserCard