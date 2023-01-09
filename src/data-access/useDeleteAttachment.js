import axios from "axios"
import { useState } from "react"
// import { useMutation } from "react-query"

const useDeleteAttachment = () => {
  const PublicApi = axios.create({
    baseURL: "https://et-staging-api.ringover-crm.xyz/",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const deleteMultimediaApi = async (support_message_id, support_chat_id, chat_attachment_id) => {
    return axios
      .delete(
        `https://et-staging-api.ringover-crm.xyz/v1/ticket/deleteAttachment`,
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
