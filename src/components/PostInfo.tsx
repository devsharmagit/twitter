import React from 'react'
import Image from './Image'

const PostInfo = () => {
  return (
    <div className='cursor-pointer w-4 h-4 relative'>
        <Image path="icons/infoMore.svg" alt='info more' width={16} height={16} />
    </div>
  )
}

export default PostInfo