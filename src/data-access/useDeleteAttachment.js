import axios from "axios"
import { useState } from "react"
// import { useMutation } from "react-query"
const backendURL = process.env.REACT_APP_BACKEND_URL

const useDeleteAttachment = () => {
  const PublicApi = axios.create({
    baseURL: backendURL,
    headers: {
      "Content-Type": "application/json",
    },
  })
  const deleteMultimediaApi = async (support_message_id, support_chat_id, chat_attachment_id) => {
    return axios
      .delete(
        `${backendURL}v1/ticket/deleteAttachment`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        { support_message_id, support_chat_id, chat_attachment_id }
      )

      .then((res) => {
        console.log("ress", res)

        return res.data
      })
  }

  // const { isLoading: isMultimediaUploading, mutate: uploadMultimedia } = useMutation(uploadMultimediaApi)
  return {
    deleteMultimediaApi,
  }
}

export default useDeleteAttachment
