import React from 'react'
import ParticipiantInfo from './ParticipiantInfo'

export default function UpdataParticipants({parts, setUpdateVisibility, setUpdatePart, setCurPartSettings}) {
  return (
    <div className="participants-settings">
      {parts.map((item, index) => 
        <ParticipiantInfo
          key={`participantsInfo${index}`}
          name={item.user.username}
          picture={item.user.profile_pic}
          roles={item.roles}
          setUpdateVisibility={setUpdateVisibility}
          index={index}
          setUpdatePart={setUpdatePart}
          setCurPartSettings={setCurPartSettings}
        />
      )}
    </div>
  )
}
