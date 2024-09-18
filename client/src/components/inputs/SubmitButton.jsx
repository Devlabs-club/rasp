import React from 'react'

const SubmitButton = ({ onClick }) => {
  return (
    <button type="submit" onClick={onClick} className="bg-white px-4 py-2 text-lg text-black rounded-md font-semibold">submit</button>
  )
}

export default SubmitButton;