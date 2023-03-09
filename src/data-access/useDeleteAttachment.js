import axios from "axios"
import { useState } from "react"
// import { useMutation } from "react-query"

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const useDeleteAttachment = () => {
  const PublicApi = axios.create({
    baseURL: BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
    },
  })
  const deleteMultimediaApi = async (support_message_id, support_chat_id, chat_attachment_id) => {
    return axios
      .delete(
        `${BACKEND_URL}v1/ticket/deleteAttachment`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        { support_message_id, support_chat_id, chat_attachment_id }
      )

      .then((res) => {
        return res.data
      })
  }

  // const { isLoading: isMultimediaUploading, mutate: uploadMultimedia } = useMutation(uploadMultimediaApi)
  return {
    deleteMultimediaApi,
  }
}

export default useDeleteAttachment
