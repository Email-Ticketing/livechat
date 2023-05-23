import React, { useEffect, useState } from "react"

import styles from "../Chatbox.module.scss"
import Skeleton from "../../../../../libs/utils/Skeleton/Skeleton"

const AttachmentImage = ({ attachment }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    const img = new Image()
    img.src = attachment?.attachment_url
    img.onerror = () => {
      setTimeout(() => {
        setError(true)
        setLoading(false)
      }, 50)
    }
    img.onload = () => {
      setTimeout(() => {
        setLoading(false)
      }, 50)
    }
  }, [attachment])

  // const download = (e, downloadUrl, fileName) => {
  //   e.preventDefault()
  //   // Create a temporary link element
  //   const link = document.createElement("a")
  //   link.href = downloadUrl
  //   link.download = "download.png" // Specify a default filename if the URL doesn't provide one
  //   link.target = '_blank';

  //   // Append the link to the document body and click it programmatically
  //   document.body.appendChild(link)
  //   link.click()

  //   // Clean up the temporary link
  //   document.body.removeChild(link)
  // }

  return !error ? (
    <div>
      {loading && <Skeleton className={styles.image_skeleton_loader} />}
      <a href={attachment?.attachment_url} download={attachment?.attachment_title} className={styles.download_link}>
        <img src={attachment?.attachment_url} alt="" />
      </a>
    </div>
  ) : (
    <div></div>
  )
}

export default AttachmentImage
